import Link from "next/link";

export function Consent() {
  return (
    <label className="flex items-start gap-2 text-sm text-slate-700">
      <input type="checkbox" name="consent" required className="mt-1" />
      <span>
        Jeg har lest og godtar{" "}
        <Link href="/personvern" className="text-fjord-600 underline" target="_blank">
          personvernerklæringen
        </Link>
        .
      </span>
    </label>
  );
}
