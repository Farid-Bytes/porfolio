"use client";

import { Quote } from "lucide-react";

import { InteractiveCard } from "@/components/ui/card";
import { HorizontalSlider } from "@/components/ui/horizontal-slider";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import { reviews } from "@/lib/reviews";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Reviews() {
  return (
    <section
      id="reviews"
      className="section-y relative isolate overflow-x-clip border-b border-line"
    >
      <div className="container-page">
        <Reveal variant="mask">
          <header className="max-w-2xl">
            <Eyebrow>Reviews</Eyebrow>
            <h2 className="mt-4 text-display-md font-semibold text-ink">
              What clients say about{" "}
              <span className="text-gradient-accent">working together.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
              Representative feedback from founders and product leaders who need
              automation that holds up in production.
            </p>
          </header>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 sm:mt-12">
          <HorizontalSlider
            ariaLabel="Client reviews"
            variant="wheel"
            autoplayMs={5200}
            showDots
            itemClassName="w-[min(100%,22rem)] shrink-0 sm:w-[26rem]"
            stageClassName="h-[min(22rem,62vh)] sm:h-[24rem]"
          >
            {reviews.map((review) => (
              <InteractiveCard
                key={review.id}
                interactive
                tilt={false}
                className="flex h-full min-h-[17rem] flex-col p-6 sm:p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <Quote
                    className="size-5 text-accent-400/80"
                    aria-hidden
                  />
                  <span
                    aria-hidden
                    className="grid size-10 place-items-center rounded-full border border-line-accent bg-accent-400/12 font-mono text-xs font-semibold tracking-wide text-accent-600"
                  >
                    {initials(review.name)}
                  </span>
                </div>
                <p className="mt-5 flex-1 text-base leading-relaxed text-ink sm:text-[1.05rem]">
                  “{review.quote}”
                </p>
                <footer className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <span
                    aria-hidden
                    className="grid size-9 place-items-center rounded-full border border-line bg-elevated font-mono text-[0.65rem] font-semibold text-ink-muted"
                  >
                    {initials(review.name)}
                  </span>
                  <div className="min-w-0">
                    <cite className="block not-italic text-sm font-semibold text-ink">
                      {review.name}
                    </cite>
                    <p className="mt-0.5 font-mono text-[0.62rem] tracking-[0.12em] text-ink-subtle uppercase">
                      Collaborator
                    </p>
                  </div>
                </footer>
              </InteractiveCard>
            ))}
          </HorizontalSlider>
        </Reveal>
      </div>
    </section>
  );
}
