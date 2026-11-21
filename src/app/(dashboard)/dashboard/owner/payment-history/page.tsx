
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlusCircle, RefreshCw, Wallet } from "lucide-react";

import { cn } from "cn";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DEFAULT_PAYMENT_FILTERS,
  filterPaymentRecords,
  hasActiveFilters,
} from "@/components/dashboard/payments/filter";
import { PaymentDetailsSheet } from "@/components/dashboard/payments/payment-details-sheet";
import { PaymentPageHero } from "@/components/dashboard/payments/payment-page-hero";
import { PaymentTable } from "@/components/dashboard/payments/payment-table";
import {
  PaymentEmptyState,
  PaymentErrorState,
  PaymentNoResultsState,
  PaymentPageSkeleton,
} from "@/components/dashboard/payments/payment-states";
import { PaymentToolbar } from "@/components/dashboard/payments/payment-toolbar";
import { RecentPaymentActivity } from "@/components/dashboard/payments/recent-activity";
import { RevenueChart } from "@/components/dashboard/payments/revenue-chart";
import { buildPaymentStats } from "@/components/dashboard/payments/stats";
import { PaymentSummaryCards } from "@/components/dashboard/payments/summary-cards";
import type {
  PaymentDateRange,
  PaymentRecord,
  PaymentSortKey,
  PaymentStatus,
  PaymentStatusFilter,
} from "@/components/dashboard/payments/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PAGE_SIZE = 5;

interface ApiPayment {
  _id: string;
  rentalId: string;
  equipmentTitle: string;
  customerName: string;
  customerEmail: string;
  ownerName: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  transactionId: string | null;
  paidAt: string | null;
}

interface PaymentResponse {
  success: boolean;
  message?: string;
  data: ApiPayment[];
}

function mapPaymentRecord(payment: ApiPayment): PaymentRecord {
  const validStatuses: PaymentStatus[] = [
    "paid",
    "pending",
    "failed",
    "refunded",
  ];

  const status = validStatuses.includes(
    payment.paymentStatus as PaymentStatus,
  )
    ? (payment.paymentStatus as PaymentStatus)
    : "pending";

  return {
    id: payment._id,
    equipmentName: payment.equipmentTitle,
    customerName: payment.customerName,
    customerEmail: payment.customerEmail,
    ownerName: payment.ownerName,
    amount: Number(payment.amount) || 0,
    currency: payment.currency || "BDT",
    status,
    transactionId: payment.transactionId || "",
    paymentDate: payment.paidAt || "",
    rentalReference: payment.rentalId,
    paymentMethod: "Stripe",
  };
}

export default function OwnerPaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [search, setSearch] = useState(
    DEFAULT_PAYMENT_FILTERS.search,
  );
  const [status, setStatus] = useState<PaymentStatusFilter>(
    DEFAULT_PAYMENT_FILTERS.status,
  );
  const [dateRange, setDateRange] = useState<PaymentDateRange>(
    DEFAULT_PAYMENT_FILTERS.dateRange,
  );
  const [sort, setSort] = useState<PaymentSortKey>(
    DEFAULT_PAYMENT_FILTERS.sort,
  );

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PaymentRecord | null>(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);

    try {
      const response = await fetch(
        `${API_URL}/api/payments/owner/history`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        },
      );

      const result: PaymentResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load payment records.",
        );
      }

      const records = Array.isArray(result.data)
        ? result.data.map(mapPaymentRecord)
        : [];

      setPayments(records);
    } catch (error) {
      console.error("Owner payment history error:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filtered = useMemo(
    () =>
      filterPaymentRecords(payments, {
        search,
        status,
        dateRange,
        sort,
      }),
    [payments, search, status, dateRange, sort],
  );

  const stats = useMemo(
    () => buildPaymentStats(payments, "owner"),
    [payments],
  );

  const recentRecords = useMemo(
    () =>
      [...payments]
        .sort(
          (a, b) =>
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime(),
        )
        .slice(0, 5),
    [payments],
  );

  const filtersActive = hasActiveFilters({
    search,
    status,
    dateRange,
    sort,
  });

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, pageCount);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRecords = filtered.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const rangeFrom =
    filtered.length === 0 ? 0 : startIndex + 1;

  const rangeTo = Math.min(
    startIndex + PAGE_SIZE,
    filtered.length,
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatus = (value: PaymentStatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  const handleDateRange = (value: PaymentDateRange) => {
    setDateRange(value);
    setPage(1);
  };

  const handleSort = (value: PaymentSortKey) => {
    setSort(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch(DEFAULT_PAYMENT_FILTERS.search);
    setStatus(DEFAULT_PAYMENT_FILTERS.status);
    setDateRange(DEFAULT_PAYMENT_FILTERS.dateRange);
    setSort(DEFAULT_PAYMENT_FILTERS.sort);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PaymentPageHero
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard/owner" },
          {
            label: "Payment History",
            href: "/dashboard/owner/payments",
          },
        ]}
        title="Payment History"
        subtitle="Track your equipment earnings, successful payments and every transaction in one place."
        icon={Wallet}
        badge="Owner"
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={fetchPayments}
              disabled={isLoading}
            >
              <RefreshCw
                className={isLoading ? "animate-spin" : undefined}
              />
              Refresh
            </Button>

            <Link
              href="/dashboard/owner/equipment/add"
              className={cn(
                buttonVariants({ variant: "default" }),
                "bg-[#142B45] text-white hover:bg-[#142B45]/90",
              )}
            >
              <PlusCircle />
              Add equipment
            </Link>
          </>
        }
      />

      {isLoading ? (
        <PaymentPageSkeleton />
      ) : hasError ? (
        <PaymentErrorState onRetry={fetchPayments} />
      ) : (
        <>
          <PaymentSummaryCards stats={stats} />

          <div className="grid gap-4 xl:grid-cols-3">
            <RevenueChart
              className="xl:col-span-2"
              records={payments}
            />

            <RecentPaymentActivity records={recentRecords} />
          </div>

          <div className="space-y-4">
            <PaymentToolbar
              scope="owner"
              search={search}
              onSearchChange={handleSearch}
              status={status}
              onStatusChange={handleStatus}
              dateRange={dateRange}
              onDateRangeChange={handleDateRange}
              sort={sort}
              onSortChange={handleSort}
              onClear={handleClearFilters}
              hasActiveFilters={filtersActive}
            />

            {pageRecords.length > 0 ? (
              <PaymentTable
                scope="owner"
                records={pageRecords}
                totalCount={filtered.length}
                page={currentPage}
                pageCount={pageCount}
                rangeFrom={rangeFrom}
                rangeTo={rangeTo}
                onPageChange={setPage}
                onViewDetails={setSelected}
              />
            ) : filtersActive ? (
              <PaymentNoResultsState
                search={search}
                onClear={handleClearFilters}
              />
            ) : (
              <PaymentEmptyState scope="owner" />
            )}
          </div>
        </>
      )}

      <PaymentDetailsSheet
        record={selected}
        scope="owner"
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
      />
    </div>
  );
}
