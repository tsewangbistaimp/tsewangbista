import { createHash, randomBytes } from "node:crypto";
import { cfg, hasDb } from "../q/config";
import { normalize, slugify, type GuideData, type Status } from "./types";

export type GuideRow = {
  id: string; email: string; slug: string | null; status: Status; verified: boolean; display_name: string | null; step: number;
  data: unknown; admin_note: string | null; submitted_at: string | null; approved_at: string | null; created_at: string; updated_at: string;
};
export type InquiryRow = { id: string; guide_id: string; package_id: string | null; kind: string; name: string; email: string; country: string | null; phone: string | null; travel_date: string | null; group_size: string | null; message: string; status: string; created_at: string };

async function db(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${cfg.supabaseUrl()}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: cfg.supabaseKey(),
      ...(cfg.supabaseKey().startsWith("eyJ") ? { Authorization: `Bearer ${cfg.supabaseKey()}` } : {}),
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init.headers ?? {})
    }
  });
}

export const hashToken = (t: string) => createHash("sha256").update(t).digest("hex");
export const newToken = () => randomBytes(24).toString("base64url");
export const validToken = (t: string) => /^[A-Za-z0-9_-]{20,80}$/.test(t);
const COLS = "id,email,slug,status,verified,display_name,step,data,admin_note,submitted_at,approved_at,created_at,updated_at";

export async function createProfile(token: string): Promise<GuideRow | null> {
  if (!hasDb()) return null;
  const r = await db("guide_profiles", { method: "POST", body: JSON.stringify({ email: "", token_hash: hashToken(token), data: normalize({}) }) });
  return r.ok ? (((await r.json()) as GuideRow[])[0] ?? null) : null;
}

export async function findByToken(token: string): Promise<GuideRow | null> {
  if (!hasDb() || !validToken(token)) return null;
  const r = await db(`guide_profiles?token_hash=eq.${hashToken(token)}&select=${COLS}&limit=1`);
  return r.ok ? (((await r.json()) as GuideRow[])[0] ?? null) : null;
}

export async function saveDraft(id: string, data: GuideData, step: number): Promise<boolean> {
  const r = await db(`guide_profiles?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({ data, step: Math.min(7, Math.max(0, step)), display_name: data.p.displayName || null, email: data.p.email.trim().toLowerCase().slice(0, 160), updated_at: new Date().toISOString() })
  });
  return r.ok;
}

export async function patch(id: string, fields: Record<string, unknown>): Promise<boolean> {
  const r = await db(`guide_profiles?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }) });
  return r.ok;
}

export async function getById(id: string): Promise<GuideRow | null> {
  if (!hasDb() || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await db(`guide_profiles?id=eq.${id}&select=${COLS}&limit=1`);
  return r.ok ? (((await r.json()) as GuideRow[])[0] ?? null) : null;
}

/** Public lookups only ever return approved profiles. */
export async function getApprovedBySlug(slug: string): Promise<GuideRow | null> {
  if (!hasDb() || !/^[a-z0-9-]{3,80}$/.test(slug)) return null;
  const r = await db(`guide_profiles?slug=eq.${slug}&status=eq.approved&select=${COLS}&limit=1`);
  return r.ok ? (((await r.json()) as GuideRow[])[0] ?? null) : null;
}

export async function listApproved(): Promise<GuideRow[]> {
  if (!hasDb()) return [];
  const r = await db(`guide_profiles?status=eq.approved&select=${COLS}&order=approved_at.desc&limit=200`);
  return r.ok ? ((await r.json()) as GuideRow[]) : [];
}

export async function listAll(): Promise<GuideRow[]> {
  if (!hasDb()) return [];
  const r = await db(`guide_profiles?select=${COLS}&order=updated_at.desc&limit=500`);
  return r.ok ? ((await r.json()) as GuideRow[]) : [];
}

export async function approve(id: string, displayName: string): Promise<string | null> {
  const row = await getById(id);
  if (!row) return null;
  if (row.slug) {
    await patch(id, { status: "approved", approved_at: new Date().toISOString() });
    return row.slug;
  }
  for (let i = 0; i < 5; i++) {
    const slug = `${slugify(displayName)}-${randomBytes(2).toString("hex")}`;
    const r = await db(`guide_profiles?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ slug, status: "approved", approved_at: new Date().toISOString(), updated_at: new Date().toISOString() }) });
    if (r.ok) return slug;
  }
  return null;
}

export async function saveInquiry(row: Omit<InquiryRow, "id" | "status" | "created_at">): Promise<boolean> {
  const r = await db("guide_inquiries", { method: "POST", body: JSON.stringify(row) });
  return r.ok;
}

export async function listInquiries(guideId?: string): Promise<InquiryRow[]> {
  if (!hasDb()) return [];
  const q = guideId ? `guide_id=eq.${guideId}&` : "";
  const r = await db(`guide_inquiries?${q}select=*&order=created_at.desc&limit=300`);
  return r.ok ? ((await r.json()) as InquiryRow[]) : [];
}
