import type { Metadata } from "next";

import { Projects } from "@/app/components/projects";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Projects",
  description: `Selected work by ${siteConfig.name}: AI automation systems, agents, and production software.`,
  alternates: { canonical: "/projects" },
  openGraph: {
    title: `Projects · ${siteConfig.name}`,
    description: `Selected work by ${siteConfig.name}: AI automation systems, agents, and production software.`,
    url: `${siteConfig.url}/projects`,
  },
};

export default function ProjectsPage() {
  return <Projects />;
}
