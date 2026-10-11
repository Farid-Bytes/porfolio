"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type HorizontalSliderProps = {
  children: ReactNode;
  className?: string;
  /** Autoplay interval in ms; 0 disables. */
  autoplayMs?: number;
  ariaLabel: string;
  /** Slide width utility classes for each item wrapper. */
  itemClassName?: string;
  /** Show edge fade masks on the scroller. */
  fadeEdges?: boolean;
  /** Show progress dots under the track. */
  showDots?: boolean;
  /** Flat snap strip (default) or 3D coverflow wheel. */
  variant?: "flat" | "wheel";
  /** Extra classes for the wheel stage (height / padding). */
  stageClassName?: string;
  /**
   * Compact wheel tuning for smaller poster cards — tighter spacing and
   * stronger side dim. Reviews keep the default.
   */
  density?: "default" | "compact";
};

const WHEEL_STEP_DEG = 38;
const WHEEL_SPACING_PCT = 48;
const WHEEL_SPACING_COMPACT_PCT = 40;
const WHEEL_DEPTH = 120;
const WHEEL_OUTWARD = 56;
const WHEEL_OUTWARD_COMPACT = 40;
const SWIPE_THRESHOLD = 48;
const AXIS_LOCK_PX = 8;
const WHEEL_NAV_THRESHOLD = 40;
const WHEEL_NAV_COOLDOWN_MS = 420;
const WHEEL_TRANSITION_MS = 600;

