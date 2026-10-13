// Picks the question set for a questionnaire variant: the original research questionnaire or the hospitality one.
import { HOSPITALITY_IDS, HOSPITALITY_QUESTIONS, HOSPITALITY_QUICK_IDS, HOSPITALITY_STEPS, TOTAL_HOSPITALITY } from "./hospitality";
import { SHORT_IDS, SHORT_QUESTIONS, SHORT_QUICK_IDS, SHORT_STEPS, TOTAL_SHORT, type ShortQuestion, type ShortStep } from "./short";

export type Variant = "main" | "hospitality";
export type QSet = { variant: Variant; steps: ShortStep[]; questions: ShortQuestion[]; ids: string[]; total: number; quick: string[]; label: string };

export const SETS: Record<Variant, QSet> = {
  main: { variant: "main", steps: SHORT_STEPS, questions: SHORT_QUESTIONS, ids: SHORT_IDS, total: TOTAL_SHORT, quick: SHORT_QUICK_IDS, label: "Research Questionnaire" },
  hospitality: { variant: "hospitality", steps: HOSPITALITY_STEPS, questions: HOSPITALITY_QUESTIONS, ids: HOSPITALITY_IDS, total: TOTAL_HOSPITALITY, quick: HOSPITALITY_QUICK_IDS, label: "Hospitality Questionnaire" }
};

export const ALL_IDS = [...SHORT_IDS, ...HOSPITALITY_IDS];

/** Works out which questionnaire a set of answers belongs to (hospitality ids start with "H"). */
export function variantOf(answers: Record<string, unknown>): Variant {
  return Object.keys(answers).some((k) => HOSPITALITY_IDS.includes(k)) ? "hospitality" : "main";
}
