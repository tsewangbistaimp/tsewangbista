"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CheckCircle2, Copy, Plus, Save, Send, Trash2 } from "lucide-react";
import { ProfileView, PackageView } from "../../GuideView";
import { itineraryBreakdown, money } from "../../../../lib/guide/pricing";
import {
  COST_PRESETS, COST_SCOPES, CURRENCIES, DAY_TYPES, DIFFICULTY, EXCLUDED, INCLUDED, LANGUAGES, MAX_ITINERARIES, MONTHS, PRICE_STATUS, REGIONS, SEASONS, SERVICES, TOTAL_STEPS,
  emptyDay, emptyItinerary, uid, validateStep, type Day, type GuideData, type Itinerary
} from "../../../../lib/guide/types";
import "../../../services/free-portfolio/form.css";
import "../../guides.css";
import "./guide-form.css";

const STEPS = ["About you", "Experience", "Services & safety", "Itineraries & prices", "Review"];
const MINUTES = [3, 3, 2, 6, 1]; // guidance only (about 15 minutes)
const LAST = TOTAL_STEPS - 1;

type Props = { token: string; initial: GuideData; step: number; note: string | null };

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
  const [step, setStep] = useState(Math.min(LAST, startStep));
  const [maxStep, setMaxStep] = useState(Math.min(LAST, startStep));
  const [save, setSave] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ai, setAi] = useState(0);
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

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const t = setTimeout(persist, 1500);
    return () => clearTimeout(t);
  }, [d, step, persist]);

  const setP = (k: string, v: string) => setD((x) => ({ ...x, p: { ...x.p, [k]: v } }));
  const setQ = (k: string, v: string) => setD((x) => ({ ...x, q: { ...x.q, [k]: v } }));
  const setS = (k: string, v: string) => setD((x) => ({ ...x, safety: { ...x.safety, [k]: v } }));
  const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((i) => i !== v) : [...arr, v]);
  const setIt = (i: number, fn: (it: Itinerary) => Itinerary) => setD((x) => ({ ...x, itineraries: x.itineraries.map((it, j) => (j === i ? fn(it) : it)) }));

  const remaining = MINUTES.slice(step).reduce((a, b) => a + b, 0);

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
    for (let s = 0; s < TOTAL_STEPS; s++) {
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
        <p>Thank you. Your portfolio is waiting for review. It becomes public only after it is approved, and we will contact you at <strong>{d.p.email}</strong> when the status changes.</p>
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

  const it = d.itineraries[ai] ?? d.itineraries[0];
  const setF = (k: string, v: string) => setIt(ai, (x) => ({ ...x, f: { ...x.f, [k]: v } }));

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
          <Field label="From">{input(day.from, (v) => set("from", v))}</Field>
          <Field label="To">{input(day.to, (v) => set("to", v))}</Field>
          <Field label="Ending altitude">{input(day.altEnd, (v) => set("altEnd", v), "e.g. 2,810 m")}</Field>
          <Field label="Walking time">{input(day.hours, (v) => set("hours", v), "e.g. 5-6 hours")}</Field>
          <Field label="Overnight stay">{input(day.stay, (v) => set("stay", v))}</Field>
          <Field label="Meals">{input(day.meals, (v) => set("meals", v), "e.g. B, L, D")}</Field>
        </div>
        <Field label="What happens this day">{area(day.description, (v) => set("description", v), "", 2)}</Field>
      </details>
    );
  };

  const pr = it?.pricing;
  const setPr = (fn: (p: NonNullable<typeof pr>) => NonNullable<typeof pr>) => setIt(ai, (x) => ({ ...x, pricing: fn(x.pricing) }));
  const setPf = (k: string, v: string) => setPr((p) => ({ ...p, f: { ...p.f, [k]: v } }));
  const b = it ? itineraryBreakdown(it) : null;

  return (
    <div className="fp-card gf" ref={top}>
      <p className="fp-lead" style={{ fontSize: ".85rem" }}>
        To continue later on any device, save this page&apos;s link.{" "}
        <button type="button" className="gf-linkbtn" onClick={() => { navigator.clipboard?.writeText(window.location.href); setCopied(true); }}>{copied ? "Link copied" : "Copy my link"}</button>{" "}
        Anyone with the link can edit this draft, so keep it private.
      </p>
      {note ? <p className="fp-error" style={{ marginTop: 0 }}><b>Reviewer note:</b> {note}</p> : null}
      <div className="gf-intro">
        <strong>Estimated time: 10-15 minutes · {TOTAL_STEPS} steps · Save and continue later.</strong>
        <span>About {remaining} min left (a guide, not a countdown).</span>
        <span className={`gf-save ${save}`}>{save === "saving" ? "Saving…" : save === "saved" ? "Draft saved" : save === "error" ? "Not saved" : "Auto-save is on"}</span>
      </div>
      <div className="fp-progress" aria-label={`Step ${step + 1} of ${TOTAL_STEPS}`}>
        {STEPS.map((s, i) => (
          <button type="button" key={s} className={i === step ? "cur" : i <= maxStep ? "done" : ""} style={{ cursor: i <= maxStep ? "pointer" : "default" }} onClick={() => i <= maxStep && go(i)} aria-current={i === step}>
            <span>{i < step ? "✓" : i + 1}</span><em>{s}</em>
          </button>
        ))}
      </div>
      <div className="fp-bar"><i style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} /></div>
      <p className="fp-lead" style={{ fontSize: ".85rem" }}>Step {step + 1} of {TOTAL_STEPS} · {Math.round((step / TOTAL_STEPS) * 100)}% complete</p>

      <form onSubmit={(e) => { e.preventDefault(); step === LAST ? submit() : go(step + 1); }} noValidate>
        {step === 0 && (
          <div className="fp-step">
            <h2>About you</h2><p className="fp-lead">Your legal name, phone and email stay private. The rest appears on your public page after approval.</p>
            <div className="fp-grid">
              <Field label="Full legal name" req hint="Private. For verification only.">{input(d.p.legalName, (v) => setP("legalName", v))}</Field>
              <Field label="Public display name" req>{input(d.p.displayName, (v) => setP("displayName", v), "e.g. Pasang Sherpa")}</Field>
              <Field label="Current location" req>{input(d.p.location, (v) => setP("location", v), "e.g. Jomsom, Mustang")}</Field>
              <Field label="Email" req hint="Private.">{input(d.p.email, (v) => setP("email", v), "you@example.com", "email")}</Field>
              <Field label="WhatsApp number" req hint="Add WhatsApp or phone. WhatsApp shows as a public button.">{input(d.p.whatsapp, (v) => setP("whatsapp", v), "+977…", "tel")}</Field>
              <Field label="Phone number" hint="Private.">{input(d.p.phone, (v) => setP("phone", v), "+977…", "tel")}</Field>
            </div>
            <Field label="Professional headline" req wide hint="Example: Mustang trekking guide with local culture expertise">{input(d.p.headline, (v) => setP("headline", v))}</Field>
            <Field label="Short biography" req wide hint="Who you are and what trekkers can expect. At least 50 characters.">{area(d.p.bio, (v) => setP("bio", v), "", 5)}</Field>
            <div className="fp-field"><span className="fp-label">Languages spoken<b> *</b></span>{chips(LANGUAGES, d.languages, (v) => setD((x) => ({ ...x, languages: toggle(x.languages, v) })))}</div>
            <Field label="Profile photo link" wide hint="Link to your photo (Google Drive, Dropbox, Instagram or your site).">{input(d.p.profilePhoto, (v) => setP("profilePhoto", v), "https://…")}</Field>
          </div>
        )}

        {step === 1 && (
          <div className="fp-step">
            <h2>Experience</h2><p className="fp-lead">Only enter what is true and that you can show if asked.</p>
            <div className="fp-grid">
              <Field label="Years of trekking experience" req>{input(d.q.yearsExp, (v) => setQ("yearsExp", v), "e.g. 6")}</Field>
              <Field label="Treks completed (approx.)">{input(d.q.treksDone, (v) => setQ("treksDone", v))}</Field>
              <Field label="Highest altitude reached">{input(d.q.highestAlt, (v) => setQ("highestAlt", v), "e.g. 5,416 m")}</Field>
              <Field label="Guide licence number" hint="Private. For verification only.">{input(d.q.licenceNo, (v) => setQ("licenceNo", v))}</Field>
            </div>
            <div className="fp-field"><span className="fp-label">Trekking regions you know<b> *</b></span>{chips(REGIONS, d.regions, (v) => setD((x) => ({ ...x, regions: toggle(x.regions, v) })))}</div>
            {d.regions.map((r) => (
              <Field key={r} label={`${r}: routes you know`} wide>
                {input(d.regionInfo[r]?.routes ?? "", (v) => setD((x) => ({ ...x, regionInfo: { ...x.regionInfo, [r]: { ...x.regionInfo[r], routes: v } } })), "e.g. Upper Mustang, Annapurna Circuit")}
              </Field>
            ))}
            <h3 className="fp-sub">Certificates <small>optional</small></h3>
            {d.certs.map((c, i) => (
              <div className="fp-repeat" key={i}>
                <div className="fp-grid">
                  <input placeholder="Certificate name" value={c.name} onChange={(e) => setD((x) => ({ ...x, certs: x.certs.map((y, j) => (j === i ? { ...y, name: e.target.value } : y)) }))} />
                  <input placeholder="Issued by" value={c.issuer} onChange={(e) => setD((x) => ({ ...x, certs: x.certs.map((y, j) => (j === i ? { ...y, issuer: e.target.value } : y)) }))} />
                  <input placeholder="Private link to certificate (optional)" value={c.link} onChange={(e) => setD((x) => ({ ...x, certs: x.certs.map((y, j) => (j === i ? { ...y, link: e.target.value } : y)) }))} />
                </div>
                <button type="button" className="fp-del" aria-label="Remove" onClick={() => setD((x) => ({ ...x, certs: x.certs.filter((_, j) => j !== i) }))}><Trash2 size={15} /></button>
              </div>
            ))}
            <button type="button" className="fp-add" onClick={() => setD((x) => ({ ...x, certs: [...x.certs, { name: "", issuer: "", issued: "", expiry: "", link: "" }] }))}><Plus size={15} /> Add certificate</button>
          </div>
        )}

        {step === 2 && (
          <div className="fp-step">
            <h2>Services &amp; safety</h2><p className="fp-lead">Everything here is optional. Choose only what you really provide.</p>
            <div className="fp-field"><span className="fp-label">Services you provide</span>
              {chips(SERVICES, SERVICES.filter((s) => d.services[s] !== "none"), (v) => setD((x) => ({ ...x, services: { ...x.services, [v]: x.services[v] === "none" ? "included" : "none" } })))}
            </div>
            <div className="fp-field"><span className="fp-label">Months you are available</span>{chips(MONTHS, d.availMonths, (v) => setD((x) => ({ ...x, availMonths: toggle(x.availMonths, v) })))}</div>
            <div className="fp-grid">
              <Field label="First aid status">{input(d.safety.firstAidStatus, (v) => setS("firstAidStatus", v), "e.g. Certified (year) / Not certified")}</Field>
              <Field label="Satellite phone?">{select(d.safety.satPhone, (v) => setS("satPhone", v), ["Yes", "No", "On request"])}</Field>
              <Field label="Emergency contact name" hint="Private.">{input(d.safety.emergencyName, (v) => setS("emergencyName", v))}</Field>
              <Field label="Emergency contact phone" hint="Private.">{input(d.safety.emergencyPhone, (v) => setS("emergencyPhone", v), "", "tel")}</Field>
            </div>
            <Field label="Emergency evacuation procedure" wide>{area(d.safety.evacuation, (v) => setS("evacuation", v), "", 2)}</Field>
          </div>
        )}

        {step === 3 && !it && (
          <div className="fp-step">
            <h2>Itineraries &amp; prices</h2>
            <p className="fp-lead">Add your first trekking package. Each package gets its own page with a day-by-day plan and a price. You can add up to {MAX_ITINERARIES}.</p>
            <button type="button" className="fp-next" onClick={() => { setD((x) => ({ ...x, itineraries: [emptyItinerary()] })); setAi(0); }}><Plus size={16} /> Add my first itinerary</button>
          </div>
        )}

        {step === 3 && it && pr && b && (
          <div className="fp-step">
            <h2>Itineraries &amp; prices</h2><p className="fp-lead">Add up to {MAX_ITINERARIES} trekking packages. Each one has its own page and price. Enter only real, checked details.</p>
            <div className="gf-tabs">
              {d.itineraries.map((x, i) => <button type="button" key={x.id} className={i === ai ? "on" : ""} onClick={() => setAi(i)}>{x.f.title || `Itinerary ${i + 1}`}</button>)}
              {d.itineraries.length < MAX_ITINERARIES ? <button type="button" className="gf-add" onClick={() => { setD((x) => ({ ...x, itineraries: [...x.itineraries, emptyItinerary()] })); setAi(d.itineraries.length); }}><Plus size={14} /> Add itinerary ({d.itineraries.length}/{MAX_ITINERARIES})</button> : null}
            </div>
            <div className="gf-tools" style={{ marginBottom: 12 }}>
              <button type="button" onClick={() => { if (d.itineraries.length < MAX_ITINERARIES) { setD((x) => ({ ...x, itineraries: [...x.itineraries, { ...it, id: uid(), f: { ...it.f, title: `${it.f.title} (copy)` }, days: it.days.map((y) => ({ ...y, id: uid() })), pricing: { ...it.pricing, costs: it.pricing.costs.map((c) => ({ ...c, id: uid() })) } }] })); setAi(d.itineraries.length); } }}><Copy size={14} /> Duplicate</button>
              {d.itineraries.length > 1 ? <button type="button" className="gf-danger" onClick={() => { if (confirm("Delete this whole itinerary?")) { setD((x) => ({ ...x, itineraries: x.itineraries.filter((_, j) => j !== ai) })); setAi(0); } }}><Trash2 size={14} /> Delete itinerary</button> : null}
            </div>
            <div className="fp-grid">
              <Field label="Package title" req>{input(it.f.title, (v) => setF("title", v), "e.g. Upper Mustang Trek")}</Field>
              <Field label="Region" req>{select(it.f.region, (v) => setF("region", v), REGIONS)}</Field>
              <Field label="Duration (days)">{input(it.f.durationDays, (v) => setF("durationDays", v))}</Field>
              <Field label="Difficulty">{select(it.f.difficulty, (v) => setF("difficulty", v), DIFFICULTY)}</Field>
              <Field label="Starting point">{input(it.f.start, (v) => setF("start", v))}</Field>
              <Field label="Ending point">{input(it.f.end, (v) => setF("end", v))}</Field>
              <Field label="Maximum altitude">{input(it.f.maxAlt, (v) => setF("maxAlt", v))}</Field>
              <Field label="Best season">{select(it.f.season, (v) => setF("season", v), SEASONS)}</Field>
            </div>
            <Field label="Short description" req wide>{area(it.f.short, (v) => setF("short", v), "", 2)}</Field>
            <Field label="Photo links" wide hint="Links to real photos of this route, one per line.">{area(it.f.photos, (v) => setF("photos", v), "", 2)}</Field>

            <h3 className="fp-sub">Day by day ({it.days.length})</h3>
            {it.days.map((day, i) => dayEditor(day, i, it.days.length))}
            <button type="button" className="fp-add" onClick={() => setIt(ai, (x) => ({ ...x, days: [...x.days, emptyDay(x.days.length + 1)] }))}><Plus size={15} /> Add day</button>

            <h3 className="fp-sub">Price for this package</h3>
            <div className="fp-grid">
              <Field label="Price type" req><select value={pr.status} onChange={(e) => setPr((p) => ({ ...p, status: e.target.value as typeof p.status }))}>{PRICE_STATUS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
              <Field label="Currency" req><select value={pr.currency} onChange={(e) => setPr((p) => ({ ...p, currency: e.target.value as typeof p.currency }))}>{CURRENCIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
              <Field label="Price per person" hint="Enter a price per person, per group, or custom pricing.">{input(pr.f.perPerson, (v) => setPf("perPerson", v))}</Field>
              <Field label="Price per group">{input(pr.f.perGroup, (v) => setPf("perGroup", v))}</Field>
              <Field label="Minimum group size">{input(pr.f.minGroup, (v) => setPf("minGroup", v))}</Field>
              <Field label="Maximum group size">{input(pr.f.maxGroup, (v) => setPf("maxGroup", v))}</Field>
            </div>
            <Field label="Custom pricing note" wide>{area(pr.f.custom, (v) => setPf("custom", v), "e.g. Price changes with group size. Ask for a quote.", 2)}</Field>
            <div className="fp-field"><span className="fp-label">Included</span>{chips(INCLUDED, pr.included, (v) => setPr((p) => ({ ...p, included: toggle(p.included, v) })))}</div>
            <div className="fp-field"><span className="fp-label">Not included</span>{chips(EXCLUDED, pr.excluded, (v) => setPr((p) => ({ ...p, excluded: toggle(p.excluded, v) })))}</div>
            <Field label="Cancellation and refund policy" wide>{area(pr.f.refund, (v) => setPf("refund", v), "", 2)}</Field>

            <details className="gf-day"><summary>Detailed cost breakdown (optional)</summary>
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
                <label>Travellers <input inputMode="numeric" value={pr.travellers} placeholder={String(b.travellers)} onChange={(e) => setPr((p) => ({ ...p, travellers: e.target.value.replace(/\D/g, "").slice(0, 3) }))} /></label>
                <p><b>Total {money(b.total, pr.currency)}</b> · {money(b.perPerson, pr.currency)} per person · {money(b.perDay, pr.currency)} per day{b.optional ? ` · optional extras ${money(b.optional, pr.currency)} (not in total)` : ""}</p>
              </div>
            </details>
          </div>
        )}

        {step === 4 && (
          <div className="fp-step">
            <h2>Review and submit</h2><p className="fp-lead">This is how your public portfolio will look. Use the steps above to edit anything.</p>
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
            {step < LAST ? <button type="submit" className="fp-next">Continue <ArrowRight size={16} /></button> : <button type="submit" className="fp-next fp-submit" disabled={sending}>{sending ? "Submitting…" : "Submit for Verification"} <Send size={16} /></button>}
          </div>
        </div>
      </form>
    </div>
  );
}
