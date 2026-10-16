"use client";

import { useActionState } from "react";
import type { FormState } from "./AuthForm";

export function ContactForm({
  action,
  candidateId,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  candidateId: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  if (state?.message) return <p className="rounded-md bg-emerald-50 p-4 text-emerald-800">{state.message}</p>;
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="candidate_id" value={candidateId} />
      <textarea
        className="input"
        name="message"
        rows={5}
        required
        minLength={10}
        maxLength={2000}
        placeholder="Fortell kort om bedriften og hvilket verv det gjelder."
      />
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button className="btn" disabled={pending}>{pending ? "Sender…" : "Send henvendelse"}</button>
    </form>
  );
}
