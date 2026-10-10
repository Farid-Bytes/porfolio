import fs from "node:fs";
import nextEnv from "@next/env";

const raw = fs.readFileSync(".env.local", "utf8");
const line = raw.split(/\r?\n/).find((l) => l.startsWith("RESEND_FROM_EMAIL"));
console.log("file line:", line);

nextEnv.loadEnvConfig(process.cwd());
const from = process.env.RESEND_FROM_EMAIL ?? "";
const domain = from.match(/@([^>\s"]+)/)?.[1] ?? null;
console.log(
  JSON.stringify({
    from,
    domain,
    ok: domain === "resend.dev",
  }),
);
