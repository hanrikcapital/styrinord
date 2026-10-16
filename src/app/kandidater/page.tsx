import Link from "next/link";
import { requireCandidateAccess } from "@/lib/auth";
import {
  BOARD_EDUCATION,
  BOARD_EXPERIENCE,
  COMPETENCES,
  COUNTIES,
  GENDERS,
  INDUSTRIES,
  label,
} from "@/lib/options";

export type PublicCandidate = {
  user_id: string;
  full_name: string;
  age: number;
  gender: string;
  municipality: string | null;
  county: string;
  industry: string;
  position: string | null;
  competence: string[];
  board_experience: string;
  board_education: string[];
  desired_roles: string[];
  bio: string | null;
  board_roles: string | null;
  identity_verified: boolean;
};

type Search = Record<string, string | undefined>;

const param = (s: Search, k: string) => (s[k] && s[k] !== "" ? s[k] : null);
const num = (s: Search, k: string) => {
  const v = param(s, k);
  return v && /^\d+$/.test(v) ? Number(v) : null;
};

export default async function Kandidater({ searchParams }: { searchParams: Promise<Search> }) {
  const { supabase } = await requireCandidateAccess();
  const s = await searchParams;

  const { data, error } = await supabase.rpc("search_candidates", {
    p_county: param(s, "region"),
    p_industry: param(s, "bransje"),
    p_gender: param(s, "kjonn"),
    p_competence: param(s, "kompetanse"),
    p_board_experience: param(s, "erfaring"),
    p_board_education: param(s, "utdanning"),
    p_min_age: num(s, "minAlder"),
    p_max_age: num(s, "maxAlder"),
    p_query: param(s, "q"),
  });
  const candidates = (data ?? []) as PublicCandidate[];

  const select = (name: string, title: string, options: readonly (string | { value: string; label: string })[]) => (
    <div>
      <label className="label" htmlFor={name}>{title}</label>
      <select className="input" id={name} name={name} defaultValue={s[name] ?? ""}>
        <option value="">Alle</option>
        {options.map((o) =>
          typeof o === "string" ? (
            <option key={o}>{o}</option>
          ) : (
            <option key={o.value} value={o.value}>{o.label}</option>
          ),
        )}
      </select>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <form className="card h-fit space-y-4" method="get">
        <h2 className="font-semibold text-fjord-900">Filtrer</h2>
        <div>
          <label className="label" htmlFor="q">Fritekst</label>
          <input className="input" id="q" name="q" defaultValue={s.q ?? ""} placeholder="Navn, stilling…" />
        </div>
        {select("region", "Region", COUNTIES)}
        {select("bransje", "Bransje", INDUSTRIES)}
        {select("kompetanse", "Kompetanse", COMPETENCES)}
        {select("erfaring", "Styreerfaring", BOARD_EXPERIENCE)}
        {select("utdanning", "Styreutdanning", BOARD_EDUCATION)}
        {select("kjonn", "Kjønn", GENDERS)}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label" htmlFor="minAlder">Alder fra</label>
            <input className="input" id="minAlder" name="minAlder" type="number" min={18} max={100} defaultValue={s.minAlder ?? ""} />
          </div>
          <div>
            <label className="label" htmlFor="maxAlder">til</label>
            <input className="input" id="maxAlder" name="maxAlder" type="number" min={18} max={100} defaultValue={s.maxAlder ?? ""} />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn flex-1">Søk</button>
          <Link href="/kandidater" className="btn-secondary">Nullstill</Link>
        </div>
      </form>

      <section>
        <h1 className="text-2xl font-bold text-fjord-900">
          {candidates.length} {candidates.length === 1 ? "kandidat" : "kandidater"}
        </h1>
        {error && <p className="mt-4 text-red-700">Søket feilet: {error.message}</p>}
        <ul className="mt-6 space-y-4">
          {candidates.map((c) => (
            <li key={c.user_id}>
              <Link href={`/kandidater/${c.user_id}`} className="card block hover:border-fjord-600">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-lg font-semibold text-fjord-900">{c.full_name}</h2>
                  <span className="text-sm text-slate-500">
                    {c.age} år · {label(GENDERS, c.gender)} · {c.municipality ? `${c.municipality}, ` : ""}{c.county}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-700">
                  {[c.position, c.industry].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="chip">{label(BOARD_EXPERIENCE, c.board_experience)}</span>
                  {c.competence.slice(0, 4).map((k) => (
                    <span key={k} className="chip bg-slate-100 text-slate-700">{k}</span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {candidates.length === 0 && !error && (
          <p className="mt-6 text-slate-600">Ingen kandidater passer søket ditt ennå.</p>
        )}
      </section>
    </div>
  );
}
