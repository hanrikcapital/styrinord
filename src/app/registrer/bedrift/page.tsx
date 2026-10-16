import { AuthForm } from "@/components/AuthForm";
import { Consent } from "@/components/Consent";
import { signUpCompany } from "../actions";

export default function RegistrerBedrift() {
  return (
    <div className="mx-auto max-w-md card">
      <h1 className="text-2xl font-bold text-fjord-900">Registrer bedrift</h1>
      <p className="mt-2 mb-6 text-sm text-slate-600">
        Opprett en bruker for bedriften. Etterpå registrerer du bedriftsinformasjon,
        og vi godkjenner bedriften før dere får se kandidatene.
      </p>
      <AuthForm action={signUpCompany} submitLabel="Opprett bruker">
        <Consent />
      </AuthForm>
    </div>
  );
}
