"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { InteractiveCard } from "@/components/ui/card";
import { GithubIcon } from "@/components/ui/icons";
import { type ProjectCard } from "@/lib/projects-index";
import { cn } from "@/lib/utils";

type ProjectPosterCardProps = {
  project: ProjectCard;
  /** Anchor id for deep links (projects page). */
  id?: string;
  /** Show compact GitHub control when a repository exists. */
  showRepository?: boolean;
  className?: string;
};

export function ProjectPosterCard({
  project,
  id,
  showRepository = false,
  className,
}: ProjectPosterCardProps) {
  const showGithub = showRepository && Boolean(project.repository);

  return (
    <InteractiveCard
      id={id}
      interactive
      tilt={false}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.15rem] p-0",
        "shadow-panel transition-[border-color,box-shadow] duration-300",
        "hover:border-line-accent hover:shadow-glow",
        className,
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-0 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
        aria-label={`Open ${project.name} case study`}
      />

      <div className="relative z-10 h-28 shrink-0 overflow-hidden border-b border-line bg-elevated/50 pointer-events-none sm:h-[7.5rem]">
        <Image
          src={project.coverImage}
          alt={`${project.name} UI mockup`}
          fill
          sizes="(max-width: 640px) 16.5rem, 18rem"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/90 via-white/40 to-transparent"
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-4 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={project.featured ? "accent" : "soft"}>
            {project.label}
          </Badge>
        </div>

        <h3 className="mt-2.5 text-lg font-semibold tracking-[-0.02em] text-ink sm:text-xl">
          {project.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-ink-muted">
          {project.tagline}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 2).map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 transition-colors group-hover:text-accent-500">
            Open case study
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>

          {showGithub && project.repository ? (
            <ButtonLink
              href={project.repository}
              target="_blank"
              rel="noreferrer noopener"
              variant="secondary"
              size="sm"
              className="relative z-20 h-8 px-3 text-xs pointer-events-auto"
              data-magnetic
              aria-label={`View ${project.name} source code on GitHub`}
              onClick={(event) => event.stopPropagation()}
            >
              <GithubIcon className="size-3.5" />
              Source
              <ArrowUpRight className="size-3" aria-hidden />
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </InteractiveCard>
  );
}
