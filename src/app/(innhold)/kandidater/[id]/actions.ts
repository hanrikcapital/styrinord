"use server";

import { revalidatePath } from "next/cache";
import { requireCandidateAccess } from "@/lib/auth";
import type { FormState } from "@/components/AuthForm";

export async function contactCandidate(_: FormState, f: FormData): Promise<FormState> {
  const { supabase, user, role } = await requireCandidateAccess();
  if (role !== "company") return { error: "Kun bedrifter kan sende forespørsler." };

  const message = String(f.get("message") ?? "").trim();
  const candidateId = String(f.get("candidate_id"));
  if (message.length < 10) return { error: "Skriv en melding på minst 10 tegn." };

  const { error } = await supabase.from("contact_requests").insert({
    company_id: user.id,
    candidate_id: candidateId,
    message,
  });
  if (error?.code === "23505") return { error: "Dere har allerede en forespørsel som venter på svar." };
  if (error) return { error: "Kunne ikke sende: " + error.message };
  revalidatePath(`/kandidater/${candidateId}`);
  return { message: "Forespørselen er sendt. Dere ser kontaktinformasjonen her når kandidaten har godkjent den." };
}
