import Link from "next/link";

export default function Registrer() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold text-fjord-900">Registrer deg</h1>
      <p className="mt-2 text-slate-600">Hvem registrerer du deg som?</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link href="/registrer/kandidat" className="card hover:border-fjord-600">
          <h2 className="text-lg font-semibold text-fjord-900">Styrekandidat</h2>
          <p className="mt-2 text-sm text-slate-600">
            Jeg ønsker å bli funnet av bedrifter som trenger styremedlemmer.
          </p>
        </Link>
        <Link href="/registrer/bedrift" className="card hover:border-fjord-600">
          <h2 className="text-lg font-semibold text-fjord-900">Bedrift</h2>
          <p className="mt-2 text-sm text-slate-600">
            Vi ser etter kandidater til styret vårt.
          </p>
        </Link>
      </div>
    </div>
  );
}
