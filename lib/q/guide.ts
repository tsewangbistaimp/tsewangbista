// The Global Tour Guide Perspectives, Tourist Challenges & Technology Research questionnaire (15 questions in 4 parts).
import type { ShortQuestion, ShortStep } from "./short";

const t = (id: string, text: string, helper: string): ShortQuestion => ({ id, text, helper, kind: "text" });
const s = (id: string, text: string, helper: string, choices: string[]): ShortQuestion => ({ id, text, helper, kind: "single", choices });
const m = (id: string, text: string, helper: string, choices: string[]): ShortQuestion => ({ id, text, helper, kind: "multi", choices });

export const GUIDE_STEPS: ShortStep[] = [
  {
    key: "guide-work", part: "Part 1", title: "Your Work", color: "#0e7490",
    intro: "Tell me about your work as a guide or tourism professional. You can skip any question you do not want to answer.",
    questions: [
      t("G1", "Which country do you work in, and what types of tours do you provide?", "For example city tours, trekking, cultural or heritage tours, wildlife, food or religious tours."),
      s("G2", "How long have you worked in the tourism industry?", "Tap the closest option.", ["Less than 1 year", "1 to 3 years", "4 to 10 years", "More than 10 years"]),
      m("G3", "What types of tourists do you usually work with?", "Tap all that apply.", ["Solo travellers", "Couples", "Families", "Groups of friends", "School or student groups", "Budget or backpacker travellers", "Luxury travellers", "Adventure or trekking travellers", "Cultural or religious visitors", "Business or corporate groups", "Other"])
    ]
  },
  {
    key: "guide-tourists", part: "Part 2", title: "Working with Tourists", color: "#c2572b",
    intro: "Real situations are the most useful answers. Please do not use real names or private details of tourists or colleagues.",
    questions: [
      t("G4", "What are the most common problems you experience when working with tourists?", "Think about time, expectations, communication, safety, money and behaviour."),
      t("G5", "What tourist behaviours do you find challenging, and why do you think they occur?", "Describe the behaviour and what you think is behind it."),
      t("G6", "Have you experienced conflicts or misunderstandings with tourists? If yes, what happened?", "Say what happened and how it was handled. If not, you can write 'No' or skip."),
      t("G7", "What do tourists most often misunderstand about your country's culture, people, or traditions?", "Give one or two examples."),
      t("G8", "What do tourists appreciate most about your work, and what do they complain about?", "Write both the good feedback and the complaints you hear.")
    ]
  },
  {
    key: "guide-community", part: "Part 3", title: "Your Profession and Community", color: "#1f8a70",
    intro: "Tell me about the challenges in your profession and the effect of tourism on your community.",
    questions: [
      t("G9", "What are the biggest professional challenges you face as a tour guide?", "Think about income, seasons, competition, training, licences, working hours or respect for your profession."),
      t("G10", "How does tourism affect your local community?", "Think about both benefits and difficulties, for example jobs, prices, crowds, culture, waste and nature."),
      t("G11", "What changes would make tourists more respectful and responsible?", "Think about information before the trip, rules, guides, signs, payments or education.")
    ]
  },
  {
    key: "guide-tech", part: "Part 4", title: "Technology and Ideas", color: "#7a4fb5",
    intro: "Think about the tools you use and the tools that would help you. There is no need to know anything technical.",
    questions: [
      m("G12", "What technology or digital tools do you currently use in your work?", "Tap all that apply.", ["WhatsApp or messaging apps", "Maps and navigation", "Booking websites or apps", "Translation apps", "Payment or banking apps", "Social media for marketing", "Itinerary or planning tools", "Weather apps", "Review websites", "AI tools", "Other", "I mostly work without technology"]),
      t("G13", "What is the biggest problem in your work that technology could help solve?", "Choose one problem and explain why it matters."),
      m("G14", "Which technology features would help you work more effectively and improve tourists' experiences?", "Tap all that apply.", ["Getting bookings and clients easily", "Real-time translation", "Pre-trip information for tourists about local culture", "Clear and safe payments", "Group communication tools", "Itinerary and schedule tools", "Ratings and feedback from tourists", "Emergency help and alerts", "Offline maps and guides", "Training and certification", "Other"]),
      t("G15", "If you could create one technology to improve relationships between tourists, guides, and local communities, what would it do?", "Describe your idea in a few sentences.")
    ]
  }
];

export const GUIDE_QUESTIONS: ShortQuestion[] = GUIDE_STEPS.flatMap((x) => x.questions);
export const GUIDE_IDS = GUIDE_QUESTIONS.map((x) => x.id);
export const TOTAL_GUIDE = GUIDE_QUESTIONS.length;
/** Key answers shown at the top of the email. */
export const GUIDE_QUICK_IDS = ["G4", "G9", "G13", "G15"];
