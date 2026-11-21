import { cn } from "cn";

import type {
  PaymentStat,
  SummaryTone,
} from "@/components/dashboard/payments/types";

const TONE_CLASS: Record<SummaryTone, string> = {
  brand: "bg-[#142B45]/10 text-[#142B45]",
  success: "bg-[#16A37A]/10 text-[#16A37A]",
  neutral: "bg-muted text-muted-foreground",
  warning: "bg-[#F59E0B]/10 text-[#B45309]",
};

const CARD_SHADOW = "shadow-[0_1px_2px_rgba(15,23,42,0.05)]";

interface PaymentSummaryCardsProps {
  stats: PaymentStat[];
  className?: string;
}

/** Four evenly-sized KPI cards with a tinted icon, value and hint line. */
export function PaymentSummaryCards({
  stats,
  className,
}: PaymentSummaryCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <article
            key={stat.label}
            className={cn(
              "group h-full rounded-xl border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#16A37A]/40 hover:shadow-[0_12px_28px_-18px_rgba(15,23,42,0.45)]",
              CARD_SHADOW,
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>

              <span
                aria-hidden="true"
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105",
                  TONE_CLASS[stat.tone],
                )}
              >
                <Icon className="size-4" />
              </span>
            </div>

            <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
              {stat.value}
            </p>

            <p className="mt-1.5 truncate text-xs text-muted-foreground">
              {stat.hint}
            </p>
          </article>
        );
      })}
    </div>
  );
}
