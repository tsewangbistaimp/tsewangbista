"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { enquiryTypes, regionOptions } from "../../lib/trek/profile";
import "../services/free-portfolio/form.css";

const initial = { name: "", email: "", country: "", phone: "", enquiryType: "", region: "", travelDate: "", message: "", website_hp: "" };

export default function ContactForm() {
  const [f, setF] = useState(initial);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [doneId, setDoneId] = useState("");
  const key = useRef("");
  const set = (k: keyof typeof initial, v: string) => setF((p) => ({ ...p, [k]: v }));
  const bind = (k: keyof typeof initial) => ({ value: f[k], onChange: (e: { target: { value: string } }) => set(k, e.target.value) });

  async function submit() {
    if (f.name.trim().length < 2) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setError("Please enter a valid email address.");
    if (f.country.trim().length < 2) return setError("Please enter your country.");
    if (!f.enquiryType) return setError("Please choose an enquiry type.");
    if (f.message.trim().length < 10) return setError("Please write a short message (at least a sentence).");
    if (!key.current) key.current = `trek-${crypto.randomUUID()}`;
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
      <div className="fp-card fp-done" id="contact-form">
        <CheckCircle2 size={56} />
        <h2>Message sent</h2>
        <p>Thank you, {f.name.split(" ")[0]}. I will reply to <strong>{f.email}</strong> soon. This is an enquiry only, not a booking.</p>
        <span className="fp-ref">Reference: {doneId}</span>
      </div>
    );
  }

  const label = (text: string, req?: boolean) => (
    <span className="fp-label">{text}{req ? <b> *</b> : <em style={{ fontStyle: "normal", opacity: 0.6 }}> (optional)</em>}</span>
  );

  return (
    <div className="fp-card" id="contact-form">
      <p className="fp-lead" style={{ marginBottom: 18 }}>
        <strong>Estimated completion time: 2-3 minutes.</strong> One short form, about 8 fields. This is an estimate, not a guarantee.
      </p>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
        <input className="fp-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website_hp" value={f.website_hp} onChange={(e) => set("website_hp", e.target.value)} />
        <div className="fp-grid">
          <label className="fp-field">{label("Full name", true)}<input {...bind("name")} /></label>
          <label className="fp-field">{label("Email", true)}<input type="email" {...bind("email")} /></label>
          <label className="fp-field">{label("Country", true)}<input {...bind("country")} /></label>
          <label className="fp-field">{label("WhatsApp or phone")}<input type="tel" {...bind("phone")} /></label>
        </div>
        <div className="fp-field" style={{ marginTop: 16 }}>
          {label("Enquiry type", true)}
          <div className="fp-chips">
            {enquiryTypes.map((o) => (
              <button type="button" key={o} className={f.enquiryType === o ? "on" : ""} onClick={() => set("enquiryType", f.enquiryType === o ? "" : o)}>{o}</button>
            ))}
          </div>
        </div>
        <div className="fp-field">
          {label("Preferred trekking region")}
          <div className="fp-chips">
            {regionOptions.map((o) => (
              <button type="button" key={o} className={f.region === o ? "on" : ""} onClick={() => set("region", f.region === o ? "" : o)}>{o}</button>
            ))}
          </div>
        </div>
        <label className="fp-field">{label("Travel date")}<input placeholder="e.g. April 2027, flexible" {...bind("travelDate")} /></label>
        <label className="fp-field">{label("Message", true)}<textarea rows={4} placeholder="Tell me what you are looking for." {...bind("message")} /></label>
        {error && <p className="fp-error" role="alert">{error}</p>}
        <div className="fp-actions">
          <span />
          <button type="submit" className="fp-next fp-submit" disabled={sending}>{sending ? "Sending…" : "Send message"} <Send size={16} /></button>
        </div>
      </form>
    </div>
  );
}
