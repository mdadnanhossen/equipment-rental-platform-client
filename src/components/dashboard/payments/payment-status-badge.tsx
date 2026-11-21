import { cn } from "cn";

import type { PaymentStatus } from "@/components/dashboard/payments/types";

const STATUS_META: Record<
  PaymentStatus,
  { label: string; badge: string; dot: string }
> = {
  paid: {
    label: "Paid",
    badge: "bg-[#16A37A]/10 text-[#0F7A57] ring-[#16A37A]/25 dark:text-[#34D399]",
    dot: "bg-[#16A37A]",
  },
  pending: {
    label: "Pending",
    badge: "bg-[#F59E0B]/10 text-[#B45309] ring-[#F59E0B]/25 dark:text-[#FBBF24]",
    dot: "bg-[#F59E0B]",
  },
  failed: {
    label: "Failed",
    badge: "bg-[#EF4444]/10 text-[#B91C1C] ring-[#EF4444]/25 dark:text-[#F87171]",
    dot: "bg-[#EF4444]",
  },
  refunded: {
    label: "Refunded",
    badge: "bg-[#3B82F6]/10 text-[#1D4ED8] ring-[#3B82F6]/25 dark:text-[#93C5FD]",
    dot: "bg-[#3B82F6]",
  },
};

/** Status dot colour, reused by the activity feed. */
export function paymentStatusDot(status: PaymentStatus): string {
  return STATUS_META[status].dot;
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

/** Consistent pill badge used across every payments surface. */
export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const meta = STATUS_META[status];

  return (
    <span
      className={cn(
        "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap ring-1",
        meta.badge,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", meta.dot)}
      />
      {meta.label}
    </span>
  );
}
