export type ExperienceEntry = {
  id: "current" | "previous" | "education";
  type: "Work" | "Education";
  status: string;
  title: string;
  organization: string;
  context: string;
  highlights: readonly string[];
  stack: readonly string[];
};

/**
 * Dates and unverified metrics are intentionally omitted.
 * Highlights and stack only restate facts already published on the site.
 */
export const experience: readonly ExperienceEntry[] = [
  {
    id: "current",
    type: "Work",
    status: "Current",
    title: "AI Automation Engineer",
    organization: "Coventures",
    context:
      "Current professional work focused on AI automation engineering — building workflows, integrations, and interfaces that turn models into tools people can use.",
    highlights: [
      "AI automation engineering as the primary role focus",
      "Practical systems around models, APIs, and dependable interfaces",
      "Aligned with agents, Python services, and applied ML products",
    ],
    stack: ["AI Automation", "Python", "AI Agents", "FastAPI", "Workflows"],
  },
  {
    id: "previous",
    type: "Work",
    status: "Previous",
    title: "Laravel Development",
    organization: "Xcelent Solutions",
    context:
      "Professional experience developing with Laravel at Xcelent Solutions, building full-stack application features on a PHP backend.",
    highlights: [
      "Laravel-based application development",
      "Full-stack store work reflected in the Laravel Ecommerce showcase",
    ],
    stack: ["Laravel", "Backend systems", "MySQL"],
  },
  {
    id: "education",
    type: "Education",
    status: "Education",
    title: "BS in Computer Science",
    organization: "GC University Faisalabad",
    context:
      "Bachelor’s-level study in Computer Science at GC University Faisalabad — the foundation behind the automation and software work on this site.",
    highlights: [
      "Computer Science graduate",
      "Foundation for AI automation, Python development, and applied ML",
    ],
    stack: ["Computer Science", "Python", "AI / ML"],
  },
] as const;
