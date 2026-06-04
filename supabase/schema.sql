-- LindaStay Supabase schema
-- Production-oriented SaaS schema for vacation rental management.
-- Run this file in Supabase SQL Editor after enabling the pgcrypto extension.

create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  phone text,
  company_name text,
  role text not null default 'property_owner' check (role in ('super_admin','property_owner','staff')),
  preferred_language text not null default 'fr' check (preferred_language in ('fr','en','de','ar')),
  country text default 'Tunisia',
  subscription_status text not null default 'trial' check (subscription_status in ('trial','active','expired','blocked')),
  subscription_plan text not null default 'free' check (subscription_plan in ('free','starter','pro','premium')),
  subscription_start date default current_date,
  subscription_end date default (current_date + interval '14 days'),
  is_read_only boolean generated always as (subscription_status in ('expired','blocked')) stored,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  address text,
  google_maps_link text,
  gps_coordinates text,
  photos text[] default '{}',
  capacity int default 1 check (capacity >= 0),
  bedrooms int default 0 check (bedrooms >= 0),
  bathrooms numeric default 0 check (bathrooms >= 0),
  amenities text[] default '{}',
  wifi_name text,
  wifi_password text,
  check_in_instructions text,
  house_rules text,
  base_price numeric default 0,
  currency text default 'EUR',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  country text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  guest_id uuid references guests(id) on delete set null,
  guest_name text not null,
  guest_phone text,
  guest_email text,
  check_in date not null,
  check_out date not null,
  nights int not null default 0,
  guests_count int default 1 check (guests_count > 0),
  total_price numeric default 0,
  deposit_paid numeric default 0,
  remaining_balance numeric default 0,
  status text default 'pending' check (status in ('pending','confirmed','checked_in','checked_out','cancelled')),
  source text default 'direct',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint reservation_valid_dates check (check_out > check_in)
);

