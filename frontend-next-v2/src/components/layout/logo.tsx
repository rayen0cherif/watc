import { cn } from "@/lib/cn";
import { BrainCircuit } from "lucide-react";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight text-neutral-900",
        className
      )}
    >
      <BrainCircuit className="h-6 w-6 text-primary-500" />
      <span>
        Mentora<span className="text-accent-500">.</span>
      </span>
    </span>
  );
}
