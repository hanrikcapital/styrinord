import { AuthForm } from "@/components/AuthForm";
import { Consent } from "@/components/Consent";
import { signUpCandidate } from "../actions";

export default function RegistrerKandidat() {
  return (
    <div className="mx-auto max-w-md card">
      <h1 className="text-2xl font-bold text-fjord-900">Bli styrekandidat</h1>
      <p className="mt-2 mb-6 text-sm text-slate-600">
        Opprett en bruker. Etterpå fyller du ut profilen din. Innlogging med Vipps
        eller BankID kommer snart.
      </p>
      <AuthForm action={signUpCandidate} submitLabel="Opprett bruker">
        <Consent />
      </AuthForm>
    </div>
  );
}