create table if not exists expense_templates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  category text not null default 'General',
  default_amount numeric default 0,
  type text not null default 'fixed_per_reservation' check (type in ('fixed_per_reservation','per_night','per_guest','manual')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  reservation_id uuid references reservations(id) on delete cascade,
  template_id uuid references expense_templates(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  name text not null,
  category text,
  amount numeric default 0,
  expense_date date default current_date,
  forecast boolean default false,
  note text,
  created_at timestamptz default now()
);

create table if not exists traveler_guides (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  gps_location text,
  wifi text,
  house_rules text,
  restaurants text,
  supermarkets text,
  pharmacies text,
  beaches text,
  emergency_contacts text,
  taxi_services text,
  share_slug text unique default encode(gen_random_bytes(8), 'hex'),
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(property_id)
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  plan text not null check (plan in ('free','starter','pro','premium')),
  status text not null check (status in ('trial','active','expired','cancelled','blocked')),
  start_date date not null default current_date,
  end_date date,
  price_monthly numeric default 0,
  provider text default 'manual',
  provider_subscription_id text,
  created_at timestamptz default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  reservation_id uuid references reservations(id) on delete set null,
  type text not null check (type in ('booking_confirmation','arrival_reminder','payment_reminder','checkout_message','thank_you','custom')),
  channel text not null default 'whatsapp' check (channel in ('whatsapp','email')),
  template text not null,
  generated_message text,
  recipient text,
  sent_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete set null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','in_progress','resolved','closed')),
  priority text default 'normal' check (priority in ('low','normal','high','urgent')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Compatibility migrations for existing LindaStay databases.
-- `create table if not exists` does not add newly introduced columns, so keep
-- this block additive and safe to rerun from the Supabase SQL Editor.
alter table profiles add column if not exists email text;
alter table profiles add column if not exists full_name text;
alter table profiles add column if not exists phone text;
alter table profiles add column if not exists company_name text;
alter table profiles add column if not exists role text not null default 'property_owner';
alter table profiles add column if not exists preferred_language text not null default 'fr';
alter table profiles add column if not exists country text default 'Tunisia';
alter table profiles add column if not exists subscription_status text not null default 'trial';
alter table profiles add column if not exists subscription_plan text not null default 'free';
alter table profiles add column if not exists subscription_start date default current_date;
alter table profiles add column if not exists subscription_end date default (current_date + interval '14 days');
alter table profiles add column if not exists is_read_only boolean generated always as (subscription_status in ('expired','blocked')) stored;
alter table profiles add column if not exists created_at timestamptz default now();
alter table profiles add column if not exists updated_at timestamptz default now();

alter table properties add column if not exists description text;
alter table properties add column if not exists address text;
alter table properties add column if not exists google_maps_link text;
alter table properties add column if not exists gps_coordinates text;
alter table properties add column if not exists photos text[] default '{}';
alter table properties add column if not exists capacity int default 1;
alter table properties add column if not exists bedrooms int default 0;
alter table properties add column if not exists bathrooms numeric default 0;
alter table properties add column if not exists amenities text[] default '{}';
alter table properties add column if not exists wifi_name text;
alter table properties add column if not exists wifi_password text;
alter table properties add column if not exists check_in_instructions text;
alter table properties add column if not exists house_rules text;
alter table properties add column if not exists base_price numeric default 0;
alter table properties add column if not exists currency text default 'EUR';
alter table properties add column if not exists created_at timestamptz default now();
alter table properties add column if not exists updated_at timestamptz default now();

alter table reservations add column if not exists guest_id uuid references guests(id) on delete set null;
alter table reservations add column if not exists guest_name text;
alter table reservations add column if not exists guest_phone text;
alter table reservations add column if not exists guest_email text;
alter table reservations add column if not exists check_in date;
alter table reservations add column if not exists check_out date;
alter table reservations add column if not exists nights int not null default 0;
alter table reservations add column if not exists guests_count int default 1;
alter table reservations add column if not exists total_price numeric default 0;
alter table reservations add column if not exists deposit_paid numeric default 0;
alter table reservations add column if not exists remaining_balance numeric default 0;
alter table reservations add column if not exists status text default 'pending';
alter table reservations add column if not exists source text default 'direct';
alter table reservations add column if not exists notes text;
alter table reservations add column if not exists created_at timestamptz default now();
alter table reservations add column if not exists updated_at timestamptz default now();

alter table messages add column if not exists reservation_id uuid references reservations(id) on delete set null;
alter table messages add column if not exists type text;
alter table messages add column if not exists channel text not null default 'whatsapp';
alter table messages add column if not exists template text;
alter table messages add column if not exists generated_message text;
alter table messages add column if not exists recipient text;
alter table messages add column if not exists sent_at timestamptz;
alter table messages add column if not exists created_at timestamptz default now();

create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_subscription on profiles(subscription_status, subscription_plan, subscription_end);
create index if not exists idx_properties_owner on properties(owner_id);
create index if not exists idx_guests_owner on guests(owner_id);
create index if not exists idx_reservations_owner_dates on reservations(owner_id, check_in, check_out);
create index if not exists idx_reservations_property_dates on reservations(property_id, check_in, check_out);
create index if not exists idx_expenses_owner_date on expenses(owner_id, expense_date);
create index if not exists idx_expenses_reservation on expenses(reservation_id);
create index if not exists idx_subscriptions_owner on subscriptions(owner_id);
create index if not exists idx_support_status on support_tickets(status);

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on profiles;
create trigger set_profiles_updated_at before update on profiles for each row execute function set_updated_at();
drop trigger if exists set_properties_updated_at on properties;
create trigger set_properties_updated_at before update on properties for each row execute function set_updated_at();
drop trigger if exists set_reservations_updated_at on reservations;
create trigger set_reservations_updated_at before update on reservations for each row execute function set_updated_at();
drop trigger if exists set_expense_templates_updated_at on expense_templates;
create trigger set_expense_templates_updated_at before update on expense_templates for each row execute function set_updated_at();
drop trigger if exists set_guides_updated_at on traveler_guides;
create trigger set_guides_updated_at before update on traveler_guides for each row execute function set_updated_at();
drop trigger if exists set_tickets_updated_at on support_tickets;
create trigger set_tickets_updated_at before update on support_tickets for each row execute function set_updated_at();

alter table profiles enable row level security;
alter table properties enable row level security;
alter table guests enable row level security;
alter table reservations enable row level security;
alter table expense_templates enable row level security;
alter table expenses enable row level security;
alter table traveler_guides enable row level security;
alter table subscriptions enable row level security;
alter table messages enable row level security;
alter table support_tickets enable row level security;

create or replace function is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'super_admin');
$$;

create or replace function has_write_access()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
      and (role = 'super_admin' or (subscription_status in ('trial','active') and (subscription_end is null or subscription_end >= current_date)))
  );
$$;

drop policy if exists "profiles select own staff or admin" on profiles;
create policy "profiles select own staff or admin" on profiles for select using (id = auth.uid() or is_super_admin());
drop policy if exists "profiles insert own" on profiles;
create policy "profiles insert own" on profiles for insert with check (id = auth.uid());
drop policy if exists "profiles update own or admin" on profiles;
create policy "profiles update own or admin" on profiles for update using (id = auth.uid() or is_super_admin()) with check (id = auth.uid() or is_super_admin());
drop policy if exists "profiles delete admin" on profiles;
create policy "profiles delete admin" on profiles for delete using (is_super_admin());

drop policy if exists "properties select owner admin" on properties;
create policy "properties select owner admin" on properties for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "properties insert active owner" on properties;
create policy "properties insert active owner" on properties for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "properties update active owner" on properties;
create policy "properties update active owner" on properties for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "properties delete active owner" on properties;
create policy "properties delete active owner" on properties for delete using (owner_id = auth.uid() and has_write_access());

drop policy if exists "guests select owner admin" on guests;
create policy "guests select owner admin" on guests for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "guests insert active owner" on guests;
create policy "guests insert active owner" on guests for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "guests update active owner" on guests;
create policy "guests update active owner" on guests for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "guests delete active owner" on guests;
create policy "guests delete active owner" on guests for delete using (owner_id = auth.uid() and has_write_access());

drop policy if exists "reservations select owner admin" on reservations;
create policy "reservations select owner admin" on reservations for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "reservations insert active owner" on reservations;
create policy "reservations insert active owner" on reservations for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "reservations update active owner" on reservations;
create policy "reservations update active owner" on reservations for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "reservations delete active owner" on reservations;
create policy "reservations delete active owner" on reservations for delete using (owner_id = auth.uid() and has_write_access());

drop policy if exists "expense templates select owner admin" on expense_templates;
create policy "expense templates select owner admin" on expense_templates for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "expense templates insert active owner" on expense_templates;
create policy "expense templates insert active owner" on expense_templates for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "expense templates update active owner" on expense_templates;
create policy "expense templates update active owner" on expense_templates for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "expense templates delete active owner" on expense_templates;
create policy "expense templates delete active owner" on expense_templates for delete using (owner_id = auth.uid() and has_write_access());

drop policy if exists "expenses select owner admin" on expenses;
create policy "expenses select owner admin" on expenses for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "expenses insert active owner" on expenses;
create policy "expenses insert active owner" on expenses for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "expenses update active owner" on expenses;
create policy "expenses update active owner" on expenses for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "expenses delete active owner" on expenses;
create policy "expenses delete active owner" on expenses for delete using (owner_id = auth.uid() and has_write_access());

drop policy if exists "guides public or owner" on traveler_guides;
create policy "guides public or owner" on traveler_guides for select using (is_public or owner_id = auth.uid() or is_super_admin());
drop policy if exists "guides insert active owner" on traveler_guides;
create policy "guides insert active owner" on traveler_guides for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "guides update active owner" on traveler_guides;
create policy "guides update active owner" on traveler_guides for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "guides delete active owner" on traveler_guides;
create policy "guides delete active owner" on traveler_guides for delete using (owner_id = auth.uid() and has_write_access());

drop policy if exists "subscriptions select own admin" on subscriptions;
create policy "subscriptions select own admin" on subscriptions for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "subscriptions insert own admin" on subscriptions;
create policy "subscriptions insert own admin" on subscriptions for insert with check (owner_id = auth.uid() or is_super_admin());
drop policy if exists "subscriptions update admin" on subscriptions;
create policy "subscriptions update admin" on subscriptions for update using (is_super_admin()) with check (is_super_admin());
drop policy if exists "subscriptions delete admin" on subscriptions;
create policy "subscriptions delete admin" on subscriptions for delete using (is_super_admin());

drop policy if exists "messages select owner admin" on messages;
create policy "messages select owner admin" on messages for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "messages insert active owner" on messages;
create policy "messages insert active owner" on messages for insert with check (owner_id = auth.uid() and has_write_access());
drop policy if exists "messages update active owner" on messages;
create policy "messages update active owner" on messages for update using (owner_id = auth.uid() and has_write_access()) with check (owner_id = auth.uid());
drop policy if exists "messages delete active owner" on messages;
create policy "messages delete active owner" on messages for delete using (owner_id = auth.uid() and has_write_access());

drop policy if exists "tickets select own admin" on support_tickets;
create policy "tickets select own admin" on support_tickets for select using (owner_id = auth.uid() or is_super_admin());
drop policy if exists "tickets insert authenticated" on support_tickets;
create policy "tickets insert authenticated" on support_tickets for insert with check (owner_id = auth.uid());
drop policy if exists "tickets update admin" on support_tickets;
create policy "tickets update admin" on support_tickets for update using (is_super_admin()) with check (is_super_admin());
drop policy if exists "tickets delete admin" on support_tickets;
create policy "tickets delete admin" on support_tickets for delete using (is_super_admin());

-- Seed helpers for a new owner. Replace OWNER_UUID with an existing profiles.id.
-- insert into expense_templates(owner_id, name, category, default_amount, type) values
-- ('OWNER_UUID','Cleaning','Service',80,'fixed_per_reservation'),
-- ('OWNER_UUID','Electricity','Utilities',10,'per_night'),
-- ('OWNER_UUID','Water','Utilities',5,'per_night'),
-- ('OWNER_UUID','Pool','Maintenance',25,'fixed_per_reservation'),
-- ('OWNER_UUID','Garden','Maintenance',20,'fixed_per_reservation'),
-- ('OWNER_UUID','Welcome products','Guest experience',5,'per_guest'),
-- ('OWNER_UUID','Repairs','Maintenance',0,'manual');
