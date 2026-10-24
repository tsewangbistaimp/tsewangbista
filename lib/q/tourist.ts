// The Global Tourist Experiences, Challenges & Technology Research questionnaire (15 questions in 4 parts).
import type { ShortQuestion, ShortStep } from "./short";

const t = (id: string, text: string, helper: string): ShortQuestion => ({ id, text, helper, kind: "text" });
const s = (id: string, text: string, helper: string, choices: string[]): ShortQuestion => ({ id, text, helper, kind: "single", choices });
const m = (id: string, text: string, helper: string, choices: string[]): ShortQuestion => ({ id, text, helper, kind: "multi", choices });

export const TOURIST_STEPS: ShortStep[] = [
  {
    key: "tourist-travel", part: "Part 1", title: "Your Travels", color: "#0e7490",
    intro: "Tell me a little about where you are from and how you travel. You can skip any question you do not want to answer.",
    questions: [
      t("T1", "Which country are you from?", "Write your country. Your city or region is optional."),
      s("T2", "Have you travelled internationally or within your own country?", "Tap the closest option.", ["Both internationally and within my own country", "Mostly internationally", "Mostly within my own country", "I have not travelled much yet"]),
      t("T3", "What are the biggest problems you experience while travelling?", "Think about planning, transport, language, money, safety, food or finding information. A real example helps.")
    ]
  },
  {
    key: "tourist-culture", part: "Part 2", title: "Experiences and Culture", color: "#c2572b",
    intro: "Real situations are the most useful answers. Please do not use real names or private details.",
    questions: [
      t("T4", "Describe a frustrating or disappointing travel experience and how it could have been improved.", "Say what happened, where, and what would have made it better."),
      t("T5", "What mistakes do tourists commonly make when visiting another country or community?", "For example behaviour, clothing, photos, bargaining, noise, or not respecting local rules."),
      t("T6", "Have you witnessed misunderstandings between tourists and local people due to cultural differences?", "Describe what happened and why you think it happened. If not, you can write 'No' or skip."),
      t("T7", "What should tourists learn about a destination before visiting?", "Think about customs, greetings, dress, religion, laws, tipping, safety and local etiquette."),
      t("T8", "How can tourism benefit local communities without negatively affecting residents or the environment?", "Think about jobs, fair prices, crowds, waste, nature, local businesses and respect for local life.")
    ]
  },
  {
    key: "tourist-stay", part: "Part 3", title: "Stays, Safety and Money", color: "#1f8a70",
    intro: "Tell me about finding places to stay, feeling safe, and paying while you travel.",
    questions: [
      t("T9", "What difficulties have you experienced when finding or booking accommodation?", "For example unclear prices, photos that did not match, hidden fees, cancellation rules, language or trust."),
      t("T10", "What concerns you most when travelling in an unfamiliar destination?", "Think about safety, health, getting lost, scams, language, food, weather or anything else."),
      s("T11", "Have unexpected expenses or payment problems affected your travel experience?", "Tap the closest option.", ["Yes, often", "Sometimes", "Rarely", "Never", "Not sure"])
    ]
  },
  {
    key: "tourist-tech", part: "Part 4", title: "Technology and Ideas", color: "#7a4fb5",
    intro: "Think about the tools you use and the tools you wish existed. There is no need to know anything technical.",
    questions: [
      m("T12", "What digital tools do you currently use when travelling?", "Tap all that apply.", ["Maps and navigation", "Booking apps or websites", "Translation apps", "Payment or banking apps", "Social media", "AI chat tools", "Review websites", "Ride or transport apps", "Weather apps", "Other", "None"]),
      t("T13", "If technology could solve one major travel problem, what would you want it to solve?", "Choose one problem and explain why it matters to you."),
      m("T14", "Which features would be most useful in a global travel platform?", "Tap all that apply.", ["Real-time translation", "Local etiquette and culture guide", "Verified safe accommodation", "Clear prices with no hidden fees", "Trusted local guides", "Offline maps", "Emergency help", "AI trip planner", "Ratings and feedback from travellers and locals", "Responsible tourism tips", "Other"]),
      t("T15", "If you could change one thing about tourism worldwide, what would you change and how could technology help?", "Share your own idea in a few sentences.")
    ]
  }
];

export const TOURIST_QUESTIONS: ShortQuestion[] = TOURIST_STEPS.flatMap((x) => x.questions);
export const TOURIST_IDS = TOURIST_QUESTIONS.map((x) => x.id);
export const TOTAL_TOURIST = TOURIST_QUESTIONS.length;
/** Key answers shown at the top of the email. */
export const TOURIST_QUICK_IDS = ["T3", "T4", "T13", "T15"];
