"use client";

import { motion } from "motion/react";
import { useId, useMemo } from "react";

import type { DiagramKind, StoryEdge, StoryNode } from "@/lib/projects";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type ProjectDiagramProps = {
  kind: DiagramKind;
  nodes: readonly StoryNode[];
  edges?: readonly StoryEdge[];
  active?: boolean;
  className?: string;
};

type Point = { x: number; y: number };

const VIEW = { w: 720, h: 380 };

/** Sketch stroke palette — colorful outlines, no heavy fills. */
const NODE_STROKE = [
  "rgb(13 148 136)",
  "rgb(6 182 212)",
  "rgb(245 158 11)",
  "rgb(16 185 129)",
  "rgb(244 63 94)",
  "rgb(14 165 233)",
] as const;

function layoutNodes(
  kind: DiagramKind,
  nodes: readonly StoryNode[],
): Record<string, Point> {
  const n = nodes.length;
  const positions: Record<string, Point> = {};

  if (n === 0) return positions;

  if (kind === "layers") {
    nodes.forEach((node, i) => {
      positions[node.id] = {
        x: VIEW.w / 2,
        y: 52 + (i * (VIEW.h - 90)) / Math.max(n - 1, 1),
      };
    });
    return positions;
  }

  if (kind === "chat" || kind === "rag") {
    if (n === 1) {
      positions[nodes[0].id] = { x: VIEW.w / 2, y: VIEW.h / 2 };
      return positions;
    }
    positions[nodes[0].id] = { x: 100, y: VIEW.h / 2 };
    if (n === 2) {
      positions[nodes[1].id] = { x: VIEW.w - 100, y: VIEW.h / 2 };
      return positions;
    }
    positions[nodes[1].id] = { x: VIEW.w / 2, y: VIEW.h / 2 };
    const tools = nodes.slice(2);
    tools.forEach((node, i) => {
      const t = tools.length === 1 ? 0.5 : i / (tools.length - 1);
      positions[node.id] = {
        x: VIEW.w - 108,
        y: 64 + t * (VIEW.h - 128),
      };
    });
    return positions;
  }

  if (kind === "map" || kind === "store") {
    if (n <= 3) {
      nodes.forEach((node, i) => {
        positions[node.id] = {
          x: 120 + i * ((VIEW.w - 240) / Math.max(n - 1, 1)),
          y: VIEW.h / 2,
        };
      });
      return positions;
    }
    nodes.forEach((node, i) => {
      const cols = Math.ceil(Math.sqrt(n));
      const row = Math.floor(i / cols);
      const col = i % cols;
      const rows = Math.ceil(n / cols);
      positions[node.id] = {
        x: 120 + col * ((VIEW.w - 240) / Math.max(cols - 1, 1)),
        y: 80 + row * ((VIEW.h - 120) / Math.max(rows - 1, 1)),
      };
    });
    return positions;
  }

  // pipeline / flow — horizontal outline chain
  nodes.forEach((node, i) => {
    positions[node.id] = {
      x: 96 + (i * (VIEW.w - 192)) / Math.max(n - 1, 1),
      y: VIEW.h / 2 + (n > 4 && i % 2 === 1 ? 36 : n > 4 && i % 2 === 0 ? -28 : 0),
    };
  });
  return positions;
}

function defaultEdges(
  nodes: readonly StoryNode[],
  edges?: readonly StoryEdge[],
): readonly StoryEdge[] {
  if (edges && edges.length > 0) return edges;
  return nodes.slice(0, -1).map((node, i) => ({
    from: node.id,
    to: nodes[i + 1].id,
  }));
}

function edgePath(from: Point, to: Point, kind: DiagramKind): string {
  if (kind === "layers") {
    return `M ${from.x} ${from.y + 26} L ${to.x} ${to.y - 26}`;
  }
  const midX = (from.x + to.x) / 2;
  const bend = Math.abs(to.y - from.y) > 28 ? (to.y > from.y ? 20 : -20) : 0;
  return `M ${from.x + 58} ${from.y} C ${midX} ${from.y + bend}, ${midX} ${to.y - bend}, ${to.x - 58} ${to.y}`;
}

export function ProjectDiagram({
  kind,
  nodes,
  edges,
  active = true,
  className,
}: ProjectDiagramProps) {
  const reduceMotion = useReducedMotion();
  const uid = useId();
  const positions = useMemo(() => layoutNodes(kind, nodes), [kind, nodes]);
  const links = useMemo(() => defaultEdges(nodes, edges), [nodes, edges]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.15rem] border border-dashed border-line bg-transparent",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        className="relative z-10 h-auto w-full"
        role="img"
        aria-label={`${kind} sketch architecture diagram`}
      >
        <defs>
          <marker
            id={`${uid}-arrow`}
            markerWidth="7"
            markerHeight="7"
            refX="5.5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill="rgb(13 148 136)" />
          </marker>
        </defs>

        {links.map((edge, i) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          const d = edgePath(from, to, kind);
          return (
            <g key={`${edge.from}-${edge.to}-${i}`}>
              <motion.path
                d={d}
                fill="none"
                stroke={NODE_STROKE[i % NODE_STROKE.length]}
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeDasharray="5 4"
                markerEnd={`url(#${uid}-arrow)`}
                initial={
                  reduceMotion ? false : { pathLength: 0, opacity: 0 }
                }
                animate={
                  active
                    ? { pathLength: 1, opacity: 1 }
                    : { pathLength: reduceMotion ? 1 : 0.25, opacity: 0.4 }
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.85,
                  delay: reduceMotion ? 0 : 0.1 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
              {edge.label ? (
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 12}
                  textAnchor="middle"
                  fill="rgb(92 103 122)"
                  style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
                >
                  {edge.label}
                </text>
              ) : null}
            </g>
          );
        })}

        {nodes.map((node, i) => {
          const point = positions[node.id];
          if (!point) return null;
          const stroke = NODE_STROKE[i % NODE_STROKE.length];
          const w = 124;
          const h = 58;

          return (
            <motion.g
              key={node.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={
                active
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0.55, y: 0 }
              }
              transition={{
                duration: reduceMotion ? 0 : 0.45,
                delay: reduceMotion ? 0 : 0.15 + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <rect
                x={point.x - w / 2}
                y={point.y - h / 2}
                width={w}
                height={h}
                rx={12}
                fill="none"
                stroke={stroke}
                strokeWidth={1.75}
                strokeDasharray="6 4"
              />
              <circle
                cx={point.x - w / 2 + 14}
                cy={point.y - h / 2 + 14}
                r={3.25}
                fill="none"
                stroke={stroke}
                strokeWidth={1.5}
              />
              <text
                x={point.x}
                y={point.y - (node.sublabel ? 4 : 1)}
                textAnchor="middle"
                fill="rgb(6 11 20)"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--font-display)",
                }}
              >
                {node.label}
              </text>
              {node.sublabel ? (
                <text
                  x={point.x}
                  y={point.y + 14}
                  textAnchor="middle"
                  fill="rgb(92 103 122)"
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {node.sublabel}
                </text>
              ) : null}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
