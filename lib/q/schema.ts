import { z } from "zod";
import { SHORT_IDS, SHORT_QUESTIONS } from "./short";

export const MAX_ANSWER_CHARS = 5000;

/** Strip HTML/script, control characters and excess whitespace. Line breaks are preserved. */
export function clean(input: string, max = MAX_ANSWER_CHARS): string {
  return input
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

const text = (max: number) => z.string().max(max * 2).transform((v) => clean(v, max));

export const answerSchema = z.object({
  answer: text(MAX_ANSWER_CHARS).default(""),
  choice: text(400).optional()
});

export const profileSchema = z.object({
  name: text(120).refine((v) => v.length >= 2, "Please enter your full name."),
  field: text(160).refine((v) => v.length >= 2, "Please tell me your field of study or work."),
  email: z
    .string()
    .max(200)
    .transform((v) => v.trim())
    .refine((v) => v === "" || /^[^\s@<>,;:"]+@[^\s@<>,;:"]+\.[^\s@<>,;:"]+$/.test(v), "Please enter a valid email or leave it empty.")
    .default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date."),
  consent: z.literal(true, { errorMap: () => ({ message: "Please tick the consent box to continue." }) })
});

export const submissionSchema = z.object({
  idempotencyKey: z.string().uuid(),
  startedAt: z.string().datetime().optional(),
  inviteToken: z.string().max(80).optional(),
  website: z.string().max(0).optional(), // honeypot: real people leave this empty
  profile: profileSchema,
  answers: z
    .record(answerSchema)
    .refine((r) => Object.keys(r).every((k) => SHORT_IDS.includes(k)), "Unknown question id.")
});

export type Profile = z.infer<typeof profileSchema>;
export type Submission = z.infer<typeof submissionSchema>;
export type Answers = Submission["answers"];

/** Drop empty answers and invalid quick-choice values so only real data is stored/sent. */
export function normaliseAnswers(a: Answers): Answers {
  const out: Answers = {};
  for (const q of SHORT_QUESTIONS) {
    const v = a[q.id];
    if (!v) continue;
    let choice: string | undefined;
    if (v.choice && q.choices) {
      const picked = v.choice.split("; ").filter((c) => q.choices!.includes(c));
      choice = (q.kind === "multi" ? picked : picked.slice(0, 1)).join("; ") || undefined;
    }
    if (v.answer || choice) out[q.id] = { answer: v.answer, ...(choice ? { choice } : {}) };
  }
  return out;
}

export function countAnswered(a: Answers): number {
  return Object.keys(a).length;
}
