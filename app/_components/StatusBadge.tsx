import { billingStatus, type BillingState } from "@/lib/billing";

const STYLE: Record<BillingState, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  expiring: "bg-amber-50 text-amber-700 ring-amber-200",
  grace: "bg-orange-50 text-orange-700 ring-orange-200",
  expired: "bg-red-50 text-red-700 ring-red-200",
};
const DOT: Record<BillingState, string> = {
  active: "bg-emerald-500",
  expiring: "bg-amber-500",
  grace: "bg-orange-500",
  expired: "bg-red-500",
};

export function statusLabel(state: BillingState, daysLeft: number) {
  switch (state) {
    case "active":
    case "expiring":
      return `${daysLeft} хоног үлдсэн`;
    case "grace":
      return "Хугацаа дууссан · хөнгөлөлттэй";
    case "expired":
      return "Хугацаа дууссан";
  }
}

export function StatusBadge({ paidUntil, now }: { paidUntil: string | null; now: Date }) {
  if (!paidUntil) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200 ring-inset">
        <span className="size-1.5 rounded-full bg-slate-400" />
        Төлбөр төлөөгүй
      </span>
    );
  }
  const { state, daysLeft } = billingStatus(paidUntil, now);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset ${STYLE[state]}`}
    >
      <span className={`size-1.5 rounded-full ${DOT[state]}`} />
      {statusLabel(state, daysLeft)}
    </span>
  );
}
