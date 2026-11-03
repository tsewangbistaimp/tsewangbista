import { cfg } from "../q/config";
import { esc } from "../q/email";
import type { TrekInput } from "./schema";

const FONT = "Arial, Helvetica, sans-serif";
const line = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
const ml = (s: string) => esc(s).replace(/\n/g, "<br>");
const row = (l: string, v: string) =>
  `<tr><td width="30%" style="border:1px solid #ddd;padding:7px 10px;font:bold 13px ${FONT};vertical-align:top;background:#fafafa">${esc(l)}</td><td style="border:1px solid #ddd;padding:7px 10px;font:13px/1.5 ${FONT};vertical-align:top">${v ? ml(v) : '<span style="color:#999">-</span>'}</td></tr>`;

export function buildHtml(d: TrekInput, id: string): string {
  return `<div style="font-family:${FONT};max-width:720px;margin:auto;color:#111">
<h2 style="margin:0 0 4px">New trekking enquiry</h2><div style="color:#666;font:12px ${FONT}">Reference ${esc(id)} · enquiry only, not a confirmed booking</div>
<table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:14px">
${row("Name", d.name)}${row("Email", d.email)}${row("Phone / WhatsApp", d.phone)}${row("Country", d.country)}
${row("Trek", d.trek)}${row("Trip type", d.tripType)}${row("Preferred dates", d.dates)}${row("Duration", d.duration)}
${row("Group size", d.groupSize)}${row("Trekking experience", d.experience)}${row("Accommodation", d.accommodation)}${row("Budget", d.budget)}
${row("Special requirements", d.requirements)}${row("Message", d.message)}
</table></div>`;
}

export async function sendEnquiry(d: TrekInput, id: string): Promise<{ ok: boolean; detail: string }> {
  if (!cfg.resendKey() || !cfg.recipient()) return { ok: false, detail: "Email is not configured" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.resendKey()}`, "Content-Type": "application/json", "Idempotency-Key": `trek-${id}` },
      body: JSON.stringify({
        from: cfg.mailFrom().replace("Questionnaire Website", "Trekking Enquiry"),
        to: [cfg.recipient()],
        reply_to: d.email,
        subject: `[Trekking] ${line(d.name)} | ${line(d.trek)}`,
        html: buildHtml(d, id)
      })
    });
    return r.ok ? { ok: true, detail: "sent" } : { ok: false, detail: `Resend ${r.status}` };
  } catch {
    return { ok: false, detail: "Could not reach Resend" };
  }
}
