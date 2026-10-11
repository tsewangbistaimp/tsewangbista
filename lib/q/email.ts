// Builds the submission email (HTML + plain text + JSON/CSV attachments) and sends it with Resend.
// The HTML mirrors a printed research form: bordered tables, light-blue section bars, label/value rows.
import { cfg } from "./config";
import { QUESTION_IDS, STEPS, ALL_QUESTIONS } from "./questions";
import { SHORT_QUESTIONS, SHORT_QUICK_IDS, SHORT_STEPS, TOTAL_SHORT } from "./short";
import type { Answers, Profile } from "./schema";

export type MailInput = {
  id: string;
  profile: Profile;
  answers: Answers;
  submittedAt: Date;
  durationSec?: number;
  inviteLabel?: string;
  draftConfirmed?: boolean;
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
  return `[Research Questionnaire] ${oneLine(i.profile.name)} | ${oneLine(i.profile.field)} | ${day}`;
}

type Src = "own" | "ai" | "edited";
const SRC_LABEL: Record<Src, string> = { own: "Written by respondent", ai: "AI draft, confirmed by respondent", edited: "AI draft, edited by respondent" };

/** Counts used in the summary card. */
export function stats(a: Answers) {
  const short = SHORT_QUESTIONS.filter((q) => a[q.id]).length;
  const detailed = ALL_QUESTIONS.filter((q) => a[q.id]);
  return {
    short, detailed: detailed.length,
    ai: detailed.filter((q) => a[q.id].source === "ai").length,
    edited: detailed.filter((q) => a[q.id].source === "edited").length
  };
}

const BORDER = "1px solid #222222";
const BAR = "#cfdcf0";
const FONT = "Arial, Helvetica, sans-serif";

const bar = (title: string, color = BAR) =>
  `<tr><td colspan="2" style="background:${color};border:${BORDER};padding:8px 10px;font:bold 14px ${FONT};color:#10233f;letter-spacing:.3px;text-transform:uppercase;">${esc(title)}</td></tr>`;
const row = (label: string, value: string) =>
  `<tr><td width="34%" style="border:${BORDER};padding:7px 10px;font:bold 13px ${FONT};color:#111;vertical-align:top;">${esc(label)}</td><td style="border:${BORDER};padding:7px 10px;font:13px ${FONT};color:#111;vertical-align:top;">${value}</td></tr>`;

function qrow(id: string, text: string, a?: { answer: string; choice?: string; source?: Src }) {
  const tag = a?.source && a.source !== "own" ? `<div style="font:bold 11px ${FONT};color:${a.source === "ai" ? "#8a5a00" : "#0b6b3a"};margin-bottom:4px;text-transform:uppercase;letter-spacing:.3px;">${esc(SRC_LABEL[a.source])}</div>` : "";
  const body = a
    ? `${tag}${a.choice ? `<div style="font:12px ${FONT};color:#10233f;margin-bottom:4px;"><b>Quick choice:</b> ${esc(a.choice)}</div>` : ""}${a.answer ? `<div style="font:14px/1.55 ${FONT};color:#111;">${multiline(a.answer)}</div>` : ""}`
    : `<div style="font:italic 13px ${FONT};color:#8a8a8a;">Skipped</div>`;
  return `<tr><td width="12%" style="border:${BORDER};padding:7px 8px;font:bold 13px ${FONT};color:#10233f;vertical-align:top;text-align:center;">${id}</td><td style="border:${BORDER};padding:8px 10px;vertical-align:top;"><div style="font:bold 13px/1.45 ${FONT};color:#333;margin-bottom:5px;">${esc(text)}</div>${body}</td></tr>`;
}

const table = (inner: string) => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:14px;">${inner}</table>`;

