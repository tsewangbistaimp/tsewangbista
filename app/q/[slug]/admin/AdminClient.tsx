"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SETS } from "@/lib/q/sets";

type Row = { id: string; name: string; field: string; email: string; at: string; status: string; answered: number; variant?: "main" | "hospitality"; total?: number; answers: Record<string, { answer: string; choice?: string; source?: string }> };
type Invite = { id: string; label: string; revoked: boolean; singleUse: boolean; used: boolean; link: string };

type Props = {
  slug: string; authed: boolean; rows?: Row[]; invites?: Invite[]; total?: number; openId?: string; query?: string; db?: boolean; mode?: string; hospLink?: string;
};

async function call(body: Record<string, unknown>) {
  const r = await fetch("/api/questionnaire/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { ok: r.ok, data: (await r.json().catch(() => ({}))) as { error?: string } };
}

export default function AdminClient({ slug, authed, rows = [], invites = [], total = 57, openId, query = "", db = false, mode = "none", hospLink = "" }: Props) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [labels, setLabels] = useState("");
  const [single, setSingle] = useState(true);
  const [copied, setCopied] = useState("");

  if (!authed) {
    return (
      <main className="qx-shell qx-narrow">
        <h1 className="qx-h1">Results</h1>
        <form className="qx-card" onSubmit={async (e) => {
          e.preventDefault();
          const r = await call({ action: "login", slug, password: pw });
          if (r.ok) router.refresh(); else setMsg(r.data.error ?? "Could not sign in.");
        }}>
          <label className="qx-label" htmlFor="pw">Admin password</label>
          <input id="pw" className="qx-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
          {msg && <p className="qx-error" role="alert">{msg}</p>}
          <button className="qx-btn qx-primary" type="submit">Sign in</button>
        </form>
      </main>
    );
  }

  async function removeRow(id: string, name: string) {
    if (!window.confirm(`Delete the submission from "${name}"? This cannot be undone.`)) return;
    const r = await call({ action: "delete", slug, id });
    if (r.ok) router.replace(query ? `?q=${encodeURIComponent(query)}` : "?"); else window.alert(r.data.error ?? "Could not delete.");
    router.refresh();
  }

  const open = rows.find((r) => r.id === openId);
  return (
    <main className="qx-shell qx-wide">
      <div className="qx-row-between">
        <h1 className="qx-h1">Results ({rows.length})</h1>
        <div className="qx-actions">
          <a className="qx-btn" href={`/api/questionnaire/admin?s=${encodeURIComponent(slug)}`}>Export all (CSV)</a>
          <button className="qx-btn" onClick={async () => { await call({ action: "logout", slug }); router.refresh(); }}>Sign out</button>
        </div>
      </div>
      {hospLink && (
        <div className="qx-note">
          <b>Hospitality questionnaire link</b> (share it with people who already finished the first one): <a href={hospLink}>{hospLink}</a>{" "}
          <button className="qx-link" onClick={async () => { try { await navigator.clipboard.writeText(hospLink); } catch { /* ignore */ } }}>Copy</button>
        </div>
      )}
      {!db && <p className="qx-note">No database connected, so nothing is listed here. Answers still arrive by email.</p>}

      <form className="qx-search" method="get">
        <input className="qx-input" name="q" defaultValue={query} placeholder="Search by name or field" aria-label="Search by name or field" />
        <button className="qx-btn" type="submit">Search</button>
      </form>

      <div className="qx-table-wrap">
        <table className="qx-table">
          <thead><tr><th>Name</th><th>Field</th><th>Form</th><th>Answered</th><th>Date</th><th>Email status</th><th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td><td>{r.field}</td><td>{r.variant === "hospitality" ? "Hospitality" : "Research"}</td><td>{r.answered}/{r.total ?? total}</td><td>{r.at.slice(0, 10)}</td><td title={r.status}>{r.status.length > 40 ? `${r.status.slice(0, 40)}...` : r.status}</td>
                <td>
                  <a href={`?id=${r.id}${query ? `&q=${encodeURIComponent(query)}` : ""}`}>Open</a>{" "}
                  <button className="qx-link" style={{ color: "#c0262d" }} onClick={() => removeRow(r.id, r.name)}>Delete</button>
                </td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={7}>No submissions yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <section className="qx-card" aria-label="Submission details">
          <div className="qx-row-between">
            <h2 className="qx-h2">{open.name} &middot; {open.field}</h2>
            <button className="qx-btn" style={{ color: "#c0262d", borderColor: "#c0262d" }} onClick={() => removeRow(open.id, open.name)}>Delete this submission</button>
          </div>
          {SETS[open.variant ?? "main"].questions.map((q) => (
            <div key={q.id} className="qx-ans">
              <div className="qx-ans-q"><b>{q.id}</b> {q.text}</div>
              {open.answers[q.id] ? <p className="qx-ans-a">{open.answers[q.id].choice && <em>[{open.answers[q.id].choice}] </em>}{open.answers[q.id].answer}</p> : <p className="qx-muted">Skipped</p>}
            </div>
          ))}
        </section>
      )}

      {mode === "token" && db && (
        <section className="qx-card">
          <h2 className="qx-h2">Invite links</h2>
          <p className="qx-note">One name per line. Each person gets their own private link.</p>
          <textarea className="qx-textarea" rows={4} value={labels} onChange={(e) => setLabels(e.target.value)} placeholder={"Dr. Sharma\nMr. Thapa"} aria-label="Names to invite" />
          <label className="qx-check"><input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} /> Link works for one submission only</label>
          <button className="qx-btn qx-primary" onClick={async () => {
            const r = await call({ action: "invites", slug, labels, singleUse: single });
            if (r.ok) { setLabels(""); router.refresh(); } else setMsg(r.data.error ?? "Could not create links.");
          }}>Create links</button>
          {msg && <p className="qx-error" role="alert">{msg}</p>}
          <div className="qx-table-wrap">
            <table className="qx-table">
              <thead><tr><th>Person</th><th>Status</th><th>Link</th><th /></tr></thead>
              <tbody>
                {invites.map((i) => (
                  <tr key={i.id}>
                    <td>{i.label}</td>
                    <td>{i.revoked ? "Revoked" : i.used ? "Submitted" : "Waiting"}</td>
                    <td><button className="qx-link" onClick={async () => { await navigator.clipboard.writeText(i.link); setCopied(i.id); }}>{copied === i.id ? "Copied" : "Copy link"}</button></td>
                    <td><button className="qx-link" onClick={async () => { await call({ action: "revoke", slug, id: i.id, revoked: !i.revoked }); router.refresh(); }}>{i.revoked ? "Restore" : "Revoke"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
  );
}
