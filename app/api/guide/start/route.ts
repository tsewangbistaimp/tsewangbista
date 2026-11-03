import { hasDb } from "@/lib/q/config";
import { json, limited, sameOrigin } from "@/lib/q/guard";
import { createProfile, newToken } from "@/lib/guide/store";

export const runtime = "nodejs";

// Creates an empty draft and returns its private token. The browser keeps it so the guide can continue later.
export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Not allowed." }, 403);
  if (limited(req, "guide-start", 10, 60 * 60_000)) return json({ error: "Too many attempts. Please try again later." }, 429);
  if (!hasDb()) return json({ error: "This service is not available yet. Please try again later." }, 503);
  const b = (await req.json().catch(() => ({}))) as { website_hp?: unknown };
  if (b.website_hp) return json({ error: "Not allowed." }, 400);
  const token = newToken();
  const row = await createProfile(token);
  if (!row) return json({ error: "Could not start your portfolio. Please try again." }, 502);
  return json({ ok: true, token });
}
