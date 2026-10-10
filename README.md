# Ghulam Farid — Portfolio

Personal site for **Ghulam Farid**, AI Automation Engineer, Python Developer, and AI/ML Engineer.

Built with Next.js 16, React 19, Tailwind CSS 4, Motion, and a deferred WebGL hero.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production checks

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Environment

Copy `.env.example` to `.env.local` for local development.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, Open Graph, sitemap, and robots |
| `RESEND_API_KEY` | Resend API key for the contact form (server-only) |
| `CONTACT_TO_EMAIL` | Inbox that receives contact form messages |
| `RESEND_FROM_EMAIL` | From address (use `beth.t@example.com` until a domain is verified) |

On Vercel, if `NEXT_PUBLIC_SITE_URL` is unset, the project falls back to the platform production URL. Contact form delivery also needs the three Resend variables above set in Vercel (Production and Preview).

Contact details for the UI live in `lib/site-config.ts`.

## Deploy on Vercel

1. Push this repository to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Keep the defaults:
   - Framework: Next.js
   - Build command: `next build` (`npm run build`)
   - Output: Next.js (no static export)
   - Node.js: 20.x or newer
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain, for example `https://your-project.vercel.app`.
5. Add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `RESEND_FROM_EMAIL` from `.env.example`.
6. Deploy.

After the first deploy, add a custom domain in Vercel if you have one, then update `NEXT_PUBLIC_SITE_URL` to match and redeploy. When you verify that domain in Resend, switch `RESEND_FROM_EMAIL` to an address on it.