export function buildHtml(i: MailInput): string {
  const st = stats(i.answers);
  const p = i.profile;
  const roman = ["IV", "V", "VI", "VII", "VIII"];
  const quick = SHORT_QUICK_IDS.map((id) => SHORT_QUESTIONS.find((q) => q.id === id)!).map((q) => qrow(q.id, q.text, i.answers[q.id])).join("");
  const own = SHORT_STEPS.map((s) => s.questions.map((q) => qrow(q.id, q.text, i.answers[q.id])).join("")).join("");
  const detailed = STEPS.map((s, idx) =>
    table(bar(`${roman[idx]}. ${s.part}: ${s.title} (detailed)`) + s.groups.map((g) => g.questions.map((q) => qrow(q.id, q.text, i.answers[q.id])).join("")).join(""))
  ).join("");
  const confirm = st.ai + st.edited === 0 ? "Not applicable (no AI draft)" : i.draftConfirmed ? "Yes - respondent read and confirmed the AI draft" : "No";

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>Questionnaire response</title></head>
<body style="margin:0;padding:0;background:#eef1f6;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef1f6;"><tr><td align="center" style="padding:16px 8px;">
<table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:#ffffff;border:${BORDER};"><tr><td style="padding:18px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;"><tr>
<td style="vertical-align:top;font:bold 18px ${FONT};color:#10233f;padding-right:10px;">Knowledge, Problems and Solutions<br><span style="font:13px ${FONT};color:#555;">Research Questionnaire &middot; Tsewang Bista</span></td>
<td width="44%" style="vertical-align:top;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
<tr><td style="border:${BORDER};padding:5px 8px;font:bold 12px ${FONT};">Form No.: RQ-02</td></tr>
<tr><td style="border:${BORDER};padding:5px 8px;font:12px ${FONT};word-break:break-all;"><b>Submission ID:</b> ${esc(i.id)}</td></tr>
<tr><td style="border:${BORDER};padding:5px 8px;font:12px ${FONT};"><b>Date of Receipt:</b> ${esc(fmtDate(i.submittedAt, "Asia/Kathmandu"))}</td></tr></table></td></tr></table>
<div style="text-align:center;font:bold 16px ${FONT};color:#111;margin:20px 0 14px;letter-spacing:.5px;">RESPONDENT&rsquo;S ANSWER FORM</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">${bar("I. Respondent's Information")}
${row("Name of Respondent:", esc(p.name))}${row("Field of Study / Work:", esc(p.field))}${row("Email Address:", p.email ? `<a href="mailto:${esc(p.email)}" style="color:#1a4f9c;">${esc(p.email)}</a>` : '<span style="color:#8a8a8a;">Not given</span>')}${row("Date Written:", esc(p.date))}
${row("Submitted (Asia/Kathmandu):", esc(fmtDate(i.submittedAt, "Asia/Kathmandu")))}${row("Submitted (UTC):", esc(fmtDate(i.submittedAt, "UTC")))}${row("Time Taken:", esc(duration(i.durationSec)))}
${row("Short Questions Answered:", `<b>${st.short}</b> of ${TOTAL_SHORT}`)}${row("Detailed Answers:", `<b>${st.detailed}</b> of ${QUESTION_IDS.length} (AI drafts confirmed: ${st.ai}, edited by respondent: ${st.edited})`)}${row("AI Draft Confirmed:", esc(confirm))}${i.inviteLabel ? row("Invited As:", esc(i.inviteLabel)) : ""}
${row("Consent Given:", "Yes - answers may be used for this research project")}</table>
${table(bar("II. Quick View (key answers)", "#f6e3b4") + quick)}
${table(bar("III. Respondent's Own Answers (short form)") + own)}
${detailed}
<div style="font:11px ${FONT};color:#777;margin-top:16px;text-align:center;">Form No.: RQ-02 &nbsp;|&nbsp; Detailed answers marked &ldquo;AI draft&rdquo; were generated from the respondent&rsquo;s short answers, then read and confirmed by the respondent.<br>Attachments: response-${esc(i.id)}.json and response-${esc(i.id)}.csv</div>
</td></tr></table></td></tr></table></body></html>`;
}

type Item = { id: string; section: string; question: string; choice: string; answer: string; source: string };

/** Flat list of every question (short form first, then detailed) used by CSV, JSON and text. */
export function items(a: Answers): Item[] {
  const out: Item[] = [];
  const push = (id: string, section: string, question: string) => {
    const v = a[id];
    out.push({ id, section, question, choice: v?.choice ?? "", answer: v?.answer ?? "", source: v ? SRC_LABEL[(v.source ?? "own") as Src] : "" });
  };
  for (const s of SHORT_STEPS) for (const q of s.questions) push(q.id, `Short form - ${s.part}: ${s.title}`, q.text);
  for (const s of STEPS) for (const g of s.groups) for (const q of g.questions) push(q.id, `Detailed - ${s.part}: ${s.title}`, q.text);
  return out;
}

export function buildText(i: MailInput): string {
  const st = stats(i.answers);
  const L: string[] = [
    "RESPONDENT'S ANSWER FORM", "========================",
    `Name: ${i.profile.name}`, `Field: ${i.profile.field}`, `Email: ${i.profile.email || "Not given"}`, `Date written: ${i.profile.date}`,
    `Submitted (Asia/Kathmandu): ${fmtDate(i.submittedAt, "Asia/Kathmandu")}`, `Submitted (UTC): ${fmtDate(i.submittedAt, "UTC")}`,
    `Time taken: ${duration(i.durationSec)}`, `Short questions answered: ${st.short} of ${TOTAL_SHORT}`,
    `Detailed answers: ${st.detailed} of ${QUESTION_IDS.length} (AI drafts confirmed: ${st.ai}, edited: ${st.edited}, draft confirmed: ${i.draftConfirmed ? "yes" : "no"})`,
    `Submission ID: ${i.id}`, "", "QUICK VIEW", "----------"
  ];
  const fmt = (x: Item) => [`${x.id} | ${x.question}`, x.answer || x.choice ? `${x.source ? `(${x.source}) ` : ""}${x.choice ? `[Quick choice: ${x.choice}] ` : ""}${x.answer}` : "Skipped", ""];
  const all = items(i.answers);
  for (const id of SHORT_QUICK_IDS) L.push(...fmt(all.find((x) => x.id === id)!));
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
  const head = (multi ? ["Respondent", "Field", "Date", "ID"] : []).concat(["Question ID", "Section", "Question", "Quick Choice", "Answer", "Source"]);
  const out = [head.map(csvCell).join(",")];
  for (const r of rows) {
    for (const x of items(r.answers)) {
      const cells = (multi ? [r.respondent ?? "", r.field ?? "", r.date ?? "", r.sid ?? ""] : []).concat([x.id, x.section, x.question, x.choice, x.answer, x.source]);
      out.push(cells.map(csvCell).join(","));
    }
  }
  return "﻿" + out.join("\r\n");
}

export function buildJson(i: MailInput): string {
  return JSON.stringify(
    { id: i.id, submittedAt: i.submittedAt.toISOString(), durationSec: i.durationSec ?? null, draftConfirmed: i.draftConfirmed ?? false, profile: i.profile,
      answers: items(i.answers).map((x) => ({ id: x.id, section: x.section, question: x.question, quickChoice: x.choice || null, answer: x.answer || null, source: x.source || null })) },
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
