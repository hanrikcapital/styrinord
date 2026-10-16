import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="rounded-2xl bg-fjord-900 px-6 py-16 text-white sm:px-12">
        <h1 className="max-w-2xl text-3xl font-bold sm:text-5xl">
          Styrekompetanse fra nord, for bedrifter i nord
        </h1>
        <p className="mt-4 max-w-xl text-lg text-fjord-100">
          Styrinord kobler nordnorske bedrifter med kvalifiserte styrekandidater fra
          hele landsdelen.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/registrer/kandidat" className="btn bg-aurora hover:bg-emerald-600">
            Bli styrekandidat
          </Link>
          <Link
            href="/registrer/bedrift"
            className="btn-secondary border-white/40 bg-transparent text-white hover:bg-white/10"
          >
            Finn kandidater til ditt styre
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          {
            title: "Gratis",
            text: "Tjenesten er gratis for både kandidater og bedrifter.",
          },
          {
            title: "Verifiserte kandidater",
            text: "Kandidater registrerer seg selv og bekrefter identiteten sin.",
          },
          {
            title: "Personvern først",
            text: "Bare bedrifter vi har godkjent får se kandidatene. Kontaktinfo deles aldri direkte.",
          },
        ].map((f) => (
          <div key={f.title} className="card">
            <h2 className="font-semibold text-fjord-900">{f.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{f.text}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold text-fjord-900">For kandidater</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-700">
            <li>Opprett en bruker.</li>
            <li>Fyll ut profilen med kompetanse og styreerfaring.</li>
            <li>Bli funnet av bedrifter, og svar på henvendelser når det passer deg.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-fjord-900">For bedrifter</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-700">
            <li>Registrer bedriften med organisasjonsnummer.</li>
            <li>Vent på godkjenning.</li>
            <li>Søk etter kandidater etter region, bransje og kompetanse, og ta kontakt.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
