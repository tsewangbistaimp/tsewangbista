import type { Metadata } from "next";
import { about, experience, guide, regions, skills } from "../../../lib/trek/profile";
import PrintButton from "./PrintButton";
import "./cv.css";

export const metadata: Metadata = { title: "Trekking Guide CV | Tsewang Bista", robots: { index: false } };

export default function CvPage() {
  return (
    <main className="cv-page">
      <div className="cv-toolbar">
        <PrintButton />
        <a href="/trekking-guide">Back</a>
        <small>Choose “Save as PDF” in the print window.</small>
      </div>
      <article className="cv-sheet">
        <h1>{guide.name}</h1>
        <p className="cv-title">{guide.title}</p>
        <p>{guide.email} · {guide.phone} · {guide.location}</p>

        <h2>Introduction</h2>
        <p>{guide.intro}</p>

        <h2>Professional experience</h2>
        {experience.map((e) => (
          <div key={e.role}>
            <strong>{e.role}</strong>
            <p>{e.location} · {e.period}</p>
            <ul>{e.duties.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
        ))}

        <h2>Regions</h2>
        <ul>{regions.map((r) => <li key={r.name}>{r.name}{r.note ? `: ${r.note}` : ""}</li>)}</ul>

        <h2>Skills</h2>
        {skills.map((s) => (<p key={s.group}><strong>{s.group}:</strong> {s.items.join(", ")}</p>))}

        <h2>Languages</h2>
        <p>{guide.languages}</p>

        <h2>Qualifications and certifications</h2>
        <p>To be added once verified.</p>

        <h2>About</h2>
        <p>{about[0]}</p>
      </article>
    </main>
  );
}
