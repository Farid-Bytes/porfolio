"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type RevealVariant = "rise" | "mask" | "left" | "right" | "scale";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
};

const offsets: Record<
  RevealVariant,
  { x?: number; y?: number; scale?: number; opacity: number }
> = {
  rise: { y: 28, opacity: 0 },
  mask: { y: 18, opacity: 0 },
  left: { x: -36, opacity: 0 },
  right: { x: 36, opacity: 0 },
  scale: { scale: 0.94, y: 16, opacity: 0 },
};

/**
 * Scroll-triggered directional reveal. Falls back to static markup when
 * reduced motion is preferred.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  variant = "rise",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const from = offsets[variant];

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={from}
      whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.48,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
