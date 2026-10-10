"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";

import { ProfilePortrait } from "@/app/components/profile-portrait";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { voicePulseProject } from "@/lib/projects-index";
import { siteConfig } from "@/lib/site-config";
import { siteStats } from "@/lib/stats";

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden border-b border-line"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-dot-grid opacity-40 [mask-image:radial-gradient(70%_60%_at_70%_40%,black,transparent)]" />
        <div className="absolute top-[-20%] right-[-10%] h-[70%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(20_184_166/0.18),transparent)] blur-xl" />
        <div className="absolute top-[30%] left-[-5%] h-[40%] w-[40%] rounded-full bg-[radial-gradient(closest-side,rgb(6_182_212/0.1),transparent)] blur-xl" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-canvas to-transparent"
      />

      <div className="container-page relative grid min-h-[calc(100svh-var(--spacing-navbar))] items-center gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,28rem)] lg:items-start lg:gap-x-12 xl:gap-x-16">
        <div className="relative z-10 max-w-3xl">
          <Reveal variant="mask">
            <Badge tone="accent" dot>
              {siteConfig.availability}
            </Badge>

            <h1 className="mt-6 font-semibold text-ink">
              <span className="block text-display-lg tracking-[-0.04em]">
                {siteConfig.name}
              </span>
            </h1>

            <p className="mt-3 text-lg font-medium text-accent-500 sm:text-xl">
              {siteConfig.role}
            </p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {siteConfig.disciplines.map((discipline) => (
                <li key={discipline}>
                  <Badge tone="soft">{discipline}</Badge>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
              {siteConfig.tagline}
            </p>

            <dl className="mt-7 grid max-w-md grid-cols-3 gap-4 sm:gap-6">
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

            <a
              href={`/projects/${voicePulseProject.slug}`}
              data-magnetic
              className="mt-7 flex max-w-md items-start gap-3 rounded-panel border border-line bg-white/90 p-4 shadow-panel transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-accent hover:shadow-glow motion-reduce:transform-none"
            >
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-line-accent bg-accent-400/12 text-accent-500">
                <Sparkles className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[0.65rem] tracking-[0.14em] text-accent-500 uppercase">
                  Featured project
                </span>
                <span className="mt-1 block text-base font-semibold text-ink">
                  {voicePulseProject.name}
                </span>
                <span className="mt-1 block text-sm leading-snug text-ink-muted">
                  {voicePulseProject.tagline}
                </span>
              </span>
            </a>
          </Reveal>

          <Reveal delay={0.14} variant="left">
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/contact" data-magnetic>
                Hire me
                <ArrowUpRight className="size-4" aria-hidden />
              </ButtonLink>
              {siteConfig.contact.github && (
                <ButtonLink
                  href={siteConfig.contact.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="secondary"
                  data-magnetic
                  aria-label={`${siteConfig.name} on GitHub`}
                >
                  <GithubIcon className="size-4" />
                  GitHub
                </ButtonLink>
              )}
              {siteConfig.contact.linkedin && (
                <ButtonLink
                  href={siteConfig.contact.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="ghost"
                  data-magnetic
                >
                  LinkedIn
                  <ArrowUpRight className="size-4" aria-hidden />
                </ButtonLink>
              )}
            </div>

            <p className="mt-6 font-mono text-xs tracking-[0.12em] text-ink-subtle uppercase">
              {siteConfig.availability} · {siteConfig.location}
            </p>
          </Reveal>
        </div>

        <Reveal
          delay={0.1}
          variant="right"
          className="relative z-10 mx-auto w-full max-w-sm lg:mx-0 lg:mt-6 lg:max-w-none"
        >
          <ProfilePortrait variant="hero" priority mirrored />
        </Reveal>
      </div>
    </section>
  );
}
