// All settings come from environment variables (server only). Nothing here reaches the browser.
import { createHmac, timingSafeEqual } from "node:crypto";

const env = (k: string) => (process.env[k] ?? "").trim();

export const cfg = {
  slug: () => env("QUESTIONNAIRE_SLUG"),
  enabled: () => env("QUESTIONNAIRE_ENABLED").toLowerCase() === "true" && env("QUESTIONNAIRE_SLUG").length >= 16,
  closesAt: () => env("QUESTIONNAIRE_CLOSES_AT"),
  /** token = personal invite links (needs Supabase), code = shared access code, none = secret link only */
  access: () => (env("QUESTIONNAIRE_ACCESS") || "none").toLowerCase() as "token" | "code" | "none",
  accessCode: () => env("QUESTIONNAIRE_ACCESS_CODE"),
  secret: () => env("QUESTIONNAIRE_SESSION_SECRET"),
  adminPassword: () => env("QUESTIONNAIRE_ADMIN_PASSWORD"),
  recipient: () => env("RECIPIENT_EMAIL"),
  resendKey: () => env("RESEND_API_KEY"),
  mailFrom: () => env("MAIL_FROM") || "Questionnaire Website <onboarding@resend.dev>",
  supabaseUrl: () => env("SUPABASE_URL").replace(/\/$/, ""),
  supabaseKey: () => env("SUPABASE_SERVICE_ROLE_KEY"),
  anthropicKey: () => env("ANTHROPIC_API_KEY"),
  anthropicModel: () => env("ANTHROPIC_MODEL") || "claude-sonnet-5-5",
  siteUrl: () => env("NEXT_PUBLIC_SITE_URL")
};

export const hasDb = () => Boolean(cfg.supabaseUrl() && cfg.supabaseKey());

/** True when the questionnaire is switched on and not past its closing date. */
export function isOpen(): boolean {
  if (!cfg.enabled()) return false;
  const c = cfg.closesAt();
  if (c) {
    const t = Date.parse(c);
    if (!Number.isNaN(t) && Date.now() > t) return false;
  }
  return true;
}

export function safeEqual(a: string, b: string): boolean {
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Signed value "payload.signature" used for the access-code and admin cookies. */
export function sign(payload: string): string {
  const sig = createHmac("sha256", cfg.secret() || "unset").update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySigned(value: string | undefined): string | null {
  if (!value || !cfg.secret()) return null;
  const i = value.lastIndexOf(".");
  if (i < 1) return null;
  const payload = value.slice(0, i);
  return safeEqual(sign(payload), value) ? payload : null;
}

export function cookieValid(value: string | undefined, kind: string): boolean {
  const p = verifySigned(value);
  if (!p) return false;
  const [k, exp] = p.split(":");
  return k === kind && Number(exp) > Date.now();
}

export function newCookie(kind: string, hours: number): string {
  return sign(`${kind}:${Date.now() + hours * 3600_000}`);
}
