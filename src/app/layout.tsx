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

function Logo() {
  return (
    <Link href="/" className="text-xl font-bold tracking-tight text-fjord-900">
      Styri<span className="text-fjord-600">nord</span>
    </Link>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSessionUser();

  return (
    <html lang="nb">
      <body className="flex min-h-screen flex-col antialiased">
        <header className="bg-white">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
            <Logo />
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium sm:gap-5">
              {session ? (
                <>
                  {(session.role === "company" || session.role === "admin") && (
                    <Link href="/kandidater" className="px-2 py-1 hover:text-fjord-600">
                      Finn kandidater
                    </Link>
                  )}
                  {session.role === "admin" && (
                    <Link href="/admin" className="px-2 py-1 hover:text-fjord-600">
                      Admin
                    </Link>
                  )}
                  <Link href="/min-side" className="px-2 py-1 hover:text-fjord-600">
                    Min side
                  </Link>
                  <form action={signOut}>
                    <button className="btn-secondary">Logg ut</button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/logg-inn" className="px-2 py-1 hover:text-fjord-600">
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
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-fjord-50 text-sm text-slate-600">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-6">
            <div>
              <Logo />
              <p className="mt-1">Styrekandidater for Nordland, Troms og Finnmark.</p>
            </div>
            <div className="flex gap-5">
              <Link href="/personvern" className="hover:text-fjord-600">Personvern</Link>
              <span>© {new Date().getFullYear()} Styrinord</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
