"use client";

import {
  Bot,
  Brain,
  Cable,
  Code2,
  Database,
  Layers,
  Network,
  Rocket,
  Server,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { SkillsOrbit, type OrbitItem } from "@/components/3d/skills-orbit";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import { skills, type Skill } from "@/lib/skills";
import { cn } from "@/lib/utils";

const iconBySkill: Record<string, LucideIcon> = {
  "AI Automation": Workflow,
  Python: Code2,
  Workflows: Layers,
  "AI / ML": Brain,
  LLMs: Sparkles,
  "AI Agents": Bot,
  WhisperX: Sparkles,
  PyTorch: Brain,
  Transformers: Brain,
  FastAPI: Server,
  "REST APIs": Network,
  "Backend systems": Server,
  MySQL: Database,
  Laravel: Code2,
  Integrations: Cable,
  Deployment: Rocket,
};

const accentByGroup: Record<
  Skill["group"],
  { rail: string; icon: string; chip: string }
> = {
  Core: {
    rail: "from-accent-400/80 via-accent-400/30 to-transparent",
    icon: "border-accent-400/30 bg-accent-400/10 text-accent-500",
    chip: "border-accent-400/25 bg-accent-400/10 text-accent-600",
  },
  AI: {
    rail: "from-highlight/80 via-highlight/30 to-transparent",
    icon: "border-highlight/30 bg-highlight/10 text-highlight",
    chip: "border-highlight/25 bg-highlight/10 text-ink-muted",
  },
  Backend: {
    rail: "from-spark/80 via-spark/30 to-transparent",
    icon: "border-spark/30 bg-spark/10 text-spark",
    chip: "border-spark/25 bg-spark/10 text-ink-muted",
  },
  Platform: {
    rail: "from-accent-600/80 via-accent-600/30 to-transparent",
    icon: "border-accent-600/30 bg-accent-600/10 text-accent-600",
    chip: "border-accent-600/25 bg-accent-600/10 text-ink-muted",
  },
};

function skillIcon(name: string) {
  const Icon = iconBySkill[name] ?? Sparkles;
  return <Icon className="size-4" aria-hidden />;
}

export function Skills() {
  const [activeIndex, setActiveIndex] = useState(0);

  const orbitItems: OrbitItem[] = skills.map((skill) => ({
    id: skill.name,
    label: skill.name,
    imageSrc: skill.image,
    toneClass: accentByGroup[skill.group].icon,
  }));

  const activeSkill = skills[activeIndex] ?? skills[0];
  const activeAccent = activeSkill
    ? accentByGroup[activeSkill.group]
    : accentByGroup.Core;

  return (
    <section
      id="skills"
      className="relative isolate overflow-hidden border-b border-line py-12 lg:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[28rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(6_182_212/0.1),transparent_68%)] blur-xl"
      />

      <div className="container-page">
        <Reveal variant="mask">
          <header className="max-w-2xl">
            <Eyebrow>Skills</Eyebrow>
            <h2 className="mt-3 text-display-md font-semibold text-ink">
              Tools and capabilities I use to{" "}
              <span className="text-gradient-accent">ship automation.</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted sm:text-lg">
              A practical stack drawn from the systems I build, not a scorecard.
            </p>
          </header>
        </Reveal>

        <div className="mt-6 grid items-start gap-6 lg:mt-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,36rem)]">
          <Reveal variant="left">
            <div className="max-w-md lg:pt-4">
              {activeSkill ? (
                <>
                  <p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-subtle uppercase">
                    {activeSkill.group}
                  </p>
                  <h3 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                    {activeSkill.name}
                  </h3>
                  <span
                    aria-hidden
                    className={cn(
                      "mt-3 block h-0.5 w-14 rounded-full bg-gradient-to-r",
                      activeAccent.rail,
                    )}
                  />
                  <p className="mt-3 text-base leading-relaxed text-ink-muted">
                    {activeSkill.blurb}
                  </p>
                </>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact" size="sm">
                  Contact me
                </ButtonLink>
                <p className="text-sm text-ink-subtle">
                  Drag the orbit or use arrow keys when focused.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={0.08}>
            <SkillsOrbit
              items={orbitItems}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
              className="h-[21rem] sm:h-[22rem]"
            />
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="-mt-1 sm:mt-0">
            <p className="font-mono text-[0.62rem] tracking-[0.14em] text-ink-subtle uppercase">
              All Skills
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill, index) => {
                const accent = accentByGroup[skill.group];
                const isActive = index === activeIndex;
                return (
                  <li key={skill.name}>
                    <button
                      type="button"
                      title={skill.blurb}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5",
                        "text-sm transition-colors duration-200",
                        isActive
                          ? "border-accent-400/50 bg-accent-400/15 text-ink"
                          : cn("text-ink-muted hover:border-line-accent", accent.chip),
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-5 place-items-center rounded-md border bg-white/70",
                          accent.icon,
                        )}
                      >
                        {skillIcon(skill.name)}
                      </span>
                      {skill.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
