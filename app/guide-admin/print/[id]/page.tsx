import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { cfg, cookieValid } from "../../../../lib/q/config";
import { getById } from "../../../../lib/guide/store";
import { COST_SCOPES, PRICE_STATUS, STATUS_LABEL, normalize, type Itinerary } from "../../../../lib/guide/types";
import AutoPrint from "./AutoPrint";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Guide submission", robots: { index: false, follow: false } };

const L: Record<string, string> = {
  legalName: "Full legal name", displayName: "Public display name", profilePhoto: "Profile photo", coverPhoto: "Cover photo", headline: "Headline", bio: "Biography", nationality: "Nationality",
  location: "Location", dob: "Date of birth", phone: "Phone", whatsapp: "WhatsApp", email: "Email", preferredContact: "Preferred contact", socials: "Social links", website: "Website",
  yearsExp: "Years of experience", treksDone: "Treks completed", trekkersGuided: "Trekkers guided", previousCompanies: "Previous companies", highestAlt: "Highest altitude", memorable: "Memorable experiences",
  achievements: "Achievements", training: "Guide training", licenceNo: "Licence number", licenceAuthority: "Licence authority", firstAid: "First aid training", wilderness: "Wilderness medical", rescue: "Mountain rescue",
  firstAidStatus: "First aid status", firstAidExpiry: "First aid expiry", emergencyName: "Emergency contact", emergencyPhone: "Emergency phone", responseExperience: "Emergency response experience",
  altitudeAwareness: "Altitude awareness", acclimatization: "Acclimatization", evacuation: "Evacuation procedure", satPhone: "Satellite phone", commsEquipment: "Communication equipment",
  weatherMonitoring: "Weather monitoring", insurance: "Insurance requirements", evacInsurance: "Evacuation insurance",
  dates: "Available dates", unavailable: "Unavailable dates", maxGroups: "Max groups at once", maxCapacity: "Max group capacity", advance: "Advance booking",
  routes: "Routes known", timesCompleted: "Times completed", yearsInRegion: "Years in region", culture: "Local culture", routeKnowledge: "Route knowledge", difficulty: "Difficulty", seasons: "Best seasons", expertise: "Special expertise",
  title: "Title", region: "Region", destination: "Destination", short: "Short description", detail: "Description", highlights: "Highlights", durationDays: "Duration (days)", nights: "Nights", start: "Start", end: "End",
  maxAlt: "Max altitude", distanceKm: "Distance (km)", season: "Season", minAge: "Min age", fitness: "Fitness", minPart: "Min participants", maxPart: "Max participants", accommodation: "Accommodation", transport: "Transport",
  permits: "Permits", photos: "Photos", mapLink: "Map", gpsLink: "GPS", alternatives: "Alternative routes", emergencyExit: "Emergency exits", changes: "Possible changes", weather: "Weather adjustments", safetyInfo: "Safety info",
  perPerson: "Price per person", perGroup: "Price per group", private: "Private price", groupPrice: "Group price", perDay: "Price per day", minGroup: "Min group", maxGroup: "Max group", single: "Single supplement", child: "Child price",
  seasonal: "Seasonal pricing", custom: "Custom pricing", deposit: "Deposit", balanceDeadline: "Balance deadline", paymentMethods: "Payment methods", cancelDeadline: "Cancellation deadline", refund: "Refund policy",
  weatherPolicy: "Weather policy", flightPolicy: "Flight delay policy", emergencyPolicy: "Emergency policy"
};

function Table({ data }: { data: Record<string, string> }) {
  const rows = Object.entries(data).filter(([, v]) => v && v.trim());
  if (!rows.length) return <p className="mut">Nothing entered.</p>;
  return <table><tbody>{rows.map(([k, v]) => <tr key={k}><th>{L[k] ?? k}</th><td>{v}</td></tr>)}</tbody></table>;
}

