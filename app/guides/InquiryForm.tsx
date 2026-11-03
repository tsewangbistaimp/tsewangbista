"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import "../services/free-portfolio/form.css";

const KINDS = ["Booking request", "Customized trek request", "Question about this package", "Group price request"];

export default function InquiryForm({ slug, pkg }: { slug: string; pkg?: string }) {
  const [f, setF] = useState({ kind: KINDS[0], name: "", email: "", country: "", phone: "", travelDate: "", groupSize: "", message: "", website_hp: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const busy = useRef(false);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit() {
    if (busy.current) return;
    if (f.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setError("Please enter a valid email address.");
    if (f.message.trim().length < 10) return setError("Please write a short message.");
    busy.current = true;
    setSending(true);
    setError("");
    try {
      const r = await fetch("/api/guide/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, slug, pkg: pkg ?? "" }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="fp-card fp-done">
        <CheckCircle2 size={48} /><h2>Request sent</h2>
        <p>Thank you. The guide will reply to <strong>{f.email}</strong>. This is a request only: nothing is booked or paid until the guide confirms availability and price with you.</p>
      </div>
    );
  }
  return (
    <div className="fp-card">
      <p className="fp-lead" style={{ marginBottom: 14 }}><strong>Estimated time: 2 minutes.</strong> Send a request to the guide. It is not an automatic booking.</p>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
        <input className="fp-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website_hp} onChange={(e) => set("website_hp", e.target.value)} />
        <div className="fp-chips" style={{ marginBottom: 16 }}>
          {KINDS.map((k) => <button type="button" key={k} className={f.kind === k ? "on" : ""} onClick={() => set("kind", k)}>{k}</button>)}
        </div>
        <div className="fp-grid">
          <label className="fp-field"><span className="fp-label">Name<b> *</b></span><input value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
          <label className="fp-field"><span className="fp-label">Email<b> *</b></span><input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></label>
          <label className="fp-field"><span className="fp-label">Country</span><input value={f.country} onChange={(e) => set("country", e.target.value)} /></label>
          <label className="fp-field"><span className="fp-label">Phone / WhatsApp</span><input value={f.phone} onChange={(e) => set("phone", e.target.value)} /></label>
          <label className="fp-field"><span className="fp-label">Travel date</span><input value={f.travelDate} onChange={(e) => set("travelDate", e.target.value)} /></label>
          <label className="fp-field"><span className="fp-label">Group size</span><input value={f.groupSize} onChange={(e) => set("groupSize", e.target.value)} /></label>
        </div>
        <label className="fp-field" style={{ marginTop: 16 }}><span className="fp-label">Message<b> *</b></span><textarea rows={4} value={f.message} onChange={(e) => set("message", e.target.value)} /></label>
        {error && <p className="fp-error" role="alert">{error}</p>}
        <div className="fp-actions"><span /><button type="submit" className="fp-next fp-submit" disabled={sending}>{sending ? "Sending…" : "Send request"} <Send size={16} /></button></div>
      </form>
    </div>
  );
}
