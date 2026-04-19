import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { OnboardingStepper } from "@/components/onboarding/stepper";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-8">
          <Link href="/" aria-label="Mentora — Accueil">
            <Logo />
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-900"
          >
            Reprendre plus tard
          </Link>
        </div>
      </header>

      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] items-center px-8 py-6">
          <OnboardingStepper />
        </div>
      </div>

      <main className="mx-auto max-w-[1200px] px-8 py-8">{children}</main>
    </div>
  );
}
