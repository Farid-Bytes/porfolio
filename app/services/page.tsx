import type { Metadata } from "next";

import { Services } from "@/app/components/services";
import { siteConfig } from "@/lib/site-config";

const description =
  "AI automation, agents, RAG, full-stack web (Next.js, Laravel, Python), FastAPI, data pipelines, and integrations — services by Ghulam Farid.";

export const metadata: Metadata = {
  title: "Services",
  description,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Services · ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/services`,
  },
};

export default function ServicesPage() {
  return <Services />;
}
