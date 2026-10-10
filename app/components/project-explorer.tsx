"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { StoryPanel } from "@/lib/projects";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type ProjectExplorerProps = {
  panels: readonly StoryPanel[];
  projectName: string;
};

type WirePoint = { y: number; spurX: number };

const WIRE_COLORS = [
  "rgb(13 148 136)",
  "rgb(6 182 212)",
  "rgb(245 158 11)",
] as const;

function buildTrunkPath(points: WirePoint[], x: number): string {
  if (points.length === 0) return "";
  if (points.length === 1) {
    return `M ${x} ${points[0].y} H ${points[0].spurX}`;
  }

  let d = `M ${x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mid = (prev.y + curr.y) / 2;
    const sway = i % 2 === 0 ? 10 : -10;
    d += ` C ${x + sway} ${mid - 6}, ${x - sway} ${mid + 6}, ${x} ${curr.y}`;
  }
  return d;
}

function ConnectingWires({
  points,
  height,
}: {
  points: WirePoint[];
  height: number;
}) {
  if (points.length === 0 || height <= 0) return null;

  const trunkX = 14;
  const trunk = buildTrunkPath(points, trunkX);
  const twin = buildTrunkPath(
    points.map((p) => ({ ...p, y: p.y + 3 })),
    trunkX + 4,
  );

  return (
    <svg
      aria-hidden
      width="40"
      height={height}
      className="pointer-events-none absolute top-0 left-0 z-0 overflow-visible"
    >
      <path
        d={trunk}
        fill="none"
        stroke={WIRE_COLORS[0]}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d={twin}
        fill="none"
        stroke={WIRE_COLORS[1]}
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.55"
      />
      {points.map((p, i) => (
        <g key={i}>
          <path
            d={`M ${trunkX} ${p.y} H ${p.spurX}`}
            fill="none"
            stroke={WIRE_COLORS[i % WIRE_COLORS.length]}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle
            cx={p.spurX}
            cy={p.y}
            r="3.5"
            fill="none"
            stroke={WIRE_COLORS[i % WIRE_COLORS.length]}
            strokeWidth="1.5"
          />
        </g>
      ))}
    </svg>
  );
}

export function ProjectExplorer({
  panels,
  projectName,
}: ProjectExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [wirePoints, setWirePoints] = useState<WirePoint[]>([]);
  const [listHeight, setListHeight] = useState(0);
  const reduceMotion = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = panels[activeIndex] ?? panels[0];

  const measureWires = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const next: WirePoint[] = [];
    itemRefs.current.forEach((el) => {
      if (!el) return;
      next.push({
        y: el.offsetTop + el.offsetHeight / 2,
        spurX: 34,
      });
    });

    setWirePoints(next);
    setListHeight(list.scrollHeight);
  }, []);

  const syncActiveFromScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const railRect = rail.getBoundingClientRect();
    const centerY = railRect.top + railRect.height / 2;

    let bestIndex = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    itemRefs.current.forEach((el, index) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const itemCenter = rect.top + rect.height / 2;
      const dist = Math.abs(itemCenter - centerY);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = index;
      }
    });

    setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const sync = () => {
      measureWires();
      syncActiveFromScroll();
    };

    sync();
    rail.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    window.addEventListener("resize", sync);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => measureWires())
        : null;
    if (listRef.current) ro?.observe(listRef.current);

    return () => {
      rail.removeEventListener("scroll", syncActiveFromScroll);
      window.removeEventListener("resize", sync);
      ro?.disconnect();
    };
  }, [panels, measureWires, syncActiveFromScroll]);

  function scrollToIndex(index: number) {
    const rail = railRef.current;
    const el = itemRefs.current[index];
    if (!rail || !el) return;

    const offset = el.offsetTop - rail.clientHeight / 2 + el.offsetHeight / 2;

    rail.scrollTo({
      top: Math.max(0, offset),
      behavior: reduceMotion ? "auto" : "smooth",
    });
    setActiveIndex(index);
  }

  if (!active) return null;

  return (
    <section
      aria-label={`${projectName} feature explorer`}
      className="section-y relative isolate overflow-clip border-b border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-8rem] right-[-10rem] -z-10 size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(6_182_212/0.1),transparent_70%)] blur-xl"
      />

      <div className="container-page">
        <header className="max-w-2xl">
          <h2 className="text-display-sm font-semibold">
            <span className="text-gradient-accent">Feature walkthrough</span>
          </h2>
        </header>

        <div className="mt-10 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(17rem,24rem)_minmax(0,1fr)] lg:gap-10">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-canvas to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-canvas to-transparent"
            />

            <div
              ref={railRef}
              className="relative z-10 h-[min(28rem,62svh)] snap-y snap-mandatory overflow-y-auto overscroll-contain scroll-smooth pl-3 py-[40%] [scrollbar-width:thin]"
              aria-label="Feature spin wheel"
            >
              <ol ref={listRef} className="relative flex flex-col gap-4 pl-6">
                <ConnectingWires points={wirePoints} height={listHeight} />

                {panels.map((panel, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <li key={panel.id} className="relative z-10 snap-center">
                      <button
                        type="button"
                        ref={(el) => {
                          itemRefs.current[index] = el;
                        }}
                        aria-pressed={isActive}
                        onClick={() => scrollToIndex(index)}
                        className={cn(
                          "relative w-full rounded-[0.85rem] border border-dashed bg-white/40 px-3.5 py-3.5 text-left transition-[opacity,transform,border-color,background-color,box-shadow] duration-300",
                          isActive
                            ? "border-accent-500 bg-white/70 opacity-100 shadow-[0_0_0_1px_rgb(13_148_136/0.2)]"
                            : "border-ink/25 opacity-50 hover:opacity-80",
                        )}
                      >
                        <span className="relative flex items-start gap-3">
                          <span
                            className={cn(
                              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border font-mono text-[0.65rem] tracking-[0.12em]",
                              isActive
                                ? "border-accent-500 text-accent-600"
                                : "border-ink/20 text-ink-subtle",
                            )}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-ink">
                              {panel.title}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                              {panel.oneLiner}
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <aside
            aria-live="polite"
            className="relative rounded-[1.35rem] border border-line bg-white/70 p-4 shadow-panel sm:p-5 lg:sticky lg:top-28 lg:self-start lg:p-6"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: reduceMotion ? 0 : 0.28 }}
                className="relative"
              >
                <div className="overflow-hidden rounded-[1.1rem] border border-line bg-[#f7f8fb]/50">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={active.media.src}
                      alt={active.media.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 36rem"
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                <p className="mt-5 font-mono text-[0.65rem] tracking-[0.16em] text-accent-500 uppercase">
                  {String(activeIndex + 1).padStart(2, "0")} · {active.eyebrow}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                  {active.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                  {active.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>
      </div>
    </section>
  );
}
