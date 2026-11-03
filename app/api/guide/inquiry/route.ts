import { z } from "zod";
import { cfg } from "@/lib/q/config";
import { esc } from "@/lib/q/email";
import { json, limited, sameOrigin } from "@/lib/q/guard";
import { sendMail, wrap } from "@/lib/guide/email";
import { getApprovedBySlug, saveInquiry } from "@/lib/guide/store";
import { normalize } from "@/lib/guide/types";

export const runtime = "nodejs";

const t = (n: number) => z.string().trim().max(n).default("");
const schema = z.object({
  slug: z.string().max(80), pkg: t(60), kind: z.string().trim().min(1, "Please choose a request type.").max(60),
  name: z.string().trim().min(2, "Please enter your name.").max(120), email: z.string().trim().email("Please enter a valid email address.").max(160),
  country: t(80), phone: t(40), travelDate: t(80), groupSize: t(40),
  message: z.string().trim().min(10, "Please write a short message.").max(2000), website_hp: z.string().max(200).optional()
});

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "Not allowed." }, 403);
  if (limited(req, "guide-inq", 6, 60 * 60_000)) return json({ error: "Too many requests. Please try again later." }, 429);
  const p = schema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return json({ error: p.error.issues[0]?.message ?? "Please check the form." }, 400);
  const d = p.data;
  if (d.website_hp) return json({ ok: true });
  const g = await getApprovedBySlug(d.slug);
  if (!g) return json({ error: "This guide is not available." }, 404);
  const ok = await saveInquiry({ guide_id: g.id, package_id: d.pkg || null, kind: d.kind, name: d.name, email: d.email, country: d.country || null, phone: d.phone || null, travel_date: d.travelDate || null, group_size: d.groupSize || null, message: d.message });
  if (!ok) return json({ error: "We could not save your request. Please try again." }, 502);
  const name = normalize(g.data).p.displayName || "the guide";
  const body = `<p><b>${esc(d.kind)}</b> for ${esc(name)}${d.pkg ? ` (package ${esc(d.pkg)})` : ""}</p><p>From: ${esc(d.name)} (${esc(d.email)})<br>Country: ${esc(d.country)}<br>Phone: ${esc(d.phone)}<br>Travel date: ${esc(d.travelDate)}<br>Group size: ${esc(d.groupSize)}</p><p>${esc(d.message).replace(/\n/g, "<br>")}</p><p style="color:#666;font-size:12px">This is a request, not a confirmed booking.</p>`;
  await sendMail({ to: g.email, subject: `New request from ${d.name}`, replyTo: d.email, html: wrap("New trekking request", body) });
  if (cfg.recipient()) await sendMail({ to: cfg.recipient(), subject: `[Guide inquiry] ${name}`, replyTo: d.email, html: wrap("New guide inquiry (copy)", body) });
  return json({ ok: true });
}
