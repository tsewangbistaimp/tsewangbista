import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Gauge,
  Inbox,
  MessageCircle,
  PhoneCall,
  Rocket,
  Users
} from "lucide-react";

export const metadata: Metadata = {
  title: "The 30-Day Lead Flow Sprint",
  description:
    "A done-for-you lead system for cold Meta Ads traffic: Meta Ads, a high-converting landing page, and automated follow-up that turns your ads and social media into real, paying leads in 30 days."
};

const WHATSAPP_NUMBER = "9779862568506";
const WHATSAPP_MESSAGE = "Hi! I want the 30-Day Lead Flow Sprint.";
const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function WhatsappCta({ label = "Get Your 30-Day Lead Flow Sprint" }: { label?: string }) {
  return (
    <a className="button primary" href={whatsappHref} target="_blank" rel="noreferrer">
      <MessageCircle size={18} />
      {label}
    </a>
  );
}

const steps = [
  {
    icon: PhoneCall,
    title: "Step 1: We learn your business",
    body: "A short onboarding call to understand your offer, your customers, and your goals — no jargon, no confusion."
  },
  {
    icon: Rocket,
    title: "Step 2: We build your system",
    body: "We set up your Meta Ads, a landing page built to convert, and automatic follow-up (WhatsApp/email/SMS) so every lead gets a response — even if you're busy or asleep."
  },
  {
    icon: Gauge,
    title: "Step 3: We launch and optimize",
    body: "Your campaign goes live. We track every result and adjust it in real time, so your budget goes toward what's actually working."
  },
  {
    icon: Inbox,
    title: "Step 4: Leads land in your inbox",
    body: "Real people, ready to talk — not just likes and comments. You focus on serving them. We focus on keeping the leads coming."
  }
];

const benefits = [
  'Stop wondering "is my marketing even working" — you\'ll see real leads coming in, tracked and visible',
  "Stop losing interested customers to slow or missed follow-up",
  "Stop spending time you don't have creating content with no clear return",
  "Get a system that keeps working even on your busiest, most chaotic weeks",
  'Finally feel like your marketing budget is going somewhere — not disappearing into "reach" and "impressions"'
];

const included = [
  "Done-for-you Meta Ads campaign — strategy, copy, creative, and setup",
  "A high-converting landing page, built specifically for your offer",
  "Automated lead follow-up sequence (WhatsApp/SMS + email), so no lead is ever left waiting",
  "A simple, plain-English dashboard showing exactly what's working"
];

const bonuses = [
  {
    icon: Bot,
    title: "Free AI Chatbot Setup",
    body: "Installed on your website or Facebook page to capture leads even after hours — worth having on its own, included free."
  },
  {
    icon: Gauge,
    title: "Custom Lead-Tracking Dashboard",
    body: "See exactly how many leads came in, from where, and what it cost — no confusing spreadsheets."
  },
  {
    icon: Users,
    title: '"Ready to Convert" Training Call',
    body: "A 30-minute call to walk you (or your team) through exactly how to handle and close the new leads coming in."
  }
];

const objections = [
  {
    q: '"I\'ve tried ads before and it didn\'t work."',
    a: "Most ad campaigns fail because the ad is doing all the work alone — no landing page, no follow-up, no tracking. This system fixes the actual gap, not just the ad itself."
  },
  {
    q: '"I don\'t have time to manage another thing."',
    a: "You won't need to. This is fully done-for-you. Your only job is to reply to the leads that come in."
  },
  {
    q: '"Will this feel robotic or fake to my customers?"',
    a: "No. The follow-up messages are written to sound like you — warm, natural, and human. Automation just makes sure nobody gets missed."
  },
  {
    q: '"What if it doesn\'t work for my business?"',
    a: "That's exactly why there's a guarantee (see below). You're not taking the risk alone."
  }
];

