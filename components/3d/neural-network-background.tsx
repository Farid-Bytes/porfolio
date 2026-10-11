"use client";

import {
  Bitcoin,
  Bot,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  Database,
  Sparkles,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  depth: number;
};

type GlyphSpec = {
  Icon: LucideIcon;
  tone: "accent" | "highlight" | "spark";
};

type NeuralNetworkBackgroundProps = {
  /**
   * `fixed` = full-viewport page field (default).
   * `contained` = fill the parent (footer / section).
   */
  variant?: "fixed" | "contained";
  /**
   * `light` = dark teal ink on the light canvas.
   * `dark` = light teal/white web on dark surfaces.
   */
  tone?: "light" | "dark";
  className?: string;
};

const GLYPHS: GlyphSpec[] = [
  { Icon: Bot, tone: "accent" },
  { Icon: Bitcoin, tone: "spark" },
  { Icon: Cpu, tone: "highlight" },
  { Icon: CircuitBoard, tone: "accent" },
  { Icon: BrainCircuit, tone: "highlight" },
  { Icon: Sparkles, tone: "spark" },
  { Icon: Database, tone: "accent" },
  { Icon: Wifi, tone: "highlight" },
];

const TONE_CLASS: Record<GlyphSpec["tone"], string> = {
  accent: "text-accent-400",
  highlight: "text-highlight",
  spark: "text-spark",
};

const IDLE_PAUSE_MS = 2500;
const CELL_SIZE = 120;
const MAX_NEIGHBORS = 6;
const FRAME_INTERVAL_MS = 1000 / 30;
const EDGE_ALPHA_BUCKETS = 8;

function nodeCountForSize(width: number, height: number, contained: boolean) {
  if (contained) {
    const area = width * height;
    if (area < 180_000) return 18;
    if (area < 360_000) return 28;
    return 36;
  }
  if (width < 640) return 16;
  if (width < 1024) return 36;
  return 40;
}

function seedNodes(width: number, height: number, count: number): Node[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 1.2 + Math.random() * 1.8,
    depth: 0.45 + Math.random() * 0.55,
  }));
}

function pickGlyphIndices(count: number) {
  const indices = new Set<number>();
  const target = Math.min(6, Math.max(3, Math.floor(count * 0.1)));
  while (indices.size < target && indices.size < count) {
    indices.add(Math.floor(Math.random() * count));
  }
  return [...indices];
}

function cellKey(cx: number, cy: number) {
  return `${cx},${cy}`;
}

/**
 * 2D neural web. Default: fixed full-viewport field on the page canvas.
 * Can also fill a parent (`contained`) with a light web for dark surfaces.
 */
