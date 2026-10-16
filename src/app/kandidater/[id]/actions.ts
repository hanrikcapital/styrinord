"use server";

import { requireCandidateAccess } from "@/lib/auth";
import type { FormState } from "@/components/AuthForm";

export async function contactCandidate(_: FormState, f: FormData): Promise<FormState> {
  const { supabase, user, role } = await requireCandidateAccess();
  if (role !== "company") return { error: "Kun bedrifter kan sende henvendelser." };

  const message = String(f.get("message") ?? "").trim();
  if (message.length < 10) return { error: "Skriv en melding på minst 10 tegn." };

  const { error } = await supabase.from("contact_requests").insert({
    company_id: user.id,
    candidate_id: String(f.get("candidate_id")),
    message,
  });
  if (error) return { error: "Kunne ikke sende: " + error.message };
  return { message: "Henvendelsen er sendt. Kandidaten ser den på sin side og svarer deg på e-post." };
}
