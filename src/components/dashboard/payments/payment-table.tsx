import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatBDT,
  formatDate,
  formatTime,
  truncateTransactionId,
} from "@/components/dashboard/payments/format";
import { PaymentStatusBadge } from "@/components/dashboard/payments/payment-status-badge";
import type {
  PaymentRecord,
  PaymentScope,
} from "@/components/dashboard/payments/types";

const TH_CLASS =
  "px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

const ROW_CLASS = "border-border/60";

interface PaymentTableProps {
  scope: PaymentScope;
  records: PaymentRecord[];
  totalCount: number;
  page: number;
  pageCount: number;
  rangeFrom: number;
  rangeTo: number;
  onPageChange: (page: number) => void;
  onViewDetails: (record: PaymentRecord) => void;
}

function buildPageItems(
  page: number,
  pageCount: number,
): (number | "ellipsis")[] {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }

  if (end < pageCount - 1) {
    items.push("ellipsis");
  }

  items.push(pageCount);

  return items;
}

function EquipmentCell({ record }: { record: PaymentRecord }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#142B45]/10 text-sm font-semibold text-[#142B45]"
      >
        {record.equipmentName.charAt(0).toUpperCase()}
      </span>

      <span className="font-medium text-foreground">
        {record.equipmentName}
      </span>
    </div>
  );
}

function CustomerCell({ record }: { record: PaymentRecord }) {
  return (
    <div>
      <p className="font-medium text-foreground">{record.customerName}</p>
      <p className="mt-0.5 max-w-[220px] truncate text-xs text-muted-foreground">
        {record.customerEmail}
      </p>
    </div>
  );
}

function TransactionIdCell({ record }: { record: PaymentRecord }) {
  return (
    <span
      className="inline-flex max-w-[230px] items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 font-mono text-xs text-muted-foreground"
      title={record.transactionId}
    >
      <span className="truncate">{truncateTransactionId(record.transactionId)}</span>

      <button
        type="button"
        aria-label="Copy transaction ID"
        title="Copy transaction ID"
        className="shrink-0 rounded p-0.5 transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Copy aria-hidden="true" className="size-3" />
      </button>
    </span>
  );
}

function PaymentTable({
  scope,
  records,
  totalCount,
  page,
  pageCount,
  rangeFrom,
  rangeTo,
  onPageChange,
  onViewDetails,
}: PaymentTableProps) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      <header className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Payment records
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {totalCount} transaction{totalCount === 1 ? "" : "s"} found
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          Secured by Rentora Pay
        </span>
      </header>

      {/* Desktop / tablet: horizontally scrollable table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className={TH_CLASS}>Equipment</TableHead>
              <TableHead className={TH_CLASS}>Customer</TableHead>

              {scope === "admin" && (
                <TableHead className={TH_CLASS}>Owner</TableHead>
              )}

              <TableHead className={cn(TH_CLASS, "text-right")}>
                Amount
              </TableHead>
              <TableHead className={TH_CLASS}>Status</TableHead>
              <TableHead className={TH_CLASS}>Transaction ID</TableHead>
              <TableHead className={TH_CLASS}>Payment date</TableHead>
              <TableHead className={cn(TH_CLASS, "text-right")}>
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id} className={ROW_CLASS}>
                <TableCell className="px-5 py-3.5">
                  <EquipmentCell record={record} />
                </TableCell>

                <TableCell className="px-5 py-3.5">
                  <CustomerCell record={record} />
                </TableCell>

                {scope === "admin" && (
                  <TableCell className="px-5 py-3.5 font-medium text-foreground">
                    {record.ownerName}
                  </TableCell>
                )}

                <TableCell className="px-5 py-3.5 text-right font-semibold tabular-nums">
                  {formatBDT(record.amount)}
                </TableCell>

                <TableCell className="px-5 py-3.5">
                  <PaymentStatusBadge status={record.status} />
                </TableCell>

                <TableCell className="px-5 py-3.5">
                  <TransactionIdCell record={record} />
                </TableCell>

                <TableCell className="px-5 py-3.5 text-muted-foreground">
                  <span className="block text-foreground">
                    {formatDate(record.paymentDate)}
                  </span>
                  <span className="mt-0.5 block text-xs">
                    {formatTime(record.paymentDate)}
                  </span>
                </TableCell>

                <TableCell className="px-5 py-3.5 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(record)}
                  >
                    <Eye />
                    View details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: stacked cards */}
      <div className="divide-y md:hidden">
        {records.map((record) => (
          <article key={record.id} className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#142B45]/10 text-sm font-semibold text-[#142B45]"
                >
                  {record.equipmentName.charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">
                    {record.equipmentName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {record.customerName} · {record.customerEmail}
                  </p>
                </div>
              </div>

              <PaymentStatusBadge status={record.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/40 p-3 text-xs">
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                  {formatBDT(record.amount)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Payment date</p>
                <p className="mt-1 font-medium text-foreground">
                  {formatDate(record.paymentDate)}
                </p>
              </div>

              {scope === "admin" && (
                <div>
                  <p className="text-muted-foreground">Owner</p>
                  <p className="mt-1 font-medium text-foreground">
                    {record.ownerName}
                  </p>
                </div>
              )}

              <div className={scope === "owner" ? "col-span-2" : undefined}>
                <p className="text-muted-foreground">Transaction ID</p>
                <p className="mt-1 break-all font-mono text-foreground">
                  {record.transactionId}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onViewDetails(record)}
            >
              <Eye />
              View details
            </Button>
          </article>
        ))}
      </div>

      <footer className="flex flex-col gap-3 border-t px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {rangeFrom}–{rangeTo}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{totalCount}</span>{" "}
          transactions
        </p>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              >
                <ChevronLeft />
                <span className="hidden sm:inline">Previous</span>
              </Button>
            </PaginationItem>

            {buildPageItems(page, pageCount).map((item, index) =>
              item === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center text-muted-foreground"
                  >
                    <MoreHorizontal className="size-4" />
                  </span>
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <Button
                    type="button"
                    variant={item === page ? "outline" : "ghost"}
                    size="sm"
                    aria-current={item === page ? "page" : undefined}
                    className="min-w-8 tabular-nums"
                    onClick={() => onPageChange(item)}
                  >
                    {item}
                  </Button>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= pageCount}
                onClick={() => onPageChange(page + 1)}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </footer>
    </section>
  );
}

export { PaymentTable };
