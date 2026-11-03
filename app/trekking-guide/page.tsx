import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, FileText, Mail, MapPin, MessageCircle, Mountain, Phone, User } from "lucide-react";
import ScrollEffects from "../components/ScrollEffects";
import BackToPortfolio from "../components/BackToPortfolio";
import ContactForm from "./ContactForm";
import { about, experience, galleryCategories, guide, mustangShare, mustangTopics, regions, services, skills, times } from "../../lib/trek/profile";
import "./trek.css";

export const metadata: Metadata = {
  title: "Trekking Guide | Mustang, Nepal",
  description: "Professional profile of Tsewang Bista, a trekking guide from Mustang, Nepal: experience, destinations, skills, services and contact."
};

const wa = (text: string) => `https://wa.me/${guide.whatsapp}?text=${encodeURIComponent(text)}`;
const Soon = ({ children }: { children: string }) => <p className="tg-soon">{children}</p>;

export default function TrekkingGuidePage() {
  return (
    <main className="portfolio-shell sprint-page tg">
      <ScrollEffects />
      <BackToPortfolio />

      <section className="section-shell tg-hero" data-reveal>
        <div className="tg-photo" role="img" aria-label="Guide photograph to be added">
          <User size={56} />
          <span>Guide photograph to be added</span>
        </div>
        <div>
          <p className="eyebrow">{guide.location}</p>
          <h1 className="sprint-headline">{guide.name}</h1>
          <p className="tg-title">{guide.title}</p>
          <p className="sprint-subhead">{guide.intro}</p>
          <ul className="tg-facts">
            <li><Clock size={16} /> {guide.experience}</li>
            <li><MapPin size={16} /> {guide.location}</li>
            <li><Mountain size={16} /> {guide.expertise.join(" · ")}</li>
            <li><MessageCircle size={16} /> {guide.languages}</li>
          </ul>
          <div className="hero-actions">
            <a className="button primary" href="#contact">Contact me <Mail size={16} /></a>
            <Link className="button secondary" href="/trekking-guide/cv">Download CV <FileText size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="section-shell tg-times" data-reveal>
        {times.map(([label, t]) => (
          <span key={label}><b>{t}</b>{label}</span>
        ))}
      </section>

      <section className="section-shell sprint-section" id="about" data-reveal>
        <div className="section-heading"><p className="eyebrow">About me</p><h2>My journey as a guide.</h2></div>
        <div className="tg-prose">{about.map((p) => <p key={p}>{p}</p>)}</div>
      </section>

      <section className="section-shell sprint-section" id="experience" data-reveal>
        <div className="section-heading"><p className="eyebrow">Experience</p><h2>My professional experience.</h2></div>
        <div className="tg-timeline">
          {experience.map((e) => (
            <article className="tg-card" key={e.role}>
              <h3>{e.role}</h3>
              <p className="tg-meta">{e.org}</p>
              <p className="tg-meta">{e.location} · {e.period}</p>
              <ul>{e.duties.map((d) => <li key={d}>{d}</li>)}</ul>
              <p className="tg-meta">Regions: {e.regions}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section" id="destinations" data-reveal>
        <div className="section-heading"><p className="eyebrow">Destinations</p><h2>Destinations and regions I know.</h2></div>
        <p className="tg-note">These are destination categories, not a claim that I have guided every route. Experience levels are shown only once confirmed.</p>
        {regions.map((r) => (
          <div className="tg-region" key={r.name}>
            <h3>{r.name}</h3>
            {r.note ? <p className="tg-flag">{r.note}</p> : null}
            <p className="tg-meta">{r.intro}</p>
            <div className="tg-grid">
              {r.places.map((p) => (
                <article className="tg-card" key={p.name}>
                  <h4>{p.name}</h4>
                  <p>{p.about}</p>
                  <span className="tg-badge">{p.level ?? "Experience level to be confirmed"}</span>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section-shell sprint-section" id="mustang" data-reveal>
        <div className="section-heading"><p className="eyebrow">Specialization</p><h2>Mustang: my home, my expertise.</h2></div>
        <div className="tg-chips">{mustangTopics.map((t) => <span key={t}>{t}</span>)}</div>
        <h3 className="tg-sub">What I can share with travellers</h3>
        <div className="experience-list">
          {mustangShare.map((t) => (<div key={t}><CheckCircle2 size={20} /><span>{t}</span></div>))}
        </div>
        <p className="tg-note">A guide with local knowledge helps you understand what you are seeing: the history behind a village, the meaning of a monastery, and how people live in the mountains.</p>
      </section>

      <section className="section-shell sprint-section" id="skills" data-reveal>
        <div className="section-heading"><p className="eyebrow">Skills</p><h2>My guiding skills and expertise.</h2></div>
        <div className="tg-grid">
          {skills.map((s) => (
            <article className="tg-card" key={s.group}>
              <h3>{s.group}</h3>
              <div className="tg-chips">{s.items.map((i) => <span key={i}>{i}</span>)}</div>
            </article>
          ))}
        </div>
        <p className="tg-note">Formal certifications are listed only in the credentials section, once verified.</p>
      </section>

      <section className="section-shell sprint-section" id="services" data-reveal>
        <div className="section-heading"><p className="eyebrow">Services</p><h2>Guiding services I offer.</h2></div>
        <div className="tg-grid">
          {services.map((s) => (
            <article className="tg-card" key={s.name}>
              <h3>{s.name}</h3>
              <p>{s.about}</p>
              <p className="tg-meta">Suitable for: {s.who}</p>
              <p className="tg-meta">Region: {s.region}</p>
              <a className="tg-link" href="#contact">Enquire</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell sprint-section" id="gallery" data-reveal>
        <div className="section-heading"><p className="eyebrow">Gallery</p><h2>Photographs from the trail.</h2></div>
        <div className="tg-gallery">
          {galleryCategories.map((c) => (<div key={c}><span>{c}</span><small>Photos to be added</small></div>))}
        </div>
      </section>

      <section className="section-shell sprint-section" id="stories" data-reveal>
        <div className="section-heading"><p className="eyebrow">Stories</p><h2>Stories from the mountains.</h2></div>
        <Soon>Trekking stories, route notes and local culture articles will be published here.</Soon>
      </section>

      <section className="section-shell sprint-section" id="credentials" data-reveal>
        <div className="section-heading"><p className="eyebrow">Credentials</p><h2>Qualifications and credentials.</h2></div>
        <Soon>Licences, training and certificates will be listed here once verified. Nothing is claimed until then.</Soon>
      </section>

      <section className="section-shell sprint-section" id="languages" data-reveal>
        <div className="section-heading"><p className="eyebrow">Languages</p><h2>Languages and communication.</h2></div>
        <Soon>Languages and levels to be added.</Soon>
      </section>

      <section className="section-shell sprint-section" id="recommendations" data-reveal>
        <div className="section-heading"><p className="eyebrow">Recommendations</p><h2>Traveller feedback.</h2></div>
        <Soon>Have we travelled together? Genuine feedback from travellers will appear here with their permission. You are welcome to send a recommendation through the contact form.</Soon>
      </section>

      <section className="section-shell sprint-section" id="cv" data-reveal>
        <div className="section-heading"><p className="eyebrow">CV</p><h2>Download my guide CV.</h2></div>
        <Link className="button primary" href="/trekking-guide/cv">Open CV, then save as PDF <FileText size={16} /></Link>
      </section>

      <section className="section-shell sprint-section" id="contact" data-reveal>
        <div className="section-heading"><p className="eyebrow">Work with me</p><h2>Contact me.</h2></div>
        <div className="tg-contact">
          <a href={wa("Hello Tsewang, I would like to ask about guiding.")}><MessageCircle size={18} /> WhatsApp</a>
          <a href={`mailto:${guide.email}`}><Mail size={18} /> {guide.email}</a>
          <a href={`tel:${guide.phone.replace(/\s/g, "")}`}><Phone size={18} /> {guide.phone}</a>
          <span><MapPin size={18} /> {guide.location}</span>
        </div>
        <ContactForm />
      </section>
    </main>
  );
}
