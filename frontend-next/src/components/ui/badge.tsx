import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
  {
    variants: {
      tone: {
        neutral: "bg-neutral-50 text-neutral-600 border-neutral-200",
        primary: "bg-primary-50 text-primary-600 border-primary-500/20",
        accent: "bg-accent-50 text-accent-600 border-accent-500/20",
        success: "bg-accent-50 text-accent-600 border-accent-500/20",
        warning: "bg-warning-50 text-warning-500 border-warning-500/20",
        danger: "bg-danger-50 text-danger-500 border-danger-500/20",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
