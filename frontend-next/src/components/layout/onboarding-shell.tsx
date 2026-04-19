import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./logo";

interface OnboardingShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function OnboardingShell({ title, description, children }: OnboardingShellProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" aria-label="Accueil Mentora">
            <Logo />
          </Link>
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            Onboarding
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
          <p className="mt-2 text-sm text-neutral-600">{description}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
