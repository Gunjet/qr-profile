// Subscription / payment settings. Override any of these with env vars on Vercel.
export const BILLING = {
  bankName: process.env.BANK_NAME || "Хаан банк (демо)",
  account: process.env.BANK_ACCOUNT || "5588558855",
  holder: process.env.BANK_HOLDER || "QR Профайл (демо)",
  monthlyPrice: Number(process.env.MONTHLY_PRICE) || 5_000,
  graceDays: 3, // profile stays visible this many days after expiry
  trialDays: 7, // new profiles start with this many free days
  expiringSoonDays: 5, // "дуусах гэж байна" warning threshold
};

export const EXTEND_OPTIONS = [1, 3, 6, 12] as const;

export type BillingState = "active" | "expiring" | "grace" | "expired";

const DAY = 24 * 60 * 60 * 1000;

export function billingStatus(paidUntil: string | null, now: Date) {
  if (!paidUntil) return { state: "expired" as BillingState, daysLeft: 0, visible: false };
  const remaining = new Date(paidUntil).getTime() - now.getTime();
  // Round for display (avoids "8 days" for a 7-day trial due to ms clock skew), but never show 0 while active.
  const daysLeft = remaining > 0 ? Math.max(1, Math.round(remaining / DAY)) : 0;
  const visible = remaining > -BILLING.graceDays * DAY;
  const state: BillingState =
    remaining <= 0
      ? visible
        ? "grace"
        : "expired"
      : remaining <= BILLING.expiringSoonDays * DAY
        ? "expiring"
        : "active";
  return { state, daysLeft, visible };
}

export const refCode = (id: string) => `QR-${id}`;

export function formatDate(iso: string | null) {
  if (!iso) return "—";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ulaanbaatar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso)); // YYYY-MM-DD
  return parts.replaceAll("-", ".");
}

/** YYYY-MM-DD in Ulaanbaatar time, for <input type="date"> defaults. */
export function toDateInput(iso: string | null) {
  return iso ? formatDate(iso).replaceAll(".", "-") : "";
}

export const formatMNT = (n: number) => `₮${n.toLocaleString("en-US")}`;
