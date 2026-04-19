"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE_ENTRANCE } from "@/lib/motion";

export function IsometricClipboard() {
  const reduced = useReducedMotion();

  return (
    <div
      className="relative flex h-80 w-80 items-center justify-center lg:h-96 lg:w-96"
      style={{ perspective: "1200px" }}
      aria-hidden
    >
      <motion.div
        animate={
          reduced
            ? undefined
            : {
                y: [-10, 10, -10],
                rotateX: [55, 58, 55],
                rotateZ: [-35, -38, -35],
              }
        }
        transition={{ repeat: Infinity, duration: 8, ease: EASE_ENTRANCE }}
        className="absolute h-72 w-56 lg:h-80 lg:w-64"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute -bottom-16 -left-6 h-full w-full rounded-full bg-primary-500/20 blur-3xl" />

        <div className="absolute inset-0 rounded-2xl border-b-[10px] border-r-[10px] border-primary-600 bg-primary-500 shadow-md">
          <div
            className="absolute inset-2 rounded-xl border-b-[3px] border-r-[3px] border-neutral-200 bg-neutral-50"
            style={{ transform: "translateZ(4px)" }}
          />

          <div
            className="absolute inset-3 flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
            style={{ transform: "translateZ(12px)" }}
          >
            <div className="h-3 w-1/2 rounded-full bg-primary-50" />

            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500 text-white">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="h-2.5 flex-1 rounded-full bg-neutral-200" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-500 text-white">
                <Check className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="h-2.5 w-3/4 rounded-full bg-neutral-200" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg border-2 border-neutral-200 bg-neutral-50" />
              <div className="h-2.5 flex-1 rounded-full bg-neutral-100" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-lg border-2 border-neutral-200 bg-neutral-50" />
              <div className="h-2.5 w-2/3 rounded-full bg-neutral-100" />
            </div>
          </div>

          <div
            className="absolute -top-4 left-1/2 flex h-10 w-24 -translate-x-1/2 items-center justify-center rounded-xl border-b-4 border-neutral-400 bg-neutral-200 shadow-md"
            style={{ transform: "translateZ(28px) translateX(-50%)" }}
          >
            <div className="h-2 w-14 rounded-full bg-neutral-400" />
          </div>

          <motion.div
            animate={
              reduced
                ? undefined
                : { y: [-6, 6, -6], rotateZ: [-22, -16, -22] }
            }
            transition={{ repeat: Infinity, duration: 5, ease: EASE_ENTRANCE }}
            className="absolute -right-20 top-12 flex h-44 w-8 flex-col items-center rounded-full border-b-[6px] border-r-[6px] border-accent-600 bg-accent-500 shadow-md"
            style={{ transform: "translateZ(60px)" }}
          >
            <div className="h-9 w-full rounded-t-full bg-neutral-900" />
            <div className="mt-auto flex h-14 w-full items-end justify-center rounded-b-full border-b-[5px] border-r-[5px] border-neutral-400 bg-neutral-200 pb-1">
              <div className="h-4 w-2 rounded-full bg-neutral-900" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
