import Link from "next/link";
import { Logo } from "./logo";
import { buttonVariants } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="Accueil Mentora">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
          <a href="#features" className="hover:text-neutral-900 transition-colors">
            Fonctionnalités
          </a>
          <a href="#roles" className="hover:text-neutral-900 transition-colors">
            Pour qui ?
          </a>
          <a href="#cta" className="hover:text-neutral-900 transition-colors">
            Démarrer
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:inline-flex transition-colors"
          >
            Se connecter
          </Link>
          <Link href="/register" className={buttonVariants({ variant: "primary", size: "sm" })}>
            Créer un compte
          </Link>
        </div>
      </div>
    </header>
  );
}
