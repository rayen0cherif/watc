"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ONBOARDING_STEPS, type OnboardingSlug } from "@/lib/onboarding-data";

type StepActionsProps = {
  current: OnboardingSlug;
  nextLabel?: string;
  isSubmitting?: boolean;
  canSubmit?: boolean;
};

export function StepActions({
  current,
  nextLabel = "Continuer",
  isSubmitting = false,
  canSubmit = true,
}: StepActionsProps) {
  const idx = ONBOARDING_STEPS.findIndex((s) => s.slug === current);
  const previous = idx > 0 ? ONBOARDING_STEPS[idx - 1] : null;

  return (
    <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
      {previous ? (
        <Link
          href={previous.href}
          className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-neutral-700 transition-colors duration-200 ease-in-out hover:bg-neutral-100"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Étape précédente
        </Link>
      ) : (
        <span />
      )}

      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={!canSubmit || isSubmitting}
      >
        {isSubmitting ? "Enregistrement…" : nextLabel}
      </Button>
    </div>
  );
}
