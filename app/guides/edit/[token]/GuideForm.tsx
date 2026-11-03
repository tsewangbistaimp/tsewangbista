"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CheckCircle2, Copy, Plus, Save, Send, Trash2 } from "lucide-react";
import { ProfileView, PackageView } from "../../GuideView";
import { itineraryBreakdown, money } from "../../../../lib/guide/pricing";
import {
  AVAIL_KEYS, CONTACT_METHODS, COST_PRESETS, COST_SCOPES, CURRENCIES, DAY_TYPES, DIFFICULTY, EXCLUDED, FITNESS, GALLERY_CATEGORIES, INCLUDED, LANGUAGES, MAX_ITINERARIES, MONTHS,
  PRICE_STATUS, REGIONS, REGION_KEYS, SEASONS, SERVICES, SERVICE_MODES, emptyDay, emptyItinerary, uid, validateStep,
  type Day, type GuideData, type Itinerary, type ServiceMode
} from "../../../../lib/guide/types";
import "../../../services/free-portfolio/form.css";
import "../../guides.css";
import "./guide-form.css";

const STEPS = ["Personal", "Experience", "Regions", "Services", "Itineraries", "Pricing", "Safety & gallery", "Review"];
const MINUTES = [4, 5, 3, 3, 8, 5, 4, 2]; // guidance only (sums to 34)
const LABELS: Record<string, string> = {
  title: "Package title", region: "Trekking region", destination: "Destination", short: "Short description", detail: "Detailed description", highlights: "Main highlights",
  durationDays: "Duration (days)", nights: "Number of nights", start: "Starting point", end: "Ending point", maxAlt: "Maximum altitude", distanceKm: "Total distance (km)", difficulty: "Difficulty",
  season: "Best season", minAge: "Minimum recommended age", fitness: "Recommended fitness", minPart: "Minimum participants", maxPart: "Maximum participants", accommodation: "Accommodation type",
  transport: "Transportation type", permits: "Required permits", photos: "Photo links (one per line)", mapLink: "Route map link", gpsLink: "GPS route link (optional)",
  alternatives: "Alternative routes", emergencyExit: "Emergency exit points", changes: "Possible itinerary changes", weather: "Weather-related adjustments", safetyInfo: "Important safety information"
};

type Props = { token: string; initial: GuideData; step: number; note: string | null; token2?: string };

