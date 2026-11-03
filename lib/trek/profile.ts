// Editable content for the Trekking Guide page. Change text here and redeploy.
// Anything marked `todo` is a placeholder shown as "to be added" until you supply verified details.

export const guide = {
  name: "Tsewang Bista",
  title: "Trekking Guide | Mustang, Nepal",
  location: "Mustang, Nepal",
  experience: "Approximately 5-6 years",
  email: "contact@tsewangbista.com",
  phone: "+977 9862568506",
  whatsapp: "9779862568506",
  intro:
    "I am a trekking guide from Mustang, Nepal, with about five to six years of experience guiding travellers in the Himalayas. I grew up with Mustang's villages, trails and traditions, and I enjoy sharing that local knowledge with visitors in a friendly, safe and respectful way.",
  expertise: ["Mustang region", "Local culture and villages", "Route guidance", "Traveller support", "Responsible tourism"],
  languages: "Languages to be added"
};

export const times = [
  ["Guide profile", "2-3 min"],
  ["Experience", "2-3 min"],
  ["Destinations", "3-5 min"],
  ["Services", "1-2 min"],
  ["Read a story", "3-5 min"],
  ["Download CV", "Under 1 min"],
  ["Contact form", "2-3 min"]
] as const;

export const about = [
  "I work as a trekking guide in the Himalayas, with Mustang as my home region and my main area of experience.",
  "Guiding is about more than the route. I like explaining the places we walk through, the traditions behind them, and the everyday life of the people who live there.",
  "I care about safety, a comfortable pace and respectful, responsible tourism, so that travellers enjoy the mountains and the communities leave a good impression of each other.",
  "My longer-term goal is to keep growing in tourism and hospitality in Nepal, alongside managing Jikmis Apartment in Boudha, Kathmandu.",
  "Personal story to be expanded: how I started guiding and what motivates me. (Editable: send me the details.)"
];

export const experience = [
  {
    role: "Trekking Guide (independent experience)",
    org: "Details of agencies or clients to be added if applicable",
    location: "Mustang, Nepal",
    period: "Approximately 5-6 years (exact dates to be added)",
    duties: [
      "Guiding travellers on trekking routes, with a focus on Mustang",
      "Sharing local culture, village life and landscape knowledge",
      "Coordinating the daily route, pace and traveller needs",
      "Communicating with international travellers"
    ],
    regions: "Mustang (other regions to be confirmed)"
  }
];

export type Level =
  | "Extensive Guiding Experience"
  | "Personally Guided"
  | "Familiar With the Route"
  | "Knowledge and Interest"
  | "Available Through Partner Guide";

export const regions: {
  name: string;
  note?: string;
  intro: string;
  places: { name: string; about: string; level?: Level }[];
}[] = [
  {
    name: "Mustang Region",
    note: "My home region and main area of guiding experience.",
    intro: "A high, dry Himalayan valley along the Kali Gandaki river, with strong Tibetan-influenced culture.",
    places: [
      { name: "Upper Mustang", about: "A restricted area with a special permit requirement, known for dramatic desert-like landscapes, cliffs, caves and ancient settlements." },
      { name: "Lower Mustang", about: "The Kali Gandaki valley with villages, apple orchards and mountain views." },
      { name: "Lo Manthang", about: "The walled former capital of the Kingdom of Lo, known for its monasteries and traditional architecture." },
      { name: "Jomsom", about: "The main hub of the valley, a gateway for treks and for travel in Mustang." },
      { name: "Kagbeni", about: "A medieval-style village at the meeting of routes towards Muktinath and Upper Mustang." },
      { name: "Marpha", about: "A tidy village known for apple farming and local products." },
      { name: "Muktinath", about: "An important pilgrimage site for Hindus and Buddhists." }
    ]
  },
  {
    name: "Annapurna Region",
    intro: "A varied region of forests, high passes and mountain villages.",
    places: [
      { name: "Annapurna Circuit", about: "A long trek crossing the Thorong La pass, with changing landscapes and cultures." },
      { name: "Annapurna Base Camp", about: "A trek into the Annapurna Sanctuary with close mountain views." },
      { name: "Ghorepani Poon Hill", about: "A shorter trek known for sunrise views over the Himalayas." },
      { name: "Mardi Himal", about: "A ridge trek with views of Annapurna and Machhapuchhre." }
    ]
  },
  {
    name: "Everest Region",
    intro: "The Khumbu region, home to Sherpa culture and the world's highest peak.",
    places: [
      { name: "Everest Base Camp", about: "A classic Himalayan trek through Sherpa villages towards Everest." },
      { name: "Everest region villages and trails", about: "Villages, monasteries and trails of the Khumbu valleys." }
    ]
  },
  {
    name: "Langtang Region",
    intro: "A valley close to Kathmandu, known for Tamang culture and mountain scenery.",
    places: [
      { name: "Langtang Valley", about: "A valley trek with Tamang villages and Himalayan views." },
      { name: "Local villages and surrounding trails", about: "Smaller villages and trails around the valley." }
    ]
  }
];

