"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuestionnaireAdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <main className="qx-shell qx-narrow">
      <h1 className="qx-h1">Questionnaire admin</h1>
      <form
        className="qx-card"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setMsg("");
          try {
            const r = await fetch("/api/questionnaire/admin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "short-login", password: pw })
            });
            const data = await r.json().catch(() => ({}));
            if (r.ok && data.url) router.replace(data.url);
            else setMsg(data.error ?? "Could not sign in.");
          } catch {
            setMsg("Could not sign in.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label className="qx-label" htmlFor="pw">Admin password</label>
        <input id="pw" className="qx-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
        {msg && <p className="qx-error" role="alert">{msg}</p>}
        <button className="qx-btn qx-primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
