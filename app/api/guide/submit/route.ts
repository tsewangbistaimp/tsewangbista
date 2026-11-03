import { cfg } from "@/lib/q/config";
import { json, limited, sameOrigin } from "@/lib/q/guard";
import { esc } from "@/lib/q/email";
import { button, sendMail, siteOrigin, wrap } from "@/lib/guide/email";
import { findByToken, patch, saveDraft } from "@/lib/guide/store";
import { EDITABLE, normalize, validateStep } from "@/lib/guide/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Not allowed." }, 403);
  if (limited(req, "guide-submit", 10, 60 * 60_000)) return json({ error: "Too many attempts. Please try again later." }, 429);
  const raw = await req.text();
  if (raw.length > 600_000) return json({ error: "That is too much data." }, 413);
  let b: { token?: string; data?: unknown };
  try { b = JSON.parse(raw); } catch { return json({ error: "Invalid request." }, 400); }
  const row = await findByToken(String(b.token ?? ""));
  if (!row) return json({ error: "This link is not valid." }, 404);
  if (!EDITABLE.includes(row.status)) return json({ error: "This portfolio has already been submitted." }, 409);

  const data = normalize(b.data);
  for (let s = 0; s < 8; s++) {
    const m = validateStep(data, s);
    if (m) return json({ error: m, step: s }, 400);
  }
  if (!(await saveDraft(row.id, data, 7)) || !(await patch(row.id, { status: "submitted", submitted_at: new Date().toISOString(), admin_note: null }))) {
    return json({ error: "Could not submit. Please try again." }, 502);
  }
  const origin = siteOrigin(req);
  await sendMail({
    to: data.p.email, subject: "We received your trekking guide portfolio",
    html: wrap("Submitted for verification", `<p>Thank you, ${esc(data.p.displayName)}. Your portfolio is now waiting for review. It becomes public only after it is approved. We will email you when the status changes.</p>`)
  });
  if (cfg.recipient()) {
    await sendMail({
      to: cfg.recipient(), subject: `[Guide portfolio] ${data.p.displayName} submitted for verification`,
      html: wrap("New guide portfolio to review", `<p>${esc(data.p.displayName)} (${esc(data.p.email)}) submitted a portfolio with ${data.itineraries.length} itinerary(ies).</p>${button(`${origin}/guide-admin`, "Open guide admin")}`)
    });
  }
  return json({ ok: true });
}
