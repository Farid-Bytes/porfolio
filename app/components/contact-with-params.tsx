"use client";

import { useSearchParams } from "next/navigation";

import { Contact } from "@/app/components/contact";

const MAX_SUBJECT_LENGTH = 120;

export function ContactWithParams() {
  const searchParams = useSearchParams();
  const raw = searchParams.get("subject") ?? "";
  const prefillSubject = raw.trim().slice(0, MAX_SUBJECT_LENGTH);

  return <Contact prefillSubject={prefillSubject} />;
}
