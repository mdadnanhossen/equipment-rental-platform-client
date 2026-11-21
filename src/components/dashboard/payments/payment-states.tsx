import Link from "next/link";
import { CircleAlert, Inbox, RefreshCw, SearchX } from "lucide-react";

import { cn } from "cn";

import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { PaymentScope } from "@/components/dashboard/payments/types";

/** Full-page loading state: KPI cards, chart, activity feed and table. */
export function PaymentPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading payment history…</span>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-9 rounded-lg" />
            </div>

            <Skeleton className="mt-4 h-7 w-32" />
            <Skeleton className="mt-2.5 h-3 w-40" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-2 h-3 w-56" />
            </div>

            <Skeleton className="h-8 w-40 rounded-lg" />
          </div>

          <Skeleton className="mt-5 h-[260px] w-full rounded-lg" />
        </div>

        <div className="rounded-xl border bg-card p-5">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="mt-2 h-3 w-52" />

          <div className="mt-5 space-y-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="border-b px-5 py-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-2 h-3 w-44" />
        </div>

        <div className="space-y-3 p-5">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="size-9 shrink-0 rounded-lg" />
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="ml-auto h-6 w-20 rounded-full" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STATE_SHELL =
  "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-14 text-center";

const STATE_ICON =
  "flex size-12 items-center justify-center rounded-xl bg-[#142B45]/10 text-[#142B45]";

interface PaymentEmptyStateProps {
  scope: PaymentScope;
}

/** No payments recorded yet. */
export function PaymentEmptyState({ scope }: PaymentEmptyStateProps) {
  const isOwner = scope === "owner";

  return (
    <div className={STATE_SHELL}>
      <span aria-hidden="true" className={STATE_ICON}>
        <Inbox className="size-6" />
      </span>

      <h3 className="mt-4 text-base font-semibold tracking-tight">
        {isOwner ? "No payments yet" : "No payments recorded"}
      </h3>

      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
        {isOwner
          ? "Once customers start renting your equipment, their payments will appear here."
          : "Marketplace payments will appear here as soon as customers complete a rental."}
      </p>

      <Link
        href={
          isOwner
            ? "/dashboard/owner/equipment/add"
            : "/dashboard/admin/equipment"
        }
        className={cn(
          buttonVariants({ variant: "default" }),
          "mt-5 bg-[#142B45] text-white hover:bg-[#142B45]/90",
        )}
      >
        {isOwner ? "Add equipment" : "View all equipment"}
      </Link>
    </div>
  );
}

interface PaymentNoResultsStateProps {
  search: string;
  onClear: () => void;
}

/** Search/filter returned nothing — distinct from an empty account. */
export function PaymentNoResultsState({
  search,
  onClear,
}: PaymentNoResultsStateProps) {
  return (
    <div className={STATE_SHELL}>
      <span aria-hidden="true" className={STATE_ICON}>
        <SearchX className="size-6" />
      </span>

      <h3 className="mt-4 text-base font-semibold tracking-tight">
        No matching transactions
      </h3>

      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
        {search.trim()
          ? `We couldn't find anything for “${search.trim()}” with the current filters.`
          : "No transactions match the filters you selected."}
      </p>

      <Button type="button" variant="outline" className="mt-5" onClick={onClear}>
        <RefreshCw />
        Clear filters
      </Button>
    </div>
  );
}

interface PaymentErrorStateProps {
  onRetry: () => void;
}

/** Loading failed — retry replays the local loading state only. */
export function PaymentErrorState({ onRetry }: PaymentErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
      >
        <CircleAlert className="size-6" />
      </span>

      <h3 className="mt-4 text-base font-semibold tracking-tight">
        Unable to load payments
      </h3>

      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
        Something went wrong while loading the payment history. Please try
        again.
      </p>

      <Button type="button" className="mt-5" onClick={onRetry}>
        <RefreshCw />
        Try again
      </Button>
    </div>
  );
}
