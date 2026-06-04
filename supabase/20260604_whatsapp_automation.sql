-- LindaStay WhatsApp automation migration
-- Run this file in Supabase SQL Editor after supabase/schema.sql.

create table if not exists message_templates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('booking_confirmation','arrival_reminder','payment_reminder','checkout_message','thank_you','review_request','custom')),
  language text not null default 'fr' check (language in ('fr','en','de','ar')),
  body text not null,
  is_system boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists scheduled_messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  reservation_id uuid not null references reservations(id) on delete cascade,
  template_id uuid references message_templates(id) on delete set null,
  guest_phone text,
  generated_body text not null,
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  status text not null default 'scheduled' check (status in ('sent','scheduled','failed','cancelled')),
  created_at timestamptz default now()
);

create table if not exists message_history (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  reservation_id uuid not null references reservations(id) on delete cascade,
  template_id uuid references message_templates(id) on delete set null,
  guest_phone text,
  generated_body text not null,
  status text not null default 'sent' check (status in ('sent','scheduled','failed','cancelled')),
  sent_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_message_templates_owner_type on message_templates(owner_id, type, language, is_active);
create index if not exists idx_scheduled_messages_owner_status on scheduled_messages(owner_id, status, scheduled_at);
create index if not exists idx_scheduled_messages_reservation on scheduled_messages(reservation_id);
create index if not exists idx_message_history_owner_created on message_history(owner_id, created_at desc);
create index if not exists idx_message_history_reservation on message_history(reservation_id);

alter table message_templates enable row level security;
alter table scheduled_messages enable row level security;
alter table message_history enable row level security;

drop policy if exists "message templates select owner admin" on message_templates;
create policy "message templates select owner admin" on message_templates for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "message templates insert active owner" on message_templates;
create policy "message templates insert active owner" on message_templates for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "message templates update active owner" on message_templates;
create policy "message templates update active owner" on message_templates for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "message templates delete active owner" on message_templates;
create policy "message templates delete active owner" on message_templates for delete using (owner_id = auth.uid() and has_write_access());

drop policy if exists "scheduled messages select owner admin" on scheduled_messages;
create policy "scheduled messages select owner admin" on scheduled_messages for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "scheduled messages insert active owner" on scheduled_messages;
create policy "scheduled messages insert active owner" on scheduled_messages for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "scheduled messages update active owner" on scheduled_messages;
create policy "scheduled messages update active owner" on scheduled_messages for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "scheduled messages delete active owner" on scheduled_messages;
create policy "scheduled messages delete active owner" on scheduled_messages for delete using (owner_id = auth.uid() and has_write_access());

drop policy if exists "message history select owner admin" on message_history;
create policy "message history select owner admin" on message_history for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "message history insert active owner" on message_history;
create policy "message history insert active owner" on message_history for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "message history update active owner" on message_history;
create policy "message history update active owner" on message_history for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "message history delete active owner" on message_history;
create policy "message history delete active owner" on message_history for delete using (owner_id = auth.uid() and has_write_access());
