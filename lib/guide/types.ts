// Data model for the Professional Trekking Guide Portfolio. Everything a guide enters lives in one
// GuideData object that is saved as JSON; `normalize` is the only way untrusted input becomes GuideData.

export const REGIONS = ["Everest Region", "Annapurna Region", "Langtang Region", "Manaslu Region", "Mustang Region", "Dolpo Region", "Kanchenjunga Region", "Makalu Region", "Dhaulagiri Region", "Other trekking destinations"];
export const LANGUAGES = ["English", "Nepali", "Hindi", "Tibetan", "Sherpa", "Tamang", "Gurung", "Chinese", "Japanese", "Korean", "French", "German", "Spanish", "Italian", "Russian", "Hebrew"];
export const CONTACT_METHODS = ["WhatsApp", "Email", "Phone call", "Any"];
export const SERVICES = [
  "Professional trekking guide", "Assistant guide arrangement", "Porter arrangement", "Accommodation arrangements", "Food and meal arrangements",
  "Transportation", "Airport pickup and drop-off", "Trekking permits assistance", "Equipment rental arrangement", "Camping arrangements",
  "First aid support", "Emergency coordination", "Cultural sightseeing", "Photography assistance", "Private trekking", "Group trekking",
  "Customized trekking packages", "Local community experiences"
];
export const SERVICE_MODES = [["included", "Included in package"], ["extra", "Available at additional cost"], ["none", "Not provided"]] as const;
export const DIFFICULTY = ["Easy", "Moderate", "Challenging", "Strenuous", "Extreme"];
export const FITNESS = ["Beginner", "Average fitness", "Good fitness", "Very good fitness"];
export const DAY_TYPES = ["Trekking day", "Travel day", "Acclimatization day", "Rest day", "Sightseeing day", "Contingency day"];
export const SEASONS = ["Spring (Mar-May)", "Summer / Monsoon (Jun-Aug)", "Autumn (Sep-Nov)", "Winter (Dec-Feb)"];
export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const CURRENCIES = ["NPR", "USD", "EUR"] as const;
export const PRICE_STATUS = [["estimated", "Estimated price"], ["starting", "Starting price"], ["confirmed", "Confirmed package price"]] as const;
export const COST_SCOPES = [["person", "Per person"], ["group", "Per group"], ["day", "Per day"], ["once", "One-time"], ["optional", "Optional"]] as const;
export const COST_PRESETS = [
  "Professional guide fee", "Assistant guide fee", "Porter charges", "Guide and porter accommodation", "Guide and porter meals", "Trekker accommodation",
  "Trekker meals", "Transportation", "Domestic flights", "Trekking permits", "National park fees", "Conservation fees", "Equipment rental",
  "Camping equipment", "Insurance (only if provided)", "Other expenses"
];
export const INCLUDED = ["Guide service", "Guide expenses", "Porter service", "Accommodation", "Meals", "Transportation", "Domestic flights", "Required permits", "First aid kit", "Equipment", "Taxes", "Airport pickup"];
export const EXCLUDED = ["International flights", "Nepal visa", "Personal travel insurance", "Personal trekking equipment", "Personal expenses", "Tips", "Additional drinks", "Extra accommodation", "Emergency helicopter evacuation (unless explicitly covered)", "Services not listed as included"];
export const GALLERY_CATEGORIES = ["Guide profile", "Previous expeditions", "Trekking routes", "Mountain landscapes", "Group trekking", "Cultural experiences", "Certificates (private)"];
export const MAX_ITINERARIES = 10;
export const STATUSES = ["draft", "submitted", "under_review", "approved", "changes_required", "suspended"] as const;
export type Status = (typeof STATUSES)[number];
export const STATUS_LABEL: Record<Status, string> = {
  draft: "Draft", submitted: "Submitted for Verification", under_review: "Under Review", approved: "Approved", changes_required: "Rejected / Changes Required", suspended: "Suspended"
};
export const EDITABLE: Status[] = ["draft", "changes_required"];

export type Day = { id: string; type: string; title: string; from: string; to: string; altStart: string; altEnd: string; gain: string; distance: string; hours: string; activities: string; meals: string; stay: string; difficulty: string; description: string; notes: string; photos: string };
export type Cost = { id: string; label: string; amount: string; scope: "person" | "group" | "day" | "once" | "optional" };
export type Pricing = {
  status: "estimated" | "starting" | "confirmed"; currency: "NPR" | "USD" | "EUR";
  f: Record<string, string>; costs: Cost[]; included: string[]; excluded: string[]; customIncluded: string; customExcluded: string; travellers: string;
};
export type Itinerary = { id: string; f: Record<string, string>; days: Day[]; pricing: Pricing };
export type Exp = { company: string; role: string; period: string; regions: string; details: string };
export type Cert = { name: string; issuer: string; issued: string; expiry: string; link: string };
export type Photo = { category: string; url: string; caption: string };
export type ServiceMode = "included" | "extra" | "none";

