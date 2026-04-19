import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "neutral" | "success" | "warning" | "danger" | "primary";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
  withDot?: boolean;
};

const variantClass: Record<Variant, string> = {
  neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
  success: "bg-success-50 text-success-600 border-success-500/20",
  warning: "bg-warning-50 text-warning-500 border-warning-500/20",
  danger: "bg-danger-50 text-danger-500 border-danger-500/20",
  primary: "bg-primary-50 text-primary-600 border-primary-500/20",
};

const dotClass: Record<Variant, string> = {
  neutral: "bg-neutral-400",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  primary: "bg-primary-500",
};

export function Badge({
  className,
  variant = "neutral",
  withDot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-sm font-medium",
        variantClass[variant],
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          aria-hidden
          className={cn("h-1.5 w-1.5 rounded-full", dotClass[variant])}
        />
      )}
      {children}
    </span>
  );
}
