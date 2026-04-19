import type { ReactNode } from "react";
import { MarketingNav } from "@/components/layout/marketing-nav";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main>{children}</main>
      <footer className="border-t border-neutral-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs text-neutral-600 sm:flex-row">
          <span>© 2026 Mentora. Plateforme dédiée aux projets de fin d'études.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-neutral-900">Mentions légales</a>
            <a href="#" className="hover:text-neutral-900">Confidentialité</a>
            <a href="#" className="hover:text-neutral-900">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
