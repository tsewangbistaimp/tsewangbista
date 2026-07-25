import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Figma,
  Gauge,
  GitBranch,
  Layout,
  MousePointerClick,
  Palette,
  Search
} from "lucide-react";
import ScrollEffects from "../../components/ScrollEffects";
import LeadCta from "../../components/LeadCta";

export const metadata: Metadata = {
  title: "UI/UX Design",
  description:
    "Premium digital experiences designed around users, brands, and business goals — modern interfaces, seamless user journeys, and responsive designs that improve usability, engagement, and conversions."
};

const whatWeDesign = [
  "Website UI Design",
  "Mobile App Interfaces",
  "Dashboard & Admin Panel Design",
  "Landing Page Design",
  "SaaS Product Interfaces",
  "Design Systems",
  "User Flows & Wireframes",
  "Interactive Prototypes",
  "Figma Design Systems",
  "Responsive Layouts"
];

const process = [
  { icon: Search, title: "User Research & Strategy", body: "Understanding your users, goals, and business context before any pixels are placed." },
  { icon: Layout, title: "Wireframing", body: "Structuring layouts and flows so every screen has a clear purpose." },
  { icon: Figma, title: "UI Design in Figma", body: "Premium, brand-focused visual design built in Figma, screen by screen." },
  { icon: MousePointerClick, title: "Interactive Prototyping", body: "Clickable prototypes so you can experience the flow before development starts." },
  { icon: Gauge, title: "Usability Optimisation", body: "Refining layouts and interactions for clarity, speed, and conversions." },
  { icon: GitBranch, title: "Developer Handoff", body: "Clean, organized files and specs so development moves fast with no guesswork." }
];

const principles = [
  "Premium & Modern Visual Design",
  "User-Centered Experience",
  "Mobile-First Approach",
  "Brand-Focused Interfaces",
  "Conversion-Oriented Layouts",
  "Clean & Scalable Components"
];

export default function UiUxDesignPage() {
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects />
      <div className="cursor-glow" aria-hidden="true" />

      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to portfolio
      </Link>

      <section className="section-shell sprint-hero" data-reveal>
        <p className="eyebrow">UI/UX Design</p>
        <h1 className="sprint-headline">UI/UX Design</h1>
        <p className="sprint-subhead">
          Premium digital experiences designed around users, brands, and business goals. We create
          modern interfaces, seamless user journeys, and responsive designs that improve usability,
          engagement, and conversions.
        </p>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">What We Design</p>
          <h2>Every screen your product needs.</h2>
        </div>
        <div className="experience-list" data-reveal>
          {whatWeDesign.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Our Design Process</p>
          <h2>From research to developer-ready files.</h2>
        </div>
        <div className="service-list" data-reveal>
          {process.map(({ icon: Icon, title, body }) => (
            <article key={title}>
              <Icon size={20} />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
              <ArrowUpRight size={18} />
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Design Principles</p>
          <h2>What guides every screen we ship.</h2>
        </div>
        <div className="experience-list" data-reveal>
          {principles.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card" data-reveal>
          <p className="eyebrow">Featured Work</p>
          <div className="demo-title-row">
            <Palette size={22} />
            <h3>Jikmis Apartment Website Design</h3>
          </div>
          <p className="demo-summary">
            A hospitality-focused digital experience designed with a premium interface, responsive
            layouts, smooth user flow, and direct booking-focused experience.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/#work">
              <ArrowUpRight size={18} />
              View Design Projects
            </Link>
            <LeadCta
              label="Start Your Design Project"
              context="UI/UX Design — Start Your Design Project"
              variant="secondary"
            />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>TsewangBistaX</span>
        <p>Technology, Business &amp; Innovation.</p>
        <Link href="/#contact" aria-label="Back to contact">
          <ArrowUpRight size={18} />
        </Link>
      </footer>
    </main>
  );
}
