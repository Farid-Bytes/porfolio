import type { MetadataRoute } from "next";

import { getProjectSlugs } from "@/lib/projects";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/services", "/projects", "/contact"] as const;

  const pages = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const projectPages = getProjectSlugs().map((slug) => ({
    url: `${siteConfig.url}/projects/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...projectPages];
}
