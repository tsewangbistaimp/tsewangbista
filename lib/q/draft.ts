// Turns the respondent's short answers into a draft of the 57 detailed answers.
// The draft is only ever a suggestion: the respondent must read, edit and confirm it.
import { cfg } from "./config";
import { STEPS } from "./questions";
import { SHORT_QUESTIONS } from "./short";
import type { Answers } from "./schema";

export type Drafts = Record<string, string>;

function summary(field: string, short: Answers): string {
  const lines = SHORT_QUESTIONS.map((q) => {
    const a = short[q.id];
    if (!a || (!a.answer && !a.choice)) return `${q.id}. ${q.text}\n(not answered)`;
    return `${q.id}. ${q.text}\n${a.choice ? `[Tapped: ${a.choice}] ` : ""}${a.answer}`;
  });
  return `Field: ${field}\n\n${lines.join("\n\n")}`;
}

async function draftStep(stepIndex: number, context: string): Promise<Drafts> {
  const qs = STEPS[stepIndex].groups.flatMap((g) => g.questions);
  const list = qs.map((q) => `${q.id}: ${q.text}`).join("\n");
  const prompt = `You are helping a research respondent turn their short answers into fuller written answers, in THEIR voice (first person, plain language). They will read and correct every answer before it is sent.

Their short answers:
${context}

Write an answer for each question below. Rules:
- Use only what the short answers state or clearly imply. Never invent facts, numbers, names, places, events or experiences.
- 1 to 4 plain sentences per answer. Keep their own wording where you can.
- If the short answers give no real basis for a question, use an empty string "" for it. Leaving it empty is better than guessing.
- Quick-choice questions: write only the explanation, not the option name.

Questions:
${list}

Reply with ONLY a JSON object mapping each question id to its answer string.`;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 45_000);
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctl.signal,
      headers: { "x-api-key": cfg.anthropicKey(), "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: cfg.anthropicModel(), max_tokens: 2200, messages: [{ role: "user", content: prompt }] })
    });
    if (!r.ok) return {};
    const data = (await r.json()) as { content?: { text?: string }[] };
    const raw = data.content?.[0]?.text ?? "";
    const obj = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1)) as Record<string, unknown>;
    const out: Drafts = {};
    for (const q of qs) if (typeof obj[q.id] === "string" && (obj[q.id] as string).trim()) out[q.id] = (obj[q.id] as string).slice(0, 1200);
    return out;
  } catch {
    return {};
  } finally {
    clearTimeout(timer);
  }
}

/** Returns null when AI drafting is unavailable or failed completely. */
export async function buildDrafts(field: string, short: Answers): Promise<Drafts | null> {
  if (!cfg.anthropicKey()) return null;
  const ctx = summary(field, short);
  const parts = await Promise.all(STEPS.map((_, i) => draftStep(i, ctx)));
  const merged = Object.assign({}, ...parts) as Drafts;
  return Object.keys(merged).length ? merged : null;
}
