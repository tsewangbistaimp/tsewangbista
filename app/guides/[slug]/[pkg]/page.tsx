import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollEffects from "../../../components/ScrollEffects";
import BackToPortfolio from "../../../components/BackToPortfolio";
import { PackageView } from "../../GuideView";
import InquiryForm from "../../InquiryForm";
import { getApprovedBySlug } from "../../../../lib/guide/store";
import { normalize, toPublic } from "../../../../lib/guide/types";

export const dynamic = "force-dynamic";

async function load(slug: string, pkg: string) {
  const row = await getApprovedBySlug(slug);
  if (!row) return null;
  const d = toPublic(normalize(row.data));
  const id = pkg.split("-").pop();
  const it = d.itineraries.find((x) => x.id === id);
  return it ? { d, it } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; pkg: string }> }): Promise<Metadata> {
  const { slug, pkg } = await params;
  const r = await load(slug, pkg);
  return r ? { title: `${r.it.f.title} | ${r.d.p.displayName}`, description: r.it.f.short.slice(0, 160) } : { title: "Not found", robots: { index: false } };
}

export default async function PackagePage({ params }: { params: Promise<{ slug: string; pkg: string }> }) {
  const { slug, pkg } = await params;
  const r = await load(slug, pkg);
  if (!r) notFound();
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects /><BackToPortfolio />
      <section className="section-shell" style={{ paddingTop: 100 }}>
        <p><Link href={`/guides/${slug}`}>← {r.d.p.displayName}</Link></p>
        <PackageView it={r.it} />
        <div className="gd"><h2>Request this trek</h2><InquiryForm slug={slug} pkg={r.it.f.title} /></div>
      </section>
    </main>
  );
}
