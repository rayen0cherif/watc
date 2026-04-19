"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE_ENTRANCE } from "@/lib/motion";

export function IsometricClipboardSmall() {
  const reduced = useReducedMotion();

  return (
    <div
      className="relative mx-auto flex h-20 w-20 items-center justify-center"
      style={{ perspective: "600px" }}
      aria-hidden
    >
      <motion.div
        animate={
          reduced
            ? undefined
            : { y: [-3, 3, -3], rotateX: [55, 58, 55], rotateZ: [-40, -42, -40] }
        }
        transition={{ repeat: Infinity, duration: 5, ease: EASE_ENTRANCE }}
        className="absolute h-20 w-16"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-lg border-b-[4px] border-r-[4px] border-primary-600 bg-primary-500 shadow-md">
          <div
            className="absolute inset-1.5 flex flex-col gap-1.5 rounded-md border border-neutral-200 bg-white p-2"
            style={{ transform: "translateZ(5px)" }}
          >
            <div className="h-1 rounded-full bg-accent-500" />
            <div className="h-1 w-3/4 rounded-full bg-neutral-200" />
            <div className="h-1 rounded-full bg-neutral-200" />
          </div>
          <div
            className="absolute -top-1.5 left-1/2 h-3 w-6 -translate-x-1/2 rounded-sm border-b-2 border-neutral-400 bg-neutral-200"
            style={{ transform: "translateZ(8px) translateX(-50%)" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
