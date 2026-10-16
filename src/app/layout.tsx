import type { Metadata } from "next";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { signOut } from "@/app/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "Styrinord – styrekandidater i Nord-Norge",
  description:
    "Finn kvalifiserte styrekandidater i Nord-Norge, eller registrer deg som kandidat.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSessionUser();

  return (
    <html lang="nb">
      <body className="flex min-h-screen flex-col antialiased">
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="text-xl font-bold text-fjord-900">
              Styri<span className="text-aurora">nord</span>
            </Link>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {session ? (
                <>
                  {(session.role === "company" || session.role === "admin") && (
                    <Link href="/kandidater" className="hover:text-fjord-600">
                      Finn kandidater
                    </Link>
                  )}
                  {session.role === "admin" && (
                    <Link href="/admin" className="hover:text-fjord-600">
                      Admin
                    </Link>
                  )}
                  <Link href="/min-side" className="hover:text-fjord-600">
                    Min side
                  </Link>
                  <form action={signOut}>
                    <button className="btn-secondary">Logg ut</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/logg-inn" className="hover:text-fjord-600">
                    Logg inn
                  </Link>
                  <Link href="/registrer" className="btn">
                    Registrer deg
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-slate-200 bg-fjord-50 text-sm text-slate-600">
          <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-2 px-4 py-6">
            <span>© {new Date().getFullYear()} Styrinord</span>
            <Link href="/personvern" className="hover:text-fjord-600">
              Personvern
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
