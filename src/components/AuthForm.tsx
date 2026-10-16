"use client";

import { useActionState } from "react";

export type FormState = { error?: string; message?: string; saved?: boolean } | undefined;

export function AuthForm({
  action,
  submitLabel,
  children,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  children?: React.ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  if (state?.message) {
    return <p className="rounded-md bg-emerald-50 p-4 text-emerald-800">{state.message}</p>;
  }

  return (
    <form action={formAction} className="space-y-4">
      {children}
      <div>
        <label className="label" htmlFor="email">E-post</label>
        <input className="input" id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="password">Passord</label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
        />
      </div>
      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}
      <button className="btn w-full" disabled={pending}>
        {pending ? "Vent litt…" : submitLabel}
      </button>
    </form>
  );
}