function clampIndex(index: number, length: number) {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

function shortestOffset(index: number, active: number, length: number) {
  let offset = index - active;
  if (length > 2) {
    const half = length / 2;
    if (offset > half) offset -= length;
    if (offset < -half) offset += length;
  }
  return offset;
}

function wheelSlideStyle(
  offset: number,
  reduceMotion: boolean,
  density: "default" | "compact" = "default",
): CSSProperties {
  const abs = Math.abs(offset);
  const compact = density === "compact";
  const spacing = compact ? WHEEL_SPACING_COMPACT_PCT : WHEEL_SPACING_PCT;
  const outward = compact ? WHEEL_OUTWARD_COMPACT : WHEEL_OUTWARD;

  if (reduceMotion) {
    return {
      opacity: offset === 0 ? 1 : 0,
      transform: `translateX(${offset * 108}%)`,
      zIndex: offset === 0 ? 10 : 0,
      pointerEvents: offset === 0 ? "auto" : "none",
      transition: "opacity 0.2s ease, transform 0.2s ease",
    };
  }

  const rotateY = offset * -WHEEL_STEP_DEG;
  const translateZ =
    offset === 0 ? outward : -WHEEL_DEPTH - (abs - 1) * 36;
  const scale = offset === 0
    ? compact
      ? 1.03
      : 1.04
    : Math.max(0.7, 0.88 - (abs - 1) * 0.08);
  const opacity = abs > 2 ? 0 : abs === 2 ? (compact ? 0.32 : 0.4) : abs === 1 ? (compact ? 0.72 : 0.82) : 1;

  return {
    opacity,
    transform: `translateX(${offset * spacing}%) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
    zIndex: 20 - abs,
    pointerEvents: offset === 0 ? "auto" : "none",
    transition:
      "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
  };
}

export function HorizontalSlider({
  children,
  className,
  autoplayMs = 0,
  ariaLabel,
  itemClassName = "w-[min(100%,22rem)] shrink-0 snap-start sm:w-[26rem]",
  fadeEdges = true,
  showDots = false,
  variant = "flat",
  stageClassName,
  density = "default",
}: HorizontalSliderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    axis: "undecided" | "horizontal" | "vertical";
  } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wheelNavAccRef = useRef(0);
  const wheelNavLockRef = useRef(0);
  const swipeConsumeClickRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [promoteTransforms, setPromoteTransforms] = useState(false);
  const promoteTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const items = Children.toArray(children);
  const isWheel = variant === "wheel";
  const wheelItemClassName = itemClassName.replace(/\bsnap-start\b/g, "").trim();

  const bumpTransformPromotion = useCallback(() => {
    if (!isWheel || reduceMotion) return;
    setPromoteTransforms(true);
    if (promoteTimerRef.current != null) {
      window.clearTimeout(promoteTimerRef.current);
    }
    promoteTimerRef.current = window.setTimeout(() => {
      setPromoteTransforms(false);
      promoteTimerRef.current = null;
    }, WHEEL_TRANSITION_MS);
  }, [isWheel, reduceMotion]);

  const goTo = useCallback(
    (index: number) => {
      bumpTransformPromotion();
      setActiveIndex(clampIndex(index, items.length));
    },
    [bumpTransformPromotion, items.length],
  );

  const step = useCallback(
    (direction: -1 | 1) => {
      bumpTransformPromotion();
      setActiveIndex((current) => clampIndex(current + direction, items.length));
    },
    [bumpTransformPromotion, items.length],
  );

  const scrollByPage = useCallback((direction: -1 | 1) => {
    const node = scrollerRef.current;
    if (!node) return;
    const amount = Math.min(node.clientWidth * 0.85, 420);
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const node = scrollerRef.current;
    if (!node) return;
    const child = node.children[index] as HTMLElement | undefined;
    if (!child) return;
    node.scrollTo({ left: child.offsetLeft - 8, behavior: "smooth" });
  }, []);

  const advance = useCallback(
    (direction: -1 | 1) => {
      if (isWheel) step(direction);
      else scrollByPage(direction);
    },
    [isWheel, scrollByPage, step],
  );

  const jumpTo = useCallback(
    (index: number) => {
      if (isWheel) goTo(index);
      else scrollToIndex(index);
    },
    [goTo, isWheel, scrollToIndex],
  );

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (promoteTimerRef.current != null) {
        window.clearTimeout(promoteTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isWheel) return;
    const node = scrollerRef.current;
    if (!node || !showDots) return;

    const updateActive = () => {
      const childrenEls = [...node.children] as HTMLElement[];
      if (childrenEls.length === 0) return;
      const center = node.scrollLeft + node.clientWidth / 2;
      let best = 0;
      let bestDist = Number.POSITIVE_INFINITY;
      childrenEls.forEach((child, index) => {
        const mid = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(mid - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = index;
        }
      });
      setActiveIndex(best);
    };

    updateActive();
    node.addEventListener("scroll", updateActive, { passive: true });
    return () => node.removeEventListener("scroll", updateActive);
  }, [showDots, items.length, isWheel]);

  useEffect(() => {
    if (!autoplayMs || paused || !inView || items.length < 2) return;

    const id = window.setInterval(() => {
      if (isWheel) {
        step(1);
        return;
      }
      const node = scrollerRef.current;
      if (!node) return;
      const atEnd =
        node.scrollLeft + node.clientWidth >= node.scrollWidth - 8;
      if (atEnd) {
        node.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollByPage(1);
      }
    }, autoplayMs);

    return () => window.clearInterval(id);
  }, [
    autoplayMs,
    paused,
    inView,
    scrollByPage,
    isWheel,
    step,
    items.length,
  ]);

  // Trackpad horizontal swipe + mouse wheel to rotate the card wheel.
  useEffect(() => {
    if (!isWheel || items.length < 2) return;
    const node = stageRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      const horizontal = absX > absY;
      // Horizontal trackpad pans always drive the wheel. Vertical mouse-wheel /
      // trackpad scroll also advances while the pointer is over the stage.
      if (!horizontal && absY < 1) return;

      event.preventDefault();
      setPaused(true);

      const now = performance.now();
      if (now < wheelNavLockRef.current) return;

      const delta = horizontal ? event.deltaX : event.deltaY;
      wheelNavAccRef.current += delta;

      if (Math.abs(wheelNavAccRef.current) < WHEEL_NAV_THRESHOLD) return;

      const direction: -1 | 1 = wheelNavAccRef.current > 0 ? 1 : -1;
      wheelNavAccRef.current = 0;
      wheelNavLockRef.current = now + WHEEL_NAV_COOLDOWN_MS;
      step(direction);
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [isWheel, items.length, step]);

  function onWheelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isWheel) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(items.length - 1);
    }
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isWheel || event.button !== 0) return;
    // Do NOT bail on links/buttons here: the project cards have a full-card
    // anchor overlay, so refusing the gesture on `a` would make swiping *on a
    // card* impossible. Instead we start tracking and decide the swipe axis on
    // the first move; taps (no movement) still activate the card normally.
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      axis: event.pointerType === "touch" ? "undecided" : "horizontal",
    };
    // Capture immediately for mouse/pen; for touch wait until the axis locks to
    // horizontal so a vertical flick still scrolls the page.
    if (event.pointerType !== "touch") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    // Touch: decide axis once movement clears the lock threshold. A mostly
    // vertical gesture hands control back to the page (no capture) so the user
    // can scroll; a mostly horizontal one locks in and captures the pointer.
    if (drag.axis === "undecided") {
      const totalX = event.clientX - drag.startX;
      const totalY = event.clientY - drag.startY;
      if (
        Math.abs(totalX) < AXIS_LOCK_PX &&
        Math.abs(totalY) < AXIS_LOCK_PX
      ) {
        return;
      }
      if (Math.abs(totalY) > Math.abs(totalX) * 1.15) {
        drag.axis = "vertical";
        dragRef.current = null;
        return;
      }
      drag.axis = "horizontal";
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (drag.axis !== "horizontal") return;
  }

  function onPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const horizontal = drag.axis === "horizontal";
    const delta = event.clientX - drag.startX;
    dragRef.current = null;
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* already released */
    }
    if (!horizontal || Math.abs(delta) < SWIPE_THRESHOLD) return;
    // A deliberate horizontal swipe rotates the wheel. Swallow the trailing
    // click so the swipe on a card doesn't also open its link.
    swipeConsumeClickRef.current = true;
    step(delta < 0 ? 1 : -1);
  }

  function onPointerCancel() {
    dragRef.current = null;
  }

  // After a swipe we suppress the next click on the stage so it can't trigger
  // the underlying card link the finger happened to be over.
  function onStageClickCapture(event: ReactMouseEvent<HTMLDivElement>) {
    if (!swipeConsumeClickRef.current) return;
    swipeConsumeClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div
      ref={rootRef}
      className={cn("relative", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setPaused(false);
        }
      }}
    >
      {isWheel ? (
        <div
          ref={stageRef}
          role="region"
          aria-label={ariaLabel}
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={onWheelKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClickCapture={onStageClickCapture}
          className={cn(
            "relative touch-pan-y select-none outline-none",
            "h-[min(28rem,70vh)] sm:h-[30rem]",
            "overflow-visible [perspective:1200px]",
            stageClassName,
          )}
        >
          <div
            className={cn(
              "absolute inset-0 [transform-style:preserve-3d]",
              fadeEdges &&
                "[mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]",
            )}
          >
            {items.map((child, index) => {
              const offset = shortestOffset(index, activeIndex, items.length);
              const style = wheelSlideStyle(offset, reduceMotion, density);
              const visible = Math.abs(offset) <= 2;
              const compact = density === "compact";

              return (
                <div
                  key={index}
                  className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]"
                  style={{ zIndex: style.zIndex }}
                  aria-hidden={!visible || offset !== 0}
                >
                  <div
                    className={cn(
                      "origin-center [transform-style:preserve-3d]",
                      promoteTransforms && "will-change-transform",
                      wheelItemClassName,
                    )}
                    style={style}
                  >
                    <div
                      className={cn(
                        "h-full transition-[filter] duration-300",
                        offset === 0
                          ? compact
                            ? "drop-shadow-[0_12px_28px_rgb(20_184_166/0.18)]"
                            : undefined
                          : compact
                            ? "brightness-[0.9] saturate-[0.85]"
                            : "brightness-[0.96] saturate-[0.92]",
                      )}
                    >
                      {child}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "relative",
            fadeEdges &&
              "[mask-image:linear-gradient(90deg,transparent,black_3%,black_97%,transparent)]",
          )}
        >
          <div
            ref={scrollerRef}
            role="region"
            aria-label={ariaLabel}
            className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          >
            {items.map((child, index) => (
              <div key={index} className={itemClassName}>
                {child}
              </div>
            ))}
          </div>
        </div>
      )}

      {showDots && items.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => jumpTo(index)}
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-300",
                index === activeIndex
                  ? "w-6 bg-accent-400"
                  : "w-1.5 bg-line-strong hover:bg-accent-300",
              )}
              {...(index === activeIndex
                ? { "aria-current": true as const }
                : {})}
            />
          ))}
        </div>
      )}
    </div>
  );
}
