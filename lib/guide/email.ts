import { cfg } from "../q/config";
import { esc } from "../q/email";

const FONT = "Arial, Helvetica, sans-serif";

export async function sendMail(opts: { to: string; subject: string; html: string; replyTo?: string; key?: string }): Promise<boolean> {
  if (!cfg.resendKey()) return false;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.resendKey()}`, "Content-Type": "application/json", ...(opts.key ? { "Idempotency-Key": opts.key } : {}) },
      body: JSON.stringify({
        from: cfg.mailFrom().replace("Questionnaire Website", "Trekking Guide Portfolio"),
        to: [opts.to], subject: opts.subject, html: opts.html, ...(opts.replyTo ? { reply_to: opts.replyTo } : {})
      })
    });
    return r.ok;
  } catch {
    return false;
  }
}

export const wrap = (title: string, body: string) =>
  `<div style="font-family:${FONT};max-width:620px;margin:auto;color:#111;line-height:1.6"><h2 style="margin:0 0 12px">${esc(title)}</h2>${body}</div>`;
export const button = (href: string, label: string) =>
  `<p><a href="${esc(href)}" style="background:#111;color:#fff;padding:12px 22px;border-radius:99px;text-decoration:none;font-weight:bold;display:inline-block">${esc(label)}</a></p>`;

export function siteOrigin(req: Request): string {
  const env = cfg.siteUrl();
  if (/^https?:\/\//.test(env)) return env.replace(/\/$/, "");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "www.tsewangbista.com";
  return `${req.headers.get("x-forwarded-proto") ?? "https"}://${host}`;
}
