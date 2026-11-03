"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Send } from "lucide-react";
import "../free-portfolio/form.css";

const initial = {
  name: "", email: "", phone: "", country: "",
  trek: "", tripType: "", dates: "", duration: "",
  groupSize: "", experience: "", accommodation: "", budget: "", requirements: "", message: "",
  consent: false, website_hp: ""
};

const steps = ["You", "Your trek", "Group & needs", "Review"];
const minutesPerStep = [1, 1.5, 1.5, 0.5];
const treks = [
  "Upper Mustang", "Lower Mustang", "Jomsom to Muktinath", "Lo Manthang cultural trek", "Annapurna Circuit",
  "Annapurna Base Camp", "Ghorepani Poon Hill", "Mardi Himal", "Everest Base Camp", "Langtang Valley", "Not sure yet"
];
const tripTypes = ["Private trek", "Join a group", "Custom itinerary", "Just asking"];
const levels = ["First trek", "Some hiking", "Experienced trekker"];
const stays = ["Basic teahouses", "Comfortable lodges", "Mix / no preference"];

export default function TrekForm() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(initial);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [doneId, setDoneId] = useState("");
  const key = useRef(`trek-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);
  const top = useRef<HTMLDivElement>(null);

  const set = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) => setF((p) => ({ ...p, [k]: v }));
  const text = (k: keyof typeof initial) => ({ value: f[k] as string, onChange: (e: { target: { value: string } }) => set(k, e.target.value as never) });

  const remaining = Math.max(1, Math.ceil(minutesPerStep.slice(step).reduce((a, b) => a + b, 0)));
  const percent = Math.round((step / steps.length) * 100);

  function validate(s: number): string {
    if (s === 0) {
      if (f.name.trim().length < 2) return "Please enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return "Please enter a valid email address.";
      if (f.country.trim().length < 2) return "Please enter your country.";
    }
    if (s === 1) {
      if (!f.trek) return "Please choose a trek (or 'Not sure yet').";
      if (!f.tripType) return "Please choose a trip type.";
    }
    if (s === 3 && !f.consent) return "Please confirm that we may contact you about this enquiry.";
    return "";
  }

  function go(next: number) {
    if (next > step) {
      const m = validate(step);
      if (m) { setError(m); return; }
    }
    setError("");
    setStep(next);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit() {
    for (let s = 0; s < steps.length; s++) {
      const m = validate(s);
      if (m) { setStep(s); setError(m); return; }
    }
    setSending(true);
    setError("");
    try {
      const r = await fetch("/api/trekking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, idempotencyKey: key.current })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDoneId(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (doneId) {
    return (
      <div className="fp-card fp-done" id="register">
        <CheckCircle2 size={56} />
        <h2>Enquiry sent</h2>
        <p>Thank you, {f.name.split(" ")[0]}. I will reply to <strong>{f.email}</strong> soon. This is an enquiry only. Nothing is booked or charged yet.</p>
        <span className="fp-ref">Reference: {doneId}</span>
      </div>
    );
  }

  const field = (label: string, node: React.ReactNode, hint?: string, req?: boolean) => (
    <label className="fp-field">
      <span className="fp-label">{label}{req ? <b> *</b> : <em style={{ fontStyle: "normal", opacity: 0.6 }}> (optional)</em>}</span>
      {node}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
  const input = (k: keyof typeof initial, ph = "", type = "text") => <input type={type} placeholder={ph} {...text(k)} />;
  const chips = (list: string[], k: "trek" | "tripType" | "experience" | "accommodation") => (
    <div className="fp-chips">
      {list.map((o) => (
        <button type="button" key={o} className={f[k] === o ? "on" : ""} onClick={() => set(k, f[k] === o ? "" : o)}>{o}</button>
      ))}
    </div>
  );

  return (
    <div className="fp-card" id="register" ref={top}>
      <p className="fp-lead" style={{ marginBottom: 14 }}>
        <strong>Estimated time: 3-5 minutes.</strong> Have ready: preferred trek and rough dates, group size, and any medical or dietary needs. This is an estimate, not a guarantee.
      </p>
      <div className="fp-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((s, i) => (
          <button type="button" key={s} className={i === step ? "cur" : i < step ? "done" : ""} onClick={() => i < step && go(i)} aria-current={i === step}>
            <span>{i < step ? "✓" : i + 1}</span><em>{s}</em>
          </button>
        ))}
      </div>
      <div className="fp-bar"><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
      <p className="fp-lead" style={{ fontSize: ".85rem", marginBottom: 18 }}>
        Step {step + 1} of {steps.length} · {percent}% complete · about {remaining} min left
      </p>

      <form onSubmit={(e) => { e.preventDefault(); step === steps.length - 1 ? submit() : go(step + 1); }} noValidate>
        <input className="fp-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website_hp" value={f.website_hp} onChange={(e) => set("website_hp", e.target.value)} />

        {step === 0 && (
          <div className="fp-step">
            <h2>About you</h2>
            <p className="fp-lead">So I know who to reply to.</p>
            <div className="fp-grid">
              {field("Full name", input("name", "Your name"), undefined, true)}
              {field("Email", input("email", "you@example.com", "email"), undefined, true)}
              {field("Phone / WhatsApp", input("phone", "+country code…", "tel"))}
              {field("Country", input("country", "e.g. Germany"), undefined, true)}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fp-step">
            <h2>Your trek</h2>
            <p className="fp-lead">Pick the closest match. We can refine it later.</p>
            <div className="fp-field"><span className="fp-label">Which trek?<b> *</b></span>{chips(treks, "trek")}</div>
            <div className="fp-field"><span className="fp-label">What kind of trip?<b> *</b></span>{chips(tripTypes, "tripType")}</div>
            <div className="fp-grid">
              {field("Preferred dates or month", input("dates", "e.g. late April, flexible"))}
              {field("Days available", input("duration", "e.g. 10-14 days"))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fp-step">
            <h2>Group &amp; needs</h2>
            <p className="fp-lead">All optional, but it helps me give you a useful answer.</p>
            <div className="fp-grid">
              {field("Group size", input("groupSize", "e.g. 2 adults"))}
              {field("Budget per person", input("budget", "e.g. USD 1500"))}
            </div>
            <div className="fp-field"><span className="fp-label">Trekking experience</span>{chips(levels, "experience")}</div>
            <div className="fp-field"><span className="fp-label">Accommodation</span>{chips(stays, "accommodation")}</div>
            {field("Dietary, medical or other requirements", <textarea rows={3} {...text("requirements")} />)}
            {field("Anything else?", <textarea rows={3} placeholder="Questions, special interests, photography, culture…" {...text("message")} />)}
          </div>
        )}

        {step === 3 && (
          <div className="fp-step">
            <h2>Review &amp; send</h2>
            <p className="fp-lead">Check your details, then send your enquiry.</p>
            <dl className="fp-review">
              <div><dt>Name</dt><dd>{f.name}</dd></div>
              <div><dt>Email</dt><dd>{f.email}</dd></div>
              <div><dt>Country</dt><dd>{f.country}</dd></div>
              <div><dt>Trek</dt><dd>{f.trek}</dd></div>
              <div><dt>Trip type</dt><dd>{f.tripType}</dd></div>
              <div><dt>Dates</dt><dd>{f.dates || "-"}</dd></div>
              <div><dt>Group</dt><dd>{f.groupSize || "-"}</dd></div>
            </dl>
            <label className="fp-consent">
              <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />
              <span>I agree that Tsewang Bista may contact me about this enquiry. I understand it is not a booking.</span>
            </label>
          </div>
        )}

        {error && <p className="fp-error" role="alert">{error}</p>}

        <div className="fp-actions">
          {step > 0 ? <button type="button" className="fp-back" onClick={() => go(step - 1)}><ArrowLeft size={16} /> Back</button> : <span />}
          {step < steps.length - 1 ? (
            <button type="submit" className="fp-next">Continue <ArrowRight size={16} /></button>
          ) : (
            <button type="submit" className="fp-next fp-submit" disabled={sending}>{sending ? "Sending…" : "Send enquiry"} <Send size={16} /></button>
          )}
        </div>
      </form>
    </div>
  );
}
