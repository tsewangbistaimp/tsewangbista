"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ALL_QUESTIONS, STEPS, TOTAL_QUESTIONS } from "@/lib/q/questions";
import { CHOICE_MAP, SHORT_QUESTIONS, SHORT_QUICK_IDS, SHORT_STEPS, TOTAL_SHORT, type ShortQuestion } from "@/lib/q/short";
import { MAX_ANSWER_CHARS } from "@/lib/q/schema";

type Ans = { answer: string; choice?: string };
type Answers = Record<string, Ans>;
type Detail = { answer: string; source: "own" | "ai" | "edited" };
type Details = Record<string, Detail>;
type Profile = { name: string; field: string; email: string; date: string; consent: boolean };
type Draft = { v: 2; profile: Profile; answers: Answers; details: Details; orig: Record<string, string>; hash: string; startedAt: string; key: string; screen: string };
type Result = { tips: string[]; source: string; profile: Profile; answers: Answers; details: Details };

const today = () => new Date().toISOString().slice(0, 10);
const uuid = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16)));
const blankProfile = (): Profile => ({ name: "", field: "", email: "", date: today(), consent: false });
const hasContent = (a?: Ans) => Boolean(a && (a.answer.trim() || a.choice));
const hashOf = (a: Answers) => JSON.stringify(SHORT_QUESTIONS.map((q) => [a[q.id]?.answer ?? "", a[q.id]?.choice ?? ""]));

