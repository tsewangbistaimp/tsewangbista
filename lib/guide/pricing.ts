import type { Cost, Itinerary } from "./types";

const num = (v: string) => {
  const n = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

export type Breakdown = { travellers: number; days: number; perPersonCosts: number; groupCosts: number; dayCosts: number; onceCosts: number; optional: number; total: number; perPerson: number; perDay: number };

/** Total for N travellers: per-person items x N, per-group once, per-day items x trek days, one-time once. Optional items are listed separately. */
export function breakdown(costs: Cost[], travellers: number, days: number): Breakdown {
  const n = Math.max(1, Math.floor(travellers) || 1);
  const d = Math.max(1, Math.floor(days) || 1);
  let perPersonCosts = 0, groupCosts = 0, dayCosts = 0, onceCosts = 0, optional = 0;
  for (const c of costs) {
    const a = num(c.amount);
    if (c.scope === "person") perPersonCosts += a * n;
    else if (c.scope === "group") groupCosts += a;
    else if (c.scope === "day") dayCosts += a * d;
    else if (c.scope === "once") onceCosts += a;
    else optional += a;
  }
  const total = perPersonCosts + groupCosts + dayCosts + onceCosts;
  return { travellers: n, days: d, perPersonCosts, groupCosts, dayCosts, onceCosts, optional, total, perPerson: total / n, perDay: total / d };
}

export const itineraryBreakdown = (it: Itinerary) =>
  breakdown(it.pricing.costs, parseInt(it.pricing.travellers) || parseInt(it.pricing.f.minGroup) || 1, parseInt(it.f.durationDays) || it.days.length || 1);

export const money = (n: number, cur: string) => `${cur} ${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
