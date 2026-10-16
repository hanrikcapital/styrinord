"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function setCompanyStatus(f: FormData) {
  const { supabase, role } = await requireUser();
  if (role !== "admin") return;
  const status = String(f.get("status"));
  if (!["approved", "rejected", "pending"].includes(status)) return;
  await supabase.from("companies").update({ status }).eq("user_id", String(f.get("user_id")));
  revalidatePath("/admin");
}
