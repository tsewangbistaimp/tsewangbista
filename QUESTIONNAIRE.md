# Private research questionnaire

A hidden, invite-only page at `/q/<QUESTIONNAIRE_SLUG>`. Nothing links to it, it is not in any sitemap or `robots.txt`, and every wrong URL returns the normal 404.

## Files (all new; only `next.config.mjs`, `.env.example` and `package.json` (zod) were edited)

- `app/q/[slug]/` page, wizard UI, admin page. `app/q/q.css` styles (scoped to `.qx`).
- `app/api/questionnaire/submit|code|admin/route.ts` server endpoints.
- `lib/q/` question bank, shared Zod schema, config, Supabase store, email builder, advice.
- `supabase.sql` database tables.

## Setup (once)

1. **Supabase** (free): create a project, open SQL Editor, paste `supabase.sql`, Run. Copy the Project URL and the `service_role` key (Settings > API).
2. **Resend** (free): create an API key at resend.com. Without your own domain, mail is sent from `onboarding@resend.dev`, and Resend only delivers to the email you signed up with, so sign up with the Gmail that should receive answers. To send from your domain, add it in Resend and publish the SPF/DKIM DNS records it shows.
3. **Vercel > Project > Settings > Environment Variables**, add everything in `.env.example` under the questionnaire heading:
   - `QUESTIONNAIRE_SLUG`: run `node -e "console.log(require('crypto').randomBytes(18).toString('base64url'))"`
   - `QUESTIONNAIRE_ENABLED=true`, `QUESTIONNAIRE_ACCESS=token`
   - `QUESTIONNAIRE_SESSION_SECRET` (any long random string), `QUESTIONNAIRE_ADMIN_PASSWORD`
   - `RECIPIENT_EMAIL`, `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - optional `ANTHROPIC_API_KEY` for personalised advice (otherwise fixed tips are shown)
4. Redeploy.

## Using it

- Open `https://tsewangbista.com/q/<slug>/admin`, sign in, paste the 10 names (one per line), press **Create links**, copy each person's link and send it. Links can be one-time and revoked.
- Results: same admin page lists, searches and opens submissions; **Export all (CSV)** gives Respondent, Field, Date, ID, Section, Question, Quick Choice, Answer.
- Every submission is saved first, then emailed (3 attempts) with JSON and CSV attached.
- Kill switch: `QUESTIONNAIRE_ENABLED=false` or `QUESTIONNAIRE_CLOSES_AT=<date>` makes every URL a 404 and blocks the API.
- Change the recipient: edit `RECIPIENT_EMAIL`, redeploy.

## Test checklist

- Link appears on no page, menu or footer; `/sitemap.xml` and `/robots.txt` do not mention it.
- `/q/wrong` and `/q/<slug>` without a valid `?t=` return 404.
- `curl -I https://.../q/<slug>?t=...` shows `X-Robots-Tag: noindex...` and `Referrer-Policy: no-referrer`; page source has `noindex`.
- Fill name, field, consent only and submit: email arrives with subject `[Research Questionnaire] Name | Field | DD Mon YYYY`, attachments, and a Skipped marker on empty questions.
- Refresh mid-way: answers are restored. Double-click Submit: one email.
- Spam folder: send from your own verified domain; avoid changing the wording to sales-like text.

## Notes and assumptions

- Defaults chosen: Resend, Supabase, personal invite tokens, AI-written tips with fixed-tips fallback.
- The rate limiter is in memory per server instance (enough for ~10 invitees).
- Cloudflare Turnstile was not added because it needs a third-party script on the page; the honeypot, rate limit and invite tokens cover abuse.
- Drafts are saved in the browser (localStorage), not on the server.
