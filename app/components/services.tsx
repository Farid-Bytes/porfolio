"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import Image from "next/image";

import { whyChooseReasons } from "@/app/components/why-choose";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { InteractiveCard } from "@/components/ui/card";
import { HorizontalSlider } from "@/components/ui/horizontal-slider";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import {
  contactEnquiryHref,
  serviceCategories,
  type Service,
} from "@/lib/services";
import { siteConfig } from "@/lib/site-config";

const consultationSubject = "Free consultation enquiry";

export function Services() {
  return (
    <>
      <section
        id="services"
        className="section-y relative isolate overflow-x-clip border-b border-line"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-6rem] left-[-8rem] -z-10 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.12),transparent_68%)] blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10rem] bottom-[-4rem] -z-10 size-[24rem] rounded-full bg-[radial-gradient(circle,rgb(6_182_212/0.08),transparent_70%)] blur-xl"
        />

        <div className="container-page">
          <Reveal variant="mask">
            <header className="max-w-3xl">
              <Eyebrow>Our services</Eyebrow>
              <h1 className="mt-4 text-display-md font-semibold text-ink">
                Intelligent engineering,{" "}
                <span className="text-gradient-accent">made personal.</span>
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
                {siteConfig.summary} Tap a service to enquire — each link opens
                contact with a prefilled subject so we can reply with context.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <ButtonLink
                  href={contactEnquiryHref(consultationSubject)}
                  variant="primary"
                  size="md"
                >
                  Book free consultation
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="md">
                  Or send a message
                  <MessageCircle className="size-4" aria-hidden />
                </ButtonLink>
              </div>
            </header>
          </Reveal>

          <div className="mt-14 space-y-16 sm:mt-16 sm:space-y-20 lg:space-y-24">
            {serviceCategories.map((category, categoryIndex) => (
              <div key={category.id}>
                <Reveal variant="mask" delay={categoryIndex * 0.04}>
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                      {category.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
                      {category.blurb}
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.08} className="mt-8">
                  <HorizontalSlider
                    ariaLabel={category.title}
                    variant="wheel"
                    density="compact"
                    autoplayMs={5200 + categoryIndex * 200}
                    showDots
                    itemClassName="w-[min(100%,16.5rem)] shrink-0 sm:w-[18rem]"
                    stageClassName="h-[min(26rem,55vh)] sm:h-[28rem]"
                  >
                    {category.services.map((service) => (
                      <ServiceCard key={service.slug} service={service} />
                    ))}
                  </HorizontalSlider>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y relative isolate overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-8rem] right-[-10rem] -z-10 size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.1),transparent_68%)] blur-xl"
        />

        <div className="container-page">
          <Reveal variant="mask">
            <header className="max-w-2xl">
              <Eyebrow>Why work with me</Eyebrow>
              <h2 className="mt-4 text-display-md font-semibold text-ink">
                Care you can trust,{" "}
                <span className="text-gradient-accent">systems you can ship.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
                The same principles behind my automation and full-stack work —
                clear scope, production structure, and honest communication.
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

      <section className="section-y relative isolate overflow-hidden">
        <div className="container-page">
          <Reveal variant="scale">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white/92 px-6 py-12 shadow-panel sm:px-10 sm:py-14 lg:px-14">
              <div
                aria-hidden
                className="bg-dot-grid pointer-events-none absolute inset-0 opacity-35 [mask-image:radial-gradient(circle_at_30%_50%,black,transparent_60%)]"
              />
              <div className="relative max-w-2xl">
                <Eyebrow>Get started</Eyebrow>
                <h2 className="mt-4 text-display-sm font-semibold text-ink">
                  Ready to automate, build, or integrate?
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">
                  Tell me what you are trying to ship — AI automation, Python
                  full-stack, APIs, or data pipelines. I will reply as soon as I
                  can.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink
                    href={contactEnquiryHref(consultationSubject)}
                    variant="primary"
                    size="md"
                  >
                    Book free consultation
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="secondary" size="md">
                    Contact page
                    <ArrowUpRight className="size-4" aria-hidden />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <InteractiveCard
      interactive
      tilt={false}
      className="group flex h-full min-h-[22rem] flex-col overflow-hidden p-0"
    >
      <div className="relative aspect-[400/220] shrink-0 overflow-hidden border-b border-line bg-canvas/50">
        {service.popular ? (
          <Badge tone="accent" className="absolute top-3 left-3 z-10 shadow-sm">
            Most popular
          </Badge>
        ) : null}
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 16.5rem, 18rem"
          className="object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.03] motion-reduce:transform-none"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/85 via-white/35 to-transparent"
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-base font-semibold text-ink">{service.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
          {service.description}
        </p>
        <ButtonLink
          href={contactEnquiryHref(service.enquirySubject)}
          variant="secondary"
          size="sm"
          className="mt-5 w-full sm:w-auto"
        >
          Enquire
          <ArrowUpRight className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </InteractiveCard>
  );
}
