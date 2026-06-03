-- LindaStay Supabase schema
-- À exécuter dans Supabase SQL Editor

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'owner' check (role in ('admin','owner')),
  subscription_status text not null default 'trial' check (subscription_status in ('trial','active','expired','blocked')),
  subscription_end date,
  created_at timestamptz default now()
);

create table if not exists houses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  address text,
  gps_link text,
  default_price numeric default 0,
  wifi_name text,
  wifi_password text,
  house_rules text,
  arrival_instructions text,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  house_id uuid not null references houses(id) on delete cascade,
  guest_name text not null,
  guest_phone text,
  guest_email text,
  check_in date not null,
  check_out date not null,
  guests_count int default 1,
  total_amount numeric default 0,
  deposit_amount numeric default 0,
  remaining_amount numeric default 0,
  status text default 'confirmed' check (status in ('pending','confirmed','cancelled','finished')),
  created_at timestamptz default now()
);

create table if not exists expense_settings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  category text,
  default_amount numeric default 0,
  calculation_type text not null default 'fixed' check (calculation_type in ('fixed','per_night','per_person','manual')),
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists reservation_expenses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  booking_id uuid not null references bookings(id) on delete cascade,
  name text not null,
  category text,
  amount numeric default 0,
  expense_date date default current_date,
  note text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table houses enable row level security;
alter table bookings enable row level security;
alter table expense_settings enable row level security;
alter table reservation_expenses enable row level security;

-- Profiles
create policy "profile select own or admin" on profiles for select
using (auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "profile insert own" on profiles for insert
with check (auth.uid() = id);

create policy "profile update admin or own" on profiles for update
using (auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Houses
create policy "houses owner select" on houses for select using (owner_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "houses owner insert active" on houses for insert with check (owner_id = auth.uid());
create policy "houses owner update" on houses for update using (owner_id = auth.uid());
create policy "houses owner delete" on houses for delete using (owner_id = auth.uid());

-- Bookings: insert/update allowed only for active/trial owner. Tu peux durcir trial plus tard.
create policy "bookings owner select" on bookings for select using (owner_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "bookings owner insert" on bookings for insert with check (owner_id = auth.uid() and exists (select 1 from profiles p where p.id = auth.uid() and p.subscription_status in ('active','trial')));
create policy "bookings owner update" on bookings for update using (owner_id = auth.uid());
create policy "bookings owner delete" on bookings for delete using (owner_id = auth.uid());

-- Expense settings
create policy "expense settings owner select" on expense_settings for select using (owner_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "expense settings owner insert" on expense_settings for insert with check (owner_id = auth.uid());
create policy "expense settings owner update" on expense_settings for update using (owner_id = auth.uid());
create policy "expense settings owner delete" on expense_settings for delete using (owner_id = auth.uid());

-- Reservation expenses
create policy "reservation expenses owner select" on reservation_expenses for select using (owner_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "reservation expenses owner insert" on reservation_expenses for insert with check (owner_id = auth.uid());
create policy "reservation expenses owner update" on reservation_expenses for update using (owner_id = auth.uid());
create policy "reservation expenses owner delete" on reservation_expenses for delete using (owner_id = auth.uid());

-- Dépenses par défaut utiles
-- À insérer après création d'un utilisateur si tu veux, en remplaçant OWNER_UUID.
-- insert into expense_settings(owner_id,name,category,default_amount,calculation_type) values
-- ('OWNER_UUID','Ménage','Service',80,'fixed'),
-- ('OWNER_UUID','Électricité','Charges',10,'per_night'),
-- ('OWNER_UUID','Produits d’accueil','Accueil',5,'per_person');
