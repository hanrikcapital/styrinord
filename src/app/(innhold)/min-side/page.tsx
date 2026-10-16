import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { SaveForm } from "@/components/SaveForm";
import { CandidateFields, type Candidate } from "@/components/CandidateFields";
import { STATUS_CLASS, STATUS_LABEL, type RequestStatus } from "@/lib/contact";
import { deleteMyProfile, respondToRequest, saveCandidate, saveCompany } from "./actions";

type SentRequest = {
  id: string;
  candidate_id: string;
  candidate_name: string;
  status: RequestStatus;
  created_at: string;
  email: string | null;
  phone: string | null;
};

function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

const date = (iso: string) => new Date(iso).toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" });

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
    const [{ data: company }, { data: sent }] = await Promise.all([
      supabase.from("companies").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.rpc("my_sent_requests"),
    ]);
    const requests = (sent ?? []) as SentRequest[];

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
        {requests.length > 0 && (
          <div className="card">
            <h2 className="mb-4 text-lg font-semibold text-fjord-900">Forespørsler om kontaktinfo</h2>
            <ul className="divide-y divide-slate-100">
              {requests.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <Link href={`/kandidater/${r.candidate_id}`} className="font-medium text-fjord-900 hover:underline">
                      {r.candidate_name}
                    </Link>
                    <p className="text-xs text-slate-500">Sendt {date(r.created_at)}</p>
                    {r.email && (
                      <p className="mt-1 text-sm">
                        <a className="text-fjord-600 underline" href={`mailto:${r.email}`}>{r.email}</a>
                        {r.phone && <> · <a className="text-fjord-600 underline" href={`tel:${r.phone}`}>{r.phone}</a></>}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={r.status} />
                </li>
              ))}
            </ul>
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
      .select("id, company_name, contact_name, contact_email, message, created_at, status")
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
          <h2 className="text-lg font-semibold text-fjord-900">Forespørsler fra bedrifter</h2>
          <p className="mt-1 mb-4 text-sm text-slate-600">
            Bedriften får se e-posten og telefonnummeret ditt bare hvis du godkjenner.
          </p>
          <ul className="space-y-4">
            {requests.map((r) => (
              <li key={r.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{r.company_name}</p>
                    <p className="text-xs text-slate-500">
                      {r.contact_name} · {date(r.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={r.status as RequestStatus} />
                </div>
                <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{r.message}</p>
                <form action={respondToRequest} className="mt-4 flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={r.id} />
                  {r.status === "pending" && (
                    <>
                      <button name="status" value="approved" className="btn">Godkjenn og del kontaktinfo</button>
                      <button name="status" value="declined" className="btn-secondary">Avslå</button>
                    </>
                  )}
                  {r.status === "approved" && (
                    <>
                      <span className="text-sm text-slate-600">
                        Du har delt kontaktinfo. Du kan også svare direkte til{" "}
                        <a className="text-fjord-600 underline" href={`mailto:${r.contact_email}`}>{r.contact_email}</a>.
                      </span>
                      <button name="status" value="declined" className="text-sm text-slate-500 underline">
                        Trekk tilbake
                      </button>
                    </>
                  )}
                </form>
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
            Profilen og alle forespørsler til deg slettes permanent.
          </p>
          <button className="btn-secondary mt-3 border-red-300 text-red-800">Slett profil</button>
        </form>
      )}
    </div>
  );
}
