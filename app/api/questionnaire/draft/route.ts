import { checkAccess } from "@/lib/q/access";
import { isOpen } from "@/lib/q/config";
import { buildDrafts } from "@/lib/q/draft";
import { json, limited, notFound, sameOrigin } from "@/lib/q/guard";
import { answerSchema, normaliseAnswers, profileSchema } from "@/lib/q/schema";
import { SHORT_IDS } from "@/lib/q/short";
import { z } from "zod";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  inviteToken: z.string().max(80).optional(),
  field: profileSchema.shape.field,
  answers: z.record(answerSchema).refine((r) => Object.keys(r).every((k) => SHORT_IDS.includes(k)))
});

export async function POST(req: Request) {
  if (!isOpen()) return notFound();
  if (!sameOrigin(req)) return json({ error: "Not allowed." }, 403);
  if (limited(req, "draft", 8, 60 * 60_000)) return json({ error: "Too many attempts. Please wait a little." }, 429);
  const raw = await req.text();
  if (raw.length > 100_000) return json({ error: "That is too much text." }, 413);
  const parsed = bodySchema.safeParse(JSON.parse(raw || "{}"));
  if (!parsed.success) return json({ error: "Please check your answers." }, 400);
  if (!(await checkAccess(parsed.data.inviteToken)).ok) return notFound();

  const drafts = await buildDrafts(parsed.data.field, normaliseAnswers(parsed.data.answers));
  return json({ ok: true, drafts });
}
