import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Compass, FileText, Layers3, Mountain, Save } from "lucide-react";
import ScrollEffects from "../../components/ScrollEffects";
import BackToPortfolio from "../../components/BackToPortfolio";
import StartForm from "./StartForm";

export const metadata: Metadata = {
  title: "Professional Trekking Guide Portfolio",
  description: "Create your professional trekking guide portfolio: experience, regions, services, detailed itineraries and transparent package prices."
};

const steps = ["Personal information", "Experience and qualifications", "Trekking regions", "Services and facilities", "Itinerary builder", "Pricing and costs", "Safety, availability, gallery", "Review and submit"];
const prepare = ["Your guide licence and certificates", "Photographs of you and your treks", "Route details: days, altitudes, distances", "Approximate package prices and what they include", "Emergency and safety arrangements"];

export default function TrekkingGuideServicePage() {
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects /><BackToPortfolio />
      <section className="section-shell sprint-hero" data-reveal>
        <p className="eyebrow"><Mountain size={14} /> New service</p>
        <h1 className="sprint-headline">Professional Trekking Guide Portfolio.</h1>
        <p className="sprint-subhead">
          Create your professional trekking guide portfolio and showcase your mountain guiding experience, trekking destinations, qualifications, services, detailed itineraries, and transparent trekking packages. Help international and local trekkers discover your expertise and connect with you.
        </p>
        <div className="tg-times" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <span className="tg-badge"><Clock size={13} /> Estimated time: 25-35 minutes</span>
          <span className="tg-badge"><Layers3 size={13} /> 8 main steps</span>
          <span className="tg-badge"><Save size={13} /> Save your progress and continue later</span>
        </div>
      </section>

      <section className="section-shell sprint-section" data-reveal>
        <div className="section-heading"><p className="eyebrow">Before you start</p><h2>You do not need to finish at once.</h2></div>
        <p className="sprint-subhead">You don&apos;t need to complete everything at once. You can save your progress and return later. Having your certificates, trekking photographs, route information, and package prices ready will make the process faster.</p>
        <div className="experience-list">{prepare.map((x) => <div key={x}><CheckCircle2 size={20} /><span>{x}</span></div>)}</div>
      </section>

      <section className="section-shell sprint-section" data-reveal>
        <div className="section-heading"><p className="eyebrow">The 8 steps</p><h2>What you will fill in.</h2></div>
        <div className="experience-list">{steps.map((x, i) => <div key={x}><FileText size={20} /><span>{i + 1}. {x}</span></div>)}</div>
        <p className="sprint-subhead">Your portfolio becomes public only after it has been reviewed and approved. Information you enter is shown as submitted by you unless it has been verified.</p>
      </section>

      <section className="section-shell sprint-section" data-reveal id="start">
        <div className="section-heading"><p className="eyebrow">Create portfolio</p><h2>Start or continue.</h2></div>
        <StartForm />
        <p style={{ marginTop: 18 }}><Link href="/guides"><Compass size={14} /> Browse guide portfolios</Link></p>
      </section>
    </main>
  );
}
