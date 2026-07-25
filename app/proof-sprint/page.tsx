import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Camera,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Rocket,
  Send,
  TrendingUp,
  Wand2
} from "lucide-react";
import ScrollEffects from "../components/ScrollEffects";
import BackToPortfolio from "../components/BackToPortfolio";
import LeadCta from "../components/LeadCta";

export const metadata: Metadata = {
  title: "The 30-Day Proof Sprint — Hospitality Leadership",
  description:
    "No contracts. No confusing reports. Just a simple system that gets your shop seen by the right people — and real proof it's working, every single week."
};

const PROOF_MESSAGE = "Hi! PROOF — I want the 30-Day Proof Sprint.";

const steps = [
  {
    icon: Wand2,
    title: "Step 1: We set up your system (Day 1–7)",
    body: "We research your ideal customers, set up your Facebook and Instagram campaigns, and create scroll-stopping ad content — photos and short videos — built specifically for your shop."
  },
  {
    icon: Rocket,
    title: "Step 2: We run it and manage it daily (Day 7–30)",
    body: "Your campaigns go live. We manage them every day, adjusting what's working and cutting what isn't."
  },
  {
    icon: MessageSquare,
    title: "Step 3: You get a simple update every week",
    body: "No jargon. No 10-page reports. Just a WhatsApp message: here's what we ran, here's what happened, here's what's next."
  },
  {
    icon: TrendingUp,
    title: "Step 4: You see real inquiries coming in",
    body: "Actual people messaging you about your product — trackable, visible, real."
  }
];

const benefits = [
  "Stop guessing whether your marketing is working — see real inquiries, not vague \"engagement\"",
  "Stop wasting money on boosted posts that go nowhere",
  "Get a system that runs itself once it's set up, so you can focus on running your business",
  "Understand exactly what's happening with your marketing, every week, in plain language",
  "Show up in local search too, so customers looking for you nearby can actually find you",
  "Try it with almost no risk — this isn't a 6-month leap of faith"
];

const included = [
  "AI-powered audience research + ad targeting setup — so your ads reach people who actually want what you sell (worth NPR 8,000)",
  "8 pieces of scroll-stopping ad creative — static images and short reels made for your shop, for the full month (worth NPR 12,000)",
  "Facebook + Instagram campaign setup and daily management — we run and adjust everything, every day (worth NPR 10,000)",
  "Weekly WhatsApp performance update — plain language, no jargon, sent straight to your phone (worth NPR 5,000)"
];

const bonuses = [
  {
    icon: MapPin,
    title: "Free Google Business Profile Optimization",
    body: "So customers searching for you nearby can actually find you (worth NPR 3,000)."
  },
  {
    icon: Camera,
    title: "\"5 Photos That Actually Sell\"",
    body: "A simple phone photography guide to make your product photos convert better (worth NPR 1,500)."
  },
  {
    icon: Send,
    title: "Fast-Action Bonus",
    body: "Start this week and get a free landing/WhatsApp catalog page customers can browse and message you from directly (worth NPR 5,000)."
  }
];

const objections = [
  {
    q: "\"I've tried agencies before and it didn't work.\"",
    a: "That's exactly why this is different. No 6-month contract. No confusing reports. Just 30 days, real numbers, and a guarantee that puts the risk on us, not you."
  },
  {
    q: "\"I don't understand ads or marketing — this sounds complicated.\"",
    a: "It's not, for you. We handle everything — the setup, the daily management, the strategy. All you get is a simple WhatsApp update each week telling you what happened."
  },
  {
    q: "\"What if it doesn't work for my shop?\"",
    a: "If you don't get at least 15 tracked leads or inquiries in your first 30 days, we work your second month completely free. No argument, no fine print."
  },
  {
    q: "\"Is NPR 12,000 worth it?\"",
    a: "You're getting over NPR 44,500 worth of work, creative, and tools for NPR 12,000 — and if it doesn't perform, your next month costs nothing."
  }
];

