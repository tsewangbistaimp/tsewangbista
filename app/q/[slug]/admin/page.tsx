import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { cfg, cookieValid, hasDb, safeEqual } from "@/lib/q/config";
import { listInvites, listSubmissions } from "@/lib/q/store";
import { TOTAL_SHORT as TOTAL_QUESTIONS } from "@/lib/q/short";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ id?: string; q?: string }> }) {
  const { slug } = await params;
  if (!cfg.slug() || !cfg.adminPassword() || !safeEqual(slug, cfg.slug())) notFound();
  const authed = cookieValid((await cookies()).get("q_adm")?.value, "adm");
  if (!authed) return <AdminClient slug={slug} authed={false} />;

  const sp = await searchParams;
  const h = await headers();
  const origin = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("x-forwarded-host") ?? h.get("host")}`;
  const [subs, invites] = await Promise.all([listSubmissions(), listInvites()]);
  const needle = (sp.q ?? "").toLowerCase();
  const rows = subs
    .filter((s) => !needle || `${s.name} ${s.field}`.toLowerCase().includes(needle))
    .map((s) => ({ id: s.id, name: s.name, field: s.field, email: s.email, at: s.created_at, status: s.email_status, answered: Object.keys(s.payload.answers).length, answers: s.payload.answers }));
  const inviteRows = invites.map((i) => ({
    id: i.id, label: i.label, revoked: i.revoked, singleUse: i.single_use, used: Boolean(i.used_at),
    link: `${origin}/q/${slug}?t=${i.token}`
  }));
  return <AdminClient slug={slug} authed rows={rows} invites={inviteRows} total={TOTAL_QUESTIONS} openId={sp.id} query={sp.q ?? ""} db={hasDb()} mode={cfg.access()} />;
}
