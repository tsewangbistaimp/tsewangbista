// Builds the submission email (HTML + plain text + JSON/CSV attachments) and sends it with Resend.
// The HTML mirrors a printed research form: bordered tables, light-blue section bars, label/value rows.
import { cfg } from "./config";
import { SETS, variantOf, type Variant } from "./sets";
import type { Answers, Profile } from "./schema";

export type MailInput = {
  id: string;
  profile: Profile;
  answers: Answers;
  submittedAt: Date;
  durationSec?: number;
  inviteLabel?: string;
  variant?: Variant;
};

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();
const multiline = (s: string) => esc(s).replace(/\n/g, "<br>");

function fmtDate(d: Date, tz: string) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
}

export function duration(sec?: number): string {
  if (!sec || sec < 0) return "Not recorded";
  const m = Math.floor(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min ${sec % 60} s`;
}

export function subjectFor(i: MailInput): string {
  const day = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", day: "2-digit", month: "short", year: "numeric" }).format(i.submittedAt);
  return `[${SETS[i.variant ?? "main"].label}] ${oneLine(i.profile.name)} | ${oneLine(i.profile.field)} | ${day}`;
}

const BORDER = "1px solid #222222";
const BAR = "#cfdcf0";
const FONT = "Arial, Helvetica, sans-serif";

const bar = (title: string, color = BAR) =>
  `<tr><td colspan="2" style="background:${color};border:${BORDER};padding:8px 10px;font:bold 14px ${FONT};color:#10233f;letter-spacing:.3px;text-transform:uppercase;">${esc(title)}</td></tr>`;
const row = (label: string, value: string) =>
  `<tr><td width="34%" style="border:${BORDER};padding:7px 10px;font:bold 13px ${FONT};color:#111;vertical-align:top;">${esc(label)}</td><td style="border:${BORDER};padding:7px 10px;font:13px ${FONT};color:#111;vertical-align:top;">${value}</td></tr>`;

function qrow(id: string, text: string, a?: { answer: string; choice?: string }) {
  const body = a
    ? `${a.choice ? `<div style="font:12px ${FONT};color:#10233f;margin-bottom:4px;"><b>Quick choice:</b> ${esc(a.choice)}</div>` : ""}${a.answer ? `<div style="font:14px/1.55 ${FONT};color:#111;">${multiline(a.answer)}</div>` : ""}`
    : `<div style="font:italic 13px ${FONT};color:#8a8a8a;">Skipped</div>`;
  return `<tr><td width="12%" style="border:${BORDER};padding:7px 8px;font:bold 13px ${FONT};color:#10233f;vertical-align:top;text-align:center;">${id}</td><td style="border:${BORDER};padding:8px 10px;vertical-align:top;"><div style="font:bold 13px/1.45 ${FONT};color:#333;margin-bottom:5px;">${esc(text)}</div>${body}</td></tr>`;
}

const table = (inner: string) => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:14px;">${inner}</table>`;

export function buildHtml(i: MailInput): string {
  const answered = Object.keys(i.answers).length;
  const p = i.profile;
  const set = SETS[i.variant ?? "main"]; const TOTAL_SHORT = set.total;
  const quick = set.quick.map((id) => set.questions.find((q) => q.id === id)!).map((q) => qrow(q.id, q.text, i.answers[q.id])).join("");
  const roman = ["III", "IV", "V", "VI", "VII"];
  const sections = set.steps.map((s, idx) => table(bar(`${roman[idx]}. ${s.part}: ${s.title}`) + s.questions.map((q) => qrow(q.id, q.text, i.answers[q.id])).join(""))).join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>Questionnaire response</title></head>
<body style="margin:0;padding:0;background:#eef1f6;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef1f6;"><tr><td align="center" style="padding:16px 8px;">
<table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:#ffffff;border:${BORDER};"><tr><td style="padding:18px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;"><tr>
<td style="vertical-align:top;font:bold 18px ${FONT};color:#10233f;padding-right:10px;">${i.variant === "hospitality" ? "Hospitality Operations, Real Estate, and Technology" : "Knowledge, Problems and Solutions"}<br><span style="font:13px ${FONT};color:#555;">${set.label} &middot; Tsewang Bista</span></td>
<td width="44%" style="vertical-align:top;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
<tr><td style="border:${BORDER};padding:5px 8px;font:bold 12px ${FONT};">Form No.: RQ-02</td></tr>
<tr><td style="border:${BORDER};padding:5px 8px;font:12px ${FONT};word-break:break-all;"><b>Submission ID:</b> ${esc(i.id)}</td></tr>
<tr><td style="border:${BORDER};padding:5px 8px;font:12px ${FONT};"><b>Date of Receipt:</b> ${esc(fmtDate(i.submittedAt, "Asia/Kathmandu"))}</td></tr></table></td></tr></table>
<div style="text-align:center;font:bold 16px ${FONT};color:#111;margin:20px 0 14px;letter-spacing:.5px;">RESPONDENT&rsquo;S ANSWER FORM</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${bar("I. Respondent's Information")}
${row("Name of Respondent:", esc(p.name))}${row("Field of Study / Work:", esc(p.field))}${row("Email Address:", p.email ? `<a href="mailto:${esc(p.email)}" style="color:#1a4f9c;">${esc(p.email)}</a>` : '<span style="color:#8a8a8a;">Not given</span>')}${row("Date Written:", esc(p.date))}
${row("Submitted (Asia/Kathmandu):", esc(fmtDate(i.submittedAt, "Asia/Kathmandu")))}${row("Submitted (UTC):", esc(fmtDate(i.submittedAt, "UTC")))}${row("Time Taken:", esc(duration(i.durationSec)))}
${row("Questions Answered:", `<b>${answered}</b> of ${TOTAL_SHORT} (${Math.round((answered / TOTAL_SHORT) * 100)}% complete), ${TOTAL_SHORT - answered} skipped`)}${i.inviteLabel ? row("Invited As:", esc(i.inviteLabel)) : ""}
${row("Consent Given:", "Yes - answers may be used for this research project")}</table>
${table(bar("II. Quick View (key answers)", "#f6e3b4") + quick)}
${sections}
<div style="font:11px ${FONT};color:#777;margin-top:16px;text-align:center;">Form No.: RQ-02 &nbsp;|&nbsp; Attachments: response-${esc(i.id)}.json and response-${esc(i.id)}.csv</div>
</td></tr></table></td></tr></table></body></html>`;
}

type Item = { id: string; section: string; question: string; choice: string; answer: string };

/** Flat list of every question, used by CSV, JSON and plain text. */
export function items(a: Answers, variant: Variant = variantOf(a)): Item[] {
  return SETS[variant].steps.flatMap((s) =>
    s.questions.map((q) => ({ id: q.id, section: `${s.part}: ${s.title}`, question: q.text, choice: a[q.id]?.choice ?? "", answer: a[q.id]?.answer ?? "" }))
  );
}

export function buildText(i: MailInput): string {
  const set = SETS[i.variant ?? "main"]; const TOTAL_SHORT = set.total;
  const answered = Object.keys(i.answers).length;
  const L: string[] = [
    "RESPONDENT'S ANSWER FORM", "========================",
    `Name: ${i.profile.name}`, `Field: ${i.profile.field}`, `Email: ${i.profile.email || "Not given"}`, `Date written: ${i.profile.date}`,
    `Submitted (Asia/Kathmandu): ${fmtDate(i.submittedAt, "Asia/Kathmandu")}`, `Submitted (UTC): ${fmtDate(i.submittedAt, "UTC")}`,
    `Time taken: ${duration(i.durationSec)}`, `Answered: ${answered} of ${TOTAL_SHORT}`,
    `Submission ID: ${i.id}`, "", "QUICK VIEW", "----------"
  ];
  const fmt = (x: Item) => [`${x.id} | ${x.question}`, x.answer || x.choice ? `${x.choice ? `[Quick choice: ${x.choice}] ` : ""}${x.answer}` : "Skipped", ""];
  const all = items(i.answers, set.variant);
  for (const id of set.quick) L.push(...fmt(all.find((x) => x.id === id)!));
  let last = "";
  for (const x of all) {
    if (x.section !== last) { last = x.section; L.push(x.section.toUpperCase(), "-".repeat(30)); }
    L.push(...fmt(x));
  }
  return L.join("\n");
}

const csvCell = (v: string) => {
  // Prefix cells that look like formulas so Excel/Sheets never run them.
  const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
  return `"${safe.replace(/"/g, '""')}"`;
};

