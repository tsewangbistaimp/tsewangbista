import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Globe2 } from "lucide-react";
import ScrollEffects from "../../components/ScrollEffects";
import BackToPortfolio from "../../components/BackToPortfolio";
import LeadCta from "../../components/LeadCta";

export const metadata: Metadata = {
  title: "Web Development",
  description:
    "Modern, fast, and scalable websites, booking systems, landing pages, dashboards, and custom web applications designed to help businesses grow online."
};

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

      <BackToPortfolio />

      <section className="section-shell sprint-hero" data-reveal>
        <div className="sprint-hero-grid">
          <div className="sprint-hero-copy">
          <p className="eyebrow">Web Development</p>
          <h1 className="sprint-headline">Web Development</h1>
          <p className="sprint-subhead">
            Modern, fast, and scalable websites, booking systems, landing pages, dashboards, and custom
            web applications designed to help businesses grow online.
          </p>
          </div>
          <div className="hero-visual">
            <div className="portrait-halo" />
            <div className="portrait-card">
              <Image
                src="/images/tsewang-bista-ai-marketing-banner.jpg"
                alt="Tsewang Bista — AI powered digital marketing and AI web design"
                width={1086}
                height={1448}
                className="portrait"
                sizes="(max-width: 900px) 60vw, 380px"
              />
            </div>
          </div>
        </div>
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
            <LeadCta
              label="Start Your Project"
              context="Web Development — Start Your Project"
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
