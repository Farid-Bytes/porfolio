import type { Metadata } from "next";
import { Suspense } from "react";

import { Contact } from "@/app/components/contact";
import { ContactWithParams } from "@/app/components/contact-with-params";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name} about automation partnerships and AI engineering work.`,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact · ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name} about automation partnerships and AI engineering work.`,
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <Suspense fallback={<Contact />}>
      <ContactWithParams />
    </Suspense>
  );
}
