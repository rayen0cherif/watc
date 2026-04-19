import Link from "next/link";
import { Logo } from "./logo";

export function MarketingNav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center" aria-label="Mentora — Accueil">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
          <a href="#fonctionnalites" className="transition-colors hover:text-primary-600">
            Fonctionnalités
          </a>
          <a href="#roles" className="transition-colors hover:text-primary-600">
            Pour qui
          </a>
          <a href="#approche" className="transition-colors hover:text-primary-600">
            Approche
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-neutral-700 transition-colors hover:text-primary-600 sm:block"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-primary-500/25 transition-colors hover:bg-primary-600"
          >
            Commencer
          </Link>
        </div>
      </div>
    </nav>
  );
}
