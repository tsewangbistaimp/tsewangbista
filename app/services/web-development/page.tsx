import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Globe2, MessageCircle } from "lucide-react";
import ScrollEffects from "../../components/ScrollEffects";

export const metadata: Metadata = {
  title: "Web Development",
  description:
    "Modern, fast, and scalable websites, booking systems, landing pages, dashboards, and custom web applications designed to help businesses grow online."
};

const WHATSAPP_NUMBER = "9779862568506";
const startProjectHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi! I'd like to start a web development project."
)}`;

const whatWeBuild = [
  "Business Websites",
  "Landing Pages",
  "Portfolio Websites",
  "Booking & Reservation Systems",
  "Admin Dashboards",
  "Custom Web Applications"
];

const techStack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"];

export default function WebDevelopmentPage() {
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects />
      <div className="cursor-glow" aria-hidden="true" />

      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to portfolio
      </Link>

      <section className="section-shell sprint-hero" data-reveal>
        <p className="eyebrow">Web Development</p>
        <h1 className="sprint-headline">Web Development</h1>
        <p className="sprint-subhead">
          Modern, fast, and scalable websites, booking systems, landing pages, dashboards, and custom
          web applications designed to help businesses grow online.
        </p>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">What We Build</p>
          <h2>Real products, not just templates.</h2>
        </div>
        <div className="experience-list" data-reveal>
          {whatWeBuild.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Featured Demo</p>
          <h2>See it live, not just in a screenshot.</h2>
        </div>
        <div className="glass-card sprint-card" data-reveal>
          <div className="demo-title-row">
            <Globe2 size={22} />
            <h3>Jikmis Apartment Booking Platform</h3>
          </div>
          <p className="demo-summary">
            A full booking-style website for a serviced apartment business in Boudha, Kathmandu — rooms,
            an in-house cafe, amenities, and a direct WhatsApp booking flow.
          </p>
          <p className="eyebrow demo-tech-label">Technologies</p>
          <div className="skill-cloud">
            {techStack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="hero-actions">
            <a
              className="button primary"
              href="https://jikmisapartment.tsewangbista.com"
              target="_blank"
              rel="noreferrer"
            >
              <ArrowUpRight size={18} />
              View Live Demo
            </a>
            <a className="button secondary" href={startProjectHref} target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              Start Your Project
            </a>
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