export default function ProofSprintPage() {
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects />
      <div className="cursor-glow" aria-hidden="true" />

      <BackToPortfolio />
      <Link href="/#work" className="back-link">
        <ArrowUpRight size={16} />
        Part of Hospitality Leadership
      </Link>

      <section className="section-shell sprint-hero" data-reveal>
        <div className="sprint-hero-grid">
          <div className="sprint-hero-copy">
            <p className="eyebrow">The 30-Day Proof Sprint</p>
            <h1 className="sprint-headline">
              Get Real Customers Messaging You in 30 Days — Or We Work Your Next Month Free
            </h1>
            <p className="sprint-subhead">
              No contracts. No confusing reports. Just a simple system that gets your shop seen by the
              right people — and real proof it&apos;s working, every single week.
            </p>
            <div className="hero-actions">
              <LeadCta
                label="Message Us on WhatsApp Now"
                context="30-Day Proof Sprint — Hero CTA"
                whatsappMessage={PROOF_MESSAGE}
              />
            </div>
          </div>
          <div className="hero-visual">
            <div className="portrait-halo" />
            <div className="portrait-card">
              <Image
                src="/images/tsewang-bista-hospitality-leadership.jpg"
                alt="Tsewang Bista — Hospitality Leadership"
                width={1086}
                height={1448}
                className="portrait"
                sizes="(max-width: 900px) 60vw, 380px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>Be honest with yourself for a second.</p>
          <p>
            When&apos;s the last time someone messaged you saying &quot;Is this in stock?&quot; or
            &quot;Can I order this today?&quot; — because they saw your shop online?
          </p>
          <p>
            If it&apos;s been a while... it&apos;s not your product. It&apos;s not your prices. It&apos;s
            that the right people simply aren&apos;t seeing you.
          </p>
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Sound familiar?</p>
          <h2>You&apos;ve probably already tried something.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>
            Maybe you boosted a post and got a few likes, one weird comment, and no actual customers.
            Maybe you hired an agency once, paid a good amount of money, and got back a report full of
            numbers you didn&apos;t understand — reach this, engagement that — while your WhatsApp stayed
            just as quiet.
          </p>
          <p>Maybe you&apos;ve just been posting whatever you can, whenever you have time, hoping something sticks.</p>
          <p>
            None of that is your fault. Running ads that actually bring in customers is a completely
            different skill than posting on Instagram. And most agencies make it worse — they hand you
            jargon instead of answers, and lock you into 6-month contracts before you even know if any of
            it works.
          </p>
          <p>You end up more confused, more cautious, and honestly — a little burned.</p>
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">The Solution</p>
          <h2>A simple system, not a mystery service.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>Here&apos;s what we do differently.</p>
          <p>
            We built a simple system — not a mystery service — that gets your shop in front of real
            customers and shows you exactly what&apos;s happening, in plain language, every week.
          </p>
          <p>
            It&apos;s not &quot;run some ads and hope.&quot; It&apos;s targeting the right people,
            creating content that actually stops the scroll, and tracking real results — the kind you can
            see for yourself, not just numbers on a report you have to trust us on.
          </p>
        </div>
        <div className="hero-actions">
          <LeadCta
            label="Start My Proof Sprint"
            context="30-Day Proof Sprint — Solution CTA"
            whatsappMessage={PROOF_MESSAGE}
          />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">How It Works</p>
          <h2>From setup to real inquiries, in 30 days.</h2>
        </div>
        <div className="service-list" data-reveal>
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
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Benefits</p>
          <h2>What changes once the system is running.</h2>
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
        <div className="section-heading" data-reveal>
          <p className="eyebrow">What&apos;s Included</p>
          <h2>Everything you need to get real customers messaging you within 30 days.</h2>
        </div>
        <div className="experience-list" data-reveal>
          {included.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="glass-card sprint-card guarantee-box" data-reveal>
          <p className="eyebrow">Total Value: NPR 35,000</p>
          <h2>Your Price: NPR 12,000/month</h2>
        </div>
        <div className="hero-actions">
          <LeadCta
            label="Claim My Proof Sprint"
            context="30-Day Proof Sprint — What's Included CTA"
            whatsappMessage={PROOF_MESSAGE}
          />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Bonuses</p>
          <h2>To make this a complete system, not just ads.</h2>
        </div>
        <div className="venture-grid">
          {bonuses.map(({ icon: Icon, title, body }) => (
            <article className="glass-card venture-card" key={title} data-reveal>
              <Icon size={28} />
              <span>Bonus</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <p className="sprint-muted">Total value with bonuses: NPR 44,500 — for NPR 12,000/month.</p>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Social Proof</p>
          <h2>Built for owners who&apos;ve been let down by agencies before.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>
            We&apos;ve built this system specifically for small business owners who&apos;ve been let down
            by agencies before — the ones who want proof, not promises.
          </p>
          <p>
            What we can tell you now: this system is built around one rule — if it doesn&apos;t get you
            real inquiries, we don&apos;t get paid for the next month. We only take on 5 new businesses
            per city, per month, because one strategist can only properly manage so many accounts at once
            — and we&apos;d rather do this well for a few shops than poorly for many.
          </p>
        </div>
        <p className="testimonial-placeholder">
          Add real client results, testimonials, or before/after screenshots here once available — even
          1–2 short quotes from early clients about their weekly WhatsApp updates or inquiry numbers will
          strengthen this section significantly.
        </p>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Objection Handling</p>
          <h2>The questions every owner asks first.</h2>
        </div>
        <div className="glass-card sprint-card faq-list" data-reveal>
          {objections.map(({ q, a }) => (
            <div className="faq-item" key={q}>
              <h3>{q}</h3>
              <p>{a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card guarantee-box" data-reveal>
          <p className="eyebrow">Risk Reversal / Guarantee</p>
          <h2>We work your next month free if it doesn&apos;t perform.</h2>
          <p className="sprint-subhead">
            If you don&apos;t get at least 15 tracked leads or inquiries in your first 30 days, we work
            your next month for free.
          </p>
          <p className="sprint-muted">
            No argument. No fine print. No hoops to jump through. We&apos;re confident enough in this
            system to put our own time on the line for it.
          </p>
        </div>
        <div className="hero-actions">
          <LeadCta
            label="Claim The Guarantee"
            context="30-Day Proof Sprint — Guarantee CTA"
            whatsappMessage={PROOF_MESSAGE}
          />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card urgency-box" data-reveal>
          <p className="eyebrow">Urgency &amp; Scarcity</p>
          <h2>Only 5 new businesses per city, per month.</h2>
          <p className="sprint-muted">
            This isn&apos;t a countdown timer trick — it&apos;s a real limit. One strategist can only
            properly manage and personally track so many accounts without the quality dropping.
          </p>
          <p className="sprint-muted">Once this month&apos;s spots are filled, the next opening is next month.</p>
        </div>
      </section>

      <section className="section-shell sprint-section final-cta">
        <div className="section-heading" data-reveal>
          <h2>You need real customers messaging you — and proof it&apos;s working.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>
            You don&apos;t need another agency that talks over your head. You don&apos;t need another
            6-month contract you&apos;re not sure about.
          </p>
          <p>Message us &quot;PROOF&quot; on WhatsApp to grab one of this month&apos;s 5 spots.</p>
        </div>
        <div className="hero-actions">
          <LeadCta
            label="Message Us on WhatsApp Now"
            context="30-Day Proof Sprint — Final CTA"
            whatsappMessage={PROOF_MESSAGE}
          />
        </div>
        <p className="sprint-muted">30 days. Real numbers. Or your next month is free.</p>
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
