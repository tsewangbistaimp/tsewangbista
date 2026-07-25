import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Filter,
  LineChart,
  Mail,
  Rocket,
  Search,
  Settings2,
  Target,
  TrendingUp
} from "lucide-react";
import ScrollEffects from "../../components/ScrollEffects";
import LeadCta from "../../components/LeadCta";

export const metadata: Metadata = {
  title: "Performance Marketing",
  description:
    "Performance marketing that generates real leads and sales — Meta Ads, social growth, email marketing, and conversion-focused strategy designed for measurable results."
};

const offers = [
  {
    icon: Target,
    title: "Meta Ads Management",
    items: ["Facebook Ads", "Instagram Ads", "Lead Generation Campaigns", "Retargeting Campaigns", "Sales & Conversion Campaigns"]
  },
  {
    icon: TrendingUp,
    title: "Social Media Growth",
    items: ["Content Strategy", "Audience Growth", "Engagement Optimisation", "Brand Awareness Campaigns"]
  },
  {
    icon: Mail,
    title: "Email Marketing",
    items: ["Welcome Sequences", "Lead Nurturing", "Promotional Campaigns", "Customer Retention Campaigns"]
  },
  {
    icon: Filter,
    title: "Customer Acquisition",
    items: ["Lead Generation Systems", "Landing Pages", "CRM Integration", "Automated Follow-Up"]
  },
  {
    icon: BarChart3,
    title: "Conversion Optimisation",
    items: ["Landing Page Optimisation", "Sales Funnel Setup", "A/B Testing", "Performance Analytics"]
  }
];

const process = [
  { icon: Search, title: "1. Business Audit", body: "We review your offer, current marketing, and numbers to see exactly where the gaps are." },
  { icon: ClipboardList, title: "2. Strategy Development", body: "A tailored plan for your ads, funnel, and follow-up — built around your goals and budget." },
  { icon: Settings2, title: "3. Campaign Setup", body: "Meta Ads, landing pages, tracking, and automation get built and connected end to end." },
  { icon: Rocket, title: "4. Launch & Optimisation", body: "Your campaigns go live. We monitor performance daily and adjust for the best results." },
  { icon: LineChart, title: "5. Reporting & Scaling", body: "Clear, plain-English reporting, then we scale what's working and cut what isn't." }
];

const results = [
  "More qualified leads",
  "Lower cost per acquisition",
  "Higher conversion rates",
  "Increased revenue",
  "Better return on ad spend (ROAS)"
];

const sprintIncludes = [
  "Meta Ads",
  "Landing Page",
  "WhatsApp Automation",
  "Email Follow-Up",
  "Lead Tracking Dashboard",
  "AI Chatbot"
];

const faqs = [
  {
    q: "How much should I spend on ads?",
    a: "It depends on your goals, industry, and current numbers. On the strategy call, we'll look at your business and recommend a realistic starting budget — no guesswork, no upsell pressure."
  },
  {
    q: "How quickly will I see results?",
    a: "Most clients start seeing qualified leads within the first 1-2 weeks of launch, with the full system optimized and proving itself within 30 days."
  },
  {
    q: "Do you create the ad creatives?",
    a: "Yes. Ad copy, creative direction, and campaign structure are all handled for you as part of the done-for-you service."
  },
  {
    q: "Do you manage everything for me?",
    a: "Yes — ads, landing pages, tracking, and follow-up automation are all set up and managed by us. Your job is simply to respond to the leads that come in."
  },
  {
    q: "Can this work for my industry?",
    a: "This system has been applied across retail, hospitality, agriculture, e-commerce, and local service businesses. If you sell a product or service and want more qualified leads, it can be adapted to fit."
  }
];

export default function PerformanceMarketingPage() {
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects />
      <div className="cursor-glow" aria-hidden="true" />

      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to portfolio
      </Link>

      <section className="section-shell sprint-hero" data-reveal>
        <p className="eyebrow">Performance Marketing</p>
        <h1 className="sprint-headline">Performance Marketing That Generates Real Leads &amp; Sales</h1>
        <p className="sprint-subhead">
          We help businesses grow through Meta Ads, social media growth, email marketing, lead
          generation, and conversion-focused marketing strategies designed to deliver measurable
          results.
        </p>
        <div className="hero-actions">
          <LeadCta label="Get a Free Strategy Call" context="Performance Marketing — Free Strategy Call" />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">What We Offer</p>
          <h2>A full marketing system, not just an ad account.</h2>
        </div>
        <div className="venture-grid">
          {offers.map(({ icon: Icon, title, items }) => (
            <article className="glass-card venture-card offer-card" key={title} data-reveal>
              <Icon size={28} />
              <h3>{title}</h3>
              <ul className="offer-list">
                {items.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">How We Work</p>
          <h2>A clear process from audit to scale.</h2>
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
          <p className="eyebrow">Results You Can Expect</p>
          <h2>What changes when the system is running.</h2>
        </div>
        <div className="experience-list" data-reveal>
          {results.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card guarantee-box" data-reveal>
          <p className="eyebrow">Featured Offer</p>
          <h2>30-Day Lead Flow Sprint</h2>
          <p className="sprint-subhead">Get real, qualified leads in 30 days with:</p>
          <div className="experience-list">
            {sprintIncludes.map((item) => (
              <div key={item}>
                <CheckCircle2 size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="sprint-muted">
            Guarantee: real leads in 30 days, or we continue working at no additional management fee
            until you do.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/lead-flow-sprint">
              <ArrowUpRight size={18} />
              Start Your Sprint
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">FAQ</p>
          <h2>What business owners usually ask.</h2>
        </div>
        <div className="glass-card sprint-card faq-list" data-reveal>
          {faqs.map(({ q, a }) => (
            <div className="faq-item" key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section final-cta">
        <div className="section-heading" data-reveal>
          <h2>Ready to grow your business with performance marketing?</h2>
        </div>
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>Book a free consultation and discover how we can generate more leads, customers, and sales for your business.</p>
        </div>
        <div className="hero-actions">
          <LeadCta label="Schedule a Free Call" context="Performance Marketing — Schedule a Free Call" />
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
