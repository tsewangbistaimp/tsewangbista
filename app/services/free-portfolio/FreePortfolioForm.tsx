"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Plus, Send, Trash2, X } from "lucide-react";
import "./form.css";

type Exp = { role: string; org: string; period: string; details: string };
type Edu = { school: string; degree: string; period: string };
type Proj = { title: string; details: string; link: string; image: string };

const blankExp: Exp = { role: "", org: "", period: "", details: "" };
const blankEdu: Edu = { school: "", degree: "", period: "" };
const blankProj: Proj = { title: "", details: "", link: "", image: "" };

const initial = {
  name: "", email: "", phone: "", location: "", headline: "", bio: "", photo: "",
  purpose: "", style: "", colour: "", domain: "", inspiration: "",
  skills: [] as string[], achievements: "", services: "",
  linkedin: "", github: "", instagram: "", behance: "", website: "", resume: "", otherLinks: "",
  extra: "", consent: false, website_hp: ""
};

const steps = ["About you", "Look & feel", "Skills & story", "Projects", "Links", "Review"];
const purposes = ["Get a job", "Freelancing", "Student / academic", "Creative showcase", "Personal brand", "Small business"];
const styles = ["Minimal & clean", "Dark & modern", "Bold & colourful", "Elegant & classic", "Playful & creative"];

