# TsewangBistaX Portfolio

Premium personal and business portfolio for Tsewang Bista.

## Tech Stack

- Next.js
- React
- TypeScript
- Formspree for order form email notifications

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Checks

```bash
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Order System

The Order Inquiry form submits directly from the browser to a Formspree
endpoint, which emails the submission to `tsewangbistaimp@gmail.com`.

Required environment variable (see `.env.example`):

- `NEXT_PUBLIC_FORMSPREE_ENDPOINT` — your Formspree form endpoint
  (e.g. `https://formspree.io/f/abcdwxyz`).

Setup:

1. Create a free account at [formspree.io](https://formspree.io).
2. Create a new form with `tsewangbistaimp@gmail.com` as the recipient.
3. Copy the form's endpoint URL into `NEXT_PUBLIC_FORMSPREE_ENDPOINT`.
4. Never commit `.env.local` or real secrets.

## Vercel Deployment

1. Import this GitHub repository into Vercel.
2. Keep the framework preset as `Next.js`.
3. Add `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in Vercel Project Settings.
4. Deploy.
