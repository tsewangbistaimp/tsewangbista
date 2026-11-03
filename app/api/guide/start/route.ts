import { hasDb } from "@/lib/q/config";
import { json, limited, sameOrigin } from "@/lib/q/guard";
import { button, sendMail, siteOrigin, wrap } from "@/lib/guide/email";
import { createProfile, findByEmail, newToken, rotateToken } from "@/lib/guide/store";

export const runtime = "nodejs";

// Sends (or re-sends) the private "continue your portfolio" link. Always answers the same way so email addresses can't be probed.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Not allowed." }, 403);
  if (limited(req, "guide-start", 5, 60 * 60_000)) return json({ error: "Too many attempts. Please try again later." }, 429);
  if (!hasDb()) return json({ error: "This service is not available yet. Please try again later." }, 503);
  const b = (await req.json().catch(() => ({}))) as { email?: unknown; website_hp?: unknown };
  if (b.website_hp) return json({ ok: true });
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 160) return json({ error: "Please enter a valid email address." }, 400);

  const token = newToken();
  const existing = await findByEmail(email);
  const ok = existing ? await rotateToken(existing.id, token) : Boolean(await createProfile(email, token));
  if (!ok) return json({ error: "Could not start your portfolio. Please try again." }, 502);

  const link = `${siteOrigin(req)}/guides/edit/${token}`;
  const sent = await sendMail({
    to: email,
    subject: "Your Trekking Guide Portfolio link",
    html: wrap("Continue your trekking guide portfolio", `<p>Use the private link below to start or continue your portfolio. Your progress is saved automatically. Anyone with this link can edit your draft, so please do not share it.</p>${button(link, "Open my portfolio")}<p style="color:#666;font-size:12px">If you did not request this, you can ignore this email.</p>`)
  });
  if (!sent) return json({ error: "We could not send the email right now. Please try again in a moment." }, 502);
  return json({ ok: true });
}
