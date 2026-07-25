import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Handshake,
  Headset,
  PackageCheck,
  PhoneCall,
  Sparkles,
  Star
} from "lucide-react";
import ScrollEffects from "../components/ScrollEffects";
import LeadCta from "../components/LeadCta";

export const metadata: Metadata = {
  title: "Chef's Trial Crate — Mustang Apple Farming",
  description:
    "Get a free trial crate of consistent, restaurant-grade local apples delivered to your kitchen this week — no contract, no minimum order, no risk."
};

const steps = [
  {
    icon: PhoneCall,
    title: "Step 1 — Tell us what you normally order",
    body: "A quick conversation about your typical weekly volume and delivery schedule. Takes a few minutes."
  },
  {
    icon: PackageCheck,
    title: "Step 2 — We build your trial crate",
    body: "Sized to match your real order, not a token sample box. Delivered on your schedule."
  },
  {
    icon: ClipboardCheck,
    title: "Step 3 — You taste it, plate it, judge it",
    body: "No pressure, no contract. Use it exactly like you would a normal order and see how it performs on your line."
  },
  {
    icon: Handshake,
    title: "Step 4 — Decide if it earns a permanent spot",
    body: "If it does, you move to regular delivery with transparent, published pricing. If it doesn't, no hard feelings — you owe nothing."
  }
];

const benefits = [
  "You stop firefighting supplier problems — consistent quality and reliable delivery means one less thing eating into your week.",
  "Your menu gets a real story to tell — an actual grower name, farm, and region you can put in front of guests with confidence.",
  "You get treated like an account that matters — a dedicated contact who actually answers, instead of a call center or a portal that never responds.",
  "You protect your margins — fewer spoiled deliveries, fewer wasted cases, fewer emergency substitutions that throw off your food cost.",
  "You get first access to what's actually good — limited and seasonal varieties go to trial-crate accounts first, before they're gone."
];

const included = [
  "A full trial crate of premium local apples, sized to your typical weekly order",
  "Delivery on a schedule that fits your kitchen, not the other way around",
  "A dedicated account contact for onboarding, questions, and scheduling",
  "Transparent volume-based pricing shown upfront if you decide to continue — no hidden \"call for a quote\" games"
];

const bonuses = [
  {
    icon: FileText,
    title: "Custom Sourcing Story",
    body: "A ready-to-use one-pager with the grower's name, farm, and region, written so you can drop it straight onto your menu or marketing without writing a word yourself."
  },
  {
    icon: Sparkles,
    title: "Priority Access to Rare Varieties",
    body: "First right of refusal on limited heirloom and seasonal apples before they're offered anywhere else — great for specials and seasonal menus."
  },
  {
    icon: Headset,
    title: "Dedicated Account Support",
    body: "A real person assigned to your account from day one, not a rotating support queue."
  }
];

const testimonials = [
  {
    quote:
      "The first thing I noticed wasn't the taste — it was that someone actually called to confirm my delivery window.",
    name: "Restaurant Owner (placeholder quote)"
  },
  {
    quote: "We stopped losing product to bruising and inconsistent sizing within the first two weeks.",
    name: "Café Owner (placeholder quote)"
  }
];

const objections = [
  {
    q: "\"I already have a supplier.\"",
    a: "Good — keep them. The trial crate isn't asking you to switch anything yet. It's just letting you compare, side by side, with zero commitment."
  },
  {
    q: "\"Can you actually handle my volume every week?\"",
    a: "That's exactly what the trial crate is designed to prove. It's sized to match your real order, not a small sample — so you see real performance, not a best-case demo."
  },
  {
    q: "\"What happens during the off-season?\"",
    a: "We'll walk you through seasonal availability honestly during onboarding, so there are no surprises — including what alternatives look like when certain varieties are out of season."
  },
  {
    q: "\"Is this going to cost more than what I'm paying now?\"",
    a: "Pricing is published and transparent once you move past the free trial — no vague \"call for pricing,\" no special deal for someone else that you don't get. You'll know exactly what you're comparing against."
  },
  {
    q: "\"I don't have time to onboard a new supplier.\"",
    a: "The whole point of the trial crate is that it takes almost none of your time. One short conversation, one delivery, and you judge it on your own schedule."
  }
];

