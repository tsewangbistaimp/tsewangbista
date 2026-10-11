// The short (5-10 minute) questionnaire. Its answers feed an AI draft of the 57 detailed answers,
// which the respondent then reads, edits and confirms before submitting.
export type ShortQuestion = {
  id: string;
  text: string;
  helper: string;
  kind: "text" | "single" | "multi";
  choices?: string[];
};

export type ShortStep = { key: string; part: string; title: string; intro: string; color: string; questions: ShortQuestion[] };

const A6 = ["Classes or teachers", "Books or reading", "Practice or work", "Other people", "Internet or videos", "My own mistakes", "A mix of these"];
const B7 = ["Essential for life or safety", "Very important", "Important", "Somewhat important", "Not sure"];
const C9 = ["Daily", "Weekly", "Monthly", "A few times a year", "Rarely", "Not sure"];
const C10 = ["Minor inconvenience", "Moderate problem", "Serious problem", "Very serious or harmful", "Not sure"];
const D6 = ["Yes - a lot", "Partly", "Not really", "Not sure"];
const D7 = ["Mobile app", "Website", "Desktop software", "AI-powered tool", "Business or service (not software)", "Educational platform", "A combination", "Other", "Not sure"];
const F4 = ["Yes", "Maybe - ask first", "No"];
export const PROBLEM_KINDS = [
  "Waste of time", "Extra cost or fees", "Tasks done by hand or on paper", "Confusing rules or steps", "Missing tools or equipment",
  "Not enough training or knowledge", "People cannot reach the service", "Safety or trust concerns", "Other"
];

const t = (id: string, text: string, helper: string): ShortQuestion => ({ id, text, helper, kind: "text" });
const s = (id: string, text: string, helper: string, choices: string[]): ShortQuestion => ({ id, text, helper, kind: "single", choices });

export const SHORT_STEPS: ShortStep[] = [
  {
    key: "knowledge", part: "Part 1", title: "Knowledge and Study", color: "#2f6fbd",
    intro: "Tell me a little about your subject and what you have learned.",
    questions: [
      t("Q1", "What is your field, and what do you do or study in it?", "Two or three sentences is enough. Example (from another field, for illustration only): 'Civil engineering - I design roads and bridges.'"),
      s("Q2", "Where did you learn most of what you know?", "Tap the closest option.", A6),
      t("Q3", "What do you know about your field that most ordinary people do not?", "One fact, habit or warning that would help people if they knew it.")
    ]
  },
  {
    key: "importance", part: "Part 2", title: "Importance", color: "#1f8a70",
    intro: "Explain why your field matters in people's daily lives.",
    questions: [
      s("Q4", "How important is your field for people's lives?", "Tap the closest option.", B7),
      t("Q5", "Who depends on your work, and what could go wrong if it is done badly?", "Think of the people affected and one real consequence.")
    ]
  },
  {
    key: "problems", part: "Part 3", title: "Problems", color: "#c2572b",
    intro: "Real situations are the most useful answers. Please do not use real names or private details.",
    questions: [
      t("Q6", "What are the biggest problems you have noticed in your field?", "Write the ones that come up again and again. Say what happened and who was affected. Example (illustration only): 'Patients forget to take medicine on time.'"),
      { id: "Q7", text: "What kind of problems are they?", helper: "Tap all that apply.", kind: "multi", choices: PROBLEM_KINDS },
      s("Q8", "How often do these problems happen?", "Tap the closest option.", C9),
      s("Q9", "How serious are they?", "Tap the closest option.", C10),
      t("Q10", "Which problem would you want solved first, and why?", "Pick one problem and explain why it matters most.")
    ]
  },
  {
    key: "solutions", part: "Part 4", title: "Solutions", color: "#7a4fb5",
    intro: "Think about the problem you chose above. A solution can be a website, software, an AI tool, a service, training or a change in how things are done.",
    questions: [
      t("Q11", "What solution would you suggest, and who would use it?", "Describe your idea in 2-4 sentences. It does not have to be an app."),
      s("Q12", "Would technology help solve this problem?", "'Not really' is a valid and useful answer.", D6),
      s("Q13", "What type of solution would people prefer?", "Tap the closest option.", D7)
    ]
  },
  {
    key: "future", part: "Part 5", title: "Next Generation", color: "#b8860b",
    intro: "Think about the future of your field.",
    questions: [
      t("Q14", "How should your field improve for the next generation, and what should always stay with qualified people?", "Think about tools, teaching, skills and what technology should never replace."),
      s("Q15", "May I contact you again to discuss your answers?", "You can add details in your own words on the next screen if you like.", F4)
    ]
  }
];

export const SHORT_QUESTIONS: ShortQuestion[] = SHORT_STEPS.flatMap((x) => x.questions);
export const SHORT_IDS = SHORT_QUESTIONS.map((x) => x.id);
export const TOTAL_SHORT = SHORT_QUESTIONS.length;
/** Short questions shown at the top of the email so the key answers can be scanned fast. */
export const SHORT_QUICK_IDS = ["Q6", "Q10", "Q11", "Q14"];

/** Quick-choice answers in the short form that directly fill the matching detailed question. */
export const CHOICE_MAP: Record<string, string> = { A6: "Q2", B7: "Q4", C9: "Q8", C10: "Q9", D6: "Q12", D7: "Q13", F4: "Q15" };