function Trek({ it, n }: { it: Itinerary; n: number }) {
  const pr = it.pricing;
  const cost = (s: string) => COST_SCOPES.find(([k]) => k === s)?.[1] ?? s;
  return (
    <div className="blk">
      <h3>Itinerary {n}: {it.f.title || "Untitled"}</h3>
      <Table data={it.f} />
      <h4>Days ({it.days.length})</h4>
      {it.days.map((d, i) => (
        <div key={d.id} className="day"><b>Day {i + 1}: {d.title}</b> <span className="mut">({d.type})</span>
          <Table data={{ from: d.from, to: d.to, "altitude start": d.altStart, "altitude end": d.altEnd, gain: d.gain, distance: d.distance, hours: d.hours, activities: d.activities, meals: d.meals, stay: d.stay, difficulty: d.difficulty, description: d.description, notes: d.notes }} />
        </div>
      ))}
      <h4>Pricing ({PRICE_STATUS.find(([k]) => k === pr.status)?.[1]}, {pr.currency})</h4>
      <Table data={pr.f} />
      {pr.costs.filter((c) => c.label).length ? <table><thead><tr><th>Cost item</th><th>Type</th><th>Amount</th></tr></thead><tbody>{pr.costs.filter((c) => c.label).map((c) => <tr key={c.id}><td>{c.label}</td><td>{cost(c.scope)}</td><td>{c.amount}</td></tr>)}</tbody></table> : null}
      <p><b>Included:</b> {[...pr.included, pr.customIncluded].filter(Boolean).join(", ") || "-"}</p>
      <p><b>Not included:</b> {[...pr.excluded, pr.customExcluded].filter(Boolean).join(", ") || "-"}</p>
    </div>
  );
}

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  if (!cfg.adminPassword() || !cookieValid((await cookies()).get("q_adm")?.value, "adm")) notFound();
  const row = await getById((await params).id);
  if (!row) notFound();
  const d = normalize(row.data);
  return (
    <div className="doc">
      <style>{`
        body{background:#fff!important}
        .doc{background:#fff;color:#111;font:14px/1.5 Arial,Helvetica,sans-serif;margin:0 auto;max-width:820px;padding:24px;position:relative;z-index:5}
        .doc h1{font-size:24px;margin:0}.doc h2{border-bottom:2px solid #111;font-size:16px;margin:26px 0 8px;padding-bottom:3px;text-transform:uppercase}
        .doc h3{font-size:15px;margin:18px 0 6px}.doc h4{font-size:13px;margin:12px 0 4px}
        .doc table{border-collapse:collapse;margin:4px 0 8px;width:100%}.doc th,.doc td{border:1px solid #ddd;padding:4px 8px;text-align:left;vertical-align:top;white-space:pre-line}
        .doc th{background:#f5f5f5;width:30%}.mut{color:#777}.day{margin-bottom:8px}.blk{break-inside:auto}
        @media print{.no-print{display:none}.doc{padding:0}}
      `}</style>
      <AutoPrint />
      <h1>{d.p.displayName || "Guide"} · Trekking guide submission</h1>
      <p className="mut">Status: {STATUS_LABEL[row.status]} · Email: {row.email || "-"} · Updated {row.updated_at.slice(0, 10)} · Contains private details. Do not publish.</p>

      <h2>Personal</h2><Table data={d.p} />
      <p><b>Languages:</b> {d.languages.join(", ") || "-"}</p>

      <h2>Experience and qualifications</h2><Table data={d.q} />
      {d.experiences.filter((e) => e.role || e.company).map((e, i) => <p key={i}><b>{e.role}</b> {e.company} ({e.period}) {e.regions}. {e.details}</p>)}
      {d.certs.filter((c) => c.name).map((c, i) => <p key={i}><b>Certificate:</b> {c.name}, {c.issuer} {c.issued} {c.expiry ? `(expires ${c.expiry})` : ""} {c.link}</p>)}

      <h2>Regions</h2>
      {d.regions.length ? d.regions.map((r) => <div key={r}><h3>{r}</h3><Table data={d.regionInfo[r] ?? {}} /></div>) : <p className="mut">None selected.</p>}
      {d.customDestinations ? <p><b>Other destinations:</b> {d.customDestinations}</p> : null}

      <h2>Services</h2>
      <p>{Object.entries(d.services).filter(([, m]) => m !== "none").map(([k, m]) => `${k} (${m === "included" ? "included" : "extra cost"})`).join("; ") || "None selected."}</p>
      {d.customServices.map((c) => <p key={c.name}>{c.name} ({c.mode})</p>)}

      <h2>Safety and availability</h2><Table data={d.safety} />
      <p><b>Seasons:</b> {d.availSeasons.join(", ") || "-"} · <b>Months:</b> {d.availMonths.join(", ") || "-"}</p><Table data={d.avail} />

      <h2>Itineraries ({d.itineraries.length})</h2>
      {d.itineraries.map((it, i) => <Trek key={it.id} it={it} n={i + 1} />)}

      {d.gallery.length ? <><h2>Gallery links</h2>{d.gallery.map((g, i) => <p key={i}>{g.category}: {g.url} {g.caption}</p>)}</> : null}
    </div>
  );
}
