export const metadata = { title: "Personvern – Styrinord" };

export default function Personvern() {
  return (
    <article className="prose mx-auto max-w-2xl space-y-4 text-slate-800">
      <h1 className="text-3xl font-bold text-fjord-900">Personvernerklæring</h1>
      <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
        Utkast. Må gjennomgås og fylles ut med behandlingsansvarlig før lansering.
      </p>
      <h2 className="text-xl font-semibold">Behandlingsansvarlig</h2>
      <p>[Navn på selskap eller forening], org.nr. [nummer], [adresse], [e-post].</p>
      <h2 className="text-xl font-semibold">Hva vi lagrer</h2>
      <p>
        For kandidater: navn, fødselsdato, kjønn, telefon, e-post, bosted, bransje,
        stilling, kompetanse, styreerfaring, styreutdanning og en kort presentasjon.
        For bedrifter: bedriftsnavn, organisasjonsnummer og kontaktperson.
      </p>
      <h2 className="text-xl font-semibold">Hvorfor</h2>
      <p>
        Formålet er å koble styrekandidater med bedrifter i Nord-Norge. Grunnlaget er
        ditt samtykke (GDPR art. 6 nr. 1 a), som du gir ved registrering og kan trekke
        tilbake når som helst.
      </p>
      <h2 className="text-xl font-semibold">Hvem ser opplysningene</h2>
      <p>
        Kun bedrifter vi har godkjent kan se kandidatprofiler, og bare når kandidaten
        har valgt at profilen skal være synlig. Bedrifter ser alder, ikke fødselsdato,
        og ser aldri telefonnummer eller e-post. Henvendelser går gjennom tjenesten.
      </p>
      <h2 className="text-xl font-semibold">Lagring og databehandlere</h2>
      <p>
        Data lagres hos Supabase (EU) og nettsiden driftes av Vercel. Vi har
        databehandleravtaler med begge.
      </p>
      <h2 className="text-xl font-semibold">Dine rettigheter</h2>
      <p>
        Du kan når som helst se, endre eller slette profilen din på «Min side». Du kan
        også be om innsyn eller sletting ved å kontakte oss. Du kan klage til
        Datatilsynet.
      </p>
    </article>
  );
}
