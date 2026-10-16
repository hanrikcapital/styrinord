import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { signIn } from "../registrer/actions";

export default function LoggInn() {
  return (
    <div className="mx-auto max-w-md card">
      <h1 className="mb-6 text-2xl font-bold text-fjord-900">Logg inn</h1>
      <AuthForm action={signIn} submitLabel="Logg inn" />
      <p className="mt-4 text-sm text-slate-600">
        Ny her?{" "}
        <Link href="/registrer" className="text-fjord-600 underline">
          Registrer deg
        </Link>
      </p>
    </div>
  );
}
