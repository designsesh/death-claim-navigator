// US date formatting helpers. Inputs are typically ISO "YYYY-MM-DD" or
// "YYYY-MM-DD HH:mm" strings as produced by the mock data.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(input?: string) {
  if (!input) return null;
  const [datePart, timePart] = input.split(" ");
  const [y, m, d] = datePart.split("-").map((n) => parseInt(n, 10));
  if (!y || !m || !d) return null;
  return { y, m, d, time: timePart };
}

/** "Sep 8, 2024" */
export function formatDateUS(input?: string) {
  const p = parts(input);
  if (!p) return input ?? "";
  return `${MONTHS[p.m - 1]} ${p.d}, ${p.y}`;
}

/** "09/08/2024" */
export function formatDateShortUS(input?: string) {
  const p = parts(input);
  if (!p) return input ?? "";
  return `${String(p.m).padStart(2, "0")}/${String(p.d).padStart(2, "0")}/${p.y}`;
}

/** "Sep 8, 2024 · 6:42 AM" */
export function formatDateTimeUS(input?: string) {
  const p = parts(input);
  if (!p) return input ?? "";
  const base = formatDateUS(input);
  if (!p.time) return base;
  const [hh, mm] = p.time.split(":").map((n) => parseInt(n, 10));
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = ((hh + 11) % 12) + 1;
  return `${base} · ${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

import type { Claim, TabKey } from "@/types/claim";

export const TAB_LABELS: Record<TabKey, string> = {
  claims: "Claim Verification",
  policy: "Policy Verification",
  beneficiary: "Beneficiary Identification",
  settlement: "Beneficiary Settlement",
  payout: "Payout",
};

export const TAB_ORDER: TabKey[] = ["claims", "policy", "beneficiary", "settlement", "payout"];

export function deriveStatusFromTabs(claim: Claim): string {
  const next = TAB_ORDER.find((k) => claim.tabStates[k] === "pending");
  if (!next) return "Closed — All stages done";
  return `In Progress — ${TAB_LABELS[next]}`;
}
