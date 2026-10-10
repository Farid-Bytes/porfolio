import { siteConfig } from "@/lib/site-config";
import { skills } from "@/lib/skills";

export type SiteStat = {
  id: string;
  value: number;
  label: string;
  suffix?: string;
};

/**
 * Site metrics for the hero. Capabilities and focus areas stay derived from
 * published data; projects uses a curated total that includes work beyond the
 * featured case studies.
 */
export const siteStats: readonly SiteStat[] = [
  {
    id: "projects",
    value: 18,
    label: "Projects",
    suffix: "+",
  },
  {
    id: "capabilities",
    value: skills.length,
    label: "Capabilities",
  },
  {
    id: "focus",
    value: siteConfig.disciplines.length,
    label: "Focus areas",
  },
] as const;
