"use client";

import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  Bot,
  BrainCircuit,
  Braces,
  CloudCog,
  Database,
  GitBranch,
  Network,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

type BuildStep = {
  plainTitle: string;
  originalTitle: string;
  oneLiner: string;
  description: string;
  role: string;
  tags: readonly string[];
  icon: LucideIcon;
};

const steps: readonly BuildStep[] = [
  {
    plainTitle: "Sense",
    originalTitle: "AI",
    oneLiner: "Find where intelligence actually helps the workflow.",
    description:
      "The capability layer: choosing where machine learning can make a workflow more useful, adaptive, or efficient.",
    role: "Defines the intelligent behavior the system needs.",
    tags: ["AI/ML", "NLP"],
    icon: BrainCircuit,
  },
  {
    plainTitle: "Reason",
    originalTitle: "LLMs",
    oneLiner: "Give language models clear context and constraints.",
    description:
      "Language models become useful when they are given clear context, constraints, and a defined place in the product.",
    role: "Turns language understanding into a usable capability.",
    tags: ["LLMs", "Context"],
    icon: GitBranch,
  },
  {
    plainTitle: "Act",
    originalTitle: "Agents",
    oneLiner: "Connect decisions to tools and multi-step work.",
    description:
      "Agents coordinate model decisions with tools and multi-step logic instead of treating one model response as the whole system.",
    role: "Connects reasoning to actions and external tools.",
    tags: ["AI Agents", "Tool use"],
    icon: Bot,
  },
  {
    plainTitle: "Automate",
    originalTitle: "Automation",
    oneLiner: "Make the intelligent path repeatable.",
    description:
      "Automation provides the triggers, decisions, integrations, and handoffs that move work through the system.",
    role: "Makes intelligent behavior repeatable and operational.",
    tags: ["Workflows", "Integrations"],
    icon: Workflow,
  },
  {
    plainTitle: "Code",
    originalTitle: "Python",
    oneLiner: "Implement the rules around the model.",
    description:
      "Python is the connective layer for orchestration logic, model integration, data transformation, and backend services.",
    role: "Implements the rules and behavior around the AI.",
    tags: ["Python", "Services"],
    icon: Braces,
  },
  {
    plainTitle: "API",
    originalTitle: "FastAPI / APIs",
    oneLiner: "Expose capabilities through clean interfaces.",
    description:
      "APIs expose capabilities cleanly so models, services, automations, and product interfaces can communicate.",
    role: "Creates stable boundaries between system components.",
    tags: ["FastAPI", "REST APIs"],
    icon: Network,
  },
  {
    plainTitle: "Data",
    originalTitle: "Backend / Data",
    oneLiner: "Keep state and information dependable.",
    description:
      "Backend and data layers provide persistence, retrieval, validation, and the context intelligent applications depend on.",
    role: "Keeps state and information dependable across the workflow.",
    tags: ["Backend", "Databases"],
    icon: Database,
  },
  {
    plainTitle: "Ship",
    originalTitle: "Deployment",
    oneLiner: "Move the system into a usable environment.",
    description:
      "Deployment turns the connected architecture into software that can run consistently beyond a local prototype.",
    role: "Moves the complete system into a usable environment.",
    tags: ["Deployment", "Containers"],
    icon: CloudCog,
  },
] as const;

export function HowIBuild() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const active = steps[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <section
      id="how-i-build"
      className="section-y relative isolate overflow-clip border-b border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10rem] left-[-12rem] -z-10 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.1),transparent_68%)] blur-xl"
      />

      <div className="container-page">
        <Reveal variant="mask">
          <header className="max-w-2xl">
            <Eyebrow>How I Build</Eyebrow>
            <h2 className="mt-4 text-display-md font-semibold text-ink">
              From idea to{" "}
              <span className="text-gradient-accent">working automation.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              A simple path founders can follow: sense the opportunity, reason
              with models, act through agents, automate the loop, then ship
              through APIs and data.
            </p>
          </header>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 sm:mt-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:gap-8">
            <ol className="grid auto-rows-fr gap-3 sm:grid-cols-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeIndex;

                return (
                  <li key={step.plainTitle} className="h-full">
                    <button
                      type="button"
                      data-magnetic
                      aria-pressed={isActive}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      className={cn(
                        "flex h-full w-full items-start gap-3 rounded-panel border px-4 py-4 text-left transition-[border-color,background-color,box-shadow] duration-300",
                        isActive
                          ? "border-line-accent bg-accent-400/10 shadow-glow"
                          : "border-line bg-white/60 hover:border-line-strong hover:bg-white/80",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-9 shrink-0 place-items-center rounded-lg border",
                          isActive
                            ? "border-line-accent bg-accent-400/15 text-accent-500"
                            : "border-line bg-elevated text-ink-muted",
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[0.6rem] tracking-[0.14em] text-ink-subtle uppercase">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-sm font-semibold text-ink">
                            {step.plainTitle}
                          </span>
                        </span>
                        <span className="mt-1 block min-h-[2.5rem] text-xs leading-relaxed text-ink-muted">
                          {step.oneLiner}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <aside
              aria-live="polite"
              className="rounded-panel border border-line bg-white/92 p-6 shadow-panel lg:sticky lg:top-28 lg:self-start lg:p-7"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active.plainTitle}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                >
                  <span className="grid size-12 place-items-center rounded-xl border border-line-accent bg-accent-400/12 text-accent-500">
                    <ActiveIcon className="size-5" aria-hidden />
                  </span>
                  <p className="mt-5 font-mono text-xs tracking-[0.16em] text-accent-500 uppercase">
                    Step {String(activeIndex + 1).padStart(2, "0")} ·{" "}
                    {active.originalTitle}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-ink">
                    {active.plainTitle}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                    {active.description}
                  </p>
                  <div className="mt-6 border-t border-line pt-5">
                    <p className="font-mono text-[0.65rem] tracking-[0.14em] text-ink-subtle uppercase">
                      Why it matters
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink">
                      {active.role}
                    </p>
                  </div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {active.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-line bg-elevated/80 px-3 py-1.5 font-mono text-[0.65rem] tracking-wide text-ink-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
