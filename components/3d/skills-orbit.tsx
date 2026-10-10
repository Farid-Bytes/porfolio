"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export type OrbitItem = {
  id: string;
  label: string;
  imageSrc: string;
  /** Tailwind classes for the tile face (border / bg). */
  toneClass: string;
};

type SkillsOrbitProps = {
  items: readonly OrbitItem[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  className?: string;
};

const RADIUS_PX = 178;
const TILT_DEG = -14;
const AUTO_DEG_PER_SEC = 8;
const DRAG_SENSITIVITY = 0.35;
const INERTIA_FRICTION = 0.94;
const MIN_INERTIA = 0.02;
const TOUCH_LOCK_THRESHOLD = 8;
/** Soft fade starts here; tiles beyond HIDE_ABS_DEG are fully culled. */
const FADE_ABS_DEG = 78;
const HIDE_ABS_DEG = 100;

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function normalizeDegrees(deg: number) {
  let value = deg % 360;
  if (value > 180) value -= 360;
  if (value < -180) value += 360;
  return value;
}

function indexFromRotation(rotation: number, count: number) {
  if (count === 0) return 0;
  const step = 360 / count;
  return wrapIndex(Math.round(-rotation / step), count);
}

function rotationForIndex(index: number, count: number) {
  if (count === 0) return 0;
  return -index * (360 / count);
}

function tileVisuals(rotation: number, index: number, step: number) {
  const angle = index * step;
  const world = normalizeDegrees(rotation + angle);
  const absWorld = Math.abs(world);
  const depth = (Math.cos((world * Math.PI) / 180) + 1) / 2;
  const hidden = absWorld > HIDE_ABS_DEG;
  const scale = 0.72 + depth * 0.38;
  const depthOpacity = 0.35 + depth * 0.65;
  let opacity = depthOpacity;
  if (hidden) {
    opacity = 0;
  } else if (absWorld > FADE_ABS_DEG) {
    const t = (HIDE_ABS_DEG - absWorld) / (HIDE_ABS_DEG - FADE_ABS_DEG);
    opacity = depthOpacity * Math.max(0, Math.min(1, t));
  }
  return {
    angle,
    hidden,
    scale,
    opacity,
    zIndex: Math.round(depth * 100),
  };
}

export function SkillsOrbit({
  items,
  activeIndex,
  onActiveIndexChange,
  className,
}: SkillsOrbitProps) {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rotationRef = useRef(rotationForIndex(activeIndex, items.length));
  const velocityRef = useRef(0);
  const draggingRef = useRef(false);
  const pausedRef = useRef(false);
  const offscreenRef = useRef(false);
  const reduceMotionRef = useRef(reduceMotion);
  const pointerIdRef = useRef<number | null>(null);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);
  const movedRef = useRef(false);
  const touchAxisRef = useRef<"undecided" | "horizontal" | "vertical">(
    "undecided",
  );
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);
  const lastIndexRef = useRef(activeIndex);
  const onActiveIndexChangeRef = useRef(onActiveIndexChange);

  const [isDragging, setIsDragging] = useState(false);

  const count = items.length;
  const step = count > 0 ? 360 / count : 360;
  const frontItem = items[activeIndex];

  reduceMotionRef.current = reduceMotion;
  onActiveIndexChangeRef.current = onActiveIndexChange;

  const applyVisuals = useCallback(
    (rotation: number) => {
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `rotateX(${TILT_DEG}deg) rotateY(${rotation}deg)`;
      }

      for (let index = 0; index < count; index++) {
        const el = tileRefs.current[index];
        if (!el) continue;
        const { angle, hidden, scale, opacity, zIndex } = tileVisuals(
          rotation,
          index,
          step,
        );
        el.style.transform = `rotateY(${angle}deg) translateZ(${RADIUS_PX}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(zIndex);
        el.style.pointerEvents = hidden ? "none" : "";
        if (hidden) {
          el.setAttribute("aria-hidden", "true");
          el.setAttribute("disabled", "");
        } else {
          el.removeAttribute("aria-hidden");
          el.removeAttribute("disabled");
        }
      }
    },
    [count, step],
  );

  const publishRotation = useCallback(
    (next: number) => {
      rotationRef.current = next;
      applyVisuals(next);
      const index = indexFromRotation(next, count);
      if (lastIndexRef.current !== index) {
        lastIndexRef.current = index;
        onActiveIndexChangeRef.current(index);
      }
    },
    [applyVisuals, count],
  );

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastFrameRef.current = null;
  }, []);

  const needsLoop = useCallback(() => {
    if (draggingRef.current) return false;
    if (Math.abs(velocityRef.current) > MIN_INERTIA) return true;
    if (reduceMotionRef.current || pausedRef.current || offscreenRef.current) {
      return false;
    }
    return count > 0;
  }, [count]);

  const startLoop = useCallback(() => {
    if (rafRef.current != null) return;
    if (!needsLoop() && Math.abs(velocityRef.current) <= MIN_INERTIA) return;

    const tick = (now: number) => {
      const prev = lastFrameRef.current ?? now;
      const dt = Math.min((now - prev) / 1000, 0.05);
      lastFrameRef.current = now;

      let next = rotationRef.current;
      let dirty = false;

      if (draggingRef.current) {
        // Pointer handlers update rotation directly.
      } else if (Math.abs(velocityRef.current) > MIN_INERTIA) {
        next += velocityRef.current;
        velocityRef.current *= INERTIA_FRICTION;
        if (Math.abs(velocityRef.current) <= MIN_INERTIA) {
          velocityRef.current = 0;
          const index = indexFromRotation(next, count);
          next = rotationForIndex(index, count);
        }
        dirty = true;
      } else if (
        !reduceMotionRef.current &&
        !pausedRef.current &&
        !offscreenRef.current &&
        count > 0
      ) {
        next += AUTO_DEG_PER_SEC * dt;
        dirty = true;
      }

      if (dirty) {
        publishRotation(next);
      }

      if (needsLoop()) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        lastFrameRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [count, needsLoop, publishRotation]);

  const snapToIndex = useCallback(
    (index: number) => {
      const target = rotationForIndex(wrapIndex(index, count), count);
      velocityRef.current = 0;
      publishRotation(target);
    },
    [count, publishRotation],
  );

  const setPaused = useCallback(
    (paused: boolean) => {
      pausedRef.current = paused;
      if (paused) {
        if (Math.abs(velocityRef.current) <= MIN_INERTIA) stopLoop();
      } else {
        startLoop();
      }
    },
    [startLoop, stopLoop],
  );

  // Keep external activeIndex (e.g. pill click) in sync when not dragging.
  useEffect(() => {
    if (draggingRef.current) return;
    const expected = indexFromRotation(rotationRef.current, count);
    if (expected !== activeIndex) {
      rotationRef.current = rotationForIndex(activeIndex, count);
      applyVisuals(rotationRef.current);
      velocityRef.current = 0;
      lastIndexRef.current = activeIndex;
    }
  }, [activeIndex, applyVisuals, count]);

  // Initial paint + paint after React commits tile nodes.
  useEffect(() => {
    applyVisuals(rotationRef.current);
  }, [applyVisuals, items]);

  // Pause when off-screen; resume auto-spin when visible again.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        offscreenRef.current = !entry.isIntersecting;
        if (offscreenRef.current) {
          if (Math.abs(velocityRef.current) <= MIN_INERTIA) stopLoop();
        } else {
          startLoop();
        }
      },
      { threshold: 0.08, rootMargin: "40px 0px" },
    );

    observer.observe(stage);
    return () => observer.disconnect();
  }, [startLoop, stopLoop]);

  useEffect(() => {
    if (!reduceMotion) startLoop();
    return () => stopLoop();
  }, [reduceMotion, startLoop, stopLoop]);

  const endDrag = useCallback(
    (pointerId: number) => {
      if (pointerIdRef.current !== pointerId) return;
      const stage = stageRef.current;
      if (stage?.hasPointerCapture(pointerId)) {
        stage.releasePointerCapture(pointerId);
      }
      pointerIdRef.current = null;
      draggingRef.current = false;
      setIsDragging(false);
      touchAxisRef.current = "undecided";

      if (!movedRef.current) {
        startLoop();
        return;
      }

      if (Math.abs(velocityRef.current) < 0.4) {
        const index = indexFromRotation(rotationRef.current, count);
        publishRotation(rotationForIndex(index, count));
        velocityRef.current = 0;
      }
      startLoop();
    },
    [count, publishRotation, startLoop],
  );

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    pointerIdRef.current = event.pointerId;
    draggingRef.current = true;
    setIsDragging(true);
    movedRef.current = false;
    velocityRef.current = 0;
    stopLoop();
    lastXRef.current = event.clientX;
    lastYRef.current = event.clientY;
    startXRef.current = event.clientX;
    startYRef.current = event.clientY;
    lastTRef.current = performance.now();
    touchAxisRef.current =
      event.pointerType === "touch" ? "undecided" : "horizontal";
    // Capture immediately for mouse/pen; wait for horizontal lock on touch
    // so vertical page scroll is not stolen.
    if (event.pointerType !== "touch") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== event.pointerId || !draggingRef.current) {
      return;
    }

    const dx = event.clientX - lastXRef.current;
    const now = performance.now();
    const dt = Math.max(now - lastTRef.current, 1);

    if (touchAxisRef.current === "undecided") {
      const totalX = event.clientX - startXRef.current;
      const totalY = event.clientY - startYRef.current;
      if (
        Math.abs(totalX) < TOUCH_LOCK_THRESHOLD &&
        Math.abs(totalY) < TOUCH_LOCK_THRESHOLD
      ) {
        return;
      }
      if (Math.abs(totalY) > Math.abs(totalX) * 1.15) {
        touchAxisRef.current = "vertical";
        pointerIdRef.current = null;
        draggingRef.current = false;
        setIsDragging(false);
        startLoop();
        return;
      }
      touchAxisRef.current = "horizontal";
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (touchAxisRef.current === "vertical") return;

    if (Math.abs(dx) > 0.5) movedRef.current = true;

    const delta = dx * DRAG_SENSITIVITY;
    velocityRef.current = (delta / dt) * 16;
    publishRotation(rotationRef.current + delta);

    lastXRef.current = event.clientX;
    lastYRef.current = event.clientY;
    lastTRef.current = now;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    endDrag(event.pointerId);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (count === 0) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      snapToIndex(activeIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      snapToIndex(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      snapToIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      snapToIndex(count - 1);
    }
  };

  const initialRotation = rotationRef.current;

  return (
    <div
      ref={stageRef}
      role="listbox"
      aria-label="Skills orbit"
      aria-activedescendant={
        frontItem ? `skill-orbit-${frontItem.id}` : undefined
      }
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "relative mx-auto h-[21rem] w-full max-w-[34rem] touch-pan-y select-none",
        "outline-none focus-visible:ring-2 focus-visible:ring-accent-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className,
      )}
      style={{ perspective: "1100px", touchAction: "pan-y" }}
    >
      {/* Ghost of active skill */}
      {frontItem ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid place-items-center"
        >
          <div className="grid size-32 place-items-center opacity-[0.12] blur-[1px] sm:size-36">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={frontItem.imageSrc}
              alt=""
              className="size-20 object-contain"
              draggable={false}
            />
          </div>
        </div>
      ) : null}

      <div
        ref={ringRef}
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${TILT_DEG}deg) rotateY(${initialRotation}deg)`,
        }}
      >
        {items.map((item, index) => {
          const { angle, hidden, scale, opacity, zIndex } = tileVisuals(
            initialRotation,
            index,
            step,
          );
          const isFront = index === activeIndex;

          return (
            <button
              key={item.id}
              ref={(el) => {
                tileRefs.current[index] = el;
              }}
              id={`skill-orbit-${item.id}`}
              type="button"
              role="option"
              aria-selected={isFront}
              aria-label={item.label}
              aria-hidden={hidden || undefined}
              tabIndex={-1}
              disabled={hidden}
              onClick={() => {
                if (movedRef.current || hidden) return;
                snapToIndex(index);
              }}
              className={cn(
                "absolute top-1/2 left-1/2 -ml-12 -mt-14 w-[6rem]",
                "origin-center border-0 bg-transparent p-0",
                "transition-[filter] duration-200",
                hidden && "pointer-events-none",
                isFront ? "z-20" : "z-10",
              )}
              style={{
                transform: `rotateY(${angle}deg) translateZ(${RADIUS_PX}px) scale(${scale})`,
                opacity,
                zIndex,
                transformStyle: "preserve-3d",
              }}
            >
              <span
                className="relative flex flex-col items-center gap-1.5"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Extruded tile: face + depth slab + side edge */}
                <span
                  className="relative size-[3.85rem]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-2xl bg-slate-deep/20"
                    style={{ transform: "translateZ(-12px) scale(0.94)" }}
                  />
                  <span
                    aria-hidden
                    className="absolute top-1 right-0 bottom-1 w-3 rounded-r-2xl bg-gradient-to-b from-white/40 to-slate-deep/25"
                    style={{
                      transform: "rotateY(90deg) translateZ(1.925rem)",
                      transformOrigin: "right center",
                    }}
                  />
                  <span
                    className={cn(
                      "relative grid size-full place-items-center rounded-2xl border",
                      "bg-white/92",
                      item.toneClass,
                      isFront && "shadow-glow",
                    )}
                    style={{
                      transform: "translateZ(12px)",
                      boxShadow:
                        "0 1px 0 0 rgb(255 255 255 / 0.9) inset, 0 14px 28px -14px rgb(6 11 20 / 0.35)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageSrc}
                      alt=""
                      className="size-8 object-contain"
                      draggable={false}
                    />
                  </span>
                </span>
                <span
                  className={cn(
                    "w-full text-center font-mono text-[0.62rem] leading-tight tracking-[0.04em]",
                    isFront ? "font-medium text-ink" : "text-ink-subtle",
                  )}
                  style={{
                    transform: isFront
                      ? "translateZ(8px) translateY(12px)"
                      : "translateZ(8px)",
                  }}
                >
                  {item.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
