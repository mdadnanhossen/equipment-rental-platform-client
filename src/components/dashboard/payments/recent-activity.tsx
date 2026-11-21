import { Package } from "lucide-react";

import { cn } from "cn";

import {
  PaymentStatusBadge,
  paymentStatusDot,
} from "@/components/dashboard/payments/payment-status-badge";
import { formatDate, formatBDT } from "@/components/dashboard/payments/format";
import type { PaymentRecord } from "@/components/dashboard/payments/types";

interface RecentPaymentActivityProps {
  records: PaymentRecord[];
  className?: string;
}

/**
 * Compact activity feed — deliberately styled differently from the main
 * transactions table so the two sections never read as duplicates.
 */
export function RecentPaymentActivity({
  records,
  className,
}: RecentPaymentActivityProps) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      <header className="border-b px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight">
          Recent payment activity
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Latest settlements across your rentals.
        </p>
      </header>

      {records.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          No recent activity to show.
        </p>
      ) : (
        <ul className="flex-1 divide-y divide-border/60">
          {records.map((record) => (
            <li
              key={record.id}
              className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-muted/40"
            >
              <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#142B45]/10 text-[#142B45]">
                <Package aria-hidden="true" className="size-4" />

                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-card",
                    paymentStatusDot(record.status),
                  )}
                />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {record.equipmentName}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {record.customerName} · {formatDate(record.paymentDate)}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-sm font-semibold tabular-nums">
                  {formatBDT(record.amount)}
                </span>

                <PaymentStatusBadge
                  status={record.status}
                  className="h-5 px-2 text-[11px]"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
