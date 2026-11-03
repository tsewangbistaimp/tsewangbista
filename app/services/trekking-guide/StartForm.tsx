"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import "../free-portfolio/form.css";

const KEY = "guide_draft_token";
const read = () => { try { return localStorage.getItem(KEY) ?? ""; } catch { return ""; } };
const subscribe = () => () => undefined;

export default function StartForm() {
  const router = useRouter();
  const saved = useSyncExternalStore(subscribe, read, () => "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [hp, setHp] = useState("");

  async function start() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/guide/start", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ website_hp: hp }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.token) throw new Error(data.error || "Something went wrong.");
      try { localStorage.setItem(KEY, data.token); } catch { /* ignore */ }
      router.push(`/guides/edit/${data.token}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="fp-card">
      <p className="fp-lead">No account or password needed. Your answers save automatically in your draft, and this browser remembers it so you can continue later. You will also get a link at the top of the form to bookmark.</p>
      <input className="fp-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} />
      {error && <p className="fp-error" role="alert">{error}</p>}
      <div className="fp-actions" style={{ flexWrap: "wrap", gap: 12 }}>
        {saved ? <button type="button" className="fp-back" onClick={() => router.push(`/guides/edit/${saved}`)}>Continue my draft</button> : <span />}
        <button type="button" className="fp-next fp-submit" disabled={busy} onClick={start}>{busy ? "Starting…" : saved ? "Start a new portfolio" : "Create Portfolio"} <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}