export default function FreePortfolioForm() {
  const [step, setStep] = useState(0);
  const [f, setF] = useState(initial);
  const [exp, setExp] = useState<Exp[]>([{ ...blankExp }]);
  const [edu, setEdu] = useState<Edu[]>([{ ...blankEdu }]);
  const [proj, setProj] = useState<Proj[]>([{ ...blankProj }]);
  const [skillDraft, setSkillDraft] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [doneId, setDoneId] = useState("");
  const key = useRef(`fp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);
  const top = useRef<HTMLDivElement>(null);

  const set = <K extends keyof typeof initial>(k: K, v: (typeof initial)[K]) => setF((p) => ({ ...p, [k]: v }));
  const text = (k: keyof typeof initial) => ({ value: f[k] as string, onChange: (e: { target: { value: string } }) => set(k, e.target.value as never) });

  function addSkill(raw: string) {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    set("skills", Array.from(new Set([...f.skills, ...parts])).slice(0, 40));
    setSkillDraft("");
  }
  function skillKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillDraft); }
    else if (e.key === "Backspace" && !skillDraft && f.skills.length) set("skills", f.skills.slice(0, -1));
  }

  function validate(s: number): string {
    if (s === 0) {
      if (f.name.trim().length < 2) return "Please enter your full name.";
      if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return "Please enter a valid email address.";
      if (f.headline.trim().length < 2) return "Please tell us your profession or headline.";
      if (f.bio.trim().length < 20) return "Please write a short bio (at least a couple of sentences).";
    }
    if (s === 1 && !f.purpose) return "Please choose what the portfolio is for.";
    if (s === 2 && !f.skills.length && !skillDraft.trim()) return "Add at least one skill.";
    if (s === 5 && !f.consent) return "Please confirm that we may use your details to build your portfolio.";
    return "";
  }

  function go(next: number) {
    if (next > step) {
      if (step === 2 && skillDraft.trim()) addSkill(skillDraft);
      const m = validate(step);
      if (m) { setError(m); return; }
    }
    setError("");
    setStep(next);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function submit() {
    for (let s = 0; s < 6; s++) {
      const m = validate(s);
      if (m) { setStep(s); setError(m); return; }
    }
    setSending(true);
    setError("");
    try {
      const r = await fetch("/api/free-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, experience: exp, education: edu, projects: proj, idempotencyKey: key.current })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDoneId(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (doneId) {
    return (
      <div className="fp-card fp-done" id="register">
        <CheckCircle2 size={56} />
        <h2>You&apos;re registered!</h2>
        <p>Thank you, {f.name.split(" ")[0]}. We&apos;ve received everything we need to start building your free portfolio. We&apos;ll email you at <strong>{f.email}</strong> with a preview.</p>
        <span className="fp-ref">Reference: {doneId}</span>
      </div>
    );
  }

  const field = (label: string, node: React.ReactNode, hint?: string, req?: boolean) => (
    <label className="fp-field">
      <span className="fp-label">{label}{req ? <b> *</b> : null}</span>
      {node}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
  const input = (k: keyof typeof initial, ph = "", type = "text") => <input type={type} placeholder={ph} {...text(k)} />;
  const chips = (list: string[], k: "purpose" | "style") => (
    <div className="fp-chips">
      {list.map((o) => (
        <button type="button" key={o} className={f[k] === o ? "on" : ""} onClick={() => set(k, f[k] === o ? "" : o)}>{o}</button>
      ))}
    </div>
  );
  const upd = <T,>(arr: T[], setArr: (v: T[]) => void, i: number, p: Partial<T>) => setArr(arr.map((x, j) => (j === i ? { ...x, ...p } : x)));

  return (
    <div className="fp-card" id="register" ref={top}>
      <div className="fp-progress" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((s, i) => (
          <button type="button" key={s} className={i === step ? "cur" : i < step ? "done" : ""} onClick={() => i < step && go(i)} aria-current={i === step}>
            <span>{i < step ? "✓" : i + 1}</span><em>{s}</em>
          </button>
        ))}
      </div>
      <div className="fp-bar"><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>

      <form onSubmit={(e) => { e.preventDefault(); step === 5 ? submit() : go(step + 1); }} noValidate>
        <input className="fp-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website_hp" value={f.website_hp} onChange={(e) => set("website_hp", e.target.value)} />

        {step === 0 && (
          <div className="fp-step">
            <h2>Tell us about you</h2>
            <p className="fp-lead">The basics that go at the top of your portfolio.</p>
            <div className="fp-grid">
              {field("Full name", input("name", "e.g. Pema Sherpa"), undefined, true)}
              {field("Email", input("email", "you@example.com", "email"), "We'll send your preview here.", true)}
              {field("Phone / WhatsApp", input("phone", "+977 98…", "tel"))}
              {field("Location", input("location", "City, Country"))}
            </div>
            {field("Profession or headline", input("headline", "e.g. Graphic designer · Nursing student · Photographer"), undefined, true)}
            {field("Short bio", <textarea rows={5} placeholder="Who are you, what do you do, and what do you care about?" {...text("bio")} />, "2–5 sentences is perfect.", true)}
            {field("Profile photo link", input("photo", "Google Drive, Dropbox or Instagram link", "url"), "Optional. Make sure the link is shareable.")}
          </div>
        )}

        {step === 1 && (
          <div className="fp-step">
            <h2>Look &amp; feel</h2>
            <p className="fp-lead">Help us design something that feels like you.</p>
            <div className="fp-field"><span className="fp-label">What is the portfolio for?<b> *</b></span>{chips(purposes, "purpose")}</div>
            <div className="fp-field"><span className="fp-label">Preferred style</span>{chips(styles, "style")}</div>
            <div className="fp-grid">
              {field("Favourite colour(s)", input("colour", "e.g. deep blue and gold"))}
              {field("Preferred web address", input("domain", "e.g. pemasherpa"), "Used to suggest your free address.")}
            </div>
            {field("Portfolios you admire", <textarea rows={3} placeholder="Paste links to sites you like (optional)" {...text("inspiration")} />)}
          </div>
        )}

        {step === 2 && (
          <div className="fp-step">
            <h2>Skills &amp; story</h2>
            <p className="fp-lead">Show what you&apos;re good at and where you&apos;ve been.</p>
            <div className="fp-field">
              <span className="fp-label">Skills<b> *</b></span>
              <div className="fp-tags" onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement | null)?.focus()}>
                {f.skills.map((s) => (
                  <span key={s}>{s}<button type="button" aria-label={`Remove ${s}`} onClick={() => set("skills", f.skills.filter((x) => x !== s))}><X size={12} /></button></span>
                ))}
                <input value={skillDraft} onChange={(e) => setSkillDraft(e.target.value)} onKeyDown={skillKey} onBlur={() => addSkill(skillDraft)} placeholder={f.skills.length ? "Add another…" : "Type a skill and press Enter"} />
              </div>
              <small>Press Enter or comma after each skill.</small>
            </div>

            <h3 className="fp-sub">Work experience <small>optional</small></h3>
            {exp.map((x, i) => (
              <div className="fp-repeat" key={i}>
                <div className="fp-grid">
                  <input placeholder="Role / title" value={x.role} onChange={(e) => upd(exp, setExp, i, { role: e.target.value })} />
                  <input placeholder="Company / organisation" value={x.org} onChange={(e) => upd(exp, setExp, i, { org: e.target.value })} />
                  <input placeholder="Period, e.g. 2023 – Present" value={x.period} onChange={(e) => upd(exp, setExp, i, { period: e.target.value })} />
                </div>
                <textarea rows={2} placeholder="What did you do or achieve?" value={x.details} onChange={(e) => upd(exp, setExp, i, { details: e.target.value })} />
                {exp.length > 1 && <button type="button" className="fp-del" onClick={() => setExp(exp.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 size={15} /></button>}
              </div>
            ))}
            {exp.length < 8 && <button type="button" className="fp-add" onClick={() => setExp([...exp, { ...blankExp }])}><Plus size={15} /> Add experience</button>}

            <h3 className="fp-sub">Education <small>optional</small></h3>
            {edu.map((x, i) => (
              <div className="fp-repeat" key={i}>
                <div className="fp-grid">
                  <input placeholder="School / university" value={x.school} onChange={(e) => upd(edu, setEdu, i, { school: e.target.value })} />
                  <input placeholder="Degree / course" value={x.degree} onChange={(e) => upd(edu, setEdu, i, { degree: e.target.value })} />
                  <input placeholder="Period" value={x.period} onChange={(e) => upd(edu, setEdu, i, { period: e.target.value })} />
                </div>
                {edu.length > 1 && <button type="button" className="fp-del" onClick={() => setEdu(edu.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 size={15} /></button>}
              </div>
            ))}
            {edu.length < 6 && <button type="button" className="fp-add" onClick={() => setEdu([...edu, { ...blankEdu }])}><Plus size={15} /> Add education</button>}

            {field("Achievements, awards or certificates", <textarea rows={3} placeholder="One per line (optional)" {...text("achievements")} />)}
          </div>
        )}

        {step === 3 && (
          <div className="fp-step">
            <h2>Your best work</h2>
            <p className="fp-lead">Add projects, case studies or things you&apos;re proud of.</p>
            {proj.map((x, i) => (
              <div className="fp-repeat" key={i}>
                <input placeholder="Project title" value={x.title} onChange={(e) => upd(proj, setProj, i, { title: e.target.value })} />
                <textarea rows={3} placeholder="What was it, and what was your part?" value={x.details} onChange={(e) => upd(proj, setProj, i, { details: e.target.value })} />
                <div className="fp-grid">
                  <input placeholder="Project link (optional)" value={x.link} onChange={(e) => upd(proj, setProj, i, { link: e.target.value })} />
                  <input placeholder="Image link (optional)" value={x.image} onChange={(e) => upd(proj, setProj, i, { image: e.target.value })} />
                </div>
                {proj.length > 1 && <button type="button" className="fp-del" onClick={() => setProj(proj.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 size={15} /></button>}
              </div>
            ))}
            {proj.length < 8 && <button type="button" className="fp-add" onClick={() => setProj([...proj, { ...blankProj }])}><Plus size={15} /> Add project</button>}
            {field("Services you offer", <textarea rows={3} placeholder="e.g. Logo design, wedding photography, tutoring… (optional)" {...text("services")} />)}
          </div>
        )}

        {step === 4 && (
          <div className="fp-step">
            <h2>Links &amp; socials</h2>
            <p className="fp-lead">Where should visitors find you? Leave blank what you don&apos;t use.</p>
            <div className="fp-grid">
              {field("LinkedIn", input("linkedin", "linkedin.com/in/…"))}
              {field("GitHub", input("github", "github.com/…"))}
              {field("Instagram", input("instagram", "instagram.com/…"))}
              {field("Behance / Dribbble", input("behance", "behance.net/…"))}
              {field("Existing website", input("website", "https://…"))}
              {field("CV / resume link", input("resume", "Drive or Dropbox link"))}
            </div>
            {field("Other links", <textarea rows={2} placeholder="YouTube, TikTok, Facebook, etc." {...text("otherLinks")} />)}
            {field("Anything else we should know?", <textarea rows={3} placeholder="Sections you want, things to avoid, deadlines…" {...text("extra")} />)}
          </div>
        )}

        {step === 5 && (
          <div className="fp-step">
            <h2>Review &amp; submit</h2>
            <p className="fp-lead">Check your details, then send your free portfolio request.</p>
            <dl className="fp-review">
              <div><dt>Name</dt><dd>{f.name}</dd></div>
              <div><dt>Email</dt><dd>{f.email}</dd></div>
              <div><dt>Headline</dt><dd>{f.headline}</dd></div>
              <div><dt>Purpose</dt><dd>{f.purpose || "-"}</dd></div>
              <div><dt>Style</dt><dd>{f.style || "-"}</dd></div>
              <div><dt>Skills</dt><dd>{f.skills.join(", ") || "-"}</dd></div>
              <div><dt>Projects</dt><dd>{proj.filter((p) => p.title).length}</dd></div>
            </dl>
            <label className="fp-consent">
              <input type="checkbox" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />
              <span>I agree that Tsewang Bista may use these details to build my portfolio and contact me about it.</span>
            </label>
          </div>
        )}

        {error && <p className="fp-error" role="alert">{error}</p>}

        <div className="fp-actions">
          {step > 0 ? <button type="button" className="fp-back" onClick={() => go(step - 1)}><ArrowLeft size={16} /> Back</button> : <span />}
          {step < 5 ? (
            <button type="submit" className="fp-next">Continue <ArrowRight size={16} /></button>
          ) : (
            <button type="submit" className="fp-next fp-submit" disabled={sending}>{sending ? "Sending…" : "Submit my portfolio"} <Send size={16} /></button>
          )}
        </div>
      </form>
    </div>
  );
}
