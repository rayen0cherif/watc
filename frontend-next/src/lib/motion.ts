import type { Transition, Variants } from "motion/react";

/** Ease-out-quart — entrances and emphatic motion */
export const EASE_ENTRANCE = [0.22, 1, 0.36, 1] as const;

/** Material standard curve — in-place transitions */
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

export const DURATION_MICRO = 0.15;
export const DURATION_DEFAULT = 0.25;
export const DURATION_LARGE = 0.4;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerChildren = (stagger = 0.05): Transition => ({
  staggerChildren: stagger,
});

/**
 * Apply a transition object conditionally based on reduced-motion preference.
 * When reduced motion is requested, returns a zero-duration transition so the
 * component still renders its "visible" state without animating.
 */
export function motionSafe(transition: Transition, reduced: boolean): Transition {
  if (reduced) {
    return { duration: 0 };
  }
  return transition;
}
