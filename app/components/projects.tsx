"use client";

import { ProjectPosterCard } from "@/app/components/project-poster-card";
import { HorizontalSlider } from "@/components/ui/horizontal-slider";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import { projectCards } from "@/lib/projects-index";

export function Projects() {
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
          <header className="max-w-2xl">
            <Eyebrow>Projects</Eyebrow>
            <h2 className="mt-4 text-display-md font-semibold text-ink">
              Selected systems that{" "}
              <span className="text-gradient-accent">prove the craft.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              Flagship deep-dive first, then supporting products that show
              breadth across agents, APIs, and interfaces. Open a card for the
              full story.
            </p>
          </header>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 sm:mt-12">
          <HorizontalSlider
            ariaLabel="Projects"
            variant="wheel"
            density="compact"
            showDots
            autoplayMs={6400}
            itemClassName="w-[min(100%,16.5rem)] shrink-0 sm:w-[18rem]"
            stageClassName="h-[min(22rem,45vh)] sm:h-[24rem]"
          >
            {projectCards.map((project) => (
              <ProjectPosterCard
                key={project.slug}
                project={project}
                id={project.slug}
                showRepository
              />
            ))}
          </HorizontalSlider>
        </Reveal>
      </div>
    </section>
  );
}
