import type { LucideIcon } from "lucide-react";

/** Payment lifecycle states rendered by the status badges. */
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

/** Role-specific rendering of the payments screens. */
export type PaymentScope = "owner" | "admin";

/** A single static payment record used for the UI preview. */
export interface PaymentRecord {
  id: string;
  equipmentName: string;
  customerName: string;
  customerEmail: string;
  ownerName: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId: string;
  /** Local date-time string, e.g. "2026-11-20T14:35:00". */
  paymentDate: string;
  rentalReference: string;
  paymentMethod: string;
}

/** Toolbar filter states — presentation only, never sent to an API. */
export type PaymentStatusFilter = "all" | PaymentStatus;
export type PaymentDateRange = "all" | "7d" | "30d" | "year";
export type PaymentSortKey = "newest" | "oldest" | "amount-high" | "amount-low";

/** Icon tint used by the summary cards. */
export type SummaryTone = "brand" | "success" | "neutral" | "warning";

export interface PaymentStat {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: SummaryTone;
}
