import { cookies } from "next/headers";
import { cfg, cookieValid } from "@/lib/q/config";
import { esc } from "@/lib/q/email";
import { json, notFound, sameOrigin } from "@/lib/q/guard";
import { button, sendMail, siteOrigin, wrap } from "@/lib/guide/email";
import { approve, getById, patch } from "@/lib/guide/store";
import { normalize, type Status } from "@/lib/guide/types";

export const runtime = "nodejs";

// Same admin login as the questionnaire admin (signs the same cookie).
export async function POST(req: Request) {
  if (!sameOrigin(req) || !cfg.adminPassword() || !cookieValid((await cookies()).get("q_adm")?.value, "adm")) return notFound();
  const b = (await req.json().catch(() => ({}))) as { id?: string; action?: string; note?: string; verified?: boolean };
  const row = await getById(String(b.id ?? ""));
  if (!row) return json({ error: "Guide not found." }, 404);
  const name = normalize(row.data).p.displayName || "your portfolio";
  const note = typeof b.note === "string" ? b.note.slice(0, 1500) : "";
  const origin = siteOrigin(req);

  if (b.action === "verify") return (await patch(row.id, { verified: b.verified === true })) ? json({ ok: true }) : json({ error: "Failed." }, 502);

  const map: Record<string, Status> = { review: "under_review", approve: "approved", changes: "changes_required", suspend: "suspended" };
  const status = map[String(b.action)];
  if (!status) return json({ error: "Unknown action." }, 400);
  if (status === "approved") {
    const slug = await approve(row.id, name);
    if (!slug) return json({ error: "Could not approve." }, 502);
    await patch(row.id, { admin_note: note || null });
    await sendMail({ to: row.email, subject: "Your trekking guide portfolio is live", html: wrap("Approved", `<p>Your portfolio was approved and is now public.</p>${button(`${origin}/guides/${slug}`, "View my portfolio")}`) });
    return json({ ok: true, slug });
  }
  if (!(await patch(row.id, { status, admin_note: note || null }))) return json({ error: "Failed." }, 502);
  if (status === "changes_required") {
    await sendMail({ to: row.email, subject: "Changes needed on your trekking guide portfolio", html: wrap("Changes required", `<p>Please update your portfolio and submit it again.</p>${note ? `<p><b>Reviewer note:</b><br>${esc(note).replace(/\n/g, "<br>")}</p>` : ""}<p>Use the private link we emailed earlier, or request a new one from the Trekking Guide Portfolio page.</p>`) });
  }
  return json({ ok: true });
}
