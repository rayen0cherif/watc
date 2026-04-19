import Link from "next/link";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center px-8">
          <Link href="/" aria-label="Mentora — Accueil">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-start justify-center px-6 py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="border-t border-neutral-200 bg-white py-6">
        <p className="text-center text-sm text-neutral-500">
          © 2026 Mentora. Plateforme dédiée à l&apos;excellence académique.
        </p>
      </footer>
    </div>
  );
}
