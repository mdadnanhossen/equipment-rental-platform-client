
import {
  Calculator,
  CircleCheckBig,
  Clock3,
  Landmark,
  ReceiptText,
  Wallet,
} from "lucide-react";

import {
  formatBDT,
  formatDate,
} from "@/components/dashboard/payments/format";

import type {
  PaymentRecord,
  PaymentScope,
  PaymentStat,
} from "@/components/dashboard/payments/types";

function getValidPaymentDate(record: PaymentRecord): number {
  if (!record.paymentDate) return 0;

  const timestamp = Date.parse(record.paymentDate);

  return Number.isFinite(timestamp) ? timestamp : 0;
}

/** Builds the four summary-card stats for a role. */
export function buildPaymentStats(
  records: PaymentRecord[],
  scope: PaymentScope,
): PaymentStat[] {
  const successful = records.filter(
    (record) =>
      record.status === "paid" &&
      Number.isFinite(record.amount) &&
      record.amount >= 0,
  );

  const earnings = successful.reduce(
    (total, record) => total + record.amount,
    0,
  );

  const latest = successful.reduce<PaymentRecord | undefined>(
    (newest, record) => {
      if (!newest) return record;

      return getValidPaymentDate(record) >
        getValidPaymentDate(newest)
        ? record
        : newest;
    },
    undefined,
  );

  const successRate =
    records.length > 0
      ? Math.round((successful.length / records.length) * 100)
      : 0;

  if (scope === "owner") {
    return [
      {
        label: "Total Earnings",
        value: formatBDT(earnings),
        hint: `From ${successful.length} successful payment${successful.length === 1 ? "" : "s"}`,
        icon: Wallet,
        tone: "success",
      },
      {
        label: "Total Transactions",
        value: String(records.length),
        hint: "All recorded payments",
        icon: ReceiptText,
        tone: "neutral",
      },
      {
        label: "Successful Payments",
        value: String(successful.length),
        hint: `${successRate}% success rate`,
        icon: CircleCheckBig,
        tone: "brand",
      },
      {
        label: "Latest Payment",
        value: latest ? formatBDT(latest.amount) : "৳0",
        hint: latest
          ? `${latest.equipmentName} · ${
              getValidPaymentDate(latest)
                ? formatDate(latest.paymentDate)
                : "Date unavailable"
            }`
          : "No payments yet",
        icon: Clock3,
        tone: "brand",
      },
    ];
  }

  const average =
    successful.length > 0
      ? earnings / successful.length
      : 0;

  return [
    {
      label: "Total Revenue",
      value: formatBDT(earnings),
      hint: "Across the whole marketplace",
      icon: Landmark,
      tone: "success",
    },
    {
      label: "Total Transactions",
      value: String(records.length),
      hint: "All recorded payments",
      icon: ReceiptText,
      tone: "neutral",
    },
    {
      label: "Successful Payments",
      value: String(successful.length),
      hint: `${successRate}% success rate`,
      icon: CircleCheckBig,
      tone: "brand",
    },
    {
      label: "Average Transaction",
      value: formatBDT(average),
      hint: "Per successful payment",
      icon: Calculator,
      tone: "neutral",
    },
  ];
}
