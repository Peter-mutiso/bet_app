# Deriv-demo (bet_app)

This is a small Next.js + TypeScript trading-demo app intended for local development and demo deployments.

Quick steps to publish and deploy

1) Create a GitHub repository (if you haven't) and note the HTTPS URL, e.g. https://github.com/<you>/bet_app

2) Add remote and push from your machine (or here if authenticated):

```powershell
git remote add origin https://github.com/<you>/bet_app.git
git push -u origin main
```

3) Deploy to Vercel (recommended via the web UI):
- Go to https://vercel.com and sign in with GitHub
- Import the repository and deploy — Vercel auto-detects Next.js

Or use the Vercel CLI:

```powershell
npm i -g vercel
vercel # follow prompts
vercel --prod
```

Notes
- Add any required environment variables (e.g., MPESA credentials) in Vercel Project → Settings → Environment Variables.
- If you want me to push from this environment, provide a GitHub personal access token or set up an authenticated GitHub CLI here. I won't request or store secrets without explicit permission.

Deploying to Vercel (your project)

1) Via Vercel dashboard
- Sign in to https://vercel.com using the same GitHub account used to host the repo.
- Click "New Project" → Import Git Repository → find `Peter-mutiso/bet_app` and import.
- Vercel auto-detects Next.js; click Deploy. The site will be assigned a Vercel URL.

2) After first deploy
- Configure environment variables via Project → Settings → Environment Variables (MPESA keys, any API secrets).
- Each push to `main` will trigger a new deployment automatically.

Vercel dashboard URL (your projects page): https://vercel.com/peter-mutisos-projects
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
