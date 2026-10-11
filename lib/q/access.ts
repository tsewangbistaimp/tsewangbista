import { cookies } from "next/headers";
import { cfg, cookieValid, hasDb } from "./config";
import { findInvite, inviteUsable } from "./store";

export type Access = { ok: boolean; inviteId: string | null; inviteLabel?: string; singleUse: boolean };

/** Shared access check for the draft and submit endpoints (invite token or access-code cookie). */
export async function checkAccess(token: string | undefined): Promise<Access> {
  if (cfg.access() === "token" && hasDb()) {
    const inv = await findInvite(token ?? "");
    if (!inviteUsable(inv)) return { ok: false, inviteId: null, singleUse: false };
    return { ok: true, inviteId: inv.id, inviteLabel: inv.label, singleUse: inv.single_use };
  }
  if (cfg.access() === "code") {
    const jar = await cookies();
    return { ok: cookieValid(jar.get("q_ok")?.value, "ok"), inviteId: null, singleUse: false };
  }
  return { ok: true, inviteId: null, singleUse: false };
}
