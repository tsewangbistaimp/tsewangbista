import { cfg } from "../q/config";
import { esc } from "../q/email";
import type { PortfolioInput } from "./schema";

const FONT = "Arial, Helvetica, sans-serif";
const line = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
const ml = (s: string) => esc(s).replace(/\n/g, "<br>");
const dash = (s: string) => (s ? ml(s) : '<span style="color:#999">-</span>');
const row = (l: string, v: string) =>
  `<tr><td width="30%" style="border:1px solid #ddd;padding:7px 10px;font:bold 13px ${FONT};vertical-align:top;background:#fafafa">${esc(l)}</td><td style="border:1px solid #ddd;padding:7px 10px;font:13px/1.5 ${FONT};vertical-align:top">${dash(v)}</td></tr>`;
const section = (title: string, rows: string) =>
  `<h3 style="font:bold 14px ${FONT};margin:20px 0 6px;color:#7a4a00;text-transform:uppercase;letter-spacing:.4px">${esc(title)}</h3><table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">${rows}</table>`;

export function subject(d: PortfolioInput) {
  return `[Free Portfolio] ${line(d.name)} | ${line(d.headline)}`;
}

export function buildHtml(d: PortfolioInput, id: string): string {
  const exp = d.experience.filter((e) => e.role || e.org).map((e, i) => row(`Experience ${i + 1}`, `${e.role}${e.org ? " @ " + e.org : ""}${e.period ? " (" + e.period + ")" : ""}\n${e.details}`)).join("");
  const edu = d.education.filter((e) => e.school || e.degree).map((e, i) => row(`Education ${i + 1}`, `${e.degree}${e.school ? " - " + e.school : ""}${e.period ? " (" + e.period + ")" : ""}`)).join("");
  const proj = d.projects.filter((p) => p.title).map((p, i) => row(`Project ${i + 1}`, `${p.title}\n${p.details}\nLink: ${p.link || "-"}\nImage: ${p.image || "-"}`)).join("");
  return `<div style="font-family:${FONT};max-width:720px;margin:auto;color:#111">
<h2 style="margin:0 0 4px">New free portfolio request</h2><div style="color:#666;font:12px ${FONT}">Reference ${esc(id)}</div>
${section("About", row("Name", d.name) + row("Email", d.email) + row("Phone / WhatsApp", d.phone) + row("Location", d.location) + row("Headline", d.headline) + row("Bio", d.bio) + row("Photo link", d.photo))}
${section("Goals & style", row("Purpose", d.purpose) + row("Style", d.style) + row("Accent colour", d.colour) + row("Preferred domain / name", d.domain) + row("Inspiration", d.inspiration))}
${section("Skills & background", row("Skills", d.skills.join(", ")) + exp + edu + row("Achievements", d.achievements))}
${section("Work", (proj || row("Projects", "")) + row("Services offered", d.services))}
${section("Links", row("LinkedIn", d.linkedin) + row("GitHub", d.github) + row("Instagram", d.instagram) + row("Behance / Dribbble", d.behance) + row("Website", d.website) + row("CV / resume", d.resume) + row("Other", d.otherLinks))}
${section("Anything else", row("Notes", d.extra))}
</div>`;
}

export async function sendRequest(d: PortfolioInput, id: string): Promise<{ ok: boolean; detail: string }> {
  if (!cfg.resendKey() || !cfg.recipient()) return { ok: false, detail: "Email is not configured" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.resendKey()}`, "Content-Type": "application/json", "Idempotency-Key": `fp-${id}` },
      body: JSON.stringify({
        from: cfg.mailFrom().replace("Questionnaire Website", "Free Portfolio"),
        to: [cfg.recipient()],
        reply_to: d.email,
        subject: subject(d),
        html: buildHtml(d, id),
        attachments: [{ filename: `portfolio-${id}.json`, content: Buffer.from(JSON.stringify(d, null, 2)).toString("base64") }]
      })
    });
    if (r.ok) return { ok: true, detail: "sent" };
    return { ok: false, detail: `Resend ${r.status}` };
  } catch {
    return { ok: false, detail: "Could not reach Resend" };
  }
}
