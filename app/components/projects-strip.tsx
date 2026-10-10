"use client";

import { ArrowUpRight } from "lucide-react";

import { ProjectPosterCard } from "@/app/components/project-poster-card";
import { ButtonLink } from "@/components/ui/button";
import { HorizontalSlider } from "@/components/ui/horizontal-slider";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import { projectCards } from "@/lib/projects-index";

export function ProjectsStrip() {
  return (
    <section
      id="projects"
      className="section-y relative isolate overflow-x-clip border-b border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 left-1/2 -z-20 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(20_184_166/0.12),transparent_68%)] blur-2xl"
      />

      <div className="container-page">
        <Reveal variant="mask">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Projects</Eyebrow>
              <h2 className="mt-4 text-display-md font-semibold text-ink">
                Selected systems that{" "}
                <span className="text-gradient-accent">prove the craft.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
                Browse the showcase, then open a case study for the full story,
                architecture, and stack.
              </p>
            </div>
            <ButtonLink
              href="/projects"
              variant="secondary"
              data-magnetic
              className="shrink-0 self-start sm:self-auto"
            >
              All projects
              <ArrowUpRight className="size-4" aria-hidden />
            </ButtonLink>
          </header>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 sm:mt-12">
          <HorizontalSlider
            ariaLabel="Project showcase"
            variant="wheel"
            density="compact"
            autoplayMs={5600}
            showDots
            itemClassName="w-[min(100%,16.5rem)] shrink-0 sm:w-[18rem]"
            stageClassName="h-[min(22rem,45vh)] sm:h-[24rem]"
          >
            {projectCards.map((project) => (
              <ProjectPosterCard key={project.slug} project={project} />
            ))}
          </HorizontalSlider>
        </Reveal>
      </div>
    </section>
  );
}
