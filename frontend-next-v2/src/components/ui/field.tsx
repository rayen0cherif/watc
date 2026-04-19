import * as React from "react";
import { cn } from "@/lib/cn";

export function Field({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>{children}</div>
  );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-neutral-500">{children}</p>;
}
