export default function InnholdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 bg-sand">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">{children}</div>
    </div>
  );
}
