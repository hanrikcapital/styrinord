import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCandidateAccess } from "@/lib/auth";
import { BOARD_EXPERIENCE, GENDERS, label } from "@/lib/options";
import { ContactForm } from "@/components/ContactForm";
import type { PublicCandidate } from "../page";
import { contactCandidate } from "./actions";

export default async function Kandidat({ params }: { params: Promise<{ id: string }> }) {
  const { supabase, role } = await requireCandidateAccess();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const { data } = await supabase.rpc("search_candidates", { p_user_id: id });
  const c = (data as PublicCandidate[] | null)?.[0];
  if (!c) notFound();

  const row = (title: string, value: React.ReactNode) =>
    value ? (
      <div className="grid gap-1 border-b border-slate-100 py-3 sm:grid-cols-[200px_1fr]">
        <dt className="text-sm font-medium text-slate-500">{title}</dt>
        <dd className="text-sm">{value}</dd>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <Link href="/kandidater" className="text-sm text-fjord-600 hover:underline">← Tilbake til søket</Link>
      <div className="card">
        <h1 className="text-2xl font-bold text-fjord-900">{c.full_name}</h1>
        <p className="mt-1 text-slate-600">
          {[c.position, c.industry].filter(Boolean).join(" · ")}
        </p>
        {c.bio && <p className="mt-4 whitespace-pre-line text-slate-800">{c.bio}</p>}
        <dl className="mt-6">
          {row("Alder", `${c.age} år`)}
          {row("Kjønn", label(GENDERS, c.gender))}
          {row("Bosted", [c.municipality, c.county].filter(Boolean).join(", "))}
          {row("Styreerfaring", label(BOARD_EXPERIENCE, c.board_experience))}
          {row("Styreverv", c.board_roles && <span className="whitespace-pre-line">{c.board_roles}</span>)}
          {row("Styreutdanning", c.board_education.join(", "))}
          {row("Kompetanse", c.competence.join(", "))}
          {row("Interessert i", c.desired_roles.join(", "))}
        </dl>
      </div>
      {role === "company" && (
        <div className="card">
          <h2 className="mb-3 text-lg font-semibold text-fjord-900">Ta kontakt</h2>
          <ContactForm action={contactCandidate} candidateId={c.user_id} />
        </div>
      )}
    </div>
  );
}
