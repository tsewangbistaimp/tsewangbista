import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { cfg, cookieValid } from "../../lib/q/config";
import { listAll, listInquiries } from "../../lib/guide/store";
import { normalize, toPublic } from "../../lib/guide/types";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Guide admin", robots: { index: false, follow: false } };

export default async function GuideAdminPage() {
  const authed = Boolean(cfg.adminPassword()) && cookieValid((await cookies()).get("q_adm")?.value, "adm");
  if (!authed) return <AdminClient authed={false} />;
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const [rows, inquiries] = await Promise.all([listAll(), listInquiries()]);
  const guides = rows.map((r) => {
    const d = normalize(r.data);
    return {
      id: r.id, email: r.email, status: r.status, verified: r.verified, slug: r.slug, name: d.p.displayName || "(no name yet)", updated: r.updated_at, note: r.admin_note ?? "",
      packages: d.itineraries.length, regions: d.regions.join(", "), full: d, pub: toPublic(d).p.displayName,
      inquiries: inquiries.filter((i) => i.guide_id === r.id).length
    };
  });
  const inq = inquiries.slice(0, 100).map((i) => ({ id: i.id, guide: guides.find((g) => g.id === i.guide_id)?.name ?? "", kind: i.kind, name: i.name, email: i.email, country: i.country ?? "", message: i.message, at: i.created_at, pkg: i.package_id ?? "" }));
  return <AdminClient authed origin={origin} guides={guides.map(({ full, pub, ...g }) => { void pub; return { ...g, json: JSON.stringify(full, null, 2) }; })} inquiries={inq} />;
}
