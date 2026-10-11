// Backup storage on Supabase (Postgres) through its REST API. No extra dependency needed.
import { cfg, hasDb } from "./config";
import type { Answers, Profile } from "./schema";

export type InviteRow = { id: string; token: string; label: string; revoked: boolean; single_use: boolean; used_at: string | null; created_at: string };
export type SubmissionRow = {
  id: string; created_at: string; name: string; field: string; email: string; invite_id: string | null;
  email_status: string; payload: { profile: Profile; answers: Answers; startedAt?: string; durationSec?: number };
};

async function db(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${cfg.supabaseUrl()}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: cfg.supabaseKey(),
      Authorization: `Bearer ${cfg.supabaseKey()}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    }
  });
}

export async function findInvite(token: string): Promise<InviteRow | null> {
  if (!hasDb() || !/^[A-Za-z0-9_-]{8,80}$/.test(token)) return null;
  const r = await db(`q_invites?token=eq.${encodeURIComponent(token)}&select=*&limit=1`);
  if (!r.ok) return null;
  const rows = (await r.json()) as InviteRow[];
  return rows[0] ?? null;
}

export function inviteUsable(i: InviteRow | null): i is InviteRow {
  return Boolean(i && !i.revoked && !(i.single_use && i.used_at));
}

export async function findByKey(key: string): Promise<SubmissionRow | null> {
  if (!hasDb()) return null;
  const r = await db(`q_submissions?idempotency_key=eq.${encodeURIComponent(key)}&select=*&limit=1`);
  if (!r.ok) return null;
  return ((await r.json()) as SubmissionRow[])[0] ?? null;
}

export async function saveSubmission(row: {
  id: string; idempotency_key: string; name: string; field: string; email: string; invite_id: string | null;
  payload: SubmissionRow["payload"];
}): Promise<boolean> {
  if (!hasDb()) return false;
  const r = await db("q_submissions", { method: "POST", body: JSON.stringify({ ...row, email_status: "pending" }) });
  return r.ok;
}

export async function setEmailStatus(id: string, status: string): Promise<void> {
  if (!hasDb()) return;
  await db(`q_submissions?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ email_status: status }) });
}

export async function markInviteUsed(id: string): Promise<void> {
  if (!hasDb()) return;
  await db(`q_invites?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ used_at: new Date().toISOString() }) });
}

export async function listSubmissions(): Promise<SubmissionRow[]> {
  if (!hasDb()) return [];
  const r = await db("q_submissions?select=*&order=created_at.desc&limit=500");
  return r.ok ? ((await r.json()) as SubmissionRow[]) : [];
}

export async function getSubmission(id: string): Promise<SubmissionRow | null> {
  if (!hasDb() || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const r = await db(`q_submissions?id=eq.${id}&select=*&limit=1`);
  return r.ok ? (((await r.json()) as SubmissionRow[])[0] ?? null) : null;
}

export async function listInvites(): Promise<InviteRow[]> {
  if (!hasDb()) return [];
  const r = await db("q_invites?select=*&order=created_at.asc");
  return r.ok ? ((await r.json()) as InviteRow[]) : [];
}

export async function createInvites(labels: string[], singleUse: boolean, tokenFn: () => string): Promise<InviteRow[]> {
  const rows = labels.map((label) => ({ label, token: tokenFn(), single_use: singleUse }));
  const r = await db("q_invites", { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(rows) });
  return r.ok ? ((await r.json()) as InviteRow[]) : [];
}

export async function revokeInvite(id: string, revoked: boolean): Promise<void> {
  await db(`q_invites?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ revoked }) });
}
