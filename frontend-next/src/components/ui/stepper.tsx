import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface Step {
  id: string;
  label: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
  className?: string;
}

export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol
      className={cn("flex w-full items-center", className)}
      aria-label="Progression"
    >
      {steps.map((step, index) => {
        const completed = index < current;
        const active = index === current;
        const isLast = index === steps.length - 1;
        return (
          <li
            key={step.id}
            className={cn("flex items-center", !isLast && "flex-1")}
            aria-current={active ? "step" : undefined}
          >
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  completed
                    ? "border-accent-500 bg-accent-500 text-white"
                    : active
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-neutral-200 bg-white text-neutral-400",
                )}
              >
                {completed ? <Check className="h-4 w-4" strokeWidth={2.5} /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-medium uppercase tracking-wide text-center min-w-20",
                  active ? "text-primary-600" : "text-neutral-600",
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast ? (
              <div
                aria-hidden
                className={cn(
                  "mx-3 mb-6 h-px flex-1 transition-colors",
                  completed ? "bg-accent-500" : "bg-neutral-200",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
