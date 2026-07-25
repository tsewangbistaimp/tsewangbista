import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, MessageCircle } from "lucide-react";
import ScrollEffects from "../components/ScrollEffects";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thanks for reaching out — we've received your details and will follow up shortly."
};

const WHATSAPP_NUMBER = "9779862568506";

const nextSteps = [
  "We review your details and match them to the right service or offer.",
  "We reach out on WhatsApp or email at contact@tsewangbista.com to confirm the next step.",
  "If it's the 30-Day Lead Flow Sprint, we schedule your onboarding call."
];

export default async function ThankYouPage({
  searchParams
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    service ? `Hi! Following up on: ${service}` : "Hi! Following up on my inquiry."
  )}`;

  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects />
      <div className="cursor-glow" aria-hidden="true" />

      <section className="section-shell sprint-hero" data-reveal>
        <p className="eyebrow">Thank You</p>
        <h1 className="sprint-headline">We&apos;ve got your details.</h1>
        <p className="sprint-subhead">
          {service ? `Thanks for your interest in ${service}. ` : "Thanks for reaching out. "}
          Your information has been sent to contact@tsewangbista.com, and we&apos;ll follow up with you
          shortly — usually within 24 hours.
        </p>
        <div className="hero-actions">
          <a className="button primary" href={whatsappHref} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            Continue on WhatsApp
          </a>
          <Link className="button secondary" href="/">
            <ArrowUpRight size={18} />
            Back to Portfolio
          </Link>
        </div>
      </section>

      <section className="section-shell sprint-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">What Happens Next</p>
          <h2>You don&apos;t need to do anything else.</h2>
        </div>
        <div className="experience-list" data-reveal>
          {nextSteps.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
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
