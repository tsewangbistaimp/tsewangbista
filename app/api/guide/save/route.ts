import { json, limited, sameOrigin } from "@/lib/q/guard";
import { findByToken, saveDraft } from "@/lib/guide/store";
import { EDITABLE, normalize } from "@/lib/guide/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Not allowed." }, 403);
  if (limited(req, "guide-save", 120, 60 * 60_000)) return json({ error: "Too many saves. Please wait a moment." }, 429);
  const raw = await req.text();
  if (raw.length > 600_000) return json({ error: "That is too much data to save at once." }, 413);
  let b: { token?: string; data?: unknown; step?: number };
  try { b = JSON.parse(raw); } catch { return json({ error: "Invalid request." }, 400); }
  const row = await findByToken(String(b.token ?? ""));
  if (!row) return json({ error: "This link is not valid." }, 404);
  if (!EDITABLE.includes(row.status)) return json({ error: "This portfolio is locked while it is being reviewed." }, 409);
  const ok = await saveDraft(row.id, normalize(b.data), Number(b.step) || 0);
  return ok ? json({ ok: true, savedAt: new Date().toISOString() }) : json({ error: "Could not save." }, 502);
}
