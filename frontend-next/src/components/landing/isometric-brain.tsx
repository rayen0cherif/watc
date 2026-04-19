"use client";

import { motion } from "motion/react";
import { BrainCircuit } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { EASE_ENTRANCE } from "@/lib/motion";

export function IsometricBrain() {
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
            : { y: [-3, 3, -3], rotateX: [55, 55, 55], rotateZ: [-45, -45, -45] }
        }
        transition={{ repeat: Infinity, duration: 6, ease: EASE_ENTRANCE, delay: 0.3 }}
        className="absolute h-16 w-16"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-xl border-b-[4px] border-r-[4px] border-accent-600 bg-accent-500 shadow-md">
          <div
            className="absolute inset-2 flex items-center justify-center rounded-lg bg-white"
            style={{ transform: "translateZ(6px)" }}
          >
            <BrainCircuit className="h-6 w-6 text-accent-600" strokeWidth={1.5} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
