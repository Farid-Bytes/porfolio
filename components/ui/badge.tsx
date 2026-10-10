import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent" | "soft";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-elevated/80 text-ink-muted",
  accent: "border-line-accent bg-accent-400/12 text-accent-500",
  soft: "border-line-strong bg-slate-mid/8 text-slate-deep",
};

type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
  /** Small pulsing dot, for "available for work"-style status badges. */
  dot?: boolean;
  className?: string;
};

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs tracking-wide whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden
          className="relative grid size-1.5 place-items-center rounded-full bg-current"
        >
          <span className="absolute size-full animate-ping rounded-full bg-current opacity-60" />
        </span>
      )}
      {children}
    </span>
  );
}
