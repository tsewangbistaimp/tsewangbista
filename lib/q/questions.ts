// The 57-question bank. IDs, order and wording are fixed by the research brief.
export type Question = {
  id: string;
  text: string;
  helper: string;
  choices?: string[];
};

export type Group = { code: string; title: string; questions: Question[] };

export type Step = {
  key: string;
  title: string;
  part: string;
  intro: string;
  color: string;
  groups: Group[];
};

const q = (id: string, text: string, helper: string, choices?: string[]): Question => ({ id, text, helper, choices });

export const STEPS: Step[] = [
  {
    key: "knowledge",
    title: "Knowledge and Study",
    part: "Part 1",
    intro:
      "Tell me about the subject, study and knowledge you have received so far. Think about school, university, work, practice and daily life.",
    color: "#2f6fbd",
    groups: [
      {
        code: "A",
        title: "What You Have Studied and Learned",
        questions: [
          q("A1", "What is the main subject or topic you have studied or worked on until now?", "Name the subject and say what it is about in simple words. Example (from another field, for illustration only): 'Civil engineering - designing roads and bridges.'"),
          q("A2", "What are the most important things you have learned so far?", "List 3-5 key ideas or facts. Example (illustration only): 'How to read a map, how to measure distance, how to plan a route.'"),
          q("A3", "Which parts of your subject do you understand best?", "Pick 2-4 topics and say why you feel confident in them."),
          q("A4", "What practical skills have you gained through study or work?", "Skills can be hands-on (using tools) or personal (explaining clearly, teamwork). Example (illustration only): 'Cooking for 50 people at a time.'"),
          q("A5", "Which real-life experiences (job, internship, volunteering, family work) taught you the most?", "Describe one or two experiences and what you learned from them."),
          q("A6", "Where did you learn most of what you know?", "Choose the closest option, then explain in the Answer box.", ["Classes or teachers", "Books or reading", "Practice or work", "Other people", "Internet or videos", "My own mistakes", "A mix of these"]),
          q("A7", "What do you know about your field that most ordinary people do not know?", "Think of facts, habits or warnings that would help people if they knew them. Example (illustration only): 'Most people never check the expiry date on medicine.'"),
          q("A8", "What do you wish you had been taught earlier?", "This shows gaps in how knowledge is taught today."),
          q("A9", "Which part of your knowledge do you use in daily life?", "Give a real example of when you used what you learned outside class or work."),
          q("A10", "Which part of your field is changing the fastest right now?", "Think about new tools, new rules, new methods or new expectations from people.")
        ]
      }
    ]
  },
  {
    key: "importance",
    title: "Importance",
    part: "Part 2",
    intro:
      "Explain how important your field and knowledge are, and why. Use real examples from people's daily lives.",
    color: "#1f8a70",
    groups: [
      {
        code: "B",
        title: "Why It Is Important",
        questions: [
          q("B1", "How is your field or knowledge important in people's daily lives?", "Describe the everyday situations where people need it. Example (illustration only): 'Clean water engineering - every home needs safe water.'"),
          q("B2", "Who depends on this knowledge or work?", "Name the groups: families, patients, students, businesses, communities, the government."),
          q("B3", "What would happen if this knowledge or service did not exist, or was done badly?", "Think about the consequences for people. Be as specific as you can."),
          q("B4", "Why is your field important for society or the country?", "Think about health, safety, jobs, the economy, education or the environment."),
          q("B5", "How does it help people save time, save money, stay safe or stay healthy?", "Choose the benefits that apply and give a real example for each."),
          q("B6", "Which part of your field is the most important, and why?", "Choose one part and explain why it matters more than the others."),
          q("B7", "How important is your field for people's lives overall?", "Choose the closest option, then explain your choice in the Answer box.", ["Essential for life or safety", "Very important", "Important", "Somewhat important", "Not sure"]),
          q("B8", "Who benefits the most from it, and who is left out?", "Think about people who cannot afford it, live far away, or do not know it exists."),
          q("B9", "What does it cost people (in time or money) to learn about it or use it?", "Give a rough idea and say how you know. Honest guesses are fine if you label them as guesses."),
          q("B10", "Why is this field or topic important to you personally?", "Personal reasons are valuable. They show what you care about most.")
        ]
      }
    ]
  },
  {
    key: "problems",
    title: "Problems",
    part: "Part 3",
    intro: "Tell me about the real problems you have seen in your field. Real examples are the most useful answers.",
    color: "#c2572b",
    groups: [
      {
        code: "C",
        title: "Problems",
        questions: [
          q("C1", "What are the biggest problems you have noticed in your field?", "Write the problems that come up again and again. Example (illustration only): 'Patients forget to take medicine on time.'"),
          q("C2", "Which problems waste people's time or cost them money?", "Think about waiting, repeating work, mistakes and extra fees. Example (illustration only): 'Queuing in person to collect a printed certificate.'"),
          q("C3", "Which tasks are difficult, confusing or still done by hand?", "Name the task and who does it. Example (illustration only): 'Copying the same figures into three different forms.'"),
          q("C4", "What problems do the people who use the services of your field face?", "Think about customers, patients, clients, students or the public."),
          q("C5", "What problems do professionals or organisations in your field face?", "Think about paperwork, time pressure, missing tools or unclear rules."),
          q("C6", "What do students and beginners find hardest when learning your field?", "Think about practice, feedback, equipment, confidence and understanding."),
          q("C7", "Which problems are ignored or delayed? Why?", "Think about small problems that become big ones, and why people wait."),
          q("C8", "Why do these problems still exist?", "Think about the causes: cost, lack of knowledge, old methods, rules, or lack of tools."),
          q("C9", "How often do these problems happen?", "Choose the closest option, then add detail in the Answer box if useful.", ["Daily", "Weekly", "Monthly", "A few times a year", "Rarely", "Not sure"]),
          q("C10", "How serious are these problems?", "Choose the closest option, then explain the effect on the people involved.", ["Minor inconvenience", "Moderate problem", "Serious problem", "Very serious or harmful", "Not sure"]),
          q("C11", "Describe one real example of a problem you have personally experienced or observed.", "Tell it like a short story: who, what happened, when, and the result. Do not use real names or private details."),
          q("C12", "Which problem would you want solved first, and why?", "Pick one problem and explain why it matters most.")
        ]
      }
    ]
  },
  {
    key: "solutions",
    title: "Solutions",
    part: "Part 4",
    intro:
      "Think about the problem you chose in Part 3 (question C12). A solution can be a website, software, an AI tool, a service, training or a change in how things are done. It does not have to be an app.",
    color: "#7a4fb5",
    groups: [
      {
        code: "D",
        title: "Solutions",
        questions: [
          q("D1", "How is this problem solved today?", "Include workarounds such as paper forms, asking friends, spreadsheets, or doing nothing."),
          q("D2", "What works well in the current solutions?", "Be fair. Note what people like and what should be kept."),
          q("D3", "What does not work, or what is missing, in the current solutions?", "Think about cost, speed, accuracy, convenience, access or trust."),
          q("D4", "What solution would you suggest?", "Describe your idea in your own words, in 3-5 sentences."),
          q("D5", "Who would use the solution, and who would benefit?", "Be specific: 'first-year students living away from home' is better than 'everyone'."),
          q("D6", "Would technology help solve this problem?", "Choose a quick answer, then explain how. 'Not really' is a valid and useful answer.", ["Yes - a lot", "Partly", "Not really", "Not sure"]),
          q("D7", "What type of solution would people prefer?", "Choose the closest option, then explain why it suits the users.", ["Mobile app", "Website", "Desktop software", "AI-powered tool", "Business or service (not software)", "Educational platform", "A combination", "Other", "Not sure"]),
          q("D8", "What features would the solution need?", "List the features and mark which are essential and which are 'nice to have'."),
          q("D9", "What would a simple first version look like?", "Describe the smallest version that would still be useful, in 3-5 sentences."),
          q("D10", "Would people be willing to pay for it, or should it be free?", "Choose the closest option, then say who should pay and why.", ["Should be free", "Free with optional paid features", "One-time payment", "Subscription", "Paid by an organisation instead of the user", "Not sure"]),
          q("D11", "What risks or difficulties could stop the solution from working?", "Think about cost, privacy, trust, rules, safety and people not wanting to change their habits.")
        ]
      }
    ]
  },
  {
    key: "future",
    title: "Next Generation",
    part: "Part 5",
    intro:
      "Think about the future: how your field can be improved for the next generation of people and professionals.",
    color: "#b8860b",
    groups: [
      {
        code: "E",
        title: "Next-Generation Improvement",
        questions: [
          q("E1", "How do you think your field will look in 10 years?", "Think about tools, services, rules and the way people work or learn."),
          q("E2", "What should the next generation of tools, services or education in your field look like?", "Describe the ideal future in simple words."),
          q("E3", "What should be improved first for future generations?", "Choose the most urgent improvement and explain why."),
          q("E4", "How could new technology (software, AI, data tools) improve your field in the future?", "Give specific examples. It is fine to say where technology should NOT be used."),
          q("E5", "What should always stay with qualified people and never be replaced by technology? Why?", "Think about care, judgement, ethics, trust and responsibility."),
          q("E6", "What skills will the next generation need in your field?", "Think about technical skills, thinking skills and people skills."),
          q("E7", "How could knowledge be passed on better to students and young people?", "Think about teaching methods, practice, mentoring and easy access to reliable information."),
          q("E8", "What would you do differently if money, technology and resources were not limits?", "Dream freely. Ignoring limits shows what you truly believe is wrong today."),
          q("E9", "Which group of people would you most like to help in the future?", "Name the group and say why you chose them."),
          q("E10", "How could we measure whether an improvement really works?", "Describe what would change if it works. Example (illustration only): 'Fewer missed appointments per month.'")
        ]
      },
      {
        code: "F",
        title: "Final Thoughts",
        questions: [
          q("F1", "What important question have I not asked you?", "Write the question and, if you can, your answer to it."),
          q("F2", "If you could work with a Computing student to build one solution, what would you want to build?", "Describe the project you would be most excited about, in a few sentences."),
          q("F3", "What knowledge or support could you contribute to such a project?", "For example: subject knowledge, introductions to professionals, testing, or feedback."),
          q("F4", "May I contact you again to discuss your answers in more detail?", "Choose one option. You can add preferred times or methods of contact in the Answer box.", ["Yes", "Maybe - ask first", "No"])
        ]
      }
    ]
  }
];

export const ALL_QUESTIONS: Question[] = STEPS.flatMap((s) => s.groups.flatMap((g) => g.questions));
export const QUESTION_IDS = ALL_QUESTIONS.map((x) => x.id);
export const TOTAL_QUESTIONS = ALL_QUESTIONS.length;

/** Questions shown in the email "Quick view" so the key answers can be scanned fast. */
export const QUICK_VIEW_IDS = ["C1", "C12", "D4", "E3"];

export function stepOfQuestion(id: string): Step {
  return STEPS.find((s) => s.groups.some((g) => g.questions.some((x) => x.id === id))) as Step;
}
