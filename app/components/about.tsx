import { Braces, Network, Workflow } from "lucide-react";

import { ProfilePortrait } from "@/app/components/profile-portrait";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import { siteConfig } from "@/lib/site-config";

const principles = [
  {
    title: "What I build",
    description:
      "AI agents, automation workflows, backend services, and API integrations.",
    icon: Workflow,
  },
  {
    title: "How I work",
    description:
      "I connect models, tools, data, and dependable interfaces around a clear system goal.",
    icon: Network,
  },
  {
    title: "Technical direction",
    description:
      "Applied AI engineering where Python, backend systems, and automation meet.",
    icon: Braces,
  },
] as const;

export function About() {
  return (
    <section
      id="about"
      className="section-y relative isolate overflow-hidden border-b border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-[-14rem] -z-10 size-[30rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.1),transparent_68%)] blur-xl"
      />

      <div className="container-page">
        {/* Mobile: compact circular avatar above the copy (desktop shows the
            framed portrait on the right instead). */}
        <Reveal variant="mask" className="mb-8 flex justify-center lg:hidden">
          <ProfilePortrait variant="avatar" mirrored />
        </Reveal>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,20rem)] lg:gap-x-14 xl:gap-x-16">
          <div>
            <Reveal variant="mask">
              <header className="max-w-2xl">
                <Eyebrow>About</Eyebrow>
                <h2 className="mt-4 text-display-md font-semibold text-ink">
                  I turn AI capabilities into{" "}
                  <span className="text-gradient-accent">working systems.</span>
                </h2>
              </header>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-2 text-lg font-medium text-accent-500">
                {siteConfig.name} · {siteConfig.role}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-3xl text-xl leading-relaxed font-medium text-ink sm:text-2xl">
                {siteConfig.summary}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">
                My work centers on shaping AI into practical workflows: defining
                the logic, integrating APIs and data, and building the software
                around a model so it can solve a real task reliably.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <ul className="mt-6 flex flex-wrap gap-2">
                {siteConfig.disciplines.map((discipline) => (
                  <li key={discipline}>
                    <Badge tone="accent">{discipline}</Badge>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal
            delay={0.12}
            variant="right"
            className="mx-auto hidden w-full max-w-sm lg:mx-0 lg:block lg:max-w-none"
          >
            <ProfilePortrait variant="framed" mirrored />
          </Reveal>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-3 lg:mt-20">
          {principles.map((principle, index) => {
            const Icon = principle.icon;

            return (
              <Reveal
                key={principle.title}
                delay={0.08 + index * 0.07}
                variant="rise"
              >
                <InteractiveCard interactive className="h-full p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <span className="grid size-10 place-items-center rounded-xl border border-line-accent bg-accent-400/12 text-accent-500">
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {principle.description}
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
