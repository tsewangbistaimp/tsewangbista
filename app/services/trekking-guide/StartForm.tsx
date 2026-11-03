"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import "../free-portfolio/form.css";

export default function StartForm() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function go() {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
    setState("sending");
    setError("");
    try {
      const r = await fetch("/api/guide/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, website_hp: hp }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Something went wrong.");
      setState("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="fp-card fp-done">
        <Mail size={48} /><h2>Check your email</h2>
        <p>We sent a private link to <strong>{email}</strong>. Open it to start or continue your portfolio. Your progress saves automatically. The email can take a minute to arrive; check spam if you do not see it.</p>
      </div>
    );
  }
  return (
    <div className="fp-card">
      <p className="fp-lead">Enter your email. We send you a private link, with no password, that lets you save and return to your draft any time. Already started? Use the same email to get a new link.</p>
      <form onSubmit={(e) => { e.preventDefault(); go(); }} noValidate>
        <input className="fp-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} />
        <label className="fp-field"><span className="fp-label">Your email<b> *</b></span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        {error && <p className="fp-error" role="alert">{error}</p>}
        <div className="fp-actions"><span /><button type="submit" className="fp-next fp-submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Create Portfolio"} <Mail size={16} /></button></div>
      </form>
    </div>
  );
}