export function NeuralNetworkBackground({
  variant = "fixed",
  tone = "light",
  className,
}: NeuralNetworkBackgroundProps = {}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glyphElsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const nodesRef = useRef<Node[]>([]);
  const glyphNodeIndicesRef = useRef<number[]>([]);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const rafRef = useRef(0);
  /**
   * Coarse-pointer (touch) devices run an *ambient* loop: the web animates
   * continuously with no idle-pause, because touch has no hover to drive the
   * pointer-reactive behaviour. All other perf guards (30fps cap, DPR 1 on
   * narrow screens, off-screen pause, reduced-motion) still apply.
   */
  const ambientRef = useRef(false);
  const reduceMotion = useReducedMotion();
  const [staticOnly, setStaticOnly] = useState(true);
  const [glyphCount, setGlyphCount] = useState(0);
  const contained = variant === "contained";
  const dark = tone === "dark";

  const syncStaticGate = useCallback(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Touch devices keep the live canvas (ambient loop) instead of collapsing
    // to a static dot grid — only reduced-motion fully disables animation.
    ambientRef.current = coarse;
    setStaticOnly(reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    syncStaticGate();
    const media = window.matchMedia("(pointer: coarse)");
    const onChange = () => syncStaticGate();
    media.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [syncStaticGate]);

  useEffect(() => {
    if (staticOnly) return;

    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let running = true;
    let animating = true;
    let inView = true;
    let linkDistance = 140;
    let lastPointerAt = performance.now();
    let lastFrameAt = 0;
    // Touch devices run a lower frame rate and pause while scrolling so the
    // ambient web never competes with scroll compositing (see frame()).
    let frameIntervalMs = FRAME_INTERVAL_MS;
    let scrolling = false;
    let scrollTimer = 0;

    const edgeRgb = dark ? "204, 251, 241" : "15, 118, 110";
    const nodeRgb = dark ? "153, 246, 228" : "20, 184, 166";
    const glowRgb = dark ? "165, 243, 252" : "6, 182, 212";
    const edgeAlphaScale = dark ? 0.55 : 0.28;
    const nodeAlphaBase = dark ? 0.55 : 0.35;
    const edgePaths = Array.from(
      { length: EDGE_ALPHA_BUCKETS },
      () => new Path2D(),
    );
    const edgeBucketAlpha = new Float32Array(EDGE_ALPHA_BUCKETS);

    const resize = () => {
      const rect = contained
        ? root.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
      const narrow = rect.width < 768;
      dpr = narrow ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      linkDistance = width < 768 ? 90 : width < 1280 ? 110 : 130;
      // Halve the frame rate on phones — the slow drift is imperceptible at
      // ~20fps but roughly halves GPU/CPU work during ambient animation.
      frameIntervalMs = narrow ? 1000 / 20 : FRAME_INTERVAL_MS;

      const count = nodeCountForSize(width, height, contained);
      nodesRef.current = seedNodes(width, height, count);
      glyphNodeIndicesRef.current = pickGlyphIndices(count);
      setGlyphCount(glyphNodeIndicesRef.current.length);
    };

    const bumpActivity = () => {
      lastPointerAt = performance.now();
      if (!animating && running && !document.hidden && inView) {
        animating = true;
        rafRef.current = requestAnimationFrame(frame);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (contained) {
        const rect = root.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const inside =
          x >= -40 && y >= -40 && x <= rect.width + 40 && y <= rect.height + 40;
        pointerRef.current.x = x;
        pointerRef.current.y = y;
        pointerRef.current.active = inside;
        if (inside) bumpActivity();
        return;
      }

      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.active = true;
      bumpActivity();
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    const onVisibility = () => {
      if (document.hidden) {
        animating = false;
        cancelAnimationFrame(rafRef.current);
      } else if (running && inView) {
        bumpActivity();
      }
    };

    const drawEdges = (nodes: Node[]) => {
      const grid = new Map<string, number[]>();
      const cell = Math.max(CELL_SIZE, linkDistance);
      const linkDistSq = linkDistance * linkDistance;

      for (let b = 0; b < EDGE_ALPHA_BUCKETS; b++) {
        edgePaths[b] = new Path2D();
        edgeBucketAlpha[b] = 0;
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const cx = Math.floor(node.x / cell);
        const cy = Math.floor(node.y / cell);
        const key = cellKey(cx, cy);
        const bucket = grid.get(key);
        if (bucket) bucket.push(i);
        else grid.set(key, [i]);
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const cx = Math.floor(a.x / cell);
        const cy = Math.floor(a.y / cell);
        let linked = 0;

        for (let ox = -1; ox <= 1 && linked < MAX_NEIGHBORS; ox++) {
          for (let oy = -1; oy <= 1 && linked < MAX_NEIGHBORS; oy++) {
            const bucket = grid.get(cellKey(cx + ox, cy + oy));
            if (!bucket) continue;

            for (const j of bucket) {
              if (j <= i) continue;
              const b = nodes[j];
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const distSq = dx * dx + dy * dy;
              if (distSq > linkDistSq) continue;

              const dist = Math.sqrt(distSq);
              const alpha =
                (1 - dist / linkDistance) *
                edgeAlphaScale *
                Math.min(a.depth, b.depth);
              const bucketIndex = Math.min(
                EDGE_ALPHA_BUCKETS - 1,
                Math.max(0, Math.floor(alpha * EDGE_ALPHA_BUCKETS)),
              );
              const path = edgePaths[bucketIndex];
              path.moveTo(a.x, a.y);
              path.lineTo(b.x, b.y);
              edgeBucketAlpha[bucketIndex] = Math.max(
                edgeBucketAlpha[bucketIndex],
                alpha,
              );
              linked += 1;
              if (linked >= MAX_NEIGHBORS) break;
            }
          }
        }
      }

      ctx.lineWidth = 1;
      for (let b = 0; b < EDGE_ALPHA_BUCKETS; b++) {
        const alpha = edgeBucketAlpha[b];
        if (alpha <= 0) continue;
        ctx.strokeStyle = `rgba(${edgeRgb}, ${alpha})`;
        ctx.stroke(edgePaths[b]);
      }
    };

    const frame = (now: number) => {
      if (!running || document.hidden || !animating || !inView) return;

      // On fine-pointer devices the web idles after a pause until the pointer
      // moves again. Touch (ambient) devices keep drifting so the background
      // stays alive without any hover input.
      if (!ambientRef.current && now - lastPointerAt > IDLE_PAUSE_MS) {
        animating = false;
        return;
      }

      // While the user scrolls on touch, skip canvas work entirely so the
      // animation never fights the scroll compositor — the single biggest
      // source of mobile jank. Resumes automatically once scrolling settles.
      if (scrolling) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      if (now - lastFrameAt < frameIntervalMs) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      lastFrameAt = now;

      const nodes = nodesRef.current;
      const pointer = pointerRef.current;

      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx * node.depth;
        node.y += node.vy * node.depth;

        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;

        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 220) {
            const force = ((220 - dist) / 220) * 0.018 * node.depth;
            node.vx -= (dx / dist) * force;
            node.vy -= (dy / dist) * force;
          }
        }

        const speed = Math.hypot(node.vx, node.vy);
        if (speed > 0.55) {
          node.vx *= 0.96;
          node.vy *= 0.96;
        }
      }

      drawEdges(nodes);

      for (const node of nodes) {
        const glow = 0.35 + node.depth * 0.45;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${nodeRgb}, ${nodeAlphaBase + node.depth * 0.35})`;
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();

        if (node.depth > 0.75) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${glowRgb}, ${glow * (dark ? 0.35 : 0.22)})`;
          ctx.arc(node.x, node.y, node.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      glyphNodeIndicesRef.current.forEach((nodeIndex, id) => {
        const node = nodes[nodeIndex];
        const el = glyphElsRef.current[id];
        if (!el || !node) return;
        el.style.transform = `translate3d(${node.x}px, ${node.y}px, 0) translate(-50%, -50%)`;
      });

      rafRef.current = requestAnimationFrame(frame);
    };

    resize();

    const resizeObserver =
      contained && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => resize())
        : null;
    resizeObserver?.observe(root);

    const setInView = (next: boolean) => {
      inView = next;
      if (inView) bumpActivity();
      else {
        animating = false;
        cancelAnimationFrame(rafRef.current);
      }
    };

    let viewObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      if (contained) {
        viewObserver = new IntersectionObserver(
          ([entry]) => setInView(entry?.isIntersecting ?? true),
          { rootMargin: "80px 0px" },
        );
        viewObserver.observe(root);
      } else {
        const footer = document.querySelector("footer");
        if (footer) {
          // Pause the fixed page field while the footer is on screen so only
          // the contained footer canvas animates.
          viewObserver = new IntersectionObserver(
            ([entry]) => setInView(!(entry?.isIntersecting ?? false)),
            { threshold: 0 },
          );
          viewObserver.observe(footer);
        }
      }
    }

    if (!contained) {
      window.addEventListener("resize", resize);
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    // Touch scroll-pause: flag scrolling on touch scroll, clear it shortly
    // after the gesture ends. Only touch devices set this (desktop keeps its
    // pointer-reactive behaviour untouched).
    const onScroll = () => {
      if (!ambientRef.current) return;
      scrolling = true;
      if (scrollTimer) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        scrolling = false;
      }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Seed one frame, then idle naturally until pointer activity.
    lastPointerAt = performance.now();
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      running = false;
      animating = false;
      cancelAnimationFrame(rafRef.current);
      if (scrollTimer) window.clearTimeout(scrollTimer);
      resizeObserver?.disconnect();
      viewObserver?.disconnect();
      if (!contained) {
        window.removeEventListener("resize", resize);
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [staticOnly, contained, dark]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden",
        contained ? "absolute inset-0" : "fixed inset-0 z-0",
        className,
      )}
    >
      {staticOnly ? (
        <div
          className={cn(
            "absolute inset-0",
            dark
              ? "opacity-45 [background-image:radial-gradient(circle_at_center,rgb(248_250_252/0.55)_1.1px,transparent_1.1px)] [background-size:28px_28px]"
              : "bg-dot-grid opacity-35 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]",
          )}
        />
      ) : (
        <>
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
          {Array.from({ length: glyphCount }, (_, id) => {
            const spec = GLYPHS[id % GLYPHS.length];
            const Icon = spec.Icon;

            return (
              <span
                key={id}
                ref={(el) => {
                  glyphElsRef.current[id] = el;
                }}
                className={cn(
                  "absolute top-0 left-0 grid size-7 place-items-center rounded-lg will-change-transform",
                  dark
                    ? "border border-white/20 bg-white/10 opacity-50 shadow-[0_0_18px_rgb(20_184_166/0.25)]"
                    : "border border-line bg-white/70 opacity-[0.4] shadow-panel",
                  TONE_CLASS[spec.tone],
                )}
              >
                <Icon className="size-3.5" strokeWidth={1.75} />
              </span>
            );
          })}
        </>
      )}

      {!dark ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(232_236_242/0.55)_100%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(7_20_18/0.55)_100%)]" />
      )}
    </div>
  );
}
