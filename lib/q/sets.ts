// Picks the question set for a questionnaire variant: the original research questionnaire, the hospitality one,
// or the global tourist / tour guide questionnaires. Also holds the text for each questionnaire's card and welcome page.
import { GUIDE_IDS, GUIDE_QUESTIONS, GUIDE_QUICK_IDS, GUIDE_STEPS, TOTAL_GUIDE } from "./guide";
import { HOSPITALITY_IDS, HOSPITALITY_QUESTIONS, HOSPITALITY_QUICK_IDS, HOSPITALITY_STEPS, TOTAL_HOSPITALITY } from "./hospitality";
import { SHORT_IDS, SHORT_QUESTIONS, SHORT_QUICK_IDS, SHORT_STEPS, TOTAL_SHORT, type ShortQuestion, type ShortStep } from "./short";
import { TOTAL_TOURIST, TOURIST_IDS, TOURIST_QUESTIONS, TOURIST_QUICK_IDS, TOURIST_STEPS } from "./tourist";

/** "main" is the original questionnaire. The others are stored with these identifiers so responses can be filtered separately. */
export type Variant = "main" | "hospitality" | "global_tourist" | "tour_guide";
export const VARIANTS: Variant[] = ["main", "hospitality", "global_tourist", "tour_guide"];

export type Welcome = { title: string; sub: string; why: string[]; step2: string; rules: string[] };
export type CardInfo = { title: string; text: string; audience: string; minutes: string; path: string; icon: "hotel" | "globe" | "compass" };
export type QSet = {
  variant: Variant; steps: ShortStep[]; questions: ShortQuestion[]; ids: string[]; total: number; quick: string[];
  label: string; title: string; fieldLabel?: string; fieldHint?: string; welcome?: Welcome; card?: CardInfo;
};

const COMMON_RULES = [
  "There are no right or wrong answers. An honest answer is better than a perfect answer.",
  "You can write a few sentences or a full paragraph. A little detail helps me a lot.",
  "If you do not know an answer or do not want to answer, skip it.",
  "Please do not write real names or private details of other people. Write \u201ca tourist\u201d or \u201ca guide\u201d instead of a real name.",
  "You can answer in simple English. Short, clear sentences are perfect."
];

export const SETS: Record<Variant, QSet> = {
  main: { variant: "main", steps: SHORT_STEPS, questions: SHORT_QUESTIONS, ids: SHORT_IDS, total: TOTAL_SHORT, quick: SHORT_QUICK_IDS, label: "Research Questionnaire", title: "Knowledge, Problems and Solutions" },
  hospitality: {
    variant: "hospitality", steps: HOSPITALITY_STEPS, questions: HOSPITALITY_QUESTIONS, ids: HOSPITALITY_IDS, total: TOTAL_HOSPITALITY, quick: HOSPITALITY_QUICK_IDS,
    label: "Hospitality Questionnaire", title: "Hospitality Operations, Real Estate, and Technology",
    card: {
      title: "Hospitality, Real Estate and Technology",
      text: "A separate optional questionnaire: 12 open-ended questions, about 20-25 minutes. Already finished the main one? Take this one next.",
      audience: "Hospitality workers, tenants, property owners and anyone interested in apartments and hotels", minutes: "About 20-25 minutes", path: "hospitality", icon: "hotel"
    }
  },
  global_tourist: {
    variant: "global_tourist", steps: TOURIST_STEPS, questions: TOURIST_QUESTIONS, ids: TOURIST_IDS, total: TOTAL_TOURIST, quick: TOURIST_QUICK_IDS,
    label: "Global Tourist Questionnaire", title: "Global Tourist Experiences, Challenges & Technology Research",
    fieldLabel: "What do you do?", fieldHint: "For example student, teacher, engineer, business owner, retired. Write it in your own words.",
    card: {
      title: "Global Tourist Experiences",
      text: "Help us understand travellers' problems, cultural experiences, accommodation challenges, safety concerns, unexpected expenses, and how technology can improve tourism worldwide.",
      audience: "International tourists, domestic travellers, and people from any country", minutes: "About 15-20 minutes", path: "global-tourist", icon: "globe"
    },
    welcome: {
      title: "Global Tourist Experiences, Challenges & Technology Research",
      sub: "Prepared by Tsewang Bista | 15 questions | About 15-20 minutes | For travellers from any country",
      why: [
        "My name is Tsewang Bista. I am a Computing student and I run apartment and cafe businesses in Nepal. I am asking travellers from around the world about their problems, cultural experiences, accommodation challenges, safety concerns and unexpected expenses, and how technology could make tourism better for tourists and for local communities.",
        "Your real-life travel stories and your own ideas are very valuable to me."
      ],
      step2: "Answer the 15 questions in your own words. Tap an option where there are choices, or write a few sentences. Read the grey helper text if you are not sure.",
      rules: COMMON_RULES
    }
  },
  tour_guide: {
    variant: "tour_guide", steps: GUIDE_STEPS, questions: GUIDE_QUESTIONS, ids: GUIDE_IDS, total: TOTAL_GUIDE, quick: GUIDE_QUICK_IDS,
    label: "Tour Guide Questionnaire", title: "Global Tour Guide Perspectives, Tourist Challenges & Technology Research",
    fieldLabel: "Your role in tourism", fieldHint: "For example local guide, trekking guide, cultural guide, tour operator, hotel or travel staff.",
    card: {
      title: "Your Guide Perspective",
      text: "Help us understand tour guides' experiences with tourists, common behavioural and cultural challenges, the impact of tourism on local communities, and opportunities to improve the tourism industry through technology.",
      audience: "Tour guides, local guides, cultural guides, tour operators, and tourism professionals worldwide", minutes: "About 15-20 minutes", path: "tour-guide", icon: "compass"
    },
    welcome: {
      title: "Global Tour Guide Perspectives, Tourist Challenges & Technology Research",
      sub: "Prepared by Tsewang Bista | 15 questions | About 15-20 minutes | For guides and tourism professionals worldwide",
      why: [
        "My name is Tsewang Bista. I am a Computing student and I run apartment and cafe businesses in Nepal. I am asking tour guides and tourism professionals about their experiences with tourists, common behaviour and cultural challenges, the effect of tourism on local communities, and how technology could improve the industry.",
        "Your professional experience and your own ideas are very valuable to me."
      ],
      step2: "Answer the 15 questions in your own words. Tap an option where there are choices, or write a few sentences. Read the grey helper text if you are not sure.",
      rules: COMMON_RULES
    }
  }
};

export const ALL_IDS = VARIANTS.flatMap((v) => SETS[v].ids);

/** Works out which questionnaire a set of answers belongs to, from the question ids (H.. hospitality, T.. tourist, G.. guide). */
export function variantOf(answers: Record<string, unknown>): Variant {
  const keys = Object.keys(answers);
  for (const v of ["hospitality", "global_tourist", "tour_guide"] as Variant[]) {
    if (keys.some((k) => SETS[v].ids.includes(k))) return v;
  }
  return "main";
}

export const isVariant = (v: unknown): v is Variant => typeof v === "string" && (VARIANTS as string[]).includes(v);
