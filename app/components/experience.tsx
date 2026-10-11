"use client";

import {
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import { experience, type ExperienceEntry } from "@/lib/experience";
import { siteConfig } from "@/lib/site-config";
import { siteStats } from "@/lib/stats";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const iconByEntry: Record<ExperienceEntry["id"], LucideIcon> = {
  current: BriefcaseBusiness,
  previous: Code2,
  education: GraduationCap,
};

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 72%", "end 42%"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });
  const beamScale = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <section
      id="experience"
      className="relative isolate overflow-hidden border-b border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-8rem] right-[-14rem] -z-20 size-[34rem] rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.08),transparent_68%)] blur-2xl"
      />

      <div className="container-page section-y">
        <Reveal variant="mask">
          <header className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.7fr)] lg:items-end lg:gap-16">
            <div>
              <Eyebrow>Experience</Eyebrow>
              <h2 className="mt-5 text-display-md font-semibold text-ink">
                A path built around{" "}
                <span className="text-gradient-accent">useful systems.</span>
              </h2>
              <div className="mt-5 inline-flex items-center gap-3 rounded-panel border border-line-accent bg-white/90 px-4 py-3 shadow-panel">
                <span className="grid size-10 place-items-center rounded-xl border border-line-accent bg-accent-400/12 font-mono text-sm font-semibold text-accent-500">
                  CS
                </span>
                <div>
                  <p className="font-mono text-[0.62rem] tracking-[0.14em] text-accent-500 uppercase">
                    Verified focus
                  </p>
                  <p className="text-sm font-semibold text-ink">
                    {siteConfig.role}
                  </p>
                </div>
              </div>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              Current work, earlier Laravel development, and the Computer
              Science foundation behind both — stated only from facts on this
              site.
            </p>
          </header>
        </Reveal>

        <Reveal delay={0.08} variant="left" className="mt-10 sm:mt-12">
          <dl className="grid max-w-xl grid-cols-3 gap-4 sm:gap-6">
            {siteStats.map((stat) => (
              <div key={stat.id} className="min-w-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <p className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix ?? ""}
                    />
                  </p>
                  <p className="mt-1 font-mono text-[0.62rem] tracking-[0.12em] text-ink-subtle uppercase">
                    {stat.label}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div ref={timelineRef} className="relative mt-14 sm:mt-16 lg:mt-20">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-5 w-px bg-line md:left-1/2 md:-translate-x-1/2"
          />
          <motion.div
            aria-hidden
            style={{ scaleY: reduceMotion ? scrollYProgress : beamScale }}
            className="absolute top-0 bottom-0 left-5 w-px origin-top bg-gradient-to-b from-accent-300 via-accent-500 to-slate-mid shadow-[0_0_14px_rgb(20_184_166/0.35)] md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="space-y-8 md:space-y-0">
            {experience.map((entry, index) => (
              <TimelineEntry
                key={entry.id}
                entry={entry}
                index={index}
                reduceMotion={Boolean(reduceMotion)}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TimelineEntry({
  entry,
  index,
  reduceMotion,
}: {
  entry: ExperienceEntry;
  index: number;
  reduceMotion: boolean;
}) {
  const Icon = iconByEntry[entry.id];
  const alignLeft = index % 2 === 0;
  const enterFrom = alignLeft ? -48 : 48;

  return (
    <li className="relative min-h-[15rem] pl-12 md:flex md:min-h-[19rem] md:items-center md:pl-0">
      <motion.span
        aria-hidden
        initial={reduceMotion ? false : { scale: 0.72, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-28% 0px -28% 0px" }}
        transition={{
          duration: 0.45,
          delay: index * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          "absolute top-1 left-0 z-10 grid size-10 place-items-center rounded-xl border bg-canvas md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
          entry.id === "current"
            ? "border-line-accent text-accent-500 shadow-[0_0_24px_rgb(20_184_166/0.2)]"
            : "border-line-strong text-ink-muted",
        )}
      >
        <Icon className="size-4" />
      </motion.span>

      <motion.div
        initial={
          reduceMotion ? false : { opacity: 0, x: enterFrom, y: 16 }
        }
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-18% 0px -18% 0px" }}
        transition={{
          duration: 0.65,
          delay: 0.1 + index * 0.12,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          "md:w-[calc(50%-3.5rem)]",
          alignLeft ? "md:mr-auto" : "md:ml-auto",
        )}
      >
        <InteractiveCard interactive className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge tone={entry.id === "current" ? "accent" : "soft"}>
              {entry.status}
            </Badge>
            <span className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-subtle uppercase">
              {entry.type}
            </span>
          </div>

          <h3 className="mt-5 text-xl font-semibold text-ink sm:text-2xl">
            {entry.title}
          </h3>
          <p className="mt-2 text-base font-medium text-accent-500">
            {entry.organization}
          </p>
          <p className="mt-4 leading-relaxed text-ink-muted">{entry.context}</p>

          <ul className="mt-5 space-y-2">
            {entry.highlights.map((item) => (
              <li
                key={item}
                className="flex gap-2 text-sm leading-relaxed text-ink-muted"
              >
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-400"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-2">
            {entry.stack.map((item) => (
              <li key={item}>
                <Badge tone="accent">{item}</Badge>
              </li>
            ))}
          </ul>
        </InteractiveCard>
      </motion.div>
    </li>
  );
}
