import Link from "next/link";

function Mountains() {
  return (
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      className="absolute inset-x-0 bottom-0 h-28 w-full sm:h-44"
      aria-hidden
    >
      <path
        d="M0 240V160l130-70 100 50 130-100 130 90 120-50 130 70 120-90 120 60 120-50 140 70 200-40v130z"
        fill="#0d2233"
      />
      <path
        d="M0 240v-55l170-45 150 40 150-60 180 55 170-45 180 50 170-40 270 30v70z"
        fill="#132e44"
      />
    </svg>
  );
}

function ExampleProfile() {
  return (
    <div className="relative">
      <div className="card rotate-[1.5deg] p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sand font-serif text-lg font-semibold text-fjord-900">
            KN
          </div>
          <div>
            <h3 className="text-xl font-semibold text-fjord-900">Kari Nordmann</h3>
            <p className="text-sm text-slate-500">Økonomidirektør · Fiskeri og havbruk</p>
          </div>
        </div>
        <dl className="mt-5 text-sm">
          {[
            ["Region", "Troms"],
            ["Alder", "48 år"],
            ["Styreerfaring", "3–5 verv"],
            ["Styreutdanning", "Styreakademiet"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-slate-100 py-2.5">
              <dt className="text-slate-500">{k}</dt>
              <dd className="font-semibold text-fjord-900">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["Økonomi og finans", "Strategi", "Bærekraft"].map((k) => (
            <span key={k} className="chip">{k}</span>
          ))}
        </div>
        <div className="mt-5 rounded-lg bg-fjord-900 py-2.5 text-center text-sm font-semibold text-white">
          Ta kontakt
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-white/50">Eksempel på kandidatprofil</p>
    </div>
  );
}

const STEPS = {
  kandidat: [
    ["Opprett bruker", "Det tar et par minutter, og er gratis."],
    ["Fyll ut profilen", "Kompetanse, styreerfaring og hvilke verv du er interessert i."],
    ["Bli funnet", "Godkjente bedrifter tar kontakt gjennom Styrinord. Du velger selv hva du svarer."],
  ],
  bedrift: [
    ["Registrer bedriften", "Med organisasjonsnummer og kontaktperson."],
    ["Bli godkjent", "Vi sjekker bedriften før dere får tilgang til kandidatene."],
    ["Finn kandidater", "Filtrer på region, bransje, kompetanse og erfaring, og send en henvendelse."],
  ],
};

export default function Home() {
  return (
    <>
      <section className="relative -mt-px overflow-hidden bg-night pb-28 text-white sm:pb-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 blur-2xl"
          style={{
            background:
              "radial-gradient(55% 45% at 25% 20%, rgba(43,211,154,.30), transparent 70%)," +
              "radial-gradient(45% 40% at 75% 10%, rgba(59,140,255,.25), transparent 70%)," +
              "radial-gradient(35% 30% at 55% 45%, rgba(155,92,255,.18), transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aurora">
              Styrerekruttering i Nord-Norge
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] sm:text-6xl">
              Riktig kompetanse rundt styrebordet
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300">
              Styrinord kobler nordnorske bedrifter med kvalifiserte styrekandidater fra
              Nordland, Troms og Finnmark. Gratis for alle.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/registrer/kandidat" className="btn-aurora">
                Bli styrekandidat
              </Link>
              <Link
                href="/registrer/bedrift"
                className="inline-flex items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Finn kandidater til ditt styre
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm lg:max-w-none">
            <ExampleProfile />
          </div>
        </div>
        <Mountains />
      </section>

      <section className="bg-[#132e44] text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 sm:grid-cols-3 sm:px-6">
          {[
            ["Gratis", "for både kandidater og bedrifter"],
            ["Kun godkjente bedrifter", "får se kandidatprofilene"],
            ["Kontaktinfo deles aldri", "alle henvendelser går gjennom oss"],
          ].map(([t, d]) => (
            <div key={t} className="border-l-2 border-aurora pl-4">
              <p className="font-serif text-xl font-semibold">{t}</p>
              <p className="mt-1 text-sm text-slate-300">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-semibold text-fjord-900 sm:text-4xl">
            Slik fungerer det
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {(
              [
                ["For kandidater", STEPS.kandidat, "/registrer/kandidat", "Bli styrekandidat"],
                ["For bedrifter", STEPS.bedrift, "/registrer/bedrift", "Registrer bedriften"],
              ] as const
            ).map(([title, steps, href, cta]) => (
              <div key={title} className="card">
                <h3 className="text-2xl font-semibold text-fjord-900">{title}</h3>
                <ol className="mt-6 space-y-5">
                  {steps.map(([t, d], i) => (
                    <li key={t} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fjord-900 text-sm font-semibold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-fjord-900">{t}</p>
                        <p className="text-sm text-slate-600">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link href={href} className="btn mt-8">
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
