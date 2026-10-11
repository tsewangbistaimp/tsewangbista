// Personalised end-of-form tips. Uses Claude when ANTHROPIC_API_KEY is set, otherwise helpful fixed tips.
import { cfg } from "./config";
import { SHORT_QUESTIONS, SHORT_QUICK_IDS } from "./short";
import type { Answers, Profile } from "./schema";

const FALLBACK = [
  "Pick the one problem from your answers that costs people the most time or money and write it as a single sentence. A clear problem statement is the first step to a useful solution.",
  "Talk to two or three colleagues about the problem you chose. If they recognise it, it is probably real and worth solving.",
  "Keep a simple log for one week of how often the problem happens and how long it takes to handle. Small numbers make strong evidence.",
  "Before choosing any tool, ask whether a better process, a checklist or some training could solve part of it. Technology works best when the process is already clear.",
  "Share what you know with the next generation: even one short mentoring conversation or written guide helps new people avoid the mistakes you learned from."
];

export async function buildAdvice(profile: Profile, answers: Answers): Promise<{ tips: string[]; source: "ai" | "default" }> {
  if (!cfg.anthropicKey()) return { tips: FALLBACK, source: "default" };
  const key = SHORT_QUICK_IDS.map((id) => `${SHORT_QUESTIONS.find((q) => q.id === id)?.text}\n${answers[id]?.answer ?? "(skipped)"}`).join("\n\n");
  const prompt = `A person working or studying in "${profile.field}" answered a research questionnaire. Their key answers:\n${key}\n\nWrite 4 to 5 short, practical, encouraging pieces of advice specific to their field and what they wrote (problems, solution idea, improvements for the next generation). Each is 1-2 plain sentences. Do not give medical, legal or financial instructions. Reply with ONLY a JSON array of strings.`;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 12_000);
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: ctl.signal,
      headers: { "x-api-key": cfg.anthropicKey(), "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: cfg.anthropicModel(), max_tokens: 600, messages: [{ role: "user", content: prompt }] })
    });
    clearTimeout(t);
    if (!r.ok) return { tips: FALLBACK, source: "default" };
    const data = (await r.json()) as { content?: { text?: string }[] };
    const raw = data.content?.[0]?.text ?? "";
    const tips = JSON.parse(raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1)) as unknown;
    if (Array.isArray(tips) && tips.length && tips.every((x) => typeof x === "string")) {
      return { tips: (tips as string[]).slice(0, 5).map((x) => x.slice(0, 400)), source: "ai" };
    }
  } catch {
    /* fall through to default tips */
  }
  return { tips: FALLBACK, source: "default" };
}