export default function LeadFlowSprintPage() {
  return (
    <main className="portfolio-shell sprint-page">
      <div className="cursor-glow" aria-hidden="true" />

      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to portfolio
      </Link>

      <section className="section-shell sprint-hero">
        <p className="eyebrow">The 30-Day Lead Flow Sprint</p>
        <h1 className="sprint-headline">
          Get Real, Paying Leads in 30 Days — Or We Work Free Until You Do.
        </h1>
        <p className="sprint-subhead">
          A done-for-you system that turns your ads and social media into actual bookings, orders, and
          inquiries — without you having to post more, chase leads, or figure out ads on your own.
        </p>
        <div className="hero-actions">
          <WhatsappCta />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card sprint-body">
          <p>You&apos;re posting. You&apos;re trying. You might even be running ads already.</p>
          <p>And yet... the phone isn&apos;t ringing the way it should.</p>
          <p>If that sounds familiar, you&apos;re not doing anything wrong. You&apos;re just missing one thing.</p>
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading">
          <p className="eyebrow">Sound familiar?</p>
          <h2>Here&apos;s what usually happens.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body">
          <p>
            You post consistently. You put effort into your content, maybe even pay for a few boosted
            posts. People like it. Some people comment. And then... nothing. No bookings. No orders. No
            real growth.
          </p>
          <p>
            So you try ads. You spend money, hoping this time will be different. You get some clicks,
            maybe a few messages. But most of those leads go quiet — because there was no system to
            follow up with them before they moved on to your competitor.
          </p>
          <p>It&apos;s not that your product isn&apos;t good enough. It&apos;s not that you&apos;re bad at this.</p>
          <p>
            It&apos;s that content and ads without a system behind them are just noise. No landing page
            built to convert. No automatic follow-up. No tracking to tell you what&apos;s actually working.
          </p>
          <p>So you keep guessing. Keep spending. Keep hoping the next post is the one that finally brings in customers.</p>
          <p>That&apos;s exhausting — and it doesn&apos;t have to be this way.</p>
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading">
          <p className="eyebrow">The Solution</p>
          <h2>A complete lead system, installed in 30 days.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body">
          <p>The 30-Day Lead Flow Sprint isn&apos;t another &quot;we&apos;ll post some content for you&quot; package.</p>
          <p>
            It&apos;s a complete lead system — built and installed for your business in 30 days — that runs
            in the background, brings in real leads, and follows up automatically so nobody slips through
            the cracks.
          </p>
          <p>You don&apos;t need to learn ads. You don&apos;t need to chase leads manually. You just need the system running — and we build it for you.</p>
        </div>
        <div className="hero-actions">
          <WhatsappCta label="Start My Sprint" />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading">
          <p className="eyebrow">How It Works</p>
          <h2>From onboarding call to inbox full of leads.</h2>
        </div>
        <div className="service-list">
          {steps.map(({ icon: Icon, title, body }) => (
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
        <div className="section-heading">
          <p className="eyebrow">Benefits</p>
          <h2>What changes once the system is running.</h2>
        </div>
        <div className="experience-list">
          {benefits.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading">
          <p className="eyebrow">What&apos;s Included</p>
          <h2>Everything set up and running for you.</h2>
        </div>
        <div className="experience-list">
          {included.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="hero-actions">
          <WhatsappCta label="Claim My Sprint Spot" />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading">
          <p className="eyebrow">Bonuses</p>
          <h2>Included free with every Sprint.</h2>
        </div>
        <div className="venture-grid">
          {bonuses.map(({ icon: Icon, title, body }) => (
            <article className="glass-card venture-card" key={title}>
              <Icon size={28} />
              <span>Bonus</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading">
          <p className="eyebrow">Why Business Owners Trust This</p>
          <h2>Leads, not likes.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body">
          <p>Every part of this system is built around one idea: leads, not likes.</p>
          <p>
            We don&apos;t measure success by how many people saw your post. We measure it by how many
            people messaged you, booked you, or bought from you.
          </p>
          <p>That&apos;s the only number that matters to your business — and it&apos;s the only number we optimize for.</p>
        </div>
        <p className="testimonial-placeholder">
          Client result coming soon — e.g. &quot;Helped [Business Name] go from 3 to 22 leads/month in
          their first Sprint.&quot;
        </p>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading">
          <p className="eyebrow">Objection Handling</p>
          <h2>The questions every owner asks first.</h2>
        </div>
        <div className="glass-card sprint-card faq-list">
          {objections.map(({ q, a }) => (
            <div className="faq-item" key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card guarantee-box">
          <p className="eyebrow">Risk Reversal / Guarantee</p>
          <h2>We work free until you get leads.</h2>
          <p className="sprint-subhead">
            If we don&apos;t generate real, qualified leads for your business within 30 days, we work the
            next month for free.
          </p>
          <p className="sprint-muted">No fine print. No disappearing act. We&apos;re putting the risk on us, not you.</p>
        </div>
        <div className="hero-actions">
          <WhatsappCta label="Claim The Guarantee" />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card urgency-box">
          <p className="eyebrow">Urgency &amp; Scarcity</p>
          <h2>Limited Sprint spots each month.</h2>
          <p className="sprint-muted">
            We only take on a small number of Sprint clients each month, so every launch gets proper
            attention — not rushed, not templated.
          </p>
          <p className="sprint-muted">Spots for this month are limited. Once they&apos;re filled, the next opportunity is next month.</p>
        </div>
      </section>

      <section className="section-shell sprint-section final-cta">
        <div className="section-heading">
          <h2>You don&apos;t need more content. You need leads.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body">
          <p>You don&apos;t need more content. You don&apos;t need more guessing.</p>
          <p>You need a system that brings leads to you — and 30 days to prove it works.</p>
        </div>
        <div className="hero-actions">
          <WhatsappCta label="Get Your 30-Day Lead Flow Sprint" />
        </div>
        <p className="sprint-muted">No long contracts. No risk. Just real leads, or we work free until you get them.</p>
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
