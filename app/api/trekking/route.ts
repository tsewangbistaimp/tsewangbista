import { randomUUID } from "node:crypto";
import { sendEnquiry } from "@/lib/trek/email";
import { trekSchema } from "@/lib/trek/schema";
import { json, limited, sameOrigin } from "@/lib/q/guard";

export const runtime = "nodejs";
export const maxDuration = 30;

const seen = new Map<string, string>();

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Not allowed." }, 403);
  if (limited(req, "trek", 6, 60 * 60_000)) return json({ error: "Too many attempts. Please try again later." }, 429);

  const raw = await req.text();
  if (raw.length > 120_000) return json({ error: "That is too much text to send at once." }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Something went wrong reading your form." }, 400);
  }
  const parsed = trekSchema.safeParse(body);
  if (!parsed.success) return json({ error: parsed.error.issues[0]?.message ?? "Please check the form and try again." }, 400);
  const d = parsed.data;
  if (d.website_hp) return json({ ok: true, id: randomUUID() });

  const prior = seen.get(d.idempotencyKey);
  if (prior) return json({ ok: true, id: prior, duplicate: true });

  const id = randomUUID().slice(0, 8).toUpperCase();
  const mail = await sendEnquiry(d, id);
  if (!mail.ok) {
    console.error("[trekking] email failed:", mail.detail);
    return json({ error: "We could not receive your request right now. Please try again in a moment or contact us on WhatsApp." }, 502);
  }
  seen.set(d.idempotencyKey, id);
  return json({ ok: true, id });
}