function Field({ label, hint, req, children, wide }: { label: string; hint?: string; req?: boolean; children: ReactNode; wide?: boolean }) {
  return (
    <label className="fp-field" style={wide ? { gridColumn: "1 / -1" } : undefined}>
      <span className="fp-label">{label}{req ? <b> *</b> : <em className="gf-opt"> optional</em>}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export default function GuideForm({ token, initial, step: startStep, note }: Props) {
  const [d, setD] = useState<GuideData>(initial);
  const [step, setStep] = useState(Math.min(7, startStep));
  const [maxStep, setMaxStep] = useState(Math.min(7, startStep));
  const [save, setSave] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [ai, setAi] = useState(0); // active itinerary
  const [copied, setCopied] = useState(false);
  const first = useRef(true);
  const top = useRef<HTMLDivElement>(null);
  const latest = useRef({ d, step });
  latest.current = { d, step };

  const persist = useCallback(async () => {
    setSave("saving");
    try {
      const r = await fetch("/api/guide/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, data: latest.current.d, step: latest.current.step }) });
      setSave(r.ok ? "saved" : "error");
      return r.ok;
    } catch {
      setSave("error");
      return false;
    }
  }, [token]);

  // Auto-save shortly after any change.
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(persist, 1500);
    return () => clearTimeout(t);
  }, [d, step, persist]);

  const setP = (k: string, v: string) => setD((x) => ({ ...x, p: { ...x.p, [k]: v } }));
  const setQ = (k: string, v: string) => setD((x) => ({ ...x, q: { ...x.q, [k]: v } }));
  const setS = (k: string, v: string) => setD((x) => ({ ...x, safety: { ...x.safety, [k]: v } }));
  const setA = (k: string, v: string) => setD((x) => ({ ...x, avail: { ...x.avail, [k]: v } }));
  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((i) => i !== v) : [...arr, v]);
  const setIt = (i: number, fn: (it: Itinerary) => Itinerary) => setD((x) => ({ ...x, itineraries: x.itineraries.map((it, j) => (j === i ? fn(it) : it)) }));

  const remaining = MINUTES.slice(step).reduce((a, b) => a + b, 0);
  const pct = Math.round((step / STEPS.length) * 100);

  function go(next: number) {
    if (next > step) {
      for (let s = step; s < next; s++) {
        const m = validateStep(d, s);
        if (m) { setError(m); if (s !== step) setStep(s); return; }
      }
    }
    setError("");
    setStep(next);
    setMaxStep((m) => Math.max(m, next));
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function saveNow() {
    const ok = await persist();
    setError(ok ? "" : "Could not save. Check your connection and try again.");
  }

  async function submit() {
    for (let s = 0; s < 8; s++) {
      const m = validateStep(d, s);
      if (m) { setStep(s); setError(m); return; }
    }
    setSending(true);
    setError("");
    try {
      const r = await fetch("/api/guide/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, data: d }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (typeof data.step === "number") setStep(data.step);
        throw new Error(data.error || "Could not submit.");
      }
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit.");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="fp-card fp-done">
        <CheckCircle2 size={56} /><h2>Submitted for verification</h2>
        <p>Thank you. Your portfolio is now waiting for review. It becomes public only after it is approved, and we will email you at <strong>{d.p.email}</strong> when the status changes.</p>
      </div>
    );
  }

  const input = (value: string, on: (v: string) => void, ph = "", type = "text") => <input type={type} value={value} placeholder={ph} onChange={(e) => on(e.target.value)} />;
  const area = (value: string, on: (v: string) => void, ph = "", rows = 3) => <textarea rows={rows} value={value} placeholder={ph} onChange={(e) => on(e.target.value)} />;
  const select = (value: string, on: (v: string) => void, opts: readonly string[], ph = "Choose…") => (
    <select value={value} onChange={(e) => on(e.target.value)}><option value="">{ph}</option>{opts.map((o) => <option key={o}>{o}</option>)}</select>
  );
  const chips = (opts: readonly string[], sel: string[], on: (v: string) => void) => (
    <div className="fp-chips">{opts.map((o) => <button type="button" key={o} className={sel.includes(o) ? "on" : ""} onClick={() => on(o)}>{o}</button>)}</div>
  );

  const it = d.itineraries[ai];
  const itTabs = (
    <div className="gf-tabs">
      {d.itineraries.map((x, i) => <button type="button" key={x.id} className={i === ai ? "on" : ""} onClick={() => setAi(i)}>{x.f.title || `Itinerary ${i + 1}`}</button>)}
      {step === 4 && d.itineraries.length < MAX_ITINERARIES ? (
        <button type="button" className="gf-add" onClick={() => { setD((x) => ({ ...x, itineraries: [...x.itineraries, emptyItinerary()] })); setAi(d.itineraries.length); }}><Plus size={14} /> Add itinerary ({d.itineraries.length}/{MAX_ITINERARIES})</button>
      ) : null}
    </div>
  );

  const dayEditor = (day: Day, i: number, n: number) => {
    const set = (k: keyof Day, v: string) => setIt(ai, (x) => ({ ...x, days: x.days.map((y, j) => (j === i ? { ...y, [k]: v } : y)) }));
    const move = (to: number) => setIt(ai, (x) => { const a = [...x.days]; const [m] = a.splice(i, 1); a.splice(to, 0, m); return { ...x, days: a }; });
    return (
      <details className="gf-day" key={day.id} open={n === 1}>
        <summary><span>{i + 1}</span> {day.title || `Day ${i + 1}`} <em>{day.type}</em></summary>
        <div className="gf-tools">
          <button type="button" disabled={i === 0} onClick={() => move(i - 1)} aria-label="Move up"><ArrowUp size={14} /></button>
          <button type="button" disabled={i === n - 1} onClick={() => move(i + 1)} aria-label="Move down"><ArrowDown size={14} /></button>
          <button type="button" onClick={() => setIt(ai, (x) => { const a = [...x.days]; a.splice(i + 1, 0, { ...day, id: uid() }); return { ...x, days: a }; })} aria-label="Duplicate day"><Copy size={14} /></button>
          <button type="button" className="gf-danger" onClick={() => { if (confirm("Delete this day?")) setIt(ai, (x) => ({ ...x, days: x.days.filter((_, j) => j !== i) })); }} aria-label="Delete day"><Trash2 size={14} /></button>
        </div>
        <div className="fp-grid">
          <Field label="Day title">{input(day.title, (v) => set("title", v), "e.g. Jomsom to Kagbeni")}</Field>
          <Field label="Day type">{select(day.type, (v) => set("type", v), DAY_TYPES)}</Field>
          <Field label="Starting location">{input(day.from, (v) => set("from", v))}</Field>
          <Field label="Destination">{input(day.to, (v) => set("to", v))}</Field>
          <Field label="Starting altitude">{input(day.altStart, (v) => set("altStart", v), "e.g. 2,720 m")}</Field>
          <Field label="Ending altitude">{input(day.altEnd, (v) => set("altEnd", v))}</Field>
          <Field label="Elevation gain / loss">{input(day.gain, (v) => set("gain", v), "e.g. +450 m / -100 m")}</Field>
          <Field label="Walking distance">{input(day.distance, (v) => set("distance", v), "e.g. 12 km")}</Field>
          <Field label="Walking duration">{input(day.hours, (v) => set("hours", v), "e.g. 5-6 hours")}</Field>
          <Field label="Day difficulty">{select(day.difficulty, (v) => set("difficulty", v), DIFFICULTY)}</Field>
          <Field label="Meals included">{input(day.meals, (v) => set("meals", v), "e.g. Breakfast, lunch, dinner")}</Field>
          <Field label="Accommodation">{input(day.stay, (v) => set("stay", v))}</Field>
        </div>
        <Field label="Activities">{area(day.activities, (v) => set("activities", v), "", 2)}</Field>
        <Field label="Route description">{area(day.description, (v) => set("description", v))}</Field>
        <Field label="Important notes">{area(day.notes, (v) => set("notes", v), "", 2)}</Field>
        <Field label="Daily photo links">{area(day.photos, (v) => set("photos", v), "One link per line", 2)}</Field>
      </details>
    );
  };

  return (
    <div className="fp-card gf" ref={top}>
      <p className="fp-lead" style={{ fontSize: ".85rem" }}>
        To continue later on any device, save this page&apos;s link. <button type="button" className="gf-linkbtn" onClick={() => { navigator.clipboard?.writeText(window.location.href); setCopied(true); }}>{copied ? "Link copied" : "Copy my link"}</button> Anyone with the link can edit this draft, so keep it private.
      </p>
      {note ? <p className="fp-error" style={{ marginTop: 0 }}><b>Reviewer note:</b> {note}</p> : null}
      <div className="gf-intro">
        <strong>Estimated time: 25-35 minutes · 8 steps · Save and continue later.</strong>
        <span> About {remaining} min left (a guide, not a countdown).</span>
        <span className={`gf-save ${save}`}>{save === "saving" ? "Saving…" : save === "saved" ? "Draft saved" : save === "error" ? "Not saved" : "Auto-save is on"}</span>
      </div>
      <div className="fp-progress" aria-label={`Step ${step + 1} of 8`}>
        {STEPS.map((s, i) => (
          <button type="button" key={s} className={i === step ? "cur" : i < step || i <= maxStep ? "done" : ""} style={{ cursor: i <= maxStep ? "pointer" : "default" }} onClick={() => i <= maxStep && go(i)} aria-current={i === step}>
            <span>{i < step ? "✓" : i + 1}</span><em>{s}</em>
          </button>
        ))}
      </div>
      <div className="fp-bar"><i style={{ width: `${((step + 1) / 8) * 100}%` }} /></div>
      <p className="fp-lead" style={{ fontSize: ".85rem" }}>Step {step + 1} of 8 · {pct}% complete</p>

      <form onSubmit={(e) => { e.preventDefault(); step === 7 ? submit() : go(step + 1); }} noValidate>
        {step === 0 && (
          <div className="fp-step">
            <h2>Personal information</h2><p className="fp-lead">Your legal name, date of birth and phone number stay private. Everything else appears on your public page after approval.</p>
            <div className="fp-grid">
              <Field label="Full legal name" req hint="Private. Used for verification only.">{input(d.p.legalName, (v) => setP("legalName", v))}</Field>
              <Field label="Public display name" req>{input(d.p.displayName, (v) => setP("displayName", v), "e.g. Pasang Sherpa")}</Field>
              <Field label="Profile photograph link" hint="Paste a link to your photo (Google Drive, Dropbox or your own site). Direct upload is coming soon.">{input(d.p.profilePhoto, (v) => setP("profilePhoto", v), "https://…")}</Field>
              <Field label="Cover photograph link">{input(d.p.coverPhoto, (v) => setP("coverPhoto", v), "https://…")}</Field>
              <Field label="Nationality" req>{input(d.p.nationality, (v) => setP("nationality", v))}</Field>
              <Field label="Current location" req>{input(d.p.location, (v) => setP("location", v), "e.g. Jomsom, Mustang")}</Field>
              <Field label="Date of birth" hint="Private.">{input(d.p.dob, (v) => setP("dob", v), "", "date")}</Field>
              <Field label="Phone number" req hint="Private. Provide a phone or WhatsApp number.">{input(d.p.phone, (v) => setP("phone", v), "+977…", "tel")}</Field>
              <Field label="WhatsApp number" hint="Shown publicly as a WhatsApp button. Leave empty to keep it private.">{input(d.p.whatsapp, (v) => setP("whatsapp", v), "+977…", "tel")}</Field>
              <Field label="Email address" req hint="Private. Used only to contact you about your portfolio.">{input(d.p.email, (v) => setP("email", v), "you@example.com", "email")}</Field>
              <Field label="Preferred contact method" req>{select(d.p.preferredContact, (v) => setP("preferredContact", v), CONTACT_METHODS)}</Field>
              <Field label="Website">{input(d.p.website, (v) => setP("website", v), "https://…", "url")}</Field>
            </div>
            <Field label="Professional headline" req hint="Example: Mustang trekking guide with local culture expertise" wide>{input(d.p.headline, (v) => setP("headline", v))}</Field>
            <Field label="Professional biography" req hint="Who you are, where you guide and what travellers can expect. At least 50 characters." wide>{area(d.p.bio, (v) => setP("bio", v), "", 6)}</Field>
            <div className="fp-field"><span className="fp-label">Languages spoken<b> *</b></span>{chips(LANGUAGES, d.languages, (v) => setD((x) => ({ ...x, languages: toggle(x.languages, v) })))}</div>
            <Field label="Social media links" hint="One per line." wide>{area(d.p.socials, (v) => setP("socials", v), "Instagram, Facebook, TikTok…", 2)}</Field>
          </div>
        )}

        {step === 1 && (
          <div className="fp-step">
            <h2>Professional experience and qualifications</h2><p className="fp-lead">Only enter what is true and that you can show if asked. Optional fields can stay empty.</p>
            <div className="fp-grid">
              <Field label="Total years of trekking experience" req>{input(d.q.yearsExp, (v) => setQ("yearsExp", v), "e.g. 6")}</Field>
              <Field label="Completed treks (approx.)">{input(d.q.treksDone, (v) => setQ("treksDone", v))}</Field>
              <Field label="Trekkers guided (approx.)">{input(d.q.trekkersGuided, (v) => setQ("trekkersGuided", v))}</Field>
              <Field label="Highest altitude reached">{input(d.q.highestAlt, (v) => setQ("highestAlt", v), "e.g. 5,416 m")}</Field>
              <Field label="Guide licence number" hint="Private. Used for verification only.">{input(d.q.licenceNo, (v) => setQ("licenceNo", v))}</Field>
              <Field label="Licence issuing authority" hint="Private.">{input(d.q.licenceAuthority, (v) => setQ("licenceAuthority", v))}</Field>
              <Field label="First aid training">{input(d.q.firstAid, (v) => setQ("firstAid", v), "Course name, year (only if trained)")}</Field>
              <Field label="Wilderness medical training">{input(d.q.wilderness, (v) => setQ("wilderness", v))}</Field>
              <Field label="Mountain rescue training">{input(d.q.rescue, (v) => setQ("rescue", v))}</Field>
              <Field label="Guide training">{input(d.q.training, (v) => setQ("training", v))}</Field>
            </div>
            <Field label="Previous trekking companies" wide>{area(d.q.previousCompanies, (v) => setQ("previousCompanies", v), "", 2)}</Field>
            <Field label="Memorable trekking experiences" wide>{area(d.q.memorable, (v) => setQ("memorable", v))}</Field>
            <Field label="Professional achievements" wide>{area(d.q.achievements, (v) => setQ("achievements", v), "", 2)}</Field>

            <h3 className="fp-sub">Employment history <small>optional</small></h3>
            {d.experiences.map((e, i) => (
              <div className="fp-repeat" key={i}>
                <div className="fp-grid">
                  {(["role", "company", "period", "regions"] as const).map((k) => (
                    <input key={k} placeholder={{ role: "Role", company: "Company (or 'Independent')", period: "Duration, e.g. 2019-2022", regions: "Regions" }[k]} value={e[k]} onChange={(ev) => setD((x) => ({ ...x, experiences: x.experiences.map((y, j) => (j === i ? { ...y, [k]: ev.target.value } : y)) }))} />
                  ))}
                </div>
                <textarea rows={2} placeholder="Responsibilities" value={e.details} onChange={(ev) => setD((x) => ({ ...x, experiences: x.experiences.map((y, j) => (j === i ? { ...y, details: ev.target.value } : y)) }))} />
                <button type="button" className="fp-del" aria-label="Remove" onClick={() => setD((x) => ({ ...x, experiences: x.experiences.filter((_, j) => j !== i) }))}><Trash2 size={15} /></button>
              </div>
            ))}
            <button type="button" className="fp-add" onClick={() => setD((x) => ({ ...x, experiences: [...x.experiences, { role: "", company: "", period: "", regions: "", details: "" }] }))}><Plus size={15} /> Add experience</button>

            <h3 className="fp-sub">Certifications <small>optional</small></h3>
            {d.certs.map((c, i) => (
              <div className="fp-repeat" key={i}>
                <div className="fp-grid">
                  {(["name", "issuer", "issued", "expiry", "link"] as const).map((k) => (
                    <input key={k} placeholder={{ name: "Certificate name", issuer: "Issuing organization", issued: "Issue date", expiry: "Expiry date (if any)", link: "Private link to certificate (Drive/Dropbox)" }[k]} value={c[k]} onChange={(ev) => setD((x) => ({ ...x, certs: x.certs.map((y, j) => (j === i ? { ...y, [k]: ev.target.value } : y)) }))} />
                  ))}
                </div>
                <button type="button" className="fp-del" aria-label="Remove" onClick={() => setD((x) => ({ ...x, certs: x.certs.filter((_, j) => j !== i) }))}><Trash2 size={15} /></button>
              </div>
            ))}
            <button type="button" className="fp-add" onClick={() => setD((x) => ({ ...x, certs: [...x.certs, { name: "", issuer: "", issued: "", expiry: "", link: "" }] }))}><Plus size={15} /> Add certificate</button>
            <p className="fp-lead" style={{ fontSize: ".82rem" }}>Certificate links are visible only to the reviewing admin. Direct document upload is coming soon.</p>
          </div>
        )}

        {step === 2 && (
          <div className="fp-step">
            <h2>Trekking regions and expertise</h2><p className="fp-lead">Select every region you genuinely know, then add details for each.</p>
            <div className="fp-field"><span className="fp-label">Regions<b> *</b></span>{chips(REGIONS, d.regions, (v) => setD((x) => ({ ...x, regions: toggle(x.regions, v) })))}</div>
            {d.regions.map((r) => {
              const info = d.regionInfo[r] ?? {};
              const set = (k: string, v: string) => setD((x) => ({ ...x, regionInfo: { ...x.regionInfo, [r]: { ...Object.fromEntries(REGION_KEYS.map((q) => [q, ""])), ...x.regionInfo[r], [k]: v } } }));
              return (
                <details className="gf-day" key={r} open><summary>{r}</summary>
                  <div className="fp-grid">
                    <Field label="Routes known">{input(info.routes ?? "", (v) => set("routes", v), "e.g. Upper Mustang, Annapurna Circuit")}</Field>
                    <Field label="Times route completed">{input(info.timesCompleted ?? "", (v) => set("timesCompleted", v))}</Field>
                    <Field label="Years of experience here">{input(info.yearsInRegion ?? "", (v) => set("yearsInRegion", v))}</Field>
                    <Field label="Highest altitude here">{input(info.highestAlt ?? "", (v) => set("highestAlt", v))}</Field>
                    <Field label="Difficulty levels handled">{input(info.difficulty ?? "", (v) => set("difficulty", v), "e.g. Easy to challenging")}</Field>
                    <Field label="Best seasons">{input(info.seasons ?? "", (v) => set("seasons", v))}</Field>
                  </div>
                  <Field label="Local cultural knowledge">{area(info.culture ?? "", (v) => set("culture", v), "", 2)}</Field>
                  <Field label="Route knowledge">{area(info.routeKnowledge ?? "", (v) => set("routeKnowledge", v), "", 2)}</Field>
                  <Field label="Special expertise">{area(info.expertise ?? "", (v) => set("expertise", v), "", 2)}</Field>
                </details>
              );
            })}
            <Field label="Other or custom destinations" wide>{area(d.customDestinations, (v) => setD((x) => ({ ...x, customDestinations: v })), "", 2)}</Field>
          </div>
        )}

        {step === 3 && (
          <div className="fp-step">
            <h2>Guide services and facilities</h2><p className="fp-lead">For each service choose what you actually provide. Leave the rest as &ldquo;Not provided&rdquo;.</p>
            <div className="gf-services">
              {SERVICES.map((s) => (
                <div key={s}><span>{s}</span>
                  <div className="gf-seg">{SERVICE_MODES.map(([k, label]) => <button type="button" key={k} className={d.services[s] === k ? "on" : ""} onClick={() => setD((x) => ({ ...x, services: { ...x.services, [s]: k as ServiceMode } }))}>{label}</button>)}</div>
                </div>
              ))}
            </div>
            <h3 className="fp-sub">Custom services <small>optional</small></h3>
            {d.customServices.map((c, i) => (
              <div className="fp-repeat" key={i}>
                <input placeholder="Service name" value={c.name} onChange={(e) => setD((x) => ({ ...x, customServices: x.customServices.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)) }))} />
                <div className="gf-seg">{SERVICE_MODES.map(([k, label]) => <button type="button" key={k} className={c.mode === k ? "on" : ""} onClick={() => setD((x) => ({ ...x, customServices: x.customServices.map((y, j) => (j === i ? { ...y, mode: k as ServiceMode } : y)) }))}>{label}</button>)}</div>
                <button type="button" className="fp-del" aria-label="Remove" onClick={() => setD((x) => ({ ...x, customServices: x.customServices.filter((_, j) => j !== i) }))}><Trash2 size={15} /></button>
              </div>
            ))}
            <button type="button" className="fp-add" onClick={() => setD((x) => ({ ...x, customServices: [...x.customServices, { name: "", mode: "included" }] }))}><Plus size={15} /> Add custom service</button>
          </div>
        )}

        {step === 4 && it && (
          <div className="fp-step">
            <h2>Trekking itinerary builder</h2><p className="fp-lead">Create up to {MAX_ITINERARIES} packages. Each becomes its own public page. Enter only real, checked route details.</p>
            {itTabs}
            <div className="gf-tools" style={{ marginBottom: 12 }}>
              <button type="button" onClick={() => { if (d.itineraries.length < MAX_ITINERARIES) { setD((x) => ({ ...x, itineraries: [...x.itineraries, { ...it, id: uid(), f: { ...it.f, title: `${it.f.title} (copy)` }, days: it.days.map((y) => ({ ...y, id: uid() })), pricing: { ...it.pricing, costs: it.pricing.costs.map((c) => ({ ...c, id: uid() })) } }] })); setAi(d.itineraries.length); } }}><Copy size={14} /> Duplicate itinerary</button>
              {d.itineraries.length > 1 ? <button type="button" className="gf-danger" onClick={() => { if (confirm("Delete this whole itinerary?")) { setD((x) => ({ ...x, itineraries: x.itineraries.filter((_, j) => j !== ai) })); setAi(0); } }}><Trash2 size={14} /> Delete itinerary</button> : null}
            </div>
            <div className="fp-grid">
              {(["title", "region", "destination", "durationDays", "nights", "start", "end", "maxAlt", "distanceKm", "difficulty", "season", "minAge", "fitness", "minPart", "maxPart", "accommodation", "transport", "permits"] as const).map((k) => (
                <Field key={k} label={LABELS[k]} req={k === "title" || k === "region"}>
                  {k === "region" ? select(it.f.region, (v) => setIt(ai, (x) => ({ ...x, f: { ...x.f, region: v } })), REGIONS) :
                    k === "difficulty" ? select(it.f.difficulty, (v) => setIt(ai, (x) => ({ ...x, f: { ...x.f, difficulty: v } })), DIFFICULTY) :
                    k === "fitness" ? select(it.f.fitness, (v) => setIt(ai, (x) => ({ ...x, f: { ...x.f, fitness: v } })), FITNESS) :
                    k === "season" ? select(it.f.season, (v) => setIt(ai, (x) => ({ ...x, f: { ...x.f, season: v } })), SEASONS) :
                    input(it.f[k], (v) => setIt(ai, (x) => ({ ...x, f: { ...x.f, [k]: v } })))}
                </Field>
              ))}
            </div>
            {(["short", "detail", "highlights", "photos", "mapLink", "gpsLink"] as const).map((k) => (
              <Field key={k} label={LABELS[k]} req={k === "short"} wide hint={k === "photos" ? "Links to real photos of this route." : undefined}>
                {k === "mapLink" || k === "gpsLink" ? input(it.f[k], (v) => setIt(ai, (x) => ({ ...x, f: { ...x.f, [k]: v } })), "https://…") : area(it.f[k], (v) => setIt(ai, (x) => ({ ...x, f: { ...x.f, [k]: v } })), "", k === "detail" ? 5 : 2)}
              </Field>
            ))}

            <h3 className="fp-sub">Day-by-day itinerary ({it.days.length} day{it.days.length === 1 ? "" : "s"})</h3>
            {it.days.map((day, i) => dayEditor(day, i, it.days.length))}
            <button type="button" className="fp-add" onClick={() => setIt(ai, (x) => ({ ...x, days: [...x.days, emptyDay(x.days.length + 1)] }))}><Plus size={15} /> Add day</button>

            <h3 className="fp-sub">Contingency and safety</h3>
            {(["alternatives", "emergencyExit", "changes", "weather", "safetyInfo"] as const).map((k) => (
              <Field key={k} label={LABELS[k]} wide>{area(it.f[k], (v) => setIt(ai, (x) => ({ ...x, f: { ...x.f, [k]: v } })), "", 2)}</Field>
            ))}
            <details className="gf-day"><summary>Preview this itinerary</summary><PackageView it={it} /></details>
          </div>
        )}

        {step === 5 && it && (
          <div className="fp-step">
            <h2>Package pricing and cost breakdown</h2><p className="fp-lead">Each itinerary has its own pricing. Enter real figures only; nothing is pre-filled.</p>
            {itTabs}
            {(() => {
              const pr = it.pricing;
              const setPr = (fn: (p: typeof pr) => typeof pr) => setIt(ai, (x) => ({ ...x, pricing: fn(x.pricing) }));
              const setF = (k: string, v: string) => setPr((p) => ({ ...p, f: { ...p.f, [k]: v } }));
              const b = itineraryBreakdown(it);
              return (
                <>
                  <div className="fp-grid">
                    <Field label="Price type" req hint="Be clear whether the price is an estimate, a starting price or confirmed."><select value={pr.status} onChange={(e) => setPr((p) => ({ ...p, status: e.target.value as typeof p.status }))}>{PRICE_STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
                    <Field label="Currency" req><select value={pr.currency} onChange={(e) => setPr((p) => ({ ...p, currency: e.target.value as typeof p.currency }))}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
                    {([["perPerson", "Price per person"], ["perGroup", "Price per group"], ["private", "Private trekking price"], ["groupPrice", "Group trekking price"], ["perDay", "Price per day"], ["minGroup", "Minimum group size"], ["maxGroup", "Maximum group size"], ["single", "Single supplement"], ["child", "Child pricing"]] as const).map(([k, l]) => (
                      <Field key={k} label={l}>{input(pr.f[k], (v) => setF(k, v))}</Field>
                    ))}
                  </div>
                  <Field label="Seasonal pricing" wide>{area(pr.f.seasonal, (v) => setF("seasonal", v), "e.g. Oct-Nov: +10%", 2)}</Field>
                  <Field label="Custom package pricing" wide hint="Use this if you quote per request.">{area(pr.f.custom, (v) => setF("custom", v), "", 2)}</Field>

                  <h3 className="fp-sub">Cost breakdown (your own figures)</h3>
                  <div className="gf-costs">
                    {pr.costs.map((c, i) => (
                      <div key={c.id}>
                        <input list="cost-presets" placeholder="Item" value={c.label} onChange={(e) => setPr((p) => ({ ...p, costs: p.costs.map((y, j) => (j === i ? { ...y, label: e.target.value } : y)) }))} />
                        <input placeholder="Amount" inputMode="decimal" value={c.amount} onChange={(e) => setPr((p) => ({ ...p, costs: p.costs.map((y, j) => (j === i ? { ...y, amount: e.target.value } : y)) }))} />
                        <select value={c.scope} onChange={(e) => setPr((p) => ({ ...p, costs: p.costs.map((y, j) => (j === i ? { ...y, scope: e.target.value as typeof y.scope } : y)) }))}>{COST_SCOPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
                        <button type="button" className="gf-danger" aria-label="Remove" onClick={() => setPr((p) => ({ ...p, costs: p.costs.filter((_, j) => j !== i) }))}><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <datalist id="cost-presets">{COST_PRESETS.map((x) => <option key={x} value={x} />)}</datalist>
                  </div>
                  <button type="button" className="fp-add" onClick={() => setPr((p) => ({ ...p, costs: [...p.costs, { id: uid(), label: "", amount: "", scope: "group" }] }))}><Plus size={15} /> Add cost item</button>
                  <div className="gf-total">
                    <label>Travellers for this calculation <input inputMode="numeric" value={pr.travellers} placeholder={String(b.travellers)} onChange={(e) => setPr((p) => ({ ...p, travellers: e.target.value.replace(/\D/g, "").slice(0, 3) }))} /></label>
                    <p>Per-person items {money(b.perPersonCosts, pr.currency)} · per-group {money(b.groupCosts, pr.currency)} · per-day {money(b.dayCosts, pr.currency)} (x {b.days} days) · one-time {money(b.onceCosts, pr.currency)}</p>
                    <p><b>Total {money(b.total, pr.currency)}</b> · {money(b.perPerson, pr.currency)} per person · {money(b.perDay, pr.currency)} per day{b.optional ? ` · optional extras ${money(b.optional, pr.currency)} (not in total)` : ""}</p>
                  </div>

                  <div className="fp-field"><span className="fp-label">Included in package</span>{chips(INCLUDED, pr.included, (v) => setPr((p) => ({ ...p, included: toggle(p.included, v) })))}</div>
                  <Field label="Other included services" wide>{area(pr.customIncluded, (v) => setPr((p) => ({ ...p, customIncluded: v })), "One per line", 2)}</Field>
                  <div className="fp-field"><span className="fp-label">Not included</span>{chips(EXCLUDED, pr.excluded, (v) => setPr((p) => ({ ...p, excluded: toggle(p.excluded, v) })))}</div>
                  <Field label="Other exclusions" wide>{area(pr.customExcluded, (v) => setPr((p) => ({ ...p, customExcluded: v })), "One per line", 2)}</Field>

                  <h3 className="fp-sub">Payment and cancellation</h3>
                  <div className="fp-grid">
                    {([["deposit", "Booking deposit (amount or %)"], ["balanceDeadline", "Remaining payment deadline"], ["paymentMethods", "Accepted payment methods"], ["cancelDeadline", "Cancellation deadline"]] as const).map(([k, l]) => (
                      <Field key={k} label={l}>{input(pr.f[k], (v) => setF(k, v))}</Field>
                    ))}
                  </div>
                  {([["refund", "Refund conditions"], ["weatherPolicy", "Weather cancellation policy"], ["flightPolicy", "Flight delay policy"], ["emergencyPolicy", "Emergency changes policy"]] as const).map(([k, l]) => (
                    <Field key={k} label={l} wide>{area(pr.f[k], (v) => setF(k, v), "", 2)}</Field>
                  ))}
                </>
              );
            })()}
          </div>
        )}

        {step === 6 && (
          <div className="fp-step">
            <h2>Safety, availability and gallery</h2>
            <div className="fp-grid">
              <Field label="First aid certification status">{input(d.safety.firstAidStatus, (v) => setS("firstAidStatus", v), "e.g. Certified / Not certified")}</Field>
              <Field label="First aid expiry date">{input(d.safety.firstAidExpiry, (v) => setS("firstAidExpiry", v), "", "date")}</Field>
              <Field label="Emergency contact name" req hint="Private.">{input(d.safety.emergencyName, (v) => setS("emergencyName", v))}</Field>
              <Field label="Emergency contact phone" hint="Private.">{input(d.safety.emergencyPhone, (v) => setS("emergencyPhone", v), "", "tel")}</Field>
              <Field label="Satellite phone available?">{select(d.safety.satPhone, (v) => setS("satPhone", v), ["Yes", "No", "On request"])}</Field>
              <Field label="Communication equipment">{input(d.safety.commsEquipment, (v) => setS("commsEquipment", v))}</Field>
            </div>
            {([["responseExperience", "Emergency response experience"], ["altitudeAwareness", "Altitude sickness awareness"], ["acclimatization", "Acclimatization arrangements"], ["evacuation", "Emergency evacuation procedure"], ["rescue", "Rescue coordination arrangements"], ["weatherMonitoring", "Weather monitoring"], ["insurance", "Travel insurance requirements"], ["evacInsurance", "Emergency evacuation insurance requirements"]] as const).map(([k, l]) => (
              <Field key={k} label={l} wide>{area(d.safety[k], (v) => setS(k, v), "", 2)}</Field>
            ))}

            <h3 className="fp-sub">Availability</h3>
            <div className="fp-field"><span className="fp-label">Available seasons</span>{chips(SEASONS, d.availSeasons, (v) => setD((x) => ({ ...x, availSeasons: toggle(x.availSeasons, v) })))}</div>
            <div className="fp-field"><span className="fp-label">Available months</span>{chips(MONTHS, d.availMonths, (v) => setD((x) => ({ ...x, availMonths: toggle(x.availMonths, v) })))}</div>
            <div className="fp-grid">
              {AVAIL_KEYS.map((k) => (
                <Field key={k} label={{ dates: "Available dates", unavailable: "Unavailable dates", maxGroups: "Maximum groups at one time", maxCapacity: "Maximum group capacity", advance: "Advance booking requirement" }[k] ?? k}>{input(d.avail[k], (v) => setA(k, v))}</Field>
              ))}
            </div>

            <h3 className="fp-sub">Gallery <small>photo links</small></h3>
            {d.gallery.map((g, i) => (
              <div className="fp-repeat" key={i}>
                <div className="fp-grid">
                  <select value={g.category} onChange={(e) => setD((x) => ({ ...x, gallery: x.gallery.map((y, j) => (j === i ? { ...y, category: e.target.value } : y)) }))}>{GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
                  <input placeholder="Photo link https://…" value={g.url} onChange={(e) => setD((x) => ({ ...x, gallery: x.gallery.map((y, j) => (j === i ? { ...y, url: e.target.value } : y)) }))} />
                </div>
                <input placeholder="Caption" value={g.caption} onChange={(e) => setD((x) => ({ ...x, gallery: x.gallery.map((y, j) => (j === i ? { ...y, caption: e.target.value } : y)) }))} />
                <button type="button" className="fp-del" aria-label="Remove" onClick={() => setD((x) => ({ ...x, gallery: x.gallery.filter((_, j) => j !== i) }))}><Trash2 size={15} /></button>
              </div>
            ))}
            <button type="button" className="fp-add" onClick={() => setD((x) => ({ ...x, gallery: [...x.gallery, { category: GALLERY_CATEGORIES[0], url: "", caption: "" }] }))}><Plus size={15} /> Add photo</button>
            <p className="fp-lead" style={{ fontSize: ".82rem" }}>Photos in the &ldquo;Certificates (private)&rdquo; category are never shown publicly. Direct upload is coming soon.</p>
          </div>
        )}

        {step === 7 && (
          <div className="fp-step">
            <h2>Review and publish</h2><p className="fp-lead">This is how your public portfolio will look. Use the progress bar above to go back and edit any step.</p>
            <ProfileView d={d} preview />
            {d.itineraries.map((x) => <details className="gf-day" key={x.id}><summary>{x.f.title || "Untitled itinerary"}</summary><PackageView it={x} /></details>)}
            <label className="fp-consent">
              <input type="checkbox" checked={d.confirm} onChange={(e) => setD((x) => ({ ...x, confirm: e.target.checked }))} />
              <span>I confirm that the professional information, trekking experience, qualifications, itinerary details, and prices I have submitted are accurate to the best of my knowledge.</span>
            </label>
          </div>
        )}

        {error && <p className="fp-error" role="alert">{error}</p>}
        <div className="fp-actions">
          {step > 0 ? <button type="button" className="fp-back" onClick={() => go(step - 1)}><ArrowLeft size={16} /> Back</button> : <span />}
          <div className="gf-right">
            <button type="button" className="fp-back" onClick={saveNow}><Save size={16} /> Save as Draft</button>
            {step < 7 ? <button type="submit" className="fp-next">Continue <ArrowRight size={16} /></button> : <button type="submit" className="fp-next fp-submit" disabled={sending}>{sending ? "Submitting…" : "Submit for Verification"} <Send size={16} /></button>}
          </div>
        </div>
      </form>
    </div>
  );
}
