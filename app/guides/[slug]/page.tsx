import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScrollEffects from "../../components/ScrollEffects";
import BackToPortfolio from "../../components/BackToPortfolio";
import { ProfileView } from "../GuideView";
import InquiryForm from "../InquiryForm";
import { getApprovedBySlug } from "../../../lib/guide/store";
import { normalize, toPublic } from "../../../lib/guide/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const row = await getApprovedBySlug((await params).slug);
  if (!row) return { title: "Guide not found", robots: { index: false } };
  const d = normalize(row.data);
  return { title: `${d.p.displayName} | Trekking Guide`, description: d.p.headline.slice(0, 160) };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const row = await getApprovedBySlug(slug);
  if (!row) notFound();
  const d = toPublic(normalize(row.data));
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects /><BackToPortfolio />
      <section className="section-shell" style={{ paddingTop: 100 }}>
        <ProfileView d={d} slug={slug} verified={row.verified} />
        <div className="gd" id="contact"><h2>Contact and booking request</h2><InquiryForm slug={slug} /></div>
      </section>
    </main>
  );
}
