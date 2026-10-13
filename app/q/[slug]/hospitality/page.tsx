import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { cfg, cookieValid, isOpen, safeEqual } from "@/lib/q/config";
import QuestionnaireApp from "../QuestionnaireApp";

export const dynamic = "force-dynamic";

// The separate Hospitality Operations, Real Estate, and Technology questionnaire.
// It uses the same private link as the main questionnaire (no invite token needed), so people who already
// finished the first questionnaire can open it from the card on the thank-you page.
export default async function HospitalityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isOpen() || !safeEqual(slug, cfg.slug())) notFound();

  let gate: "open" | "code" = "open";
  if (cfg.access() === "code") {
    const jar = await cookies();
    if (!cookieValid(jar.get("q_ok")?.value, "ok")) gate = "code";
  }
  return <QuestionnaireApp slug={slug} inviteToken="" gate={gate} variant="hospitality" />;
}