export type GuideData = {
  p: Record<string, string>; languages: string[]; experiences: Exp[]; certs: Cert[]; q: Record<string, string>;
  regions: string[]; regionInfo: Record<string, Record<string, string>>; customDestinations: string;
  services: Record<string, ServiceMode>; customServices: { name: string; mode: ServiceMode }[];
  itineraries: Itinerary[]; safety: Record<string, string>; avail: Record<string, string>; availSeasons: string[]; availMonths: string[];
  gallery: Photo[]; confirm: boolean;
};

// Field keys by group (used by the form and by `normalize`).
export const P_KEYS = ["legalName", "displayName", "profilePhoto", "coverPhoto", "headline", "bio", "nationality", "location", "dob", "phone", "whatsapp", "email", "preferredContact", "socials", "website"];
export const Q_KEYS = ["yearsExp", "treksDone", "trekkersGuided", "previousCompanies", "highestAlt", "memorable", "achievements", "training", "licenceNo", "licenceAuthority", "firstAid", "wilderness", "rescue"];
export const REGION_KEYS = ["routes", "timesCompleted", "yearsInRegion", "highestAlt", "culture", "routeKnowledge", "difficulty", "seasons", "expertise"];
export const IT_KEYS = ["title", "region", "destination", "short", "detail", "highlights", "durationDays", "nights", "start", "end", "maxAlt", "distanceKm", "difficulty", "season", "minAge", "fitness", "minPart", "maxPart", "accommodation", "transport", "permits", "photos", "mapLink", "gpsLink", "alternatives", "emergencyExit", "changes", "weather", "safetyInfo"];
export const PRICE_KEYS = ["perPerson", "perGroup", "private", "groupPrice", "perDay", "minGroup", "maxGroup", "single", "child", "seasonal", "custom", "deposit", "balanceDeadline", "paymentMethods", "cancelDeadline", "refund", "weatherPolicy", "flightPolicy", "emergencyPolicy"];
export const SAFETY_KEYS = ["firstAidStatus", "firstAidExpiry", "emergencyName", "emergencyPhone", "responseExperience", "altitudeAwareness", "acclimatization", "evacuation", "rescue", "satPhone", "commsEquipment", "weatherMonitoring", "insurance", "evacInsurance"];
export const AVAIL_KEYS = ["dates", "unavailable", "maxGroups", "maxCapacity", "advance"];
export const DAY_KEYS = ["type", "title", "from", "to", "altStart", "altEnd", "gain", "distance", "hours", "activities", "meals", "stay", "difficulty", "description", "notes", "photos"] as const;

const s = (v: unknown, max = 3000): string => (typeof v === "string" ? v.slice(0, max) : typeof v === "number" ? String(v) : "");
const rec = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const list = (v: unknown, max: number): unknown[] => (Array.isArray(v) ? v.slice(0, max) : []);
const pick = (v: unknown, keys: readonly string[], max = 3000): Record<string, string> => {
  const o = rec(v);
  return Object.fromEntries(keys.map((k) => [k, s(o[k], max)]));
};
const strs = (v: unknown, max: number, len = 120) => list(v, max).map((x) => s(x, len)).filter(Boolean);
export const uid = () => Math.random().toString(36).slice(2, 10);
const id = (v: unknown) => (/^[a-z0-9]{4,16}$/.test(s(v, 16)) ? s(v, 16) : uid());

export const emptyPricing = (): Pricing => ({ status: "estimated", currency: "USD", f: pick({}, PRICE_KEYS), costs: [], included: [], excluded: [], customIncluded: "", customExcluded: "", travellers: "" });
export const emptyDay = (n = 1): Day => ({ id: uid(), ...(Object.fromEntries(DAY_KEYS.map((k) => [k, ""])) as Omit<Day, "id">), type: "Trekking day", title: `Day ${n}` });
export const emptyItinerary = (): Itinerary => ({ id: uid(), f: pick({}, IT_KEYS), days: [emptyDay(1)], pricing: emptyPricing() });
export const emptyData = (): GuideData => normalize({});

