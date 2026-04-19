"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type RadioCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  description?: string;
};

export function RadioCard({
  name,
  value,
  checked,
  onChange,
  label,
  description,
}: RadioCardProps) {
  const id = `${name}-${value}`;
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200 ease-in-out hover:-translate-y-px",
        checked
          ? "border-primary-500 bg-primary-50/40 shadow-sm"
          : "border-neutral-200 bg-white hover:bg-neutral-50"
      )}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
          checked
            ? "border-primary-500 bg-primary-500"
            : "border-neutral-300 bg-white"
        )}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-sm font-medium text-neutral-900">{label}</span>
        {description && (
          <span className="text-sm text-neutral-500">{description}</span>
        )}
      </span>
    </label>
  );
}
