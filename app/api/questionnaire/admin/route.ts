import { cookies } from "next/headers";
import { buildCsv } from "@/lib/q/email";
import { cfg, cookieValid, isOpen, newCookie, safeEqual } from "@/lib/q/config";
import { inviteToken, json, limited, notFound, sameOrigin } from "@/lib/q/guard";
import { createInvites, listSubmissions, revokeInvite } from "@/lib/q/store";

export const runtime = "nodejs";

async function authed() {
  return cookieValid((await cookies()).get("q_adm")?.value, "adm");
}

function slugOk(slug: string | null | undefined) {
  return Boolean(slug && cfg.slug() && safeEqual(slug, cfg.slug()) && cfg.adminPassword());
}

// Download everything as one CSV: Respondent, Field, Date, ID, Section, Question, Quick Choice, Answer.
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("s");
  if (!slugOk(slug) || !(await authed())) return notFound();
  const rows = (await listSubmissions()).map((r) => ({
    respondent: r.name, field: r.field, date: r.created_at.slice(0, 10), sid: r.id, answers: r.payload.answers
  }));
  return new Response(buildCsv(rows), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="questionnaire-responses.csv"', "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }
  });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (!sameOrigin(req) || !slugOk(b.slug as string)) return notFound();

  if (b.action === "login") {
    if (limited(req, "adm", 6, 10 * 60_000)) return json({ error: "Too many tries." }, 429);
    if (typeof b.password !== "string" || !safeEqual(b.password, cfg.adminPassword())) return json({ error: "Wrong password." }, 401);
    const res = json({ ok: true });
    res.cookies.set("q_adm", newCookie("adm", 12), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 12 * 3600 });
    return res;
  }
  if (!(await authed())) return notFound();
  if (b.action === "logout") {
    const res = json({ ok: true });
    res.cookies.delete("q_adm");
    return res;
  }
  if (b.action === "revoke") {
    await revokeInvite(String(b.id), b.revoked !== false);
    return json({ ok: true });
  }
  if (b.action === "invites") {
    if (!isOpen()) return json({ error: "Questionnaire is switched off." }, 400);
    const labels = String(b.labels ?? "").split("\n").map((l) => l.trim().slice(0, 80)).filter(Boolean).slice(0, 50);
    if (!labels.length) return json({ error: "Enter at least one name." }, 400);
    const rows = await createInvites(labels, b.singleUse === true, inviteToken);
    return json({ ok: true, count: rows.length });
  }
  return json({ error: "Unknown action." }, 400);
}
