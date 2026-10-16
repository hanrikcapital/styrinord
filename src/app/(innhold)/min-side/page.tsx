import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { SaveForm } from "@/components/SaveForm";
import { CandidateFields, type Candidate } from "@/components/CandidateFields";
import { deleteMyProfile, saveCandidate, saveCompany } from "./actions";

export default async function MinSide() {
  const { supabase, user, role } = await requireUser();

  if (role === "admin") {
    return (
      <div className="card">
        <h1 className="text-2xl font-bold text-fjord-900">Hei, administrator</h1>
        <div className="mt-4 flex gap-3">
          <Link href="/admin" className="btn">Godkjenn bedrifter</Link>
          <Link href="/kandidater" className="btn-secondary">Se kandidater</Link>
        </div>
      </div>
    );
  }

  if (role === "company") {
    const { data: company } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-fjord-900">Min side</h1>
        {company?.status === "approved" && (
          <div className="rounded-md bg-emerald-50 p-4 text-emerald-800">
            Bedriften er godkjent.{" "}
            <Link href="/kandidater" className="font-semibold underline">Finn kandidater</Link>
          </div>
        )}
        {company?.status === "pending" && (
          <div className="rounded-md bg-amber-50 p-4 text-amber-900">
            Takk! Bedriften venter på godkjenning. Du får tilgang til kandidatene så snart den er godkjent.
          </div>
        )}
        {company?.status === "rejected" && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            Bedriften ble ikke godkjent. Ta kontakt med oss hvis du mener dette er feil.
          </div>
        )}
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-fjord-900">Bedriftsinformasjon</h2>
          <SaveForm action={saveCompany} submitLabel={company ? "Lagre" : "Send til godkjenning"}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="company_name">Bedriftens navn *</label>
                <input className="input" id="company_name" name="company_name" required defaultValue={company?.company_name} />
              </div>
              <div>
                <label className="label" htmlFor="org_nr">Organisasjonsnummer *</label>
                <input className="input" id="org_nr" name="org_nr" required inputMode="numeric" defaultValue={company?.org_nr} />
              </div>
              <div>
                <label className="label" htmlFor="contact_name">Kontaktperson *</label>
                <input className="input" id="contact_name" name="contact_name" required defaultValue={company?.contact_name} />
              </div>
              <div>
                <label className="label" htmlFor="contact_email">E-post til kontaktperson</label>
                <input className="input" id="contact_email" name="contact_email" type="email" defaultValue={company?.contact_email ?? user.email} />
              </div>
              <div>
                <label className="label" htmlFor="contact_phone">Telefon</label>
                <input className="input" id="contact_phone" name="contact_phone" type="tel" defaultValue={company?.contact_phone ?? ""} />
              </div>
            </div>
          </SaveForm>
        </div>
      </div>
    );
  }

  const [{ data: candidate }, { data: requests }] = await Promise.all([
    supabase.from("candidates").select("*").eq("user_id", user.id).maybeSingle<Candidate>(),
    supabase
      .from("contact_requests")
      .select("id, company_name, contact_name, contact_email, message, created_at")
      .eq("candidate_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-fjord-900">Min kandidatprofil</h1>
      {!candidate && (
        <div className="rounded-md bg-fjord-50 p-4 text-fjord-900">
          Velkommen! Fyll ut profilen din, så kan godkjente bedrifter finne deg.
        </div>
      )}

      {requests && requests.length > 0 && (
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-fjord-900">Henvendelser fra bedrifter</h2>
          <ul className="space-y-4">
            {requests.map((r) => (
              <li key={r.id} className="border-b border-slate-100 pb-4 last:border-0">
                <p className="font-medium">
                  {r.company_name} <span className="font-normal text-slate-500">· {r.contact_name}</span>
                </p>
                <p className="mt-1 whitespace-pre-line text-sm text-slate-700">{r.message}</p>
                <p className="mt-2 text-sm">
                  Svar til:{" "}
                  <a className="text-fjord-600 underline" href={`mailto:${r.contact_email}`}>{r.contact_email}</a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <SaveForm action={saveCandidate}>
          <CandidateFields c={candidate} />
        </SaveForm>
      </div>

      {candidate && (
        <form action={deleteMyProfile} className="card border-red-200">
          <h2 className="font-semibold text-red-800">Slett profilen min</h2>
          <p className="mt-1 text-sm text-slate-600">
            Profilen og alle henvendelser til deg slettes permanent.
          </p>
          <button className="btn-secondary mt-3 border-red-300 text-red-800">Slett profil</button>
        </form>
      )}
    </div>
  );
}
