// The separate Hospitality Operations, Real Estate, and Technology questionnaire (12 questions in 4 parts).
import type { ShortQuestion, ShortStep } from "./short";

const t = (id: string, text: string, helper: string): ShortQuestion => ({ id, text, helper, kind: "text" });

export const HOSPITALITY_STEPS: ShortStep[] = [
  {
    key: "hosp-general", part: "Part 1", title: "Hospitality and Real Estate", color: "#0e7490",
    intro: "Tell me what you know about hospitality, apartments and how they connect. Real-life examples are very welcome.",
    questions: [
      t("H1", "What do you know about hospitality operations, and what does a normal day look like for the people who work in it?", "Think about front desk, housekeeping, kitchen or cafe, guest requests and managers. Share anything you have seen or experienced yourself."),
      t("H2", "How are hospitality, real estate and property management connected?", "For example, how a guest stay, a rented apartment and the owner of the building depend on each other."),
      t("H3", "What are the most common problems people face when looking for and renting an apartment?", "Think about price, location, trust, paperwork, deposits, finding information and talking to owners. A real example from you or someone you know is very helpful.")
    ]
  },
  {
    key: "hosp-tech", part: "Part 2", title: "Technology, AI and Data", color: "#1f8a70",
    intro: "Think about how technology could make these businesses and your own field better.",
    questions: [
      t("H4", "How can technology improve customer service and daily operations in a hotel, cafe or apartment business?", "Think about bookings, payments, messages to guests, cleaning schedules, records and reports. Say what would be easier or faster."),
      t("H5", "How could AI, automation and data make hospitality and real estate better?", "For example, answering guest questions, setting fair prices, predicting busy days, or matching people to the right place. Explain in your own words."),
      t("H6", "What are the technology challenges and opportunities in your own field of study or work?", "Describe one challenge (for example cost, training or trust) and one opportunity you can see.")
    ]
  },
  {
    key: "hosp-scenarios", part: "Part 3", title: "Real-Life Scenarios", color: "#c2572b",
    intro: "Imagine each situation and tell me what you would do. Write your own steps and ideas. Please do not use real names or private details.",
    questions: [
      t("H7", "Scenario: A guest arrives late at night, their room is not ready and the front desk is busy. What should the business do, and how could technology help?", "Write the steps you would take, and any tool that would make it smoother."),
      t("H8", "Scenario: A person works night shifts, has a limited monthly budget and wants to be close to cafes and public transport. What kind of apartment would you recommend, and what would you ask them first?", "Think about budget, location, daily routine, noise, safety and personal preferences."),
      t("H9", "If a website recommended apartments based on a person's lifestyle, what should it ask, and which details matter most?", "For example budget, area, work or study hours, travel time, food, pets, quiet or social, and furniture. Put the most important ones first."),
      t("H10", "Scenario: A tenant reports the same maintenance problem again and again (for example no hot water), and the owner is hard to reach. How should this be handled, and what could prevent it next time?", "Think about who should act, how fast, and how a simple app or system could track and fix it.")
    ]
  },
  {
    key: "hosp-ideas", part: "Part 4", title: "Ideas for My Platform", color: "#7a4fb5",
    intro: "My platform brings together apartment bookings and management, rooms, guests, finance, reports and a free portfolio service. Any idea is welcome, big or small.",
    questions: [
      t("H11", "What new technology-based ideas or features would you suggest for my platform?", "Think about what would help guests, owners, staff or people looking for an apartment."),
      t("H12", "If you could add one feature to my platform tomorrow, what would it be, who would use it, and what real-life problem would it solve?", "Give one idea in your own words, with a real example if you can.")
    ]
  }
];

export const HOSPITALITY_QUESTIONS: ShortQuestion[] = HOSPITALITY_STEPS.flatMap((x) => x.questions);
export const HOSPITALITY_IDS = HOSPITALITY_QUESTIONS.map((x) => x.id);
export const TOTAL_HOSPITALITY = HOSPITALITY_QUESTIONS.length;
/** Key answers shown at the top of the email. */
export const HOSPITALITY_QUICK_IDS = ["H3", "H9", "H11", "H12"];
