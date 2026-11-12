-- =============================================================================
-- Event Management Platform — Initial Schema & Row-Level Security
-- Tables: enquiries, gallery_items, settings
-- Storage: gallery bucket
-- =============================================================================

-- Enable pgcrypto for gen_random_uuid() if not already enabled
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Helper: Updated-at trigger function
-- -----------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 2. Helper: Admin check for RLS
-- NOTE: In Supabase Dashboard -> Authentication -> Providers -> Email, disable
-- public sign-ups so only the owner account you create can authenticate.
-- For defense-in-depth, replace 'owner@yourcompany.com' below with your actual
-- admin email (matching ADMIN_EMAIL in .env.local), or set app_metadata.role = 'admin'.
-- -----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    auth.role() = 'authenticated'
    and (
      coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
      or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('owner@yourcompany.com')
    );
$$;

-- -----------------------------------------------------------------------------
-- 3. Table: settings (singleton row id = 1)
-- -----------------------------------------------------------------------------
create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  company_name text not null default 'Core Events',
  city_region text not null default 'Bengaluru, India',
  notification_email text not null default 'owner@yourcompany.com',
  contact_email text not null default 'hello@yourcompany.com',
  contact_phone text not null default '+91 98000 00000',
  updated_at timestamptz not null default now()
);

drop trigger if exists settings_updated_at on public.settings;
create trigger settings_updated_at
  before update on public.settings
  for each row execute function public.handle_updated_at();

insert into public.settings (id, company_name, city_region, notification_email, contact_email, contact_phone)
values (1, 'Core Events', 'Bengaluru, India', 'owner@yourcompany.com', 'hello@yourcompany.com', '+91 98000 00000')
on conflict (id) do nothing;

alter table public.settings enable row level security;

drop policy if exists "Admin can read settings" on public.settings;
create policy "Admin can read settings"
  on public.settings for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admin can update settings" on public.settings;
create policy "Admin can update settings"
  on public.settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin can insert settings" on public.settings;
create policy "Admin can insert settings"
  on public.settings for insert
  to authenticated
  with check (public.is_admin());

-- Public read-only view exposing only non-sensitive footer contact details
create or replace view public.public_settings as
  select company_name, city_region, contact_email, contact_phone
  from public.settings
  where id = 1;

grant select on public.public_settings to anon, authenticated;

-- -----------------------------------------------------------------------------
-- 4. Table: gallery_items
-- -----------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  media_type text not null check (media_type in ('image', 'video')),
  storage_path text not null,
  public_url text not null,
  thumbnail_path text,
  thumbnail_url text,
  caption text not null default '',
  category text not null default 'General',
  sort_order integer not null default 0,
  file_size_bytes bigint,
  mime_type text,
  width integer,
  height integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_items_sort_created
  on public.gallery_items (sort_order asc, created_at desc);

create index if not exists idx_gallery_items_media_type
  on public.gallery_items (media_type);

drop trigger if exists gallery_items_updated_at on public.gallery_items;
create trigger gallery_items_updated_at
  before update on public.gallery_items
  for each row execute function public.handle_updated_at();

alter table public.gallery_items enable row level security;

drop policy if exists "Public can view gallery items" on public.gallery_items;
create policy "Public can view gallery items"
  on public.gallery_items for select
  to anon, authenticated
  using (true);

drop policy if exists "Admin can insert gallery items" on public.gallery_items;
create policy "Admin can insert gallery items"
  on public.gallery_items for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "Admin can update gallery items" on public.gallery_items;
create policy "Admin can update gallery items"
  on public.gallery_items for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin can delete gallery items" on public.gallery_items;
create policy "Admin can delete gallery items"
  on public.gallery_items for delete
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. Table: enquiries
-- -----------------------------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  work_email text not null,
  phone text default '',
  event_type text not null check (
    event_type in ('Seminar', 'Annual office event', 'Conference', 'Team offsite', 'Other')
  ),
  expected_guests integer check (expected_guests is null or expected_guests > 0),
  preferred_date date,
  city_venue text default '',
  message text not null,
  status text not null default 'New' check (status in ('New', 'Contacted', 'Won', 'Lost')),
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_enquiries_created_at
  on public.enquiries (created_at desc);

create index if not exists idx_enquiries_status
  on public.enquiries (status);

drop trigger if exists enquiries_updated_at on public.enquiries;
create trigger enquiries_updated_at
  before update on public.enquiries
  for each row execute function public.handle_updated_at();

alter table public.enquiries enable row level security;

-- Enquiries are inserted by the Next.js server route handler (using service_role)
-- after validation, honeypot, and rate-limit checks. Only admin can read/update/delete.
drop policy if exists "Admin can read enquiries" on public.enquiries;
create policy "Admin can read enquiries"
  on public.enquiries for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admin can update enquiries" on public.enquiries;
create policy "Admin can update enquiries"
  on public.enquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin can delete enquiries" on public.enquiries;
create policy "Admin can delete enquiries"
  on public.enquiries for delete
  to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. Storage Bucket: gallery
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'gallery',
  'gallery',
  true,
  209715200, -- 200 MB max (videos up to 200 MB; images enforced at 20 MB in app)
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view gallery files" on storage.objects;
create policy "Public can view gallery files"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'gallery');

drop policy if exists "Admin can upload gallery files" on storage.objects;
create policy "Admin can upload gallery files"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "Admin can update gallery files" on storage.objects;
create policy "Admin can update gallery files"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'gallery' and public.is_admin())
  with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "Admin can delete gallery files" on storage.objects;
create policy "Admin can delete gallery files"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'gallery' and public.is_admin());
