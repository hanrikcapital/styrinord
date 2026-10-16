import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { setCompanyStatus } from "./actions";

const STATUS = { pending: "Venter", approved: "Godkjent", rejected: "Avvist" } as const;

export default async function Admin() {
  const { supabase, role } = await requireUser();
  if (role !== "admin") redirect("/min-side");

  const [{ data: companies }, { count: candidateCount }] = await Promise.all([
    supabase.from("companies").select("*").order("created_at", { ascending: false }),
    supabase.from("candidates").select("*", { count: "exact", head: true }),
  ]);
  const pending = companies?.filter((c) => c.status === "pending") ?? [];
  const others = companies?.filter((c) => c.status !== "pending") ?? [];

  const Row = ({ c }: { c: NonNullable<typeof companies>[number] }) => (
    <li className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-3 last:border-0">
      <div>
        <p className="font-medium">
          {c.company_name}{" "}
          <a
            className="text-sm font-normal text-fjord-600 underline"
            href={`https://virksomhet.brreg.no/nb/oppslag/enheter/${c.org_nr}`}
            target="_blank"
            rel="noreferrer"
          >
            {c.org_nr}
          </a>
        </p>
        <p className="text-sm text-slate-600">
          {c.contact_name} · {c.contact_email} {c.contact_phone && `· ${c.contact_phone}`}
        </p>
        <p className="text-xs text-slate-500">Status: {STATUS[c.status as keyof typeof STATUS]}</p>
      </div>
      <form action={setCompanyStatus} className="flex gap-2">
        <input type="hidden" name="user_id" value={c.user_id} />
        {c.status !== "approved" && (
          <button name="status" value="approved" className="btn">Godkjenn</button>
        )}
        {c.status !== "rejected" && (
          <button name="status" value="rejected" className="btn-secondary">Avvis</button>
        )}
      </form>
    </li>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-fjord-900">Administrasjon</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-500">Kandidater</p><p className="text-3xl font-bold">{candidateCount ?? 0}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Bedrifter som venter</p><p className="text-3xl font-bold">{pending.length}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Godkjente bedrifter</p><p className="text-3xl font-bold">{others.filter((c) => c.status === "approved").length}</p></div>
      </div>
      <div className="card">
        <h2 className="mb-2 text-lg font-semibold text-fjord-900">Venter på godkjenning</h2>
        {pending.length === 0 ? <p className="text-sm text-slate-600">Ingen bedrifter venter.</p> : <ul>{pending.map((c) => <Row key={c.user_id} c={c} />)}</ul>}
      </div>
      <div className="card">
        <h2 className="mb-2 text-lg font-semibold text-fjord-900">Behandlet</h2>
        {others.length === 0 ? <p className="text-sm text-slate-600">Ingen ennå.</p> : <ul>{others.map((c) => <Row key={c.user_id} c={c} />)}</ul>}
      </div>
    </div>
  );
}
