import type { Metadata } from "next";
import { CheckCircle2, Clock, Gift, Palette, Smartphone } from "lucide-react";
import ScrollEffects from "../../components/ScrollEffects";
import BackToPortfolio from "../../components/BackToPortfolio";
import FreePortfolioForm from "./FreePortfolioForm";

export const metadata: Metadata = {
  title: "Free Portfolio",
  description:
    "Register for a free personal portfolio website. Share your details in one simple form and get a professional, mobile-friendly portfolio built for you."
};

const perks = [
  { icon: Gift, title: "100% free", body: "No hidden fees. Register and we build your first portfolio at no cost." },
  { icon: Palette, title: "Designed for you", body: "Your colours, your style, your story, shaped by what you tell us." },
  { icon: Smartphone, title: "Mobile-ready", body: "Looks sharp on phones, tablets and desktops, and loads fast." },
  { icon: Clock, title: "Just 5 minutes", body: "One short form. We take it from there and send you a preview." }
];

const included = ["About, skills and experience sections", "Project showcase with links and images", "Contact and social links", "Clean, responsive design", "Free web address suggestion", "Preview sent to your email"];

export default function FreePortfolioPage() {
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects />
      <div className="cursor-glow" aria-hidden="true" />
      <BackToPortfolio />

      <section className="section-shell sprint-hero" data-reveal>
        <p className="eyebrow">Free Service</p>
        <h1 className="sprint-headline">Get your free portfolio website.</h1>
        <p className="sprint-subhead">
          Register below and tell us about yourself. We turn your details into a professional portfolio you can share with employers, clients and the world.
        </p>
      </section>

      <section className="section-shell sprint-section" data-reveal>
        <div className="service-list">
          {perks.map(({ icon: Icon, title, body }) => (
            <article key={title}>
              <Icon size={20} />
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">What&apos;s included</p>
          <h2>Everything a great portfolio needs.</h2>
        </div>
        <div className="experience-list">
          {included.map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">Register</p>
          <h2>Tell us about you.</h2>
        </div>
        <FreePortfolioForm />
      </section>
    </main>
  );
}
