import { Resend } from "resend";
import { NextResponse } from "next/server";

const MAX = {
  name: 100,
  email: 254,
  phone: 30,
  subject: 150,
  message: 5000,
} as const;

type ContactBody = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

function asTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validate(body: ContactBody): string | null {
  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const phone = asTrimmedString(body.phone);
  const subject = asTrimmedString(body.subject);
  const message = asTrimmedString(body.message);

  if (!name || name.length > MAX.name) {
    return "Please enter your name.";
  }
  if (!email || email.length > MAX.email) {
    return "Please enter your email.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Enter a valid email address.";
  }
  if (phone && (phone.length > MAX.phone || !/^[\d\s+().-]{7,20}$/.test(phone))) {
    return "Enter a valid phone number.";
  }
  if (!subject || subject.length > MAX.subject) {
    return "Please add a short subject.";
  }
  if (!message || message.length < 10) {
    return "Message should be at least 10 characters.";
  }
  if (message.length > MAX.message) {
    return "Message is too long.";
  }

  return null;
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Silent success for honeypot so bots don't retry.
  if (asTrimmedString(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json(
      { ok: false, error: validationError },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.error("Contact API missing RESEND_API_KEY, CONTACT_TO_EMAIL, or RESEND_FROM_EMAIL");
    return NextResponse.json(
      { ok: false, error: "Messaging is temporarily unavailable." },
      { status: 503 },
    );
  }

  const name = asTrimmedString(body.name);
  const email = asTrimmedString(body.email);
  const phone = asTrimmedString(body.phone);
  const subject = asTrimmedString(body.subject);
  const message = asTrimmedString(body.message);

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <hr />
    <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
  `;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Portfolio contact: ${subject}`,
      text,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Could not send your message. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try again." },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
