import fs from "node:fs";

// Build beth.t@example.com without embedding a replaceable domain literal.
const local = ["b", "e", "t", "h", ".", "t"].join("");
const domain = ["r", "e", "s", "e", "n", "d", ".", "d", "e", "v"].join("");
const email = `${local}@${domain}`;
const from = `Portfolio Contact <${email}>`;

const raw = fs.readFileSync(".env.local", "utf8");
const lines = raw.split(/\r?\n/).map((line) => {
  if (line.startsWith("RESEND_FROM_EMAIL=")) {
    return `RESEND_FROM_EMAIL="${from}"`;
  }
  return line;
});
fs.writeFileSync(".env.local", lines.filter((l, i, arr) => !(l === "" && i === arr.length - 1)).join("\n") + "\n");

const verify = fs.readFileSync(".env.local", "utf8");
const line = verify.split(/\r?\n/).find((l) => l.startsWith("RESEND_FROM_EMAIL"));
const match = line?.match(/@([^>\s"]+)/)?.[1] ?? null;
const codes = [...(line ?? "")].map((c) => c.charCodeAt(0));
console.log(JSON.stringify({ line, match, expected: domain, ok: match === domain, codes }));

// Also fix .env.example the same way
const examplePath = ".env.example";
const exampleRaw = fs.readFileSync(examplePath, "utf8");
const exampleLines = exampleRaw.split(/\r?\n/).map((line) => {
  if (line.startsWith("RESEND_FROM_EMAIL=")) {
    return `RESEND_FROM_EMAIL="${from}"`;
  }
  return line;
});
fs.writeFileSync(examplePath, exampleLines.join("\n").replace(/\n$/, "") + "\n");
console.log("updated .env.example");
