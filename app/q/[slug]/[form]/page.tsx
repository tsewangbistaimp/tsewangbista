import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { cfg, cookieValid, isOpen, safeEqual } from "@/lib/q/config";
import { SETS, VARIANTS, type Variant } from "@/lib/q/sets";
import QuestionnaireApp from "../QuestionnaireApp";

export const dynamic = "force-dynamic";

// Separate follow-up questionnaires (global tourist, tour guide). They use the same private link as the main
// questionnaire and need no invite token. The hospitality questionnaire keeps its own page next to this one.
export default async function FollowUpPage({ params }: { params: Promise<{ slug: string; form: string }> }) {
  const { slug, form } = await params;
  if (!isOpen() || !safeEqual(slug, cfg.slug())) notFound();
  const variant = VARIANTS.find((v): v is Variant => v !== "main" && v !== "hospitality" && SETS[v].card?.path === form);
  if (!variant) notFound();

  let gate: "open" | "code" = "open";
  if (cfg.access() === "code") {
    const jar = await cookies();
    if (!cookieValid(jar.get("q_ok")?.value, "ok")) gate = "code";
  }
  return <QuestionnaireApp slug={slug} inviteToken="" gate={gate} variant={variant} />;
}
