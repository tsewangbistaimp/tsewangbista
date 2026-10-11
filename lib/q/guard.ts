import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

const hits = new Map<string, number[]>();

/** Simple per-IP sliding-window limiter (per server instance; good enough for ~10 invited people). */
export function limited(req: Request, bucket: string, max: number, windowMs: number): boolean {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > max;
}

/** Only accept requests that come from our own pages. */
export function sameOrigin(req: Request): boolean {
  const o = req.headers.get("origin");
  if (!o) return true;
  try {
    return new URL(o).host === (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return false;
  }
}

export const notFound = () => new NextResponse(null, { status: 404 });
export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet" } });

export const inviteToken = () => randomBytes(12).toString("base64url");
export const newSlug = () => randomBytes(18).toString("base64url");
