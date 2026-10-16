import type { ApprovedContact } from "@/lib/contact";

export function ContactInfo({ contact }: { contact: ApprovedContact }) {
  return (
    <dl className="grid gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900 sm:grid-cols-[100px_1fr]">
      <dt className="font-medium">E-post</dt>
      <dd>
        <a className="underline" href={`mailto:${contact.email}`}>{contact.email}</a>
      </dd>
      {contact.phone && (
        <>
          <dt className="font-medium">Telefon</dt>
          <dd>
            <a className="underline" href={`tel:${contact.phone}`}>{contact.phone}</a>
          </dd>
        </>
      )}
    </dl>
  );
}
