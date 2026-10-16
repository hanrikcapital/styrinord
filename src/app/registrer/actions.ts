"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/components/AuthForm";

// Adressen brukeren faktisk er på, så bekreftelseslenken virker uten ekstra oppsett.
async function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
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
      emailRedirectTo: `${await siteUrl()}/auth/callback?next=/min-side`,
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
