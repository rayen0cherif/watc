import { cn } from "@/lib/cn";

interface ProgressProps {
  value: number;
  className?: string;
  tone?: "primary" | "accent" | "warning" | "danger";
  "aria-label"?: string;
}

const toneClass: Record<NonNullable<ProgressProps["tone"]>, string> = {
  primary: "bg-primary-500",
  accent: "bg-accent-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

export function Progress({ value, className, tone = "primary", "aria-label": ariaLabel }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      aria-label={ariaLabel}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-neutral-200", className)}
    >
      <div
        className={cn("h-full rounded-full transition-[width] duration-500 ease-out", toneClass[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
