import { cn } from "@/lib/cn";

interface AvatarProps {
  initials: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  tone?: "primary" | "accent" | "neutral";
}

const sizeClass = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

const toneClass = {
  primary: "bg-primary-50 text-primary-600",
  accent: "bg-accent-50 text-accent-600",
  neutral: "bg-neutral-200 text-neutral-600",
};

export function Avatar({ initials, className, size = "md", tone = "primary" }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold select-none",
        sizeClass[size],
        toneClass[tone],
        className,
      )}
    >
      {initials}
    </span>
  );
}