export function buildCsv(rows: { respondent?: string; field?: string; date?: string; sid?: string; answers: Answers }[]): string {
  const multi = rows.some((r) => r.respondent !== undefined);
  const head = (multi ? ["Respondent", "Field", "Date", "ID"] : []).concat(["Question ID", "Section", "Question", "Quick Choice", "Answer"]);
  const out = [head.map(csvCell).join(",")];
  for (const r of rows) {
    for (const x of items(r.answers)) {
      const cells = (multi ? [r.respondent ?? "", r.field ?? "", r.date ?? "", r.sid ?? ""] : []).concat([x.id, x.section, x.question, x.choice, x.answer]);
      out.push(cells.map(csvCell).join(","));
    }
  }
  return "﻿" + out.join("\r\n");
}

export function buildJson(i: MailInput): string {
  return JSON.stringify(
    { id: i.id, submittedAt: i.submittedAt.toISOString(), durationSec: i.durationSec ?? null, profile: i.profile,
      answers: items(i.answers, i.variant ?? variantOf(i.answers)).map((x) => ({ id: x.id, section: x.section, question: x.question, quickChoice: x.choice || null, answer: x.answer || null })) },
    null, 2
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Sends via Resend with 3 attempts and backoff. The detail never contains answer content. */
export async function sendEmail(i: MailInput): Promise<{ ok: boolean; detail: string }> {
  if (!cfg.resendKey()) return { ok: false, detail: "RESEND_API_KEY is missing in Vercel" };
  if (!cfg.recipient()) return { ok: false, detail: "RECIPIENT_EMAIL is missing in Vercel" };
  const body = {
    from: cfg.mailFrom(), to: [cfg.recipient()], subject: subjectFor(i), html: buildHtml(i), text: buildText(i),
    ...(i.profile.email ? { reply_to: i.profile.email } : {}),
    attachments: [
      { filename: `response-${i.id}.json`, content: Buffer.from(buildJson(i)).toString("base64") },
      { filename: `response-${i.id}.csv`, content: Buffer.from(buildCsv([{ answers: i.answers }])).toString("base64") }
    ]
  };
  let detail = "unknown error";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${cfg.resendKey()}`, "Content-Type": "application/json", "Idempotency-Key": `q-${i.id}` },
        body: JSON.stringify(body)
      });
      if (r.ok) return { ok: true, detail: "sent" };
      const t = (await r.text()).replace(/\s+/g, " ").slice(0, 200);
      detail = `Resend ${r.status}: ${t}`;
      console.error(`[questionnaire] email attempt ${attempt} failed: ${detail}`);
      if (r.status >= 400 && r.status < 500 && r.status !== 429) break; // retrying cannot fix a bad key or address
    } catch {
      detail = "Could not reach Resend";
      console.error(`[questionnaire] email attempt ${attempt} network error`);
    }
    if (attempt < 3) await sleep(600 * 2 ** attempt);
  }
  return { ok: false, detail };
}

/** Sends the respondent a thank-you note. Failure here never affects the submission. */
export async function sendThanks(i: MailInput): Promise<{ ok: boolean; detail: string }> {
  if (!cfg.resendKey() || !i.profile.email) return { ok: false, detail: "Not configured" };
  const set = SETS[i.variant ?? "main"]; const TOTAL_SHORT = set.total;
  const first = oneLine(i.profile.name.split(" ")[0] || "there");
  const answered = Object.keys(i.answers).length;
  const hospLink = i.variant !== "hospitality" && cfg.slug() ? `${(cfg.siteUrl() || "https://www.tsewangbista.com").replace(/\/$/, "")}/q/${cfg.slug()}/hospitality` : "";
  const link = (href: string, label: string) => `<a href="${href}" style="color:#b86e00;font-weight:bold;text-decoration:none;">${label}</a>`;
  const html = `<div style="font-family:${FONT};max-width:560px;margin:auto;color:#111;line-height:1.6">
<h2 style="margin:0 0 8px">Thank you, ${esc(first)}!</h2>
<p>Your answers have reached me (${answered} of ${TOTAL_SHORT} questions answered). I truly appreciate the time and thought you gave.</p>
<p>I may contact you at this email address with a few follow-up questions. If you would like your answers removed, just reply to this email.</p>
${hospLink ? `<p style="margin:18px 0 0">One more optional questionnaire (about 20-25 minutes): ${link(hospLink, "Hospitality Operations, Real Estate, and Technology")}</p>` : ""}
<p style="margin:20px 0 6px;font-weight:bold">Explore more</p>
<p style="margin:0">${link("https://www.tsewangbista.com", "My portfolio: tsewangbista.com")}<br>
${link("https://www.tsewangbista.com/services/free-portfolio", "Get a free portfolio website")}<br>
${link("https://jikmisapartment.tsewangbista.com/", "Jikmis Apartment, Boudha")}</p>
<p style="margin-top:24px">Warm regards,<br><b>Tsewang Bista</b></p></div>`;
  const text = `Thank you, ${first}!\n\nYour answers have reached me (${answered} of ${TOTAL_SHORT} questions answered). I may contact you here with follow-up questions. To have your answers removed, just reply to this email.\n\nMy portfolio: https://www.tsewangbista.com\nFree portfolio website: https://www.tsewangbista.com/services/free-portfolio\n\nWarm regards,\nTsewang Bista`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${cfg.resendKey()}`, "Content-Type": "application/json", "Idempotency-Key": `qthanks-${i.id}` },
      body: JSON.stringify({ from: cfg.mailFrom(), to: [i.profile.email], ...(cfg.recipient() ? { reply_to: cfg.recipient() } : {}), subject: "Thank you for completing my questionnaire", html, text })
    });
    return r.ok ? { ok: true, detail: "sent" } : { ok: false, detail: `Resend ${r.status}` };
  } catch {
    return { ok: false, detail: "Could not reach Resend" };
  }
}
