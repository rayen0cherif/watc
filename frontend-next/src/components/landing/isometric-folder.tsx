"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE_ENTRANCE } from "@/lib/motion";

export function IsometricFolder() {
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
            : { y: [-3, 3, -3], rotateX: [55, 58, 55], rotateZ: [-38, -35, -38] }
        }
        transition={{ repeat: Infinity, duration: 5.5, ease: EASE_ENTRANCE, delay: 0.6 }}
        className="absolute h-14 w-16"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-lg border-b-[4px] border-r-[4px] border-primary-600 bg-primary-500 shadow-md">
          <div
            className="absolute -top-2 left-1 h-12 w-11 rounded-md border border-neutral-200 bg-white shadow-sm"
            style={{ transform: "translateZ(5px)" }}
          >
            <div className="mx-1.5 mt-2 h-[2px] rounded-full bg-primary-50" />
            <div className="mx-1.5 mt-1.5 h-[2px] w-3/4 rounded-full bg-neutral-200" />
            <div className="mx-1.5 mt-1.5 h-[2px] rounded-full bg-neutral-200" />
          </div>
          <div
            className="absolute inset-0 rounded-lg border-t border-primary-50 bg-primary-500/90"
            style={{
              transformOrigin: "bottom left",
              transform: "translateZ(10px) rotateX(-22deg)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
