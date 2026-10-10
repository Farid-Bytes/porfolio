"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type DivProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
>;

type CardProps = DivProps & {
  /** Adds hover lift, tilt, glare, and glow. */
  interactive?: boolean;
  /**
   * When false, keeps interactive hover chrome but skips pointer tilt/glare
   * (useful when a parent owns 3D transforms).
   */
  tilt?: boolean;
  children?: ReactNode;
};

const TILT = 7;

/**
 * Frosted glass surface. Interactive cards get pointer tilt, glare, and a
 * soft wave glow on fine-pointer hover devices. Reduced-motion / touch fall
 * back to a flat border/shadow lift.
 */
export function Card({
  interactive,
  tilt = true,
  className,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: CardProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [canTilt, setCanTilt] = useState(false);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 });
  const glareBackground = useMotionTemplate`radial-gradient(520px circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.5), transparent 42%)`;

  useEffect(() => {
    if (!interactive || !tilt || reduceMotion) {
      setCanTilt(false);
      return;
    }
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanTilt(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [interactive, tilt, reduceMotion]);

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    onMouseMove?.(event);
    if (!canTilt) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * TILT);
    rotateY.set((px - 0.5) * TILT);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function handleLeave(event: MouseEvent<HTMLDivElement>) {
    onMouseLeave?.(event);
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  const baseClass = cn(
    "relative overflow-hidden rounded-panel border border-line bg-white/92 shadow-panel",
    tilt
      ? "transition-[border-color,box-shadow,background-color,transform] duration-300 ease-out-soft"
      : "transition-[border-color,box-shadow,background-color] duration-300 ease-out-soft",
    interactive &&
      "hover:border-line-accent hover:bg-white hover:shadow-glow focus-within:border-line-accent",
    // Skip hover lift when tilt is off — a CSS translate fights parent 3D transforms.
    interactive &&
      tilt &&
      !reduceMotion &&
      "hover:-translate-y-1 motion-reduce:transform-none",
    className,
  );

  if (!interactive || !tilt) {
    return (
      <div className={baseClass} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        canTilt
          ? {
              rotateX: springX,
              rotateY: springY,
              transformPerspective: 900,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      className={baseClass}
      {...props}
    >
      {canTilt && (
        <>
          <motion.div
            aria-hidden
            style={{ background: glareBackground, opacity: hovered ? 1 : 0 }}
            className="pointer-events-none absolute inset-0 z-[1] mix-blend-soft-light transition-opacity duration-300"
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute -right-8 -bottom-10 z-0 size-28 rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.32),transparent_70%)] blur-xl transition-opacity duration-500",
              hovered
                ? "animate-[card-wave_2.8s_ease-in-out_infinite] opacity-100"
                : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute -top-6 -left-6 z-0 size-24 rounded-full bg-[radial-gradient(circle,rgb(6_182_212/0.26),transparent_70%)] blur-xl transition-opacity duration-500",
              hovered ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-6 bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-accent-400/55 to-transparent transition-opacity duration-500",
              hovered ? "opacity-100" : "opacity-0",
            )}
          />
        </>
      )}
      <div className="relative z-[2] flex h-full min-h-0 flex-1 flex-col">
        {children}
      </div>
    </motion.div>
  );
}

/** Standard interior padding, kept separate so cards can also go edge-to-edge. */
export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 sm:p-7", className)} {...props} />;
}

/** Alias matching the plan name. */
export const InteractiveCard = Card;
