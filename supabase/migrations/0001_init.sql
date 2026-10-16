-- Styrinord: grunnskjema
-- Kjøres i Supabase: SQL Editor -> lim inn -> Run.

-- Roller -------------------------------------------------------------------

create type public.user_role as enum ('candidate', 'company', 'admin');
create type public.company_status as enum ('pending', 'approved', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Brukere ser egen profilrad"
  on public.profiles for select
  using (id = auth.uid());

-- Ny bruker får rolle fra registreringsskjemaet. Admin kan aldri settes herfra.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (
    new.id,
    case when new.raw_user_meta_data ->> 'role' = 'company'
      then 'company'::public.user_role
      else 'candidate'::public.user_role
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.is_admin()
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Bedrifter ----------------------------------------------------------------

create table public.companies (
  user_id uuid primary key references auth.users (id) on delete cascade,
  company_name text not null,
  org_nr text not null check (org_nr ~ '^[0-9]{9}$'),
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  status public.company_status not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

alter table public.companies enable row level security;

create policy "Bedrift ser egen rad"
  on public.companies for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Bedrift registrerer seg selv"
  on public.companies for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'company')
  );

create policy "Bedrift oppdaterer egen rad, admin alle"
  on public.companies for update
  using (user_id = auth.uid() or public.is_admin());

create policy "Admin sletter bedrifter"
  on public.companies for delete
  using (public.is_admin());

-- Kun admin kan endre status.
create function public.protect_company_status()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if not public.is_admin() then
      new.status := 'pending';
    end if;
  elsif new.status is distinct from old.status then
    if not public.is_admin() then
      new.status := old.status;
    else
      new.reviewed_at := now();
    end if;
  end if;
  return new;
end;
$$;

create trigger companies_protect_status
  before insert or update on public.companies
  for each row execute function public.protect_company_status();

create function public.is_approved_company()
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.companies
    where user_id = auth.uid() and status = 'approved'
  );
$$;

-- Kandidater ---------------------------------------------------------------

create table public.candidates (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  birth_date date not null,
  gender text not null check (gender in ('kvinne', 'mann', 'annet', 'vil_ikke_oppgi')),
  phone text,
  municipality text,
  county text not null,
  industry text not null,
  position text,
  competence text[] not null default '{}',
  board_experience text not null,
  board_roles text,
  board_education text[] not null default '{}',
  desired_roles text[] not null default '{}',
  bio text check (char_length(bio) <= 1000),
  available boolean not null default true,
  visible boolean not null default true,
  identity_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.candidates enable row level security;

-- Kandidaten eier sin egen profil. Bedrifter leser kun via search_candidates()
-- som skjuler fødselsdato, telefon og e-post.
create policy "Kandidat ser egen profil"
  on public.candidates for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Kandidat oppretter egen profil"
  on public.candidates for insert
  with check (user_id = auth.uid());

create policy "Kandidat oppdaterer egen profil"
  on public.candidates for update
  using (user_id = auth.uid());

create policy "Kandidat eller admin sletter profil"
  on public.candidates for delete
  using (user_id = auth.uid() or public.is_admin());

-- identity_verified settes kun av systemet (Vipps/BankID senere).
create function public.protect_candidate_fields()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.identity_verified := false;
  else
    new.identity_verified := old.identity_verified;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger candidates_protect_fields
  before insert or update on public.candidates
  for each row execute function public.protect_candidate_fields();

-- Det bedrifter får se: alder i stedet for fødselsdato, ingen kontaktinfo.
create function public.search_candidates(
  p_county text default null,
  p_industry text default null,
  p_gender text default null,
  p_competence text default null,
  p_board_experience text default null,
  p_board_education text default null,
  p_min_age int default null,
  p_max_age int default null,
  p_query text default null,
  p_user_id uuid default null
)
returns table (
  user_id uuid,
  full_name text,
  age int,
  gender text,
  municipality text,
  county text,
  industry text,
  "position" text,
  competence text[],
  board_experience text,
  board_education text[],
  desired_roles text[],
  bio text,
  board_roles text,
  identity_verified boolean
)
language sql stable
security definer set search_path = ''
as $$
  select
    c.user_id, c.full_name,
    date_part('year', age(c.birth_date))::int as age,
    c.gender, c.municipality, c.county, c.industry, c.position,
    c.competence, c.board_experience, c.board_education, c.desired_roles,
    c.bio, c.board_roles, c.identity_verified
  from public.candidates c
  where (public.is_approved_company() or public.is_admin())
    and c.visible
    and (p_user_id is not null or c.available)
    and (p_user_id is null or c.user_id = p_user_id)
    and (p_county is null or c.county = p_county)
    and (p_industry is null or c.industry = p_industry)
    and (p_gender is null or c.gender = p_gender)
    and (p_competence is null or p_competence = any (c.competence))
    and (p_board_experience is null or c.board_experience = p_board_experience)
    and (p_board_education is null or p_board_education = any (c.board_education))
    and (p_min_age is null or date_part('year', age(c.birth_date)) >= p_min_age)
    and (p_max_age is null or date_part('year', age(c.birth_date)) <= p_max_age)
    and (p_query is null or c.full_name ilike '%' || p_query || '%'
         or c.position ilike '%' || p_query || '%'
         or c.bio ilike '%' || p_query || '%')
  order by c.updated_at desc
  limit 200;
$$;

-- Henvendelser fra bedrift til kandidat -----------------------------------

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (user_id) on delete cascade,
  candidate_id uuid not null references public.candidates (user_id) on delete cascade,
  company_name text,
  contact_name text,
  contact_email text,
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

alter table public.contact_requests enable row level security;

create policy "Godkjent bedrift sender henvendelse"
  on public.contact_requests for insert
  with check (company_id = auth.uid() and public.is_approved_company());

create policy "Partene ser henvendelsen"
  on public.contact_requests for select
  using (candidate_id = auth.uid() or company_id = auth.uid() or public.is_admin());

-- Bedriftsinfo kopieres inn fra bedriftsregisteringen, så kandidaten ser hvem som tok kontakt.
create function public.fill_contact_request()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  co public.companies;
begin
  select * into co from public.companies where user_id = new.company_id;
  new.company_name := co.company_name;
  new.contact_name := co.contact_name;
  new.contact_email := co.contact_email;
  return new;
end;
$$;

create trigger contact_requests_fill
  before insert on public.contact_requests
  for each row execute function public.fill_contact_request();

grant execute on function public.search_candidates to authenticated;
revoke execute on function public.search_candidates from public, anon;