export default function ChefsTrialCratePage() {
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects />
      <div className="cursor-glow" aria-hidden="true" />

      <Link href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to portfolio
      </Link>
      <Link href="/#work" className="back-link">
        <ArrowUpRight size={16} />
        Part of Mustang Apple Farming
      </Link>

      <section className="section-shell sprint-hero" data-reveal>
        <p className="eyebrow">Chef&apos;s Trial Crate — Mustang Apple Farming</p>
        <h1 className="sprint-headline">
          Stop Hoping Your Produce Supplier Shows Up. Start Knowing.
        </h1>
        <p className="sprint-subhead">
          Get a free trial crate of consistent, restaurant-grade local apples delivered to your kitchen
          this week — no contract, no minimum order, no risk.
        </p>
        <div className="hero-actions">
          <LeadCta label="Get My Free Trial Crate" context="Chef's Trial Crate — Hero CTA" />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>You&apos;ve felt it before.</p>
          <p>
            The delivery truck is late. Or it shows up, but half the box is bruised. Or the sizes are all
            over the place and you have to rebuild your prep plan on the fly — during service.
          </p>
          <p>
            If you run a restaurant, café, or hotel kitchen, you already know: a bad produce delivery
            isn&apos;t just an inconvenience. It&apos;s a Friday night scramble. It&apos;s a menu item you
            have to 86 an hour before doors open. It&apos;s you, on the phone, trying to fix a problem you
            didn&apos;t create.
          </p>
          <p>You shouldn&apos;t have to cross your fingers every time a delivery truck pulls up.</p>
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Sound familiar?</p>
          <h2>Produce is treated like a line item, not a relationship.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>
            Here&apos;s the truth nobody tells you when you sign with a big distributor: produce is
            treated like a line item, not a relationship.
          </p>
          <p>
            You&apos;re one account among thousands. When supply gets tight, you&apos;re not the priority
            — the big chains are. When quality drops, nobody calls to warn you. You just open the box and
            deal with it.
          </p>
          <p>
            So you patch it together. Maybe you go to the wholesale market yourself and eat the labor
            cost. Maybe you juggle three or four small local farms, each with their own delivery day,
            their own invoice, their own inconsistent quantities. It &quot;works,&quot; but it&apos;s
            exhausting — and it&apos;s your time being spent managing suppliers instead of running your
            kitchen.
          </p>
          <p>
            And underneath all of it is a quieter frustration: you want to tell a better story to your
            guests. &quot;Locally sourced&quot; sounds great on a menu, but if it&apos;s not actually true
            — or not actually consistent — your guests will eventually notice. And so will your margins,
            every time a shipment gets tossed for being unusable.
          </p>
          <p>
            You&apos;re not asking for much. You just want apples that show up on time, look the same
            every week, and taste like something. Is that really so hard to find?
          </p>
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">The Solution</p>
          <h2>A trial crate, not a sales pitch.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>It&apos;s not hard to find. It&apos;s just hard to find without taking a risk on switching.</p>
          <p>That&apos;s exactly why we built the Chef&apos;s Trial Crate.</p>
          <p>
            It&apos;s not a sales pitch and it&apos;s not a sample size that doesn&apos;t tell you anything
            real. It&apos;s a full trial crate, sized to match your actual weekly order, delivered free —
            so you can see for yourself what consistent, local, restaurant-grade apples look and taste
            like in your own kitchen, on your own menu, before you commit to anything.
          </p>
          <p>
            Think of it less like &quot;trying a new supplier&quot; and more like installing a system that
            finally works — reliable delivery, consistent quality, and a real person on the other end of
            the phone when you need one.
          </p>
        </div>
        <div className="hero-actions">
          <LeadCta label="Start My Trial Crate" context="Chef's Trial Crate — Solution CTA" />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">How It Works</p>
          <h2>From a quick call to a decision, on your terms.</h2>
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
          <h2>What changes once the crate shows up.</h2>
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
          <h2>Everything in your free trial crate.</h2>
        </div>
        <div className="experience-list" data-reveal>
          {included.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="hero-actions">
          <LeadCta label="Claim My Trial Crate" context="Chef's Trial Crate — What's Included CTA" />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Bonuses</p>
          <h2>Included free with every trial crate.</h2>
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
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Social Proof</p>
          <h2>Kitchens who were tired of being an account number.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>
            We currently work with independent restaurants, cafés, and boutique hotels who were tired of
            being just another account number to a national distributor.
          </p>
        </div>
        <div className="testimonial-grid" data-reveal>
          {testimonials.map((testimonial) => (
            <article className="glass-card testimonial-card" key={testimonial.name}>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="currentColor" />
                ))}
              </div>
              <p>&quot;{testimonial.quote}&quot;</p>
              <span>{testimonial.name}</span>
            </article>
          ))}
        </div>
        <p className="testimonial-placeholder">
          Swap these for real quotes from your first trial-crate customers as soon as you have them — even
          2–3 short, specific ones will significantly increase trust on this section.
        </p>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Objection Handling</p>
          <h2>The questions every kitchen asks first.</h2>
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
          <h2>If it doesn&apos;t meet your standards, you owe nothing.</h2>
          <p className="sprint-subhead">
            No contract. No obligation to continue. No awkward cancellation process. You try it, you judge
            it on your own kitchen&apos;s standards, and you decide — with zero financial risk either way.
          </p>
        </div>
        <div className="hero-actions">
          <LeadCta label="Claim The Guarantee" context="Chef's Trial Crate — Guarantee CTA" />
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="glass-card sprint-card urgency-box" data-reveal>
          <p className="eyebrow">Urgency &amp; Scarcity</p>
          <h2>Only 5 new trial-crate accounts a month.</h2>
          <p className="sprint-muted">
            This isn&apos;t a marketing trick — it&apos;s how we make sure every kitchen we bring on
            actually gets the delivery reliability and quality we promise.
          </p>
          <p className="sprint-muted">
            Once a month&apos;s spots are filled, the next opening isn&apos;t until the following month.
          </p>
        </div>
      </section>

      <section className="section-shell sprint-section final-cta">
        <div className="section-heading" data-reveal>
          <h2>You didn&apos;t get into this business to chase supplier problems.</h2>
        </div>
        <div className="glass-card sprint-card sprint-body" data-reveal>
          <p>
            Claim one of this month&apos;s 5 free Chef&apos;s Trial Crate spots — see the difference in
            your own kitchen, with zero risk and zero contract.
          </p>
        </div>
        <div className="hero-actions">
          <LeadCta label="Get My Free Trial Crate" context="Chef's Trial Crate — Final CTA" />
        </div>
        <p className="sprint-muted">
          No contract. No obligation. Just apples that actually show up — and actually taste like
          something.
        </p>
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
