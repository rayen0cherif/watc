"use client";

import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { ONBOARDING_STEPS } from "@/lib/onboarding-data";

export function OnboardingStepper() {
  const pathname = usePathname();
  const currentIndex = ONBOARDING_STEPS.findIndex((s) =>
    pathname.startsWith(s.href)
  );

  return (
    <ol className="flex items-center gap-3" aria-label="Progression">
      {ONBOARDING_STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <li key={step.slug} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-200",
                  isDone && "border-primary-500 bg-primary-500 text-white",
                  isCurrent &&
                    "border-primary-500 bg-white text-primary-600",
                  !isDone &&
                    !isCurrent &&
                    "border-neutral-200 bg-white text-neutral-500"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {isDone ? (
                  <Check className="h-3 w-3" strokeWidth={3} />
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={cn(
                  "hidden text-sm font-medium md:inline",
                  isCurrent ? "text-neutral-900" : "text-neutral-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < ONBOARDING_STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px w-6 transition-colors duration-200 md:w-12",
                  isDone ? "bg-primary-500" : "bg-neutral-200"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
