"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { EASE_STANDARD } from "@/lib/motion";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusable = containerRef.current?.querySelector<HTMLElement>(
      "input,textarea,select,button,[href],[tabindex]:not([tabindex='-1'])",
    );
    focusable?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: EASE_STANDARD }}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby={description ? "dialog-description" : undefined}
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: EASE_STANDARD }}
            className={cn(
              "relative z-10 w-full max-w-lg rounded-xl bg-white shadow-md border border-neutral-200",
              className,
            )}
          >
            <div className="flex items-start justify-between px-6 pt-6 pb-2">
              <div className="flex flex-col gap-1">
                <h2 id="dialog-title" className="text-base font-semibold text-neutral-900">
                  {title}
                </h2>
                {description ? (
                  <p id="dialog-description" className="text-sm text-neutral-600">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="px-6 pb-6 pt-2">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
