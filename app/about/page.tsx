import type { Metadata } from "next";

import { About } from "@/app/components/about";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: siteConfig.summary,
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${siteConfig.name}`,
    description: siteConfig.summary,
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return <About />;
}
