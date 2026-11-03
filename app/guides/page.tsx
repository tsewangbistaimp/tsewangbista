import type { Metadata } from "next";
import Link from "next/link";
import ScrollEffects from "../components/ScrollEffects";
import BackToPortfolio from "../components/BackToPortfolio";
import { listApproved } from "../../lib/guide/store";
import { normalize } from "../../lib/guide/types";
import "./guides.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Trekking Guides in Nepal", description: "Browse verified trekking guide portfolios in Nepal." };

export default async function GuidesPage() {
  const rows = await listApproved();
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects /><BackToPortfolio />
      <section className="section-shell sprint-hero">
        <p className="eyebrow">Directory</p>
        <h1 className="sprint-headline">Trekking guides in Nepal.</h1>
        <p className="sprint-subhead">Only guides whose portfolios have been reviewed and approved appear here.</p>
      </section>
      <section className="section-shell">
        {rows.length ? (
          <div className="gd-packages">
            {rows.map((r) => {
              const d = normalize(r.data);
              return (
                <Link className="gd-card gd-pkg" href={`/guides/${r.slug}`} key={r.id}>
                  <h3>{d.p.displayName}</h3><p className="gd-meta">{d.p.location}</p><p>{d.p.headline}</p>
                  <p className="gd-meta">{d.regions.join(", ")}</p>
                </Link>
              );
            })}
          </div>
        ) : <p className="gd-meta">No guides are published yet.</p>}
        <p style={{ marginTop: 22 }}><Link className="button primary" href="/services/trekking-guide">Create your guide portfolio</Link></p>
      </section>
    </main>
  );
}
