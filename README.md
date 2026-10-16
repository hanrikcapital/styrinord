# Styrinord

Nettside der nordnorske bedrifter finner styrekandidater, og kandidater registrerer seg selv.

Bygget med Next.js, Supabase (database og innlogging) og Vercel (drift).

## Hva som finnes

- **Kandidater** oppretter bruker, fyller ut profil (alder, kjønn, region, bransje, kompetanse, styreerfaring, styreutdanning) og velger om profilen er synlig.
- **Bedrifter** oppretter bruker og registrerer bedriften med organisasjonsnummer. De ser ingen kandidater før en administrator har godkjent dem.
- **Godkjente bedrifter** søker og filtrerer kandidater og sender henvendelser. Kandidaten ser henvendelsen på «Min side» og svarer på e-post.
- **Administrator** godkjenner eller avviser bedrifter på `/admin`.
- Bedrifter ser aldri fødselsdato, telefon eller e-post til kandidater. Dette håndheves i databasen (se `supabase/migrations`).

## Oppsett

1. **Supabase**: opprett et prosjekt (velg region i EU, f.eks. Stockholm). Gå til *SQL Editor*, lim inn innholdet i `supabase/migrations/0001_init.sql` og trykk *Run*.
2. Under *Authentication → URL Configuration* settes *Site URL* til adressen siden skal ha (f.eks. `https://styrinord.no`).
3. **Vercel**: importer dette repositoriet og legg inn miljøvariablene fra `.env.example`. Verdiene for Supabase finnes under *Project Settings → API*.
4. Registrer deg på siden, og gjør deg selv til administrator i Supabase *SQL Editor*:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'din@epost.no');
   ```

## Lokal utvikling

```bash
cp .env.example .env.local   # fyll inn verdiene
npm install
npm run dev
```

## Planlagt

- Innlogging og identitetsbekreftelse med Vipps eller BankID
- E-postvarsel til kandidaten ved ny henvendelse
- Opplasting av CV og bilde
