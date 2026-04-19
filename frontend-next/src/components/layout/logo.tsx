import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  compact?: boolean;
}

export function Logo({ className, compact = false }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-semibold"
      >
        M
      </span>
      {compact ? null : (
        <span className="text-base font-semibold tracking-tight text-neutral-900">
          Mentora
        </span>
      )}
    </div>
  );
}
