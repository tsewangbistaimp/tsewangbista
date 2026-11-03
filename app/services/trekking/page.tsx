import type { Metadata } from "next";
import { CheckCircle2, Clock, Compass, Landmark, MountainSnow, ShieldCheck } from "lucide-react";
import ScrollEffects from "../../components/ScrollEffects";
import BackToPortfolio from "../../components/BackToPortfolio";
import TrekForm from "./TrekForm";

export const metadata: Metadata = {
  title: "Trekking Guide, Mustang",
  description:
    "Plan a trek in Nepal with a local guide from Mustang. Send a short enquiry for a private trek, a group trek or a custom itinerary."
};

const perks = [
  { icon: MountainSnow, title: "Mustang local", body: "5-6 years of trekking guide experience in Mustang, Nepal." },
  { icon: Landmark, title: "Culture and villages", body: "Local knowledge of traditional villages, monasteries and mountain life." },
  { icon: ShieldCheck, title: "Safety first", body: "Altitude awareness, sensible pacing and honest advice on what suits you." },
  { icon: Clock, title: "Quick enquiry", body: "A short form of about 3-5 minutes. No payment, no commitment." }
];

const routes = [
  "Upper Mustang", "Lower Mustang", "Jomsom to Muktinath", "Lo Manthang cultural trek", "Annapurna Circuit",
  "Annapurna Base Camp", "Ghorepani Poon Hill", "Mardi Himal", "Everest Base Camp", "Langtang Valley"
];

export default function TrekkingPage() {
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects />
      <div className="cursor-glow" aria-hidden="true" />
      <BackToPortfolio />

      <section className="section-shell sprint-hero" data-reveal>
        <p className="eyebrow">Trekking Guide</p>
        <h1 className="sprint-headline">Trek Nepal with a Mustang local.</h1>
        <p className="sprint-subhead">
          Tell me where you would like to go and when. I will reply personally with route advice, what to prepare and a price estimate for your group. An enquiry is not a booking, and nothing is charged.
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
          <p className="eyebrow">Routes</p>
          <h2>Treks you can ask about.</h2>
        </div>
        <div className="experience-list">
          {routes.map((item) => (
            <div key={item}>
              <Compass size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="sprint-subhead" style={{ marginTop: 18 }}>
          These are planning options. Which routes I personally guide, current permit rules, prices and dates are confirmed with you before anything is booked.
        </p>
      </section>

      <section className="section-shell sprint-section" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">What happens next</p>
          <h2>Simple and transparent.</h2>
        </div>
        <div className="experience-list">
          {["You send the short enquiry", "I reply by email or WhatsApp with options", "We agree route, dates and price", "Permits and arrangements are confirmed before booking"].map((item) => (
            <div key={item}>
              <CheckCircle2 size={20} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section" data-reveal>
        <div className="section-heading">
          <p className="eyebrow">Plan your trek</p>
          <h2>Send an enquiry.</h2>
        </div>
        <TrekForm />
      </section>
    </main>
  );
}
