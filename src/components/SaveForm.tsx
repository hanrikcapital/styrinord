"use client";

import { useActionState } from "react";
import type { FormState } from "./AuthForm";

export function SaveForm({
  action,
  children,
  submitLabel = "Lagre",
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="space-y-5">
      {children}
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      {state?.saved && !pending && <p className="text-sm text-emerald-700">Lagret.</p>}
      <button className="btn" disabled={pending}>
        {pending ? "Lagrer…" : submitLabel}
      </button>
    </form>
  );
}