export function normalize(raw: unknown): GuideData {
  const o = rec(raw);
  const mode = (v: unknown): ServiceMode => (v === "included" || v === "extra" ? v : "none");
  const services: Record<string, ServiceMode> = {};
  for (const k of SERVICES) services[k] = mode(rec(o.services)[k]);
  const regions = strs(o.regions, 12).filter((r) => REGIONS.includes(r));
  const regionInfo: Record<string, Record<string, string>> = {};
  for (const r of regions) regionInfo[r] = pick(rec(o.regionInfo)[r], REGION_KEYS, 1500);
  return {
    p: pick(o.p, P_KEYS, 4000),
    languages: strs(o.languages, 30, 60),
    experiences: list(o.experiences, 12).map((e) => pick(e, ["company", "role", "period", "regions", "details"], 1500) as Exp),
    certs: list(o.certs, 15).map((e) => pick(e, ["name", "issuer", "issued", "expiry", "link"], 400) as Cert),
    q: pick(o.q, Q_KEYS, 3000),
    regions, regionInfo, customDestinations: s(o.customDestinations, 1000),
    services,
    customServices: list(o.customServices, 10).map((c) => ({ name: s(rec(c).name, 120), mode: mode(rec(c).mode) })).filter((c) => c.name),
    itineraries: list(o.itineraries, MAX_ITINERARIES).map((raw) => {
      const it = rec(raw);
      const pr = rec(it.pricing);
      const cur = CURRENCIES.find((c) => c === pr.currency) ?? "USD";
      const st = PRICE_STATUS.find(([k]) => k === pr.status)?.[0] ?? "estimated";
      return {
        id: id(it.id),
        f: pick(it.f, IT_KEYS, 5000),
        days: list(it.days, 40).map((d) => ({ id: id(rec(d).id), ...(pick(d, DAY_KEYS, 2500) as Omit<Day, "id">) })),
        pricing: {
          status: st, currency: cur, f: pick(pr.f, PRICE_KEYS, 1500),
          costs: list(pr.costs, 40).map((c) => ({
            id: id(rec(c).id), label: s(rec(c).label, 120), amount: s(rec(c).amount, 20),
            scope: (["person", "group", "day", "once", "optional"].includes(s(rec(c).scope)) ? s(rec(c).scope) : "group") as Cost["scope"]
          })),
          included: strs(pr.included, 30), excluded: strs(pr.excluded, 30), customIncluded: s(pr.customIncluded, 800), customExcluded: s(pr.customExcluded, 800), travellers: s(pr.travellers, 4)
        }
      } satisfies Itinerary;
    }),
    safety: pick(o.safety, SAFETY_KEYS, 2000),
    avail: pick(o.avail, AVAIL_KEYS, 1500),
    availSeasons: strs(o.availSeasons, 4).filter((x) => SEASONS.includes(x)),
    availMonths: strs(o.availMonths, 12).filter((x) => MONTHS.includes(x)),
    gallery: list(o.gallery, 60).map((g) => ({ category: GALLERY_CATEGORIES.includes(s(rec(g).category)) ? s(rec(g).category) : GALLERY_CATEGORIES[0], url: s(rec(g).url, 400), caption: s(rec(g).caption, 200) })).filter((g) => g.url),
    confirm: o.confirm === true
  };
}

export const slugify = (t: string) => t.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 48) || "guide";
export const safeUrl = (u: string) => (/^https?:\/\/\S+$/i.test(u.trim()) ? u.trim() : "");
export const pkgSlug = (it: Itinerary) => `${slugify(it.f.title || "package")}-${it.id}`;

/** Steps 0..4: first problem found for a step, or "". Used by the form and again on the server at submit. */
export const TOTAL_STEPS = 5;
export function validateStep(d: GuideData, step: number): string {
  const p = d.p;
  if (step === 0) {
    if (p.legalName.trim().length < 2) return "Please enter your full legal name.";
    if (p.displayName.trim().length < 2) return "Please enter the name you want shown publicly.";
    if (p.headline.trim().length < 5) return "Please add a short professional headline.";
    if (p.bio.trim().length < 50) return "Please write a short biography (at least 50 characters).";
    if (!p.location.trim()) return "Please enter your current location.";
    if (!/^\S+@\S+\.\S+$/.test(p.email.trim())) return "Please enter a valid email address.";
    if (!p.phone.trim() && !p.whatsapp.trim()) return "Please add a phone or WhatsApp number.";
    if (!d.languages.length) return "Please choose at least one language.";
  }
  if (step === 1) {
    if (!d.q.yearsExp.trim()) return "Please enter your total years of trekking experience.";
    if (!d.regions.length) return "Please select at least one trekking region.";
  }
  if (step === 3) {
    if (!d.itineraries.length) return "Add at least one trekking itinerary.";
    for (let i = 0; i < d.itineraries.length; i++) {
      const it = d.itineraries[i];
      const n = `Itinerary ${i + 1}`;
      if (it.f.title.trim().length < 3) return `${n}: please add a package title.`;
      if (!it.f.region) return `${n}: please choose a trekking region.`;
      if (!it.f.short.trim()) return `${n}: please add a short description.`;
      if (!it.days.length) return `${n}: add at least one day.`;
      const f = it.pricing.f;
      if (!f.perPerson.trim() && !f.perGroup.trim() && !f.custom.trim()) return `${n}: enter a price per person or per group, or describe custom pricing.`;
    }
  }
  if (step === 4 && !d.confirm) return "Please confirm that the information you submitted is accurate.";
  return "";
}

/** Removes everything that must never be public. */
export function toPublic(d: GuideData): GuideData {
  const c = normalize(d);
  for (const k of ["legalName", "dob", "phone", "email"]) c.p[k] = "";
  c.q.licenceNo = "";
  c.q.licenceAuthority = "";
  c.certs = c.certs.map((x) => ({ ...x, link: "" }));
  c.gallery = c.gallery.filter((g) => !g.category.startsWith("Certificates"));
  c.safety.emergencyPhone = "";
  c.confirm = false;
  return c;
}
