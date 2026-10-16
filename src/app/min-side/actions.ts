"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import type { FormState } from "@/components/AuthForm";

const text = (f: FormData, k: string) => {
  const v = String(f.get(k) ?? "").trim();
  return v === "" ? null : v;
};

export async function saveCandidate(_: FormState, f: FormData): Promise<FormState> {
  const { supabase, user, role } = await requireUser();
  if (role !== "candidate") return { error: "Kun kandidater kan lagre kandidatprofil." };

  const row = {
    user_id: user.id,
    full_name: text(f, "full_name"),
    birth_date: text(f, "birth_date"),
    gender: text(f, "gender"),
    phone: text(f, "phone"),
    municipality: text(f, "municipality"),
    county: text(f, "county"),
    industry: text(f, "industry"),
    position: text(f, "position"),
    competence: f.getAll("competence").map(String),
    board_experience: text(f, "board_experience"),
    board_roles: text(f, "board_roles"),
    board_education: f.getAll("board_education").map(String),
    desired_roles: f.getAll("desired_roles").map(String),
    bio: text(f, "bio"),
    available: f.get("available") === "on",
    visible: f.get("visible") === "on",
  };

  if (!row.full_name || !row.birth_date || !row.gender || !row.county || !row.industry || !row.board_experience) {
    return { error: "Fyll ut alle felt merket med *." };
  }

  const { error } = await supabase.from("candidates").upsert(row);
  if (error) return { error: "Kunne ikke lagre: " + error.message };
  revalidatePath("/min-side");
  return { saved: true };
}

export async function saveCompany(_: FormState, f: FormData): Promise<FormState> {
  const { supabase, user, role } = await requireUser();
  if (role !== "company") return { error: "Kun bedriftsbrukere kan registrere bedrift." };

  const orgNr = (text(f, "org_nr") ?? "").replace(/\s/g, "");
  if (!/^\d{9}$/.test(orgNr)) return { error: "Organisasjonsnummeret må ha 9 siffer." };

  const row = {
    user_id: user.id,
    company_name: text(f, "company_name"),
    org_nr: orgNr,
    contact_name: text(f, "contact_name"),
    contact_email: text(f, "contact_email") ?? user.email,
    contact_phone: text(f, "contact_phone"),
  };
  if (!row.company_name || !row.contact_name) return { error: "Fyll ut alle felt merket med *." };

  const { error } = await supabase.from("companies").upsert(row);
  if (error) return { error: "Kunne ikke lagre: " + error.message };
  revalidatePath("/min-side");
  return { saved: true };
}

export async function deleteMyProfile() {
  const { supabase, user, role } = await requireUser();
  if (role === "candidate") {
    await supabase.from("candidates").delete().eq("user_id", user.id);
  }
  revalidatePath("/min-side");
  redirect("/min-side");
}
