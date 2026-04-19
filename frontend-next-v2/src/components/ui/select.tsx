import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={cn(
        "h-9 w-full appearance-none rounded-lg border border-neutral-200 bg-white pl-3 pr-9 text-sm text-neutral-900 transition-colors duration-200 ease-in-out focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden
      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
      strokeWidth={2}
    />
  </div>
));
Select.displayName = "Select";
