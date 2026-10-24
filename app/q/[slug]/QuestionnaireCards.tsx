import { Compass, Globe2, Hotel } from "lucide-react";
import { SETS, VARIANTS, type Variant } from "@/lib/q/sets";

const ICONS = { hotel: Hotel, globe: Globe2, compass: Compass };

/**
 * The cards that open the separate optional questionnaires (hospitality, global tourist, tour guide).
 * `current` hides the questionnaire the person is already on; the main questionnaire shows all three.
 */
export default function QuestionnaireCards({ slug, current }: { slug: string; current: Variant }) {
  const forms = VARIANTS.filter((v) => v !== current && SETS[v].card);
  if (!forms.length) return null;
  return (
    <section className="qx-forms" aria-labelledby="qx-forms-h">
      <h2 id="qx-forms-h" className="qx-h2">Optional questionnaires</h2>
      <p className="qx-muted">Each one is separate, with its own 15 or fewer questions. Choose the one that fits you.</p>
      <div className={`qx-form-grid ${forms.length === 3 ? "qx-three" : ""}`}>
        {forms.map((v) => {
          const c = SETS[v].card!;
          const Icon = ICONS[c.icon];
          return (
            <article className="qx-form-card" key={v}>
              <span className="qx-form-icon" aria-hidden="true"><Icon size={22} /></span>
              <h3 className="qx-form-title">{c.title}</h3>
              <p className="qx-form-text">{c.text}</p>
              <dl className="qx-form-meta">
                <dt>Who it is for</dt><dd>{c.audience}</dd>
                <dt>Time</dt><dd>{c.minutes} &middot; {SETS[v].total} questions</dd>
              </dl>
              <a className="qx-btn qx-primary qx-form-btn" href={`/q/${slug}/${c.path}`}>Start Questionnaire</a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
