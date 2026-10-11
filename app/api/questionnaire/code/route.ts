import { cfg, isOpen, newCookie, safeEqual } from "@/lib/q/config";
import { json, limited, notFound, sameOrigin } from "@/lib/q/guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isOpen() || cfg.access() !== "code" || !sameOrigin(req)) return notFound();
  if (limited(req, "code", 6, 10 * 60_000)) return json({ error: "Too many tries. Please wait a few minutes." }, 429);
  const b = (await req.json().catch(() => ({}))) as { slug?: string; code?: string };
  if (!b.slug || !safeEqual(b.slug, cfg.slug())) return notFound();
  if (!b.code || !cfg.accessCode() || !safeEqual(b.code.trim(), cfg.accessCode())) return json({ error: "That code is not correct." }, 401);
  const res = json({ ok: true });
  res.cookies.set("q_ok", newCookie("ok", 24 * 14), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 14 * 24 * 3600 });
  return res;
}
