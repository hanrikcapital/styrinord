import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "candidate" | "company" | "admin";

/** Innlogget bruker og rolle, eller null. */
export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return { supabase, user, role: (profile?.role ?? "candidate") as Role };
}

export async function requireUser() {
  const session = await getSessionUser();
  if (!session) redirect("/logg-inn");
  return session;
}

/** Bedriften kan se kandidater kun når den er godkjent. Admin kan alltid. */
export async function requireCandidateAccess() {
  const session = await requireUser();
  if (session.role === "admin") return session;
  if (session.role !== "company") redirect("/min-side");

  const { data: company } = await session.supabase
    .from("companies")
    .select("status")
    .eq("user_id", session.user.id)
    .single();
  if (company?.status !== "approved") redirect("/min-side");
  return session;
}
