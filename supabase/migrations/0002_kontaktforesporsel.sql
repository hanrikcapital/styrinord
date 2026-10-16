-- Styrinord: bedrifter ber om kontaktinfo, kandidaten godkjenner eller avslår.
-- Kjøres i Supabase: SQL Editor -> lim inn -> Run (én gang).

create type public.request_status as enum ('pending', 'approved', 'declined');

alter table public.contact_requests
  add column status public.request_status not null default 'pending',
  add column responded_at timestamptz;

-- Én åpen forespørsel om gangen per bedrift og kandidat.
create unique index contact_requests_one_pending
  on public.contact_requests (company_id, candidate_id)
  where status = 'pending';

-- Ny forespørsel starter alltid som ventende.
create or replace function public.fill_contact_request()
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
  new.status := 'pending';
  new.responded_at := null;
  return new;
end;
$$;

-- Kandidaten svarer på forespørsler til seg. Ingen andre felt kan endres.
create policy "Kandidat svarer på forespørsel"
  on public.contact_requests for update
  using (candidate_id = auth.uid());

create function public.protect_contact_request()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if new.status = 'pending' or old.status = new.status then
    raise exception 'Ugyldig svar på forespørsel';
  end if;
  new.id := old.id;
  new.company_id := old.company_id;
  new.candidate_id := old.candidate_id;
  new.company_name := old.company_name;
  new.contact_name := old.contact_name;
  new.contact_email := old.contact_email;
  new.message := old.message;
  new.created_at := old.created_at;
  new.responded_at := now();
  return new;
end;
$$;

create trigger contact_requests_protect
  before update on public.contact_requests
  for each row execute function public.protect_contact_request();

-- Kontaktinfo til kandidater som har godkjent bedriftens forespørsel.
create function public.approved_contacts()
returns table (candidate_id uuid, full_name text, email text, phone text)
language sql stable
security definer set search_path = ''
as $$
  select distinct on (c.user_id) c.user_id, c.full_name, u.email::text, c.phone
  from public.contact_requests r
  join public.candidates c on c.user_id = r.candidate_id
  join auth.users u on u.id = c.user_id
  where r.company_id = auth.uid() and r.status = 'approved';
$$;

grant execute on function public.approved_contacts to authenticated;
revoke execute on function public.approved_contacts from public, anon;

-- Bedriftens egne forespørsler, med kandidatnavn og kontaktinfo når den er godkjent.
create function public.my_sent_requests()
returns table (
  id uuid,
  candidate_id uuid,
  candidate_name text,
  status public.request_status,
  created_at timestamptz,
  email text,
  phone text
)
language sql stable
security definer set search_path = ''
as $$
  select
    r.id, r.candidate_id, c.full_name, r.status, r.created_at,
    case when r.status = 'approved' then u.email::text end,
    case when r.status = 'approved' then c.phone end
  from public.contact_requests r
  join public.candidates c on c.user_id = r.candidate_id
  join auth.users u on u.id = c.user_id
  where r.company_id = auth.uid()
  order by r.created_at desc;
$$;

grant execute on function public.my_sent_requests to authenticated;
revoke execute on function public.my_sent_requests from public, anon;
