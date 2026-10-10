type ProjectStackMapProps = {
  stack: readonly string[];
  projectName: string;
};

const STROKES = [
  "rgb(13 148 136)",
  "rgb(6 182 212)",
  "rgb(245 158 11)",
  "rgb(16 185 129)",
  "rgb(244 63 94)",
  "rgb(14 165 233)",
] as const;

type Point = { x: number; y: number };

function layoutNodes(count: number): Point[] {
  if (count <= 0) return [];
  if (count === 1) return [{ x: 220, y: 180 }];
  if (count === 2) return [{ x: 120, y: 180 }, { x: 320, y: 180 }];
  if (count === 3)
    return [
      { x: 220, y: 70 },
      { x: 100, y: 230 },
      { x: 340, y: 230 },
    ];
  if (count === 4)
    return [
      { x: 120, y: 90 },
      { x: 320, y: 90 },
      { x: 120, y: 250 },
      { x: 320, y: 250 },
    ];
  if (count === 5)
    return [
      { x: 220, y: 55 },
      { x: 80, y: 160 },
      { x: 360, y: 160 },
      { x: 120, y: 290 },
      { x: 320, y: 290 },
    ];

  // 6+ : two columns with wrap
  const cols = 2;
  const points: Point[] = [];
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    points.push({
      x: 110 + col * 220,
      y: 50 + row * (280 / Math.max(rows - 1, 1)),
    });
  }
  return points;
}

/**
 * Compact sketched node map of a project's stack for the detail hero.
 */
export function ProjectStackMap({ stack, projectName }: ProjectStackMapProps) {
  const nodes = stack.slice(0, 8);
  const points = layoutNodes(nodes.length);
  const nodeW = 118;
  const nodeH = 44;

  return (
    <div
      className="relative w-full overflow-hidden rounded-[1.25rem] border border-line bg-white/40"
      aria-label={`${projectName} stack map`}
    >
      <svg
        viewBox="0 0 440 360"
        className="h-auto w-full"
        fill="none"
        role="img"
      >
        <title>{`${projectName} technology stack`}</title>

        {/* Soft sketch frame */}
        <rect
          x="12"
          y="12"
          width="416"
          height="336"
          rx="16"
          stroke="rgb(13 148 136 / 0.35)"
          strokeWidth="1.25"
          strokeDasharray="6 4"
        />

        {/* Connecting wires between consecutive nodes */}
        {points.slice(0, -1).map((from, i) => {
          const to = points[i + 1];
          const midX = (from.x + to.x) / 2;
          const sway = i % 2 === 0 ? 28 : -28;
          const stroke = STROKES[i % STROKES.length];
          return (
            <path
              key={`wire-${i}`}
              d={`M ${from.x} ${from.y} C ${midX} ${from.y + sway}, ${midX} ${to.y - sway}, ${to.x} ${to.y}`}
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.7"
            />
          );
        })}

        {/* Extra weave for denser graphs */}
        {points.length >= 4
          ? points.slice(0, -2).map((from, i) => {
              const to = points[i + 2];
              const midX = (from.x + to.x) / 2;
              return (
                <path
                  key={`weave-${i}`}
                  d={`M ${from.x} ${from.y} Q ${midX + 40} ${(from.y + to.y) / 2}, ${to.x} ${to.y}`}
                  stroke={STROKES[(i + 2) % STROKES.length]}
                  strokeWidth="1.1"
                  strokeDasharray="4 4"
                  opacity="0.35"
                />
              );
            })
          : null}

        {nodes.map((tech, i) => {
          const p = points[i];
          const stroke = STROKES[i % STROKES.length];
          return (
            <g key={tech}>
              <rect
                x={p.x - nodeW / 2}
                y={p.y - nodeH / 2}
                width={nodeW}
                height={nodeH}
                rx="10"
                stroke={stroke}
                strokeWidth="1.75"
                strokeDasharray="5 3"
              />
              <circle
                cx={p.x - nodeW / 2 + 14}
                cy={p.y - nodeH / 2 + 14}
                r="3.25"
                stroke={stroke}
                strokeWidth="1.4"
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fill="rgb(6 11 20)"
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.02em",
                }}
              >
                {tech.length > 14 ? `${tech.slice(0, 13)}…` : tech}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
