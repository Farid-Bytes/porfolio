"use client";

import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/icons";
import { useActiveSection } from "@/lib/use-active-section";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";
import { siteConfig, type NavItem } from "@/lib/site-config";

const navItems = siteConfig.nav;
const homeSectionIds = [
  "home",
  ...navItems
    .map((item) => hashFromHref(item.href))
    .filter((id): id is string => id !== null && id !== "home"),
];

const easeOutSoft = [0.16, 1, 0.3, 1] as const;

function hashFromHref(href: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  const hash = href.slice(hashIndex + 1);
  return hash.length > 0 ? hash : null;
}

function isNavItemActive(
  item: NavItem,
  pathname: string,
  activeId: string | null,
): boolean {
  const hash = hashFromHref(item.href);

  if (hash) {
    return pathname === "/" && activeId === hash;
  }

  if (item.href === "/") {
    return pathname === "/" && (activeId === "home" || activeId === null);
  }

  return pathname === item.href;
}

export function Navbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const { scrollY, scrollYProgress } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const condensedRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(
    pathname === "/" ? homeSectionIds : [],
  );

  // Hysteresis avoids React re-renders on every scroll pixel.
  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = condensedRef.current ? latest > 8 : latest > 24;
    if (next === condensedRef.current) return;
    condensedRef.current = next;
    setCondensed(next);
  });

  // The mobile panel is part of the header, so leaving the breakpoint while it
  // is open would otherwise strand an invisible expanded region.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 80rem)");
    const close = () => setMenuOpen(false);

    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;

      const panelLinks = mobileNavRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const items = [
        menuButtonRef.current,
        ...(panelLinks ? Array.from(panelLinks) : []),
      ].filter((node): node is HTMLElement => node !== null);

      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const focusFrame = requestAnimationFrame(() => {
      mobileNavRef.current
        ?.querySelector<HTMLAnchorElement>("a[href]")
        ?.focus({ preventScroll: true });
    });

    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const contactHref = "/contact";

  return (
    <motion.header
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOutSoft, delay: 0.05 }}
      className="sticky top-0 z-50"
    >
      <div
        className={cn(
          "relative border-b transition-[background-color,border-color,box-shadow] duration-300 ease-out-soft",
          condensed || menuOpen
            ? "border-line bg-white/88 shadow-float backdrop-blur-sm"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="container-page flex h-navbar items-center justify-between gap-4">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="group flex items-center gap-2.5 py-1.5 text-sm font-medium text-ink"
          >
            <span className="grid size-8 place-items-center rounded-lg border border-line-strong bg-white font-mono text-xs tracking-tight text-accent-500 transition-[border-color,color,transform] duration-300 ease-out-soft group-hover:-rotate-3 group-hover:scale-105 group-hover:border-line-accent group-hover:text-accent-500 motion-reduce:transform-none">
              {siteConfig.initials}
            </span>
            <span className="hidden sm:inline">{siteConfig.name}</span>
          </Link>

          {navItems.length > 0 && (
            <nav
              aria-label="Primary"
              className="hidden items-center gap-0.5 xl:flex"
            >
              {navItems.map((item) => {
                const isActive = isNavItemActive(item, pathname, activeId);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3 py-2 text-sm transition-colors duration-200 after:absolute after:right-3 after:bottom-1.5 after:left-3 after:h-px after:origin-left after:scale-x-0 after:bg-accent-500/65 after:transition-transform after:duration-300 hover:after:scale-x-100 motion-reduce:after:transition-none",
                      isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                    )}
                  >
                    {isActive &&
                      (reduceMotion ? (
                        <span className="absolute inset-0 rounded-full border border-line bg-white/80" />
                      ) : (
                        <motion.span
                          layoutId="navbar-active-pill"
                          className="absolute inset-0 rounded-full border border-line bg-white/80"
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 34,
                          }}
                        />
                      ))}
                    <span className="relative">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {siteConfig.contact.github && (
              <ButtonLink
                href={siteConfig.contact.github}
                target="_blank"
                rel="noreferrer noopener"
                variant="ghost"
                size="icon"
                aria-label={`${siteConfig.name} on GitHub`}
                className="hidden xl:inline-flex"
              >
                <GithubIcon className="size-4" />
              </ButtonLink>
            )}

            <ButtonLink
              href={contactHref}
              variant="secondary"
              size="sm"
              className="hidden xl:inline-flex"
            >
              Get in touch
            </ButtonLink>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-haspopup="dialog"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full border border-line-strong bg-white/70 text-ink transition-colors duration-200 hover:border-line-accent xl:hidden"
            >
              {menuOpen ? (
                <X className="size-4" aria-hidden />
              ) : (
                <Menu className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </div>

        {/* Reading progress, revealed only once the page has actually moved. */}
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className={cn(
            "absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent-500 to-accent-300 transition-opacity duration-300",
            condensed ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.3,
              ease: easeOutSoft,
            }}
            className="overflow-hidden border-b border-line bg-white/96 backdrop-blur-sm xl:hidden"
          >
            <nav
              ref={mobileNavRef}
              aria-label="Primary"
              className="container-page flex flex-col gap-1 py-4"
            >
              {navItems.map((item) => {
                const isActive = isNavItemActive(item, pathname, activeId);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "rounded-xl border px-4 py-3 text-sm transition-colors duration-200",
                      isActive
                        ? "border-line bg-white text-ink"
                        : "border-transparent text-ink-muted hover:bg-elevated/80 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="mt-3 flex items-center gap-2">
                <ButtonLink
                  href={contactHref}
                  variant="secondary"
                  size="sm"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1"
                >
                  Get in touch
                </ButtonLink>

                {siteConfig.contact.github && (
                  <ButtonLink
                    href={siteConfig.contact.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="secondary"
                    size="icon"
                    aria-label={`${siteConfig.name} on GitHub`}
                  >
                    <GithubIcon className="size-4" />
                  </ButtonLink>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
