import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  /** Small mono label above the heading, e.g. "About". */
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn("section-y relative", className)}>
      <div className="container-page">
        {(eyebrow || title || description) && (
          <Reveal variant="mask">
            <header className="max-w-2xl">
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              {title && (
                <h2 className="mt-4 text-display-md font-semibold text-ink">
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
                  {description}
                </p>
              )}
            </header>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-xs tracking-[0.18em] text-accent-500 uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
