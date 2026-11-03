import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollEffects from "../../../components/ScrollEffects";
import BackToPortfolio from "../../../components/BackToPortfolio";
import { ProfileView } from "../../GuideView";
import { findByToken } from "../../../../lib/guide/store";
import { EDITABLE, STATUS_LABEL, normalize } from "../../../../lib/guide/types";
import GuideForm from "./GuideForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My guide portfolio", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function EditPage({ params }: { params: Promise<{ token: string }> }) {
  const row = await findByToken((await params).token);
  if (!row) notFound();
  const d = normalize(row.data);
  const editable = EDITABLE.includes(row.status);
  return (
    <main className="portfolio-shell sprint-page">
      <ScrollEffects /><BackToPortfolio />
      <section className="section-shell" style={{ paddingTop: 100 }}>
        <p className="eyebrow">Trekking Guide Portfolio · {STATUS_LABEL[row.status]}</p>
        {editable ? (
          <GuideForm token={(await params).token} initial={d} step={row.step} note={row.admin_note} />
        ) : (
          <>
            <h1 className="sprint-headline">{STATUS_LABEL[row.status]}</h1>
            <p className="sprint-subhead">
              {row.status === "approved" && row.slug ? <>Your portfolio is live: <Link href={`/guides/${row.slug}`}>/guides/{row.slug}</Link></> : row.status === "suspended" ? "This portfolio is currently suspended. Please contact us." : "Your portfolio is locked while it is being reviewed. We will email you when the status changes."}
            </p>
            <ProfileView d={d} slug={row.slug ?? undefined} verified={row.verified} preview />
          </>
        )}
      </section>
    </main>
  );
}
