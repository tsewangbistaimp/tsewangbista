import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, MessageCircle, Rocket } from "lucide-react";
import ScrollEffects from "../../components/ScrollEffects";

export const metadata: Metadata = {
  title: "AI Marketing Systems",
  description:
    "AI-powered marketing solutions that automate lead generation, customer engagement, content creation, and business growth — intelligent systems that help businesses attract, nurture, and convert customers more efficiently."
};

const WHATSAPP_NUMBER = "9779862568506";
const strategyCallHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hi! I'd like to book a free AI Marketing Systems strategy call."
)}`;

const whatWeBuild = [
  "AI Content Workflows",
  "Lead Generation Funnels",
  "Marketing Automation",
  "Email & WhatsApp Automation",
  "CRM Integration",
  "AI Chatbots & Assistants",
  "Campaign Strategy & Ideas",
  "Customer Journey Automation",
  "Lead Nurturing Systems",
  "Performance Tracking Dashboards"
];

const benefits = [
  "Generate More Qualified Leads",
  "Save Time with Automation",
  "Improve Customer Follow-Up",
  "Increase Conversion Rates",
  "Scale Marketing Operations"
];

export default function AiMarketingSystemsPage() {
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects />
      <div className="cursor-glow" aria-hidden="true" />

      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to portfolio
      </Link>

      <section className="section-shell sprint-hero" data-reveal>
        <p className="eyebrow">AI Marketing Systems</p>
        <h1 className="sprint-headline">AI Marketing Systems</h1>
        <p className="sprint-subhead">
          AI-powered marketing solutions that automate lead generation, customer engagement, content
          creation, and business growth. We build intelligent systems that help businesses attract,
          nurture, and convert customers more efficiently.
        </p>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">What We Build</p>
          <h2>Systems that run without you chasing them.</h2>
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
          <p className="eyebrow">Benefits</p>
          <h2>What changes once AI is running your marketing.</h2>
        </div>
        <div className="experience-list" data-reveal>
          {benefits.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card" data-reveal>
          <p className="eyebrow">Featured Offer</p>
          <div className="demo-title-row">
            <Rocket size={22} />
            <h3>30-Day Lead Flow Sprint</h3>
          </div>
          <p className="demo-summary">
            Get real leads with Meta Ads, landing pages, AI automation, and follow-up systems.
          </p>
          <div className="hero-actions">
            <a className="button primary" href={strategyCallHref} target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              Book a Free Strategy Call
            </a>
            <Link className="button secondary" href="/lead-flow-sprint">
              <ArrowUpRight size={18} />
              Explore AI Solutions
            </Link>
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
