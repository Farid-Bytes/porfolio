import {
  Handshake,
  Layers,
  Rocket,
  ShieldCheck,
  Target,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { InteractiveCard } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";

type Reason = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const whyChooseReasons: readonly Reason[] = [
  {
    title: "Production-minded",
    description:
      "I build systems that hold up beyond demos — with clear boundaries, error handling, and deployable structure.",
    icon: ShieldCheck,
  },
  {
    title: "Focused specialist",
    description:
      "AI automation, agents, Python, and applied ML — the stack I use to turn models into working tools.",
    icon: Target,
  },
  {
    title: "Workflow-first",
    description:
      "Every build starts from the real process: triggers, handoffs, and decisions — not a generic bot template.",
    icon: Workflow,
  },
  {
    title: "Clear scoping",
    description:
      "Honest scope, timelines, and tradeoffs up front so you know what you are investing in before we start.",
    icon: Layers,
  },
  {
    title: "Partnership-ready",
    description:
      "Practical collaboration for founders and product teams who need automation that fits how they already work.",
    icon: Handshake,
  },
  {
    title: "Shipped outcomes",
    description:
      "APIs, integrations, and automation people can actually use — not slides, prototypes, or throwaway scripts.",
    icon: Rocket,
  },
] as const;

export function WhyChoose() {
  return (
    <section
      id="why-choose"
      className="section-y relative isolate overflow-hidden border-b border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-8rem] right-[-10rem] -z-10 size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.1),transparent_68%)] blur-xl"
      />

      <div className="container-page">
        <Reveal variant="mask">
          <header className="max-w-2xl">
            <Eyebrow>Why work with me</Eyebrow>
            <h2 className="mt-4 text-display-md font-semibold text-ink">
              Reasons teams{" "}
              <span className="text-gradient-accent">bring me in.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              Trust built on how I work — focused delivery, clear communication,
              and systems that earn their place in production.
            </p>
          </header>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {whyChooseReasons.map((reason, index) => {
            const Icon = reason.icon;

            return (
              <Reveal
                key={reason.title}
                delay={Math.min(index * 0.05, 0.3)}
                variant="rise"
              >
                <InteractiveCard interactive className="h-full p-5 sm:p-6">
                  <span className="grid size-10 place-items-center rounded-xl border border-line-accent bg-accent-400/12 text-accent-500">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-ink">
                    {reason.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {reason.description}
                  </p>
                </InteractiveCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
