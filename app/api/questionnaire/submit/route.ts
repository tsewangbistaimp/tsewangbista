import { randomUUID } from "node:crypto";
import { checkAccess } from "@/lib/q/access";
import { advice } from "@/lib/q/advice";
import { cfg, isOpen } from "@/lib/q/config";
import { sendEmail, sendThanks } from "@/lib/q/email";
import { json, limited, notFound, sameOrigin } from "@/lib/q/guard";
import { countAnswered, normaliseAnswers, submissionSchema } from "@/lib/q/schema";
import { findByKey, markInviteUsed, saveSubmission, setEmailStatus } from "@/lib/q/store";

export const runtime = "nodejs";
export const maxDuration = 30;

// Used for duplicate protection when no database is configured (per server instance).
const seen = new Set<string>();

export async function POST(req: Request) {
  if (!isOpen()) return notFound();
  if (!sameOrigin(req)) return json({ error: "Not allowed." }, 403);
  if (limited(req, "submit", 12, 60 * 60_000)) return json({ error: "Too many attempts. Please wait a little and try again." }, 429);

  const raw = await req.text();
  if (raw.length > 600_000) return json({ error: "That is too much text to send at once." }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Something went wrong reading your answers." }, 400);
  }
  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return json({ error: first?.message ?? "Please check your answers and try again.", field: first?.path.join(".") }, 400);
  }
  const data = parsed.data;
  if (data.website) return json({ ok: true, id: randomUUID(), tips: [] }); // honeypot: pretend success

  // Access control
  // The hospitality, tourist and guide questionnaires are separate follow-up forms: people who already used a single-use invite
  // for the main one must still be able to open it, so it relies on the private link alone (and the access code, if used).
  const access = data.variant !== "main" && cfg.access() === "token" ? { ok: true, inviteId: null, singleUse: false } as Awaited<ReturnType<typeof checkAccess>> : await checkAccess(data.inviteToken);
  if (!access.ok) return notFound();
  const { inviteId, inviteLabel, singleUse } = access;

  const answers = normaliseAnswers(data.answers, data.variant);
  const tips = advice();

  // Idempotency: a double-click or retry returns the first result instead of sending twice.
  const existing = await findByKey(data.idempotencyKey);
  if (existing || seen.has(data.idempotencyKey)) return json({ ok: true, id: existing?.id ?? data.idempotencyKey, duplicate: true, tips });
  seen.add(data.idempotencyKey);

  const id = randomUUID();
  const submittedAt = new Date();
  const durationSec = data.startedAt ? Math.max(0, Math.round((submittedAt.getTime() - Date.parse(data.startedAt)) / 1000)) : undefined;

  const saved = await saveSubmission({
    id, idempotency_key: data.idempotencyKey, name: data.profile.name, field: data.profile.field, email: data.profile.email,
    invite_id: inviteId, payload: { profile: data.profile, answers, startedAt: data.startedAt, durationSec, variant: data.variant }
  });
  const mail = await sendEmail({ id, profile: data.profile, answers, submittedAt, durationSec, inviteLabel, variant: data.variant });
  const emailed = mail.ok;
  if (emailed) {
    const thanks = await sendThanks({ id, profile: data.profile, answers, submittedAt, durationSec, inviteLabel, variant: data.variant });
    if (!thanks.ok) console.error("[questionnaire] thank-you email not sent:", thanks.detail);
  }
  if (saved) await setEmailStatus(id, emailed ? "sent" : `failed - ${mail.detail}`);
  if (saved && singleUse && inviteId) await markInviteUsed(inviteId);

  if (!saved && !emailed) {
    seen.delete(data.idempotencyKey);
    console.error("[questionnaire] submission could not be saved or emailed");
    return json({ error: "We could not receive your answers right now. Your answers are still saved on this device - please try again in a moment." }, 502);
  }
  return json({ ok: true, id, answered: countAnswered(answers), tips });
}