export default function QuestionnaireApp({ slug, inviteToken, gate }: { slug: string; inviteToken: string; gate: "open" | "code" }) {
  const storeKey = `qx2:${slug.slice(0, 10)}:${inviteToken.slice(0, 6)}`;
  const [unlocked, setUnlocked] = useState(gate === "open");
  const [screen, setScreen] = useState("welcome");
  const [profile, setProfile] = useState<Profile>(blankProfile);
  const [answers, setAnswers] = useState<Answers>({});
  const [details, setDetails] = useState<Details>({});
  const [orig, setOrig] = useState<Record<string, string>>({});
  const [hash, setHash] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [key, setKey] = useState("");
  const [hasDraft, setHasDraft] = useState(false);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved">("idle");
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [toast, setToast] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const lock = useRef(false);
  const topRef = useRef<HTMLElement>(null);

  // Restore a saved draft (if any) once on first load. localStorage only exists in the browser,
  // so this has to run in an effect after hydration.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) {
        const d = JSON.parse(raw) as Draft;
        if (d.v === 2) {
          setProfile({ ...blankProfile(), ...d.profile });
          setAnswers(d.answers ?? {});
          setDetails(d.details ?? {});
          setOrig(d.orig ?? {});
          setHash(d.hash ?? "");
          setStartedAt(d.startedAt);
          setKey(d.key);
          setHasDraft(Boolean(Object.keys(d.answers ?? {}).length || d.profile?.name));
          setReady(true);
          return;
        }
      }
    } catch {
      /* storage unavailable: continue without drafts */
    }
    setKey(uuid());
    setStartedAt(new Date().toISOString());
    setReady(true);
  }, [storeKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const persist = useCallback(() => {
    try {
      const d: Draft = { v: 2, profile, answers, details, orig, hash, startedAt, key, screen: screen === "drafting" ? "confirm" : screen };
      localStorage.setItem(storeKey, JSON.stringify(d));
      setSaved("saved");
      setDirty(false);
    } catch {
      setSaved("idle");
    }
  }, [profile, answers, details, orig, hash, startedAt, key, screen, storeKey]);

  // Autosave a moment after the last change (the flags mirror that external save state).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!ready || screen === "done") return;
    setDirty(true);
    setSaved("saving");
    const t = setTimeout(persist, 1200);
    return () => clearTimeout(t);
  }, [ready, profile, answers, details, screen, persist]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty && screen !== "done") { persist(); e.preventDefault(); }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty, persist, screen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    topRef.current?.focus({ preventScroll: true });
  }, [screen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const answeredCount = useMemo(() => SHORT_QUESTIONS.filter((q) => hasContent(answers[q.id])).length, [answers]);
  const aiLeft = useMemo(() => Object.values(details).filter((d) => d.source !== "own" && d.answer.trim()).length, [details]);
  const setAns = (id: string, patch: Partial<Ans>) => setAnswers((a) => ({ ...a, [id]: { ...(a[id] ?? { answer: "" }), ...patch } }));

  function validateProfile(): boolean {
    const e: Record<string, string> = {};
    if (profile.name.trim().length < 2) e.name = "Please enter your full name.";
    if (profile.field.trim().length < 2) e.field = "Please tell me your field of study or work.";
    if (profile.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) e.email = "That email does not look right. You can also leave it empty.";
    if (!profile.date) e.date = "Please choose a date.";
    if (!profile.consent) e.consent = "Please tick the box to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Ask the server to draft the 57 detailed answers from the short ones (skipped if nothing changed).
  async function buildDraft() {
    if (!validateProfile()) { setScreen("about"); return; }
    const h = hashOf(answers);
    if (h === hash && Object.keys(details).length) { setScreen("confirm"); return; }
    setScreen("drafting");
    setDraftNote("");
    let drafts: Record<string, string> | null = null;
    try {
      const r = await fetch("/api/questionnaire/draft", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteToken: inviteToken || undefined, field: profile.field.trim(), answers: Object.fromEntries(Object.entries(answers).filter(([, v]) => hasContent(v))) })
      });
      if (r.ok) drafts = ((await r.json()) as { drafts: Record<string, string> | null }).drafts;
    } catch {
      /* fall through: the respondent can still submit the short answers */
    }
    const next: Details = {};
    const o: Record<string, string> = {};
    if (drafts) for (const [id, text] of Object.entries(drafts)) { next[id] = { answer: text, source: "ai" }; o[id] = text; }
    setDetails(next);
    setOrig(o);
    setHash(h);
    setConfirmed(false);
    if (!drafts) setDraftNote("The detailed draft could not be prepared right now. That is fine: you can submit your short answers as they are, or write extra detail yourself below.");
    setScreen("confirm");
  }

  function editDetail(id: string, text: string) {
    setDetails((d) => {
      const o = orig[id];
      const source: Detail["source"] = o === undefined ? "own" : text === o ? "ai" : "edited";
      const copy = { ...d };
      if (!text.trim() && o === undefined) delete copy[id]; else copy[id] = { answer: text, source };
      return copy;
    });
    setConfirmed(false);
  }

  async function submit() {
    if (lock.current) return;
    if (!validateProfile()) { setScreen("about"); return; }
    if (aiLeft > 0 && !confirmed) { setSubmitError("Please tick the confirmation box above the Submit button."); return; }
    lock.current = true;
    setBusy(true);
    setSubmitError("");
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setSubmitError("You seem to be offline. Your answers are safe on this device. Reconnect and press Submit again.");
      setBusy(false); lock.current = false; persist();
      return;
    }
    try {
      const all: Record<string, Ans & { source: string }> = {};
      for (const q of SHORT_QUESTIONS) if (hasContent(answers[q.id])) all[q.id] = { ...answers[q.id], source: "own" };
      for (const q of ALL_QUESTIONS) {
        const d = details[q.id];
        const mapped = CHOICE_MAP[q.id] ? answers[CHOICE_MAP[q.id]]?.choice : undefined;
        if ((d && d.answer.trim()) || mapped) all[q.id] = { answer: d?.answer.trim() ?? "", ...(mapped ? { choice: mapped } : {}), source: d && d.answer.trim() ? d.source : "own" };
      }
      const payload = {
        idempotencyKey: key, startedAt, inviteToken: inviteToken || undefined, website: "", draftConfirmed: aiLeft > 0 ? confirmed : undefined,
        profile: { ...profile, name: profile.name.trim(), field: profile.field.trim(), email: profile.email.trim() },
        answers: all
      };
      const r = await fetch("/api/questionnaire/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string; tips?: string[]; source?: string };
      if (!r.ok || !data.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      try { localStorage.removeItem(storeKey); } catch { /* ignore */ }
      setResult({ tips: data.tips ?? [], source: data.source ?? "default", profile, answers, details });
      setScreen("done");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      persist();
    } finally {
      setBusy(false);
      lock.current = false;
    }
  }

  if (!ready) return <main className="qx-shell" aria-busy="true" />;
  if (!unlocked) return <CodeGate slug={slug} onDone={() => setUnlocked(true)} />;

  const stepIndex = /^s\d$/.test(screen) ? Number(screen.slice(1)) : -1;
  const inFlow = stepIndex >= 0 || screen === "confirm" || screen === "about" || screen === "drafting";
  const pct = Math.round((answeredCount / TOTAL_SHORT) * 100);
  const lastStep = SHORT_STEPS.length - 1;

  return (
    <>
      <header className="qx-top">
        <div className="qx-top-in">
          <span className="qx-logo" aria-label="TsewangBistaX">TsewangBista<span>X</span></span>
          {inFlow && <span className={`qx-saved qx-${saved}`} role="status" aria-live="polite">{saved === "saving" ? "Saving..." : saved === "saved" ? "Saved on this device" : ""}</span>}
        </div>
        {inFlow && (
          <div className="qx-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Questions answered">
            <div className="qx-progress-bar" style={{ width: `${Math.max(pct, 3)}%` }} />
            <div className="qx-progress-text">
              {screen === "confirm" || screen === "drafting" ? "Last step: check your detailed answers" : screen === "about" ? "About you" : `Step ${stepIndex + 1} of ${SHORT_STEPS.length}`} &middot; {answeredCount} of {TOTAL_SHORT} answered
            </div>
          </div>
        )}
      </header>

      <main className="qx-shell" ref={topRef} tabIndex={-1}>
        {/* Honeypot: hidden from people, tempting to bots. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="qx-hp" />

        {screen === "welcome" && <Welcome hasDraft={hasDraft} onStart={() => setScreen("about")} onContinue={() => { try { const d = JSON.parse(localStorage.getItem(storeKey) ?? "{}") as Draft; setScreen(d.screen && d.screen !== "welcome" && d.screen !== "done" ? d.screen : "about"); } catch { setScreen("about"); } }} />}

        {screen === "about" && (
          <section aria-labelledby="about-h">
            <h1 id="about-h" className="qx-h1">About you</h1>
            <p className="qx-lead">Before the questions, please tell me a little about yourself.</p>
            <div className="qx-card">
              <Field label="Full name" required error={errors.name}>
                <input className="qx-input" value={profile.name} maxLength={120} autoComplete="name" onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </Field>
              <Field label="Your field of study or work" required error={errors.field} hint="Write it in your own words, for example dentistry, accounting, teaching, farming, engineering.">
                <input className="qx-input" value={profile.field} maxLength={160} onChange={(e) => setProfile({ ...profile, field: e.target.value })} />
              </Field>
              <Field label="Email" error={errors.email} hint="Optional. Only used so I can contact you if you say yes at the end.">
                <input className="qx-input" type="email" inputMode="email" value={profile.email} maxLength={200} autoComplete="email" onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </Field>
              <Field label="Date" required error={errors.date}>
                <input className="qx-input" type="date" value={profile.date} onChange={(e) => setProfile({ ...profile, date: e.target.value })} />
              </Field>
              <label className={`qx-consent ${errors.consent ? "qx-has-error" : ""}`}>
                <input type="checkbox" checked={profile.consent} onChange={(e) => setProfile({ ...profile, consent: e.target.checked })} />
                <span>I agree that my answers can be used for this research project. I understand I can skip questions and ask for my answers to be removed.</span>
              </label>
              {errors.consent && <p className="qx-error" role="alert">{errors.consent}</p>}
            </div>
            <div className="qx-note">
              <b>Privacy.</b> I collect your name, field, optional email and your answers, only to learn about real problems in different fields. Only I (Tsewang Bista) can see them, and I will keep them for this research project. At the end, an AI service reads your short answers to draft the longer answers and tips for you; you check and change everything before it is sent, and the text is not used for anything else. To remove your answers, just email me. Please do not write real names or private details of patients, clients, customers or colleagues, and no confidential company information.
            </div>
            <Nav onBack={() => setScreen("welcome")} onNext={() => { if (validateProfile()) setScreen("s0"); }} nextLabel="Start the questions" />
          </section>
        )}

        {stepIndex >= 0 && (() => {
          const s = SHORT_STEPS[stepIndex];
          return (
            <section aria-labelledby="step-h">
              <p className="qx-part" style={{ color: s.color }}>{s.part} of 5</p>
              <h1 id="step-h" className="qx-h1">{s.title}</h1>
              <p className="qx-lead">{s.intro}</p>
              {s.questions.map((q) => (
                <QuestionBlock key={q.id} q={q} value={answers[q.id]} color={s.color} onChange={(patch) => setAns(q.id, patch)} onBlur={persist} />
              ))}
              <div className="qx-later">
                <button className="qx-link" onClick={() => { persist(); setToast("Saved on this device. Open the same link on this device later to continue."); }}>Save and finish later</button>
              </div>
              <Nav onBack={() => setScreen(stepIndex === 0 ? "about" : `s${stepIndex - 1}`)} onNext={() => (stepIndex === lastStep ? buildDraft() : setScreen(`s${stepIndex + 1}`))}
                nextLabel={stepIndex === lastStep ? "Finish: build my full answers" : `Next: ${SHORT_STEPS[stepIndex + 1].title}`} />
            </section>
          );
        })()}

        {screen === "drafting" && (
          <section aria-live="polite" className="qx-center">
            <div className="qx-spin" aria-hidden="true" />
            <h1 className="qx-h1">Preparing your detailed answers...</h1>
            <p className="qx-lead">I am turning your short answers into fuller written answers. This takes about 20-30 seconds. You will check them before anything is sent.</p>
          </section>
        )}

        {screen === "confirm" && (
          <section aria-labelledby="rev-h">
            <h1 id="rev-h" className="qx-h1">Check your detailed answers</h1>
            {Object.keys(orig).length > 0 && (
              <div className="qx-ai-note">
                <b>These longer answers were drafted by AI from your short answers.</b> Please read them. Fix anything that is not true for you, and delete anything that does not apply. Only what you leave here will be sent.
              </div>
            )}
            {draftNote && <div className="qx-note">{draftNote}</div>}
            {STEPS.map((s, i) => {
              const qs = s.groups.flatMap((g) => g.questions);
              const filled = qs.filter((q) => details[q.id]?.answer.trim()).length;
              return (
                <details className="qx-acc" key={s.key} open={i === 0}>
                  <summary style={{ color: s.color }}>{s.part}: {s.title} <span className="qx-muted">({filled} of {qs.length} filled)</span></summary>
                  {qs.map((q) => {
                    const mapped = CHOICE_MAP[q.id] ? answers[CHOICE_MAP[q.id]]?.choice : undefined;
                    const d = details[q.id];
                    return (
                      <div className="qx-rev" key={q.id}>
                        <label className="qx-rev-q" htmlFor={`d-${q.id}`}><span className="qx-badge" style={{ background: s.color }}>{q.id}</span> {q.text}</label>
                        {mapped && <div className="qx-chip">You chose: {mapped}</div>}
                        <textarea id={`d-${q.id}`} className="qx-textarea qx-detail" value={d?.answer ?? ""} maxLength={MAX_ANSWER_CHARS} placeholder="Nothing drafted. Add detail if you like, or leave empty."
                          onChange={(e) => editDetail(q.id, e.target.value)} onBlur={persist} rows={3} />
                        {d?.source === "ai" && <div className="qx-tag qx-tag-ai">AI draft</div>}
                        {d?.source === "edited" && <div className="qx-tag qx-tag-ok">Edited by you</div>}
                      </div>
                    );
                  })}
                </details>
              );
            })}
            {aiLeft > 0 && (
              <label className="qx-consent qx-confirm">
                <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
                <span>I have read these answers. They reflect what I really think, and I have changed or deleted anything that is not true for me.</span>
              </label>
            )}
            {submitError && <div className="qx-error-box" role="alert">{submitError}</div>}
            <div className="qx-nav">
              <button className="qx-btn" onClick={() => setScreen(`s${lastStep}`)} disabled={busy}>Back to questions</button>
              <button className="qx-btn qx-primary qx-big" onClick={submit} disabled={busy || (aiLeft > 0 && !confirmed)}>{busy ? "Sending..." : submitError ? "Try again" : "Submit"}</button>
            </div>
          </section>
        )}

        {screen === "done" && result && <Done r={result} />}
      </main>

      {toast && <div className="qx-toast" role="status">{toast}</div>}
    </>
  );
}

function Welcome({ hasDraft, onStart, onContinue }: { hasDraft: boolean; onStart: () => void; onContinue: () => void }) {
  return (
    <section aria-labelledby="w-h">
      <h1 id="w-h" className="qx-h1 qx-hero">Knowledge, Problems and Solutions Questionnaire</h1>
      <p className="qx-sub">Prepared by Tsewang Bista | 15 quick questions | About 5-10 minutes | No special knowledge needed</p>
      <div className="qx-card">
        <h2 className="qx-h2">Why you are here</h2>
        <p>My name is Tsewang Bista. I am a Computing student. I am asking 10 people from different fields about what they have studied and learned, why it is important, what problems they see, what solutions could help, and how their field can improve for the next generation. Later I will think about how technology might help. Your knowledge is valuable even if you have never thought about technology.</p>
        <p className="qx-muted">You can save and finish later. Your answers stay on this device until you submit.</p>
      </div>
      <div className="qx-card">
        <h2 className="qx-h2">What you will answer</h2>
        <ol className="qx-parts">
          <li><b>Part 1</b> Knowledge and Study</li><li><b>Part 2</b> Importance</li><li><b>Part 3</b> Problems</li><li><b>Part 4</b> Solutions</li><li><b>Part 5</b> Next Generation</li>
        </ol>
      </div>
      <div className="qx-card">
        <h2 className="qx-h2">3 easy steps</h2>
        <ol className="qx-steps">
          <li><span>1</span>Write your name, your field and today&rsquo;s date.</li>
          <li><span>2</span>Answer 15 quick questions. Tap an option or write a few sentences. Read the grey helper text if you are not sure.</li>
          <li><span>3</span>Check the detailed answers I prepare from yours, change anything that is not right, and press Submit. They reach me automatically.</li>
        </ol>
      </div>
      <div className="qx-card">
        <h2 className="qx-h2">Rules</h2>
        <ul className="qx-rules">
          <li>There are no right or wrong answers. An honest answer is better than a perfect answer.</li>
          <li>You can write one sentence or a full paragraph. A little detail helps me a lot.</li>
          <li>If you do not know an answer or do not want to answer, skip it.</li>
          <li>A real situation is more useful than a general opinion. Say what happened, who was affected, and how it was handled.</li>
          <li>Do not write real names or private details of patients, clients, customers or colleagues. Write &ldquo;a customer&rdquo; instead of a real name. Do not share secret company information.</li>
          <li>At the end, an AI drafts longer answers from your short ones. They are only suggestions: you must read them and fix anything that is not true for you.</li>
          <li>The examples come from other fields. They only show the style of an answer. Write from your own field and experience.</li>
        </ul>
      </div>
      <div className="qx-card">
        <h2 className="qx-h2">A simple example</h2>
        <p className="qx-ex-q"><b>Question:</b> Which problems waste people&rsquo;s time or cost them money?</p>
        <div className="qx-ex qx-weak"><b>Not very helpful</b><p>&ldquo;Transport is bad.&rdquo;</p></div>
        <div className="qx-ex qx-good"><b>Helpful answer</b><p>&ldquo;In my town there is no fixed time for buses. Office workers wait 20-30 minutes every morning and arrive late. Some pay for a taxi because they cannot wait. They do not know when to leave home.&rdquo;</p></div>
        <p className="qx-muted">This example is from the transport field. Your answers should come from your own field.</p>
      </div>
      <div className="qx-nav qx-stack">
        {hasDraft && <button className="qx-btn qx-big" onClick={onContinue}>Continue where I left off</button>}
        <button className="qx-btn qx-primary qx-big" onClick={onStart}>{hasDraft ? "Start from About you" : "Start"}</button>
      </div>
    </section>
  );
}

function QuestionBlock({ q, value, color, onChange, onBlur }: { q: ShortQuestion; value?: Ans; color: string; onChange: (p: Partial<Ans>) => void; onBlur: () => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const text = value?.answer ?? "";
  useEffect(() => {
    const el = ref.current;
    if (el) { el.style.height = "auto"; el.style.height = `${Math.max(el.scrollHeight, 110)}px`; }
  }, [text]);
  const picked = (value?.choice ?? "").split("; ").filter(Boolean);
  const toggle = (c: string) => {
    if (q.kind === "multi") onChange({ choice: (picked.includes(c) ? picked.filter((x) => x !== c) : [...picked, c]).join("; ") || undefined });
    else onChange({ choice: picked[0] === c ? undefined : c });
    onBlur();
  };
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div className="qx-q" id={`q-${q.id}`}>
      <div className="qx-q-head"><span className="qx-badge" style={{ background: color }}>{q.id.replace("Q", "")}</span><h3 className="qx-q-text" id={`lbl-${q.id}`}>{q.text}</h3></div>
      <p className="qx-helper">{q.helper}</p>
      {q.choices && (
        <div className="qx-choices" role={q.kind === "multi" ? "group" : "radiogroup"} aria-labelledby={`lbl-${q.id}`}>
          {q.choices.map((c) => {
            const on = picked.includes(c);
            return (
              <button key={c} type="button" role={q.kind === "multi" ? "checkbox" : "radio"} aria-checked={on} className={`qx-choice ${on ? "qx-on" : ""}`} style={on ? { borderColor: color } : undefined} onClick={() => toggle(c)}>
                <span className={`qx-radio ${q.kind === "multi" ? "qx-square" : ""}`} style={on ? { borderColor: color } : undefined}>{on && <i style={{ background: color }} />}</span>{c}
              </button>
            );
          })}
        </div>
      )}
      {q.kind === "text" && (
        <>
          <textarea ref={ref} className="qx-textarea" value={text} maxLength={MAX_ANSWER_CHARS} aria-labelledby={`lbl-${q.id}`} placeholder="Type your answer here (or skip)" onChange={(e) => onChange({ answer: e.target.value })} onBlur={onBlur} />
          <div className="qx-count">{words} {words === 1 ? "word" : "words"}{!text ? " · Optional, you can skip" : words < 8 ? " · A few more details would help me" : ""}</div>
        </>
      )}
    </div>
  );
}

function Field({ label, required, error, hint, children }: { label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className={`qx-field ${error ? "qx-has-error" : ""}`}>
      <label className="qx-label">{label}{required ? <span aria-hidden="true"> *</span> : <span className="qx-muted"> (optional)</span>}{children}</label>
      {hint && <p className="qx-helper">{hint}</p>}
      {error && <p className="qx-error" role="alert">{error}</p>}
    </div>
  );
}

function Nav({ onBack, onNext, nextLabel }: { onBack: () => void; onNext: () => void; nextLabel: string }) {
  return (
    <div className="qx-nav">
      <button className="qx-btn" type="button" onClick={onBack}>Back</button>
      <button className="qx-btn qx-primary qx-big" type="button" onClick={onNext}>{nextLabel}</button>
    </div>
  );
}

function CodeGate({ slug, onDone }: { slug: string; onDone: () => void }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  return (
    <main className="qx-shell qx-narrow">
      <h1 className="qx-h1">Enter your access code</h1>
      <form className="qx-card" onSubmit={async (e) => {
        e.preventDefault();
        const r = await fetch("/api/questionnaire/code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, code }) });
        if (r.ok) onDone(); else setErr(((await r.json().catch(() => ({}))) as { error?: string }).error ?? "That code is not correct.");
      }}>
        <label className="qx-label" htmlFor="code">Access code I sent you</label>
        <input id="code" className="qx-input" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="one-time-code" />
        {err && <p className="qx-error" role="alert">{err}</p>}
        <button className="qx-btn qx-primary qx-big" type="submit">Continue</button>
      </form>
    </main>
  );
}

function Done({ r }: { r: Result }) {
  const excerpt = (s: string) => (s.length > 280 ? `${s.slice(0, 280).trim()}...` : s);
  const answered = SHORT_QUESTIONS.filter((q) => hasContent(r.answers[q.id])).length;
  const detailedCount = ALL_QUESTIONS.filter((q) => r.details[q.id]?.answer.trim()).length;
  const download = (name: string, mime: string, body: string) => {
    const url = URL.createObjectURL(new Blob([body], { type: mime }));
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };
  const rows = () => [
    ...SHORT_QUESTIONS.map((q) => ({ id: q.id, question: q.text, choice: r.answers[q.id]?.choice ?? "", answer: r.answers[q.id]?.answer ?? "" })),
    ...ALL_QUESTIONS.map((q) => ({ id: q.id, question: q.text, choice: (CHOICE_MAP[q.id] && r.answers[CHOICE_MAP[q.id]]?.choice) || "", answer: r.details[q.id]?.answer ?? "" }))
  ];
  const json = () => download("my-answers.json", "application/json", JSON.stringify({ profile: { name: r.profile.name, field: r.profile.field, date: r.profile.date }, answers: rows() }, null, 2));
  const csv = () => {
    const c = (v: string) => `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
    download("my-answers.csv", "text/csv", "﻿" + [["ID", "Question", "Quick Choice", "Answer"].map(c).join(","), ...rows().map((x) => [x.id, x.question, x.choice, x.answer].map(c).join(","))].join("\r\n"));
  };
  return (
    <section aria-labelledby="d-h">
      <div className="qx-check-circle" aria-hidden="true">&#10003;</div>
      <h1 id="d-h" className="qx-h1 qx-center">Thank you, {r.profile.name.split(" ")[0]}!</h1>
      <p className="qx-lead qx-center">Your answers have reached me. I truly appreciate the time and thought you gave.</p>

      <div className="qx-card">
        <h2 className="qx-h2">Your summary</h2>
        <dl className="qx-dl"><dt>Name</dt><dd>{r.profile.name}</dd><dt>Field</dt><dd>{r.profile.field}</dd><dt>Quick questions answered</dt><dd>{answered} of {TOTAL_SHORT}</dd><dt>Detailed answers sent</dt><dd>{detailedCount} of {TOTAL_QUESTIONS}</dd></dl>
        {SHORT_STEPS.map((s) => {
          const n = s.questions.filter((q) => hasContent(r.answers[q.id])).length;
          return (
            <div className="qx-sum-row" key={s.key}>
              <span>{s.part}: {s.title}</span><span>{n}/{s.questions.length}</span>
              <div className="qx-meter"><div style={{ width: `${(n / s.questions.length) * 100}%`, background: s.color }} /></div>
            </div>
          );
        })}
      </div>

      <div className="qx-card">
        <h2 className="qx-h2">What you wrote (key answers)</h2>
        {SHORT_QUICK_IDS.map((id) => {
          const q = SHORT_QUESTIONS.find((x) => x.id === id)!;
          const a = r.answers[id];
          return <div className="qx-rev" key={id}><div className="qx-rev-q">{q.text}</div>{hasContent(a) ? <p className="qx-rev-a">{excerpt(a.answer || a.choice || "")}</p> : <p className="qx-muted">Skipped</p>}</div>;
        })}
      </div>

      {r.tips.length > 0 && (
        <div className="qx-card qx-advice">
          <h2 className="qx-h2">Some advice for your field</h2>
          <p className="qx-muted">{r.source === "ai" ? `Written for you based on your answers in ${r.profile.field}.` : "A few practical ideas to take further."}</p>
          <ul>{r.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
      )}

      <div className="qx-nav qx-stack">
        <button className="qx-btn" onClick={json}>Download my answers (JSON)</button>
        <button className="qx-btn" onClick={csv}>Download my answers (CSV)</button>
      </div>
      <p className="qx-muted qx-center">You can close this page now.</p>
    </section>
  );
}
