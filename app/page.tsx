import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { Hero } from "@/app/components/hero";
import { LazyMount } from "@/app/components/lazy-mount";
import { siteConfig } from "@/lib/site-config";

const Skills = dynamic(() =>
  import("@/app/components/skills").then((mod) => mod.Skills),
);
const HowIBuild = dynamic(() =>
  import("@/app/components/how-i-build").then((mod) => mod.HowIBuild),
);
const ProjectsStrip = dynamic(() =>
  import("@/app/components/projects-strip").then((mod) => mod.ProjectsStrip),
);
const Experience = dynamic(() =>
  import("@/app/components/experience").then((mod) => mod.Experience),
);
const Reviews = dynamic(() =>
  import("@/app/components/reviews").then((mod) => mod.Reviews),
);
const WhyChoose = dynamic(() =>
  import("@/app/components/why-choose").then((mod) => mod.WhyChoose),
);

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    url: siteConfig.url,
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <LazyMount minHeight="30rem">
        <Skills />
      </LazyMount>
      <LazyMount minHeight="32rem">
        <HowIBuild />
      </LazyMount>
      <LazyMount minHeight="36rem">
        <ProjectsStrip />
      </LazyMount>
      <LazyMount minHeight="40rem">
        <Experience />
      </LazyMount>
      <LazyMount minHeight="36rem">
        <Reviews />
      </LazyMount>
      <LazyMount minHeight="28rem">
        <WhyChoose />
      </LazyMount>
    </>
  );
}
