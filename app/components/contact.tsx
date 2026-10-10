"use client";

import { ArrowUpRight, Mail, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";
import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section";
import { siteConfig } from "@/lib/site-config";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const channels = [
  {
    label: "Email",
    detail: siteConfig.contact.email,
    href: siteConfig.contact.email
      ? `mailto:${siteConfig.contact.email}`
      : "",
    icon: <Mail className="size-4" aria-hidden />,
  },
  {
    label: "GitHub",
    detail: "Code and project repositories",
    href: siteConfig.contact.github,
    icon: <GithubIcon className="size-4" />,
  },
  {
    label: "LinkedIn",
    detail: "Professional profile",
    href: siteConfig.contact.linkedin,
    icon: (
      <span
        aria-hidden
        className="font-sans text-[0.7rem] font-semibold tracking-[-0.05em]"
      >
        in
      </span>
    ),
  },
].filter((channel) => channel.href.length > 0);

type FormStatus = "idle" | "sending" | "sent" | "error";

type FormErrors = Partial<
  Record<"name" | "email" | "phone" | "subject" | "message", string>
>;

const fieldClass =
  "w-full rounded-xl border border-line bg-canvas/70 px-3.5 py-2.5 text-sm text-ink " +
  "placeholder:text-ink-subtle/70 outline-none transition-[border-color,background-color,box-shadow] " +
  "duration-200 hover:border-line-strong focus:border-line-accent focus:bg-white " +
  "focus:shadow-[0_0_0_3px_rgb(20_184_166/0.18)]";

const labelClass =
  "mb-1.5 block font-mono text-[0.7rem] tracking-[0.14em] text-ink-subtle uppercase";

type ContactProps = {
  /** From /contact?subject= — e.g. service enquire links. */
  prefillSubject?: string;
};

export function Contact({ prefillSubject = "" }: ContactProps) {
  const reduceMotion = useReducedMotion();
  const formId = useId();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const [subject, setSubject] = useState(prefillSubject);

  useEffect(() => {
    setSubject(prefillSubject);
  }, [prefillSubject]);

  function validate(form: HTMLFormElement): FormErrors | null {
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const next: FormErrors = {};

    if (!name) next.name = "Please enter your name.";
    if (!email) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address.";
    }
    if (phone && !/^[\d\s+().-]{7,20}$/.test(phone)) {
      next.phone = "Enter a valid phone number.";
    }
    if (!subject) next.subject = "Please add a short subject.";
    if (!message) {
      next.message = "Please write a short message.";
    } else if (message.length < 10) {
      next.message = "Message should be at least 10 characters.";
    }

    return Object.keys(next).length > 0 ? next : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors = validate(form);

    if (nextErrors) {
      setErrors(nextErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("sending");

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !result?.ok) {
        setStatus("error");
        return;
      }

      setStatus("sent");
      form.reset();
      setSubject("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-30 h-[70%] bg-[linear-gradient(to_top,rgb(20_184_166/0.08),transparent)]"
      />

      <div className="container-page section-y">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white/92 px-6 py-12 shadow-panel sm:px-10 sm:py-16 lg:px-14 lg:py-20">
            <div
              aria-hidden
              className="bg-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(circle_at_70%_40%,black,transparent_55%)]"
            />

            <div className="relative">
              <div className="max-w-3xl">
                <Eyebrow>Contact</Eyebrow>
                <h2 className="mt-5 text-[clamp(2.4rem,1.7rem+3.5vw,4.8rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-ink">
                  Let&apos;s build something{" "}
                  <span className="text-gradient-accent">intelligent.</span>
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
                  Interested in thoughtful AI automation, backend systems, and
                  applied AI work where dependable engineering matters.
                </p>
              </div>

              <div className="mt-10 space-y-6 lg:mt-12 lg:space-y-8">
                <div>
                  <p className="font-mono text-[0.7rem] tracking-[0.14em] text-ink-subtle uppercase">
                    Direct links
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {channels.map((channel, index) => (
                      <motion.div
                        key={channel.label}
                        initial={false}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.45,
                          delay: reduceMotion ? 0 : index * 0.06,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <ContactChannel {...channel} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-ink-subtle uppercase">
                  <MapPin className="size-3.5 text-accent-500" aria-hidden />
                  {siteConfig.availability} · {siteConfig.location}
                </p>

                <form
                  noValidate
                  onSubmit={handleSubmit}
                  className="relative w-full rounded-2xl border border-line bg-canvas/55 p-5 sm:p-6"
                  aria-describedby={`${formId}-status`}
                >
                  {/* Honeypot — leave empty; hidden from real users */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden opacity-0"
                  >
                    <label htmlFor={`${formId}-website`}>Website</label>
                    <input
                      id={`${formId}-website`}
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id={`${formId}-name`}
                      name="name"
                      label="Name"
                      autoComplete="name"
                      placeholder="Your name"
                      required
                      error={errors.name}
                    />
                    <Field
                      id={`${formId}-email`}
                      name="email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      required
                      error={errors.email}
                    />
                    <Field
                      id={`${formId}-phone`}
                      name="phone"
                      label="Phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+92 300 0000000"
                      error={errors.phone}
                    />
                    <Field
                      id={`${formId}-subject`}
                      name="subject"
                      label="Subject"
                      autoComplete="off"
                      placeholder="What should we talk about?"
                      required
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      error={errors.subject}
                    />
                  </div>

                  {prefillSubject ? (
                    <p className="mt-2 text-xs text-ink-subtle">
                      Subject prefilled from Services — edit if you like.
                    </p>
                  ) : null}

                  <div className="mt-4">
                    <label htmlFor={`${formId}-message`} className={labelClass}>
                      Message
                    </label>
                    <textarea
                      id={`${formId}-message`}
                      name="message"
                      rows={5}
                      required
                      placeholder="Share a bit about the project, timeline, or what you need help with."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? `${formId}-message-error` : undefined
                      }
                      className={cn(
                        fieldClass,
                        "min-h-[8.5rem] resize-y",
                        errors.message && "border-spark/70",
                      )}
                    />
                    {errors.message ? (
                      <p
                        id={`${formId}-message-error`}
                        className="mt-1.5 text-xs text-spark"
                        role="alert"
                      >
                        {errors.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p
                      id={`${formId}-status`}
                      className="text-sm text-ink-subtle"
                      aria-live="polite"
                    >
                      {status === "sent"
                        ? "Thanks — your message was sent. I’ll reply as soon as I can."
                        : status === "error"
                          ? errors.name ||
                            errors.email ||
                            errors.phone ||
                            errors.subject ||
                            errors.message
                            ? "Please fix the highlighted fields and try again."
                            : "Something went wrong sending your message. Please try again."
                          : "I’ll reply as soon as I can."}
                    </p>
                    <Button
                      type="submit"
                      disabled={status === "sending"}
                      className="shrink-0"
                    >
                      <Send className="size-4" aria-hidden />
                      {status === "sending" ? "Sending…" : "Send message"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  placeholder,
  required,
  value,
  onChange,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required ? (
          <span className="ml-1 text-accent-500" aria-hidden>
            *
          </span>
        ) : (
          <span className="ml-1.5 font-sans text-[0.65rem] tracking-normal text-ink-subtle normal-case">
            optional
          </span>
        )}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        maxLength={value !== undefined ? 120 : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldClass, error && "border-spark/70")}
      />
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-spark" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ContactChannel({
  label,
  detail,
  href,
  icon,
}: {
  label: string;
  detail: string;
  href: string;
  icon: ReactNode;
}) {
  return (
    <a
      href={href}
      data-magnetic
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noreferrer noopener"}
      aria-label={`${label}: ${detail}`}
      className="group/channel flex items-center gap-3 rounded-2xl border border-line bg-canvas/80 p-3.5 transition-[border-color,background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-line-accent hover:bg-white hover:shadow-glow motion-reduce:transform-none"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line-accent bg-accent-400/12 text-accent-500">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="mt-0.5 block truncate text-xs text-ink-subtle">
          {detail}
        </span>
      </span>
      <ArrowUpRight
        className="size-4 shrink-0 text-ink-subtle transition-[color,transform] group-hover/channel:translate-x-0.5 group-hover/channel:-translate-y-0.5 group-hover/channel:text-accent-500 motion-reduce:transform-none"
        aria-hidden
      />
    </a>
  );
}