export const mustangShare = [
  "Local cultural explanations",
  "Village walks",
  "Traditional food experiences",
  "Stories about local history",
  "Monastery and heritage visits",
  "Local lifestyle and customs",
  "Community experiences",
  "Photography locations",
  "Information about local traditions"
];

export const mustangTopics = [
  "Upper and Lower Mustang", "Local traditions", "Traditional architecture", "Tibetan-influenced heritage", "Monasteries",
  "Traditional villages", "Local lifestyle and food", "Festivals and celebrations", "Himalayan landscapes", "Local geography and trails"
];

export const skills = [
  { group: "Trekking and navigation", items: ["Route navigation", "Trail planning", "Pace management", "Daily route coordination", "Weather awareness", "Elevation awareness", "Group coordination"] },
  { group: "Traveller management", items: ["International traveller communication", "Group management", "Guest assistance", "Cultural communication", "Problem-solving", "Time management", "Customer service"] },
  { group: "Safety and responsibility", items: ["Basic trekking safety", "Altitude awareness", "Emergency preparedness", "Responsible trekking", "Environmental awareness"] },
  { group: "Local and cultural knowledge", items: ["Mustang culture", "Local traditions", "Traditional villages", "Local food", "Monastery and heritage knowledge", "Community interaction"] },
  { group: "Professional skills", items: ["English communication", "Leadership", "Hospitality", "Teamwork", "Adaptability"] }
];

export const services = [
  { name: "Private trekking guide", about: "One-to-one or family guiding at your own pace.", who: "Individuals, couples, families", region: "Mustang and other regions" },
  { name: "Group trekking guide", about: "Guiding a group and keeping the day running smoothly.", who: "Groups, agencies and operators", region: "By agreement" },
  { name: "Mustang local guide", about: "Local knowledge of Mustang's routes and villages.", who: "Visitors to Mustang", region: "Mustang" },
  { name: "Cultural and heritage guiding", about: "Explaining monasteries, architecture and traditions.", who: "Culture-focused travellers", region: "Mustang" },
  { name: "Village walks", about: "Easy walks through villages and local life.", who: "All ages and fitness levels", region: "Mustang" },
  { name: "Mountain and nature exploration", about: "Trails and viewpoints with landscape context.", who: "Nature and photography lovers", region: "Mustang" },
  { name: "Customized guiding assistance", about: "Guiding support shaped around your plans.", who: "Independent travellers", region: "By agreement" },
  { name: "Trekking route guidance", about: "Advice on routes, pace and what to expect.", who: "Trip planners", region: "By agreement" },
  { name: "Traveller support", about: "Practical help and communication on the trail.", who: "International travellers", region: "By agreement" },
  { name: "Local experience coordination", about: "Helping arrange local experiences where possible.", who: "Visitors wanting local contact", region: "Mustang" }
];

export const galleryCategories = [
  "Personal guide photographs", "Trekking experiences", "Mustang landscapes", "Upper Mustang", "Lower Mustang",
  "Traditional villages", "Monasteries and cultural heritage", "Mountain views", "Group trekking", "Local community experiences"
];

export const enquiryTypes = [
  "Hire a Trekking Guide", "Private Guide Request", "Group Trekking Guide", "Travel Agency Partnership",
  "Guide Employment Opportunity", "Cultural Experience", "General Enquiry"
];

export const regionOptions = ["Mustang", "Annapurna", "Everest", "Langtang", "Not sure yet"];
