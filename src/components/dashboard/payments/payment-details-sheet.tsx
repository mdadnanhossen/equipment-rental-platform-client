
"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  formatBDT,
  formatLongDate,
  formatTime,
} from "@/components/dashboard/payments/format";
import { PaymentStatusBadge } from "@/components/dashboard/payments/payment-status-badge";
import type {
  PaymentRecord,
  PaymentScope,
} from "@/components/dashboard/payments/types";

interface DetailProps {
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
  full?: boolean;
}

function Detail({ label, value, sub, mono, full }: DetailProps) {
  return (
    <div className={cn(full && "col-span-2")}>
      <dt className="text-xs text-muted-foreground">{label}</dt>

      <dd
        className={cn(
          "mt-1 break-words text-sm font-medium text-foreground",
          mono && "font-mono text-xs",
        )}
      >
        {value || "Not available"}

        {sub && (
          <span className="mt-0.5 block font-normal text-muted-foreground">
            {sub}
          </span>
        )}
      </dd>
    </div>
  );
}

interface PaymentDetailsSheetProps {
  record: PaymentRecord | null;
  scope: PaymentScope;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailsSheet({
  record,
  scope,
  onOpenChange,
}: PaymentDetailsSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!record?.transactionId) return;

    try {
      await navigator.clipboard.writeText(record.transactionId);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy transaction ID:", error);
    }
  };

  return (
    <Sheet open={record !== null} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="gap-0 overflow-y-auto border-l p-0 sm:max-w-md"
      >
        {record && (
          <>
            <SheetHeader className="border-b px-5 pt-6 pr-12 pb-4">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Payment details
              </span>

              <SheetTitle className="mt-1 text-lg font-semibold tracking-tight">
                {record.equipmentName}
              </SheetTitle>

              <SheetDescription className="text-sm">
                {record.customerName} · {record.customerEmail}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-5 px-5 py-5">
              <div className="rounded-xl border bg-muted/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Amount
                    </p>

                    <p className="mt-1.5 text-3xl font-semibold tracking-tight tabular-nums">
                      {formatBDT(record.amount)}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {record.currency} · {record.paymentMethod}
                    </p>
                  </div>

                  <PaymentStatusBadge
                    status={record.status}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Transaction ID
                </p>

                <div className="mt-1.5 flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
                  <code className="min-w-0 flex-1 break-all font-mono text-xs text-foreground">
                    {record.transactionId || "Not available"}
                  </code>

                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!record.transactionId}
                    aria-label="Copy transaction ID"
                    title="Copy transaction ID"
                    className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {copied ? (
                      <Check aria-hidden="true" className="size-3.5 text-green-600" />
                    ) : (
                      <Copy aria-hidden="true" className="size-3.5" />
                    )}
                  </button>
                </div>

                {copied && (
                  <p className="mt-1 text-xs text-green-600">
                    Transaction ID copied!
                  </p>
                )}
              </div>

              <Separator />

              <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
                <Detail
                  label="Payment date"
                  value={
                    record.paymentDate
                      ? formatLongDate(record.paymentDate)
                      : "Not available"
                  }
                />

                <Detail
                  label="Payment time"
                  value={
                    record.paymentDate
                      ? formatTime(record.paymentDate)
                      : "Not available"
                  }
                />

                <Detail
                  label="Rental reference"
                  value={record.rentalReference}
                  mono
                />

                <Detail label="Currency" value={record.currency} />

                <Detail
                  label="Equipment"
                  value={record.equipmentName}
                  full
                />

                <Detail
                  label="Customer"
                  value={record.customerName}
                  sub={record.customerEmail}
                  full
                />

                {scope === "admin" && (
                  <Detail
                    label="Owner"
                    value={record.ownerName}
                    full
                  />
                )}
              </dl>
            </div>

            <SheetFooter className="border-t bg-muted/50 sm:flex-row sm:justify-end">
              <SheetClose
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto"
                  />
                }
              >
                Close
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
