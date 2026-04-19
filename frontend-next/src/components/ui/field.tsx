import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Label } from "./label";

interface FieldProps {
  id: string;
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function Field({ id, label, helper, error, required, children, className }: FieldProps) {
  const describedBy = error ? `${id}-error` : helper ? `${id}-helper` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? <span className="text-danger-500 ml-0.5" aria-hidden>*</span> : null}
      </Label>
      <div data-field-control aria-describedby={describedBy}>
        {children}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger-500">
          {error}
        </p>
      ) : helper ? (
        <p id={`${id}-helper`} className="text-xs text-neutral-600">
          {helper}
        </p>
      ) : null}
    </div>
  );
}
