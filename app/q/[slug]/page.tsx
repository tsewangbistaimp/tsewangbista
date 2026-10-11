import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { cfg, cookieValid, hasDb, isOpen, safeEqual } from "@/lib/q/config";
import { findInvite, inviteUsable } from "@/lib/q/store";
import QuestionnaireApp from "./QuestionnaireApp";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { slug } = await params;
  // Wrong slug, switched off or closed: show the site's normal 404 so nothing can be detected.
  if (!isOpen() || !safeEqual(slug, cfg.slug())) notFound();

  const { t } = await searchParams;
  let inviteToken = "";
  let gate: "open" | "code" = "open";

  if (cfg.access() === "token" && hasDb()) {
    const inv = await findInvite(t ?? "");
    if (!inviteUsable(inv)) notFound();
    inviteToken = t as string;
  } else if (cfg.access() === "code") {
    const jar = await cookies();
    if (!cookieValid(jar.get("q_ok")?.value, "ok")) gate = "code";
  }

  return <QuestionnaireApp slug={slug} inviteToken={inviteToken} gate={gate} />;
}
