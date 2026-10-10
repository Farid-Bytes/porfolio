import type { Metadata, Viewport } from "next";
import { Figtree, Geist_Mono, Space_Grotesk } from "next/font/google";

import { DeferredChrome } from "@/app/components/deferred-chrome";
import { Footer } from "@/app/components/footer";
import { Navbar } from "@/app/components/navbar";
import { siteConfig, socialLinks } from "@/lib/site-config";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const title = `${siteConfig.name} · ${siteConfig.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.summary,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  keywords: [
    siteConfig.name,
    "AI Automation Engineer",
    "Python Developer",
    "AI/ML Engineer",
    "AI Agents",
    "LLMs",
    "FastAPI",
    "APIs",
    "Machine Learning",
    "Automation",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title,
    description: siteConfig.summary,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.summary,
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
    address: false,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  jobTitle: siteConfig.role,
  description: siteConfig.summary,
  url: siteConfig.url,
  sameAs: socialLinks.map((link) => link.href),
  ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "GC University Faisalabad",
  },
  worksFor: {
    "@type": "Organization",
    name: "Coventures",
  },
  knowsAbout: [...siteConfig.disciplines],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#e8ecf2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spaceGrotesk.variable} ${figtree.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-full focus-visible:bg-surface focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:shadow-float"
        >
          Skip to content
        </a>
        <DeferredChrome />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <Navbar />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
