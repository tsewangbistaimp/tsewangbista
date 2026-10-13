// The short (5-10 minute) questionnaire: 15 questions in 5 parts, plus the longer Part 6 (hospitality, real estate and technology).
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
  },
  {
    key: "hospitality", part: "Part 6", title: "Hospitality Operations, Real Estate, and Technology", color: "#0e7490",
    intro: "This longer section takes about 20-25 minutes. Please write in your own words, share real-life examples where you can, and add your own ideas. There are no right or wrong answers, and you can skip anything. Please do not use real names or private details.",
    questions: [
      t("Q16", "What do you know about hospitality operations, and what does a normal day look like for the people who work in it?", "Think about front desk, housekeeping, kitchen or cafe, guest requests and managers. Share anything you have seen or experienced yourself."),
      t("Q17", "How are hospitality, real estate and property management connected?", "For example, how a guest stay, a rented apartment and the owner of the building depend on each other."),
      t("Q18", "What are the most common problems people face when looking for and renting an apartment?", "Think about price, location, trust, paperwork, deposits, finding information and talking to owners. A real example from you or someone you know is very helpful."),
      t("Q19", "How can technology improve customer service and daily operations in a hotel, cafe or apartment business?", "Think about bookings, payments, messages to guests, cleaning schedules, records and reports. Say what would be easier or faster."),
      t("Q20", "How could AI, automation and data make hospitality and real estate better?", "For example, answering guest questions, setting fair prices, predicting busy days, or matching people to the right place. Explain in your own words."),
      t("Q21", "What are the technology challenges and opportunities in your own field of study or work?", "Describe one challenge (for example cost, training or trust) and one opportunity you can see."),
      t("Q22", "Scenario: A guest arrives late at night, their room is not ready and the front desk is busy. What should the business do, and how could technology help?", "Write the steps you would take, and any tool that would make it smoother."),
      t("Q23", "Scenario: A person works night shifts, has a limited monthly budget and wants to be close to cafes and public transport. What kind of apartment would you recommend, and what would you ask them first?", "Think about budget, location, daily routine, noise, safety and personal preferences."),
      t("Q24", "If a website recommended apartments based on a person's lifestyle, what should it ask, and which details matter most?", "For example budget, area, work or study hours, travel time, food, pets, quiet or social, and furniture. Put the most important ones first."),
      t("Q25", "Scenario: A tenant reports the same maintenance problem again and again (for example no hot water), and the owner is hard to reach. How should this be handled, and what could prevent it next time?", "Think about who should act, how fast, and how a simple app or system could track and fix it."),
      t("Q26", "What new technology-based ideas or features would you suggest for my platform?", "My platform brings together apartment bookings and management, rooms, guests, finance, reports and a free portfolio service. Any idea is welcome, big or small."),
      t("Q27", "If you could add one feature to my platform tomorrow, what would it be, who would use it, and what real-life problem would it solve?", "Give one idea in your own words, with a real example if you can.")
    ]
  }
];

export const SHORT_QUESTIONS: ShortQuestion[] = SHORT_STEPS.flatMap((x) => x.questions);
export const SHORT_IDS = SHORT_QUESTIONS.map((x) => x.id);
export const TOTAL_SHORT = SHORT_QUESTIONS.length;
/** Short questions shown at the top of the email so the key answers can be scanned fast. */
export const SHORT_QUICK_IDS = ["Q6", "Q10", "Q11", "Q14"];
