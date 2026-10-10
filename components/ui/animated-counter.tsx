"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  className?: string;
};

/**
 * Count-up that starts once the element enters the viewport.
 * Prefers reduced motion → render the final value immediately.
 */
export function AnimatedCounter({
  value,
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    stiffness: 90,
    damping: 28,
    restDelta: 0.5,
  });

  useEffect(() => {
    if (reduceMotion || !inView) return;
    motionValue.set(0);
    const id = window.setTimeout(() => {
      motionValue.set(value);
    }, 40);
    return () => window.clearTimeout(id);
  }, [inView, motionValue, reduceMotion, value]);

  useEffect(() => {
    if (reduceMotion) return;

    let rafId = 0;
    let pending: number | null = null;

    const flush = () => {
      rafId = 0;
      if (pending == null || !ref.current) return;
      ref.current.textContent = `${Math.round(pending)}${suffix}`;
      pending = null;
    };

    const unsubscribe = spring.on("change", (latest) => {
      pending = latest;
      if (rafId) return;
      rafId = requestAnimationFrame(flush);
    });

    return () => {
      unsubscribe();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reduceMotion, spring, suffix]);

  if (reduceMotion) {
    return (
      <span ref={ref} className={cn("tabular-nums", className)}>
        {value}
        {suffix}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      aria-label={`${value}${suffix}`}
    >
      0{suffix}
    </span>
  );
}
