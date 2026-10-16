"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/components/AuthForm";

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

async function signUp(role: "candidate" | "company", formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { error: "Passordet må ha minst 8 tegn." };
  if (!formData.get("consent")) return { error: "Du må godta personvernerklæringen." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
      emailRedirectTo: `${siteUrl()}/auth/callback?next=/min-side`,
    },
  });
  if (error) return { error: "Kunne ikke opprette bruker: " + error.message };

  // Uten e-postbekreftelse er brukeren logget inn med en gang.
  if (data.session) redirect("/min-side");
  return {
    message: "Sjekk e-posten din og trykk på lenken for å bekrefte kontoen.",
  };
}

export async function signUpCandidate(_: FormState, formData: FormData) {
  return signUp("candidate", formData);
}

export async function signUpCompany(_: FormState, formData: FormData) {
  return signUp("company", formData);
}

export async function signIn(_: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return { error: "Feil e-post eller passord." };
  redirect("/min-side");
}
