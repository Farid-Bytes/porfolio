import { Mail, MapPin } from "lucide-react";
import Link from "next/link";

import { FooterNeuralField } from "@/app/components/footer-neural-field";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { siteConfig } from "@/lib/site-config";

const footerChannels = [
  {
    label: "GitHub",
    href: siteConfig.contact.github,
    icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: siteConfig.contact.linkedin,
    icon: LinkedinIcon,
  },
  {
    label: "Email",
    href: siteConfig.contact.email
      ? `mailto:${siteConfig.contact.email}`
      : "",
    icon: Mail,
  },
].filter((channel) => channel.href.length > 0);

const linkClassName =
  "inline-flex min-h-8 items-center text-sm text-white/70 transition-colors hover:text-accent-300";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-accent-400/25 bg-[#071412] text-white">
      {/* Flowing teal glow + neural network field (same system as page chrome) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[#071412]" />
        <div className="absolute top-[-28%] left-[-16%] size-[44rem] rounded-full bg-[radial-gradient(circle,rgb(45_212_191/0.5)_0%,rgb(20_184_166/0.22)_38%,transparent_68%)] animate-footer-glow-a motion-reduce:animate-none" />
        <div className="absolute top-[2%] right-[-22%] size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(13_148_136/0.55)_0%,rgb(6_182_212/0.18)_42%,transparent_70%)] animate-footer-glow-b motion-reduce:animate-none" />
        <div className="absolute bottom-[-32%] left-[14%] size-[38rem] rounded-full bg-[radial-gradient(circle,rgb(20_184_166/0.45)_0%,transparent_65%)] animate-footer-glow-c motion-reduce:animate-none" />
        <div className="absolute inset-0 bg-[linear-gradient(165deg,rgb(7_20_18/0.15)_0%,rgb(7_20_18/0.45)_55%,rgb(7_20_18/0.7)_100%)]" />
        <FooterNeuralField />
      </div>

      <div className="container-page py-10 sm:py-16">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <span className="grid size-12 place-items-center rounded-xl border border-accent-400/40 bg-accent-400/15 font-display text-sm font-semibold tracking-[0.08em] text-accent-300 shadow-[0_0_28px_rgb(20_184_166/0.35)]">
                {siteConfig.initials}
              </span>
              <span>
                <span className="block text-lg font-semibold text-white">
                  {siteConfig.name}
                </span>
                <span className="mt-0.5 block font-mono text-[0.65rem] tracking-[0.14em] text-accent-300/90 uppercase">
                  {siteConfig.role}
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
              {siteConfig.summary}
            </p>

            <ul className="mt-5 flex flex-wrap gap-2.5">
              {footerChannels.map((channel) => {
                const Icon = channel.icon;
                const external = !channel.href.startsWith("mailto:");

                return (
                  <li key={channel.label}>
                    <a
                      href={channel.href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noreferrer noopener" : undefined}
                      aria-label={channel.label}
                      className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/5 text-accent-300 transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-400/50 hover:bg-accent-400/15 hover:shadow-[0_0_24px_rgb(20_184_166/0.35)] motion-reduce:transform-none"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(15.5rem,1.35fr)] sm:gap-6 lg:gap-8">
            {/* Quick Links + Explore are hidden on phones (they duplicate the
                mobile hamburger menu) and shown again from the sm breakpoint up. */}
            <nav aria-label="Quick links" className="hidden sm:block">
              <h6 className="font-mono text-[0.68rem] tracking-[0.16em] text-accent-300 uppercase">
                Quick Links
              </h6>
              <ul className="mt-4 space-y-2 sm:space-y-2.5">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClassName}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Explore home sections" className="hidden sm:block">
              <h6 className="font-mono text-[0.68rem] tracking-[0.16em] text-accent-300 uppercase">
                Explore
              </h6>
              <ul className="mt-4 space-y-2 sm:space-y-2.5">
                {siteConfig.explore.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClassName}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="col-span-2 min-w-0 sm:col-span-1">
              <h6 className="font-mono text-[0.68rem] tracking-[0.16em] text-accent-300 uppercase">
                Get In Touch
              </h6>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2.5">
                  <MapPin
                    className="size-4 shrink-0 text-accent-300"
                    aria-hidden
                  />
                  <span className="whitespace-nowrap">{siteConfig.location}</span>
                </li>
                {siteConfig.contact.email ? (
                  <li>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="inline-flex items-center gap-2.5 whitespace-nowrap transition-colors hover:text-accent-300"
                    >
                      <Mail
                        className="size-4 shrink-0 text-accent-300"
                        aria-hidden
                      />
                      <span>{siteConfig.contact.email}</span>
                    </a>
                  </li>
                ) : null}
                <li className="pt-1 whitespace-nowrap text-white/55">
                  {siteConfig.availability}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20">
        <div className="container-page flex flex-col gap-2 pt-5 pb-safe text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <Link
            href="/"
            className="inline-flex min-h-6 w-fit items-center transition-colors hover:text-accent-300"
          >
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
