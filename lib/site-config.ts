export type NavItem = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

function resolveSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/**
 * Single source of truth for identity, metadata and navigation.
 *
 * Keep every claim here verifiable: this content feeds the page copy and the
 * SEO metadata, so anything inaccurate is published twice.
 */
export const siteConfig = {
  name: "Ghulam Farid",
  /** Shown next to the logo mark in the navbar. */
  initials: "GF",
  role: "AI Automation Engineer",
  /** Secondary positioning, rendered as mono-cased chips. */
  disciplines: ["AI Automation Engineer", "Python Developer", "AI/ML Engineer"],
  tagline:
    "Building intelligent automation systems, AI agents, APIs, and production-ready software.",
  summary:
    "Computer Science graduate focused on AI automation, Python development and applied machine learning. I design workflows, integrations and interfaces that turn models into tools people can actually use.",
  /**
   * Absolute site URL, used to resolve Open Graph and canonical URLs.
   * Set NEXT_PUBLIC_SITE_URL in Vercel to your custom domain.
   */
  url: resolveSiteUrl(),
  locale: "en_US",
  location: "Pakistan",
  availability: "Open to automation partnerships",

  /**
   * Empty values are intentionally not rendered rather than faked.
   */
  contact: {
    email: "farid932973@gmail.com" as string,
    github: "https://github.com/Farid-Bytes" as string,
    linkedin: "https://www.linkedin.com/in/ghulam-farid-454652330" as string,
  },

  /**
   * Primary navigation: only dedicated page routes.
   */
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],

  /**
   * Home-page section deep links, surfaced in the footer Explore group.
   */
  explore: [
    { label: "Skills", href: "/#skills" },
    { label: "How I Build", href: "/#how-i-build" },
    { label: "Projects", href: "/#projects" },
    { label: "Experience", href: "/#experience" },
    { label: "Reviews", href: "/#reviews" },
    { label: "Why Work With Me", href: "/#why-choose" },
  ] as NavItem[],
} as const;

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: siteConfig.contact.github },
  { label: "LinkedIn", href: siteConfig.contact.linkedin },
].filter((link) => link.href.length > 0);
