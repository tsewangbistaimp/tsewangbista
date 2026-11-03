"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_LABEL, type GuideData, type Status } from "../../lib/guide/types";
import { PackageView, ProfileView } from "../guides/GuideView";

type G = { id: string; email: string; status: Status; verified: boolean; slug: string | null; name: string; updated: string; note: string; packages: number; regions: string; inquiries: number; full: GuideData };
type Inq = { id: string; guide: string; kind: string; name: string; email: string; country: string; message: string; at: string; pkg: string };
type Props = { authed: boolean; origin?: string; guides?: G[]; inquiries?: Inq[] };

const box: React.CSSProperties = { background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 22, padding: 18, marginBottom: 14 };
const btn: React.CSSProperties = { background: "var(--glass)", border: "1px solid var(--line)", borderRadius: 99, color: "var(--text)", cursor: "pointer", font: "inherit", fontSize: ".85rem", padding: "8px 14px" };

export default function AdminClient({ authed, origin, guides = [], inquiries = [] }: Props) {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});

  async function login() {
    const r = await fetch("/api/questionnaire/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "short-login", password: pw }) });
    if (r.ok) router.refresh();
    else setMsg("Wrong password.");
  }
  async function act(id: string, action: string, extra: Record<string, unknown> = {}) {
    const r = await fetch("/api/guide/admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action, note: notes[id] ?? "", ...extra }) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) setMsg(data.error ?? "Failed.");
    else { setMsg(""); router.refresh(); }
  }

  if (!authed) {
    return (
      <main className="portfolio-shell sprint-page"><section className="section-shell" style={{ maxWidth: 420, paddingTop: 120 }}>
        <h1>Guide admin</h1>
        <form onSubmit={(e) => { e.preventDefault(); login(); }}>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Admin password" style={{ width: "100%", marginBottom: 10 }} />
          <button style={btn} type="submit">Sign in</button> {msg}
        </form>
      </section></main>
    );
  }
  return (
    <main className="portfolio-shell sprint-page"><section className="section-shell" style={{ paddingTop: 100 }}>
      <h1>Guide admin</h1>
      {msg ? <p className="fp-error">{msg}</p> : null}
      <h2>Portfolios ({guides.length})</h2>
      {guides.map((g) => (
        <div style={box} key={g.id}>
          <b>{g.name}</b> · {g.email} · <span>{STATUS_LABEL[g.status]}</span>{g.verified ? " · verified" : ""}
          <div style={{ opacity: 0.7, fontSize: ".85rem" }}>{g.packages} package(s) · {g.regions || "no regions"} · {g.inquiries} inquiries · updated {g.updated.slice(0, 10)}{g.slug ? <> · <a href={`${origin}/guides/${g.slug}`}>public page</a></> : null}</div>
          <textarea rows={2} placeholder="Note to the guide (sent with 'Request changes')" value={notes[g.id] ?? g.note} onChange={(e) => setNotes({ ...notes, [g.id]: e.target.value })} style={{ width: "100%", margin: "10px 0" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button style={btn} onClick={() => act(g.id, "review")}>Mark under review</button>
            <button style={btn} onClick={() => confirm(`Approve ${g.name} and publish?`) && act(g.id, "approve")}>Approve</button>
            <button style={btn} onClick={() => act(g.id, "changes")}>Request changes</button>
            <button style={btn} onClick={() => confirm("Suspend this profile?") && act(g.id, "suspend")}>Suspend</button>
            <button style={btn} onClick={() => act(g.id, "verify", { verified: !g.verified })}>{g.verified ? "Remove verified badge" : "Mark verified"}</button>
            <a style={{ ...btn, textDecoration: "none" }} href={`/guide-admin/print/${g.id}`} target="_blank" rel="noreferrer">Download PDF</a>
            <button style={btn} onClick={() => setOpen(open === g.id ? "" : g.id)}>{open === g.id ? "Hide" : "View"} full submission</button>
          </div>
          {open === g.id ? (
            <div style={{ marginTop: 14 }}>
              <div style={box}>
                <b>Private details (admin only)</b>
                <table style={{ width: "100%", marginTop: 8, fontSize: ".9rem" }}><tbody>
                  {([["Legal name", g.full.p.legalName], ["Email", g.full.p.email], ["Phone", g.full.p.phone], ["WhatsApp", g.full.p.whatsapp], ["Guide licence no.", g.full.q.licenceNo], ["Emergency contact", `${g.full.safety.emergencyName} ${g.full.safety.emergencyPhone}`.trim()]] as const).map(([k, v]) => (
                    <tr key={k}><td style={{ width: "35%", opacity: 0.7, padding: "4px 0" }}>{k}</td><td>{v || "-"}</td></tr>
                  ))}
                  {g.full.certs.filter((c) => c.name).map((c, i) => (
                    <tr key={i}><td style={{ opacity: 0.7 }}>Certificate</td><td>{c.name}, {c.issuer} {c.link ? <a href={c.link} target="_blank" rel="noreferrer">(open document link)</a> : ""}</td></tr>
                  ))}
                </tbody></table>
              </div>
              <ProfileView d={g.full} preview />
              {g.full.itineraries.map((it) => (
                <details key={it.id} style={box}><summary style={{ cursor: "pointer", fontWeight: 700 }}>{it.f.title || "Untitled itinerary"}</summary><PackageView it={it} /></details>
              ))}
            </div>
          ) : null}
        </div>
      ))}
      <h2>Recent inquiries ({inquiries.length})</h2>
      {inquiries.map((i) => (
        <div style={box} key={i.id}><b>{i.kind}</b> for {i.guide}{i.pkg ? ` (${i.pkg})` : ""}<div style={{ opacity: 0.7, fontSize: ".85rem" }}>{i.name} · {i.email} · {i.country} · {i.at.slice(0, 10)}</div><p>{i.message}</p></div>
      ))}
    </section></main>
  );
}
