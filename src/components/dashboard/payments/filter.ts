
import type {
  PaymentDateRange,
  PaymentRecord,
  PaymentSortKey,
  PaymentStatusFilter,
} from "@/components/dashboard/payments/types";

export interface PaymentFilters {
  search: string;
  status: PaymentStatusFilter;
  dateRange: PaymentDateRange;
  sort: PaymentSortKey;
}

export const DEFAULT_PAYMENT_FILTERS: PaymentFilters = {
  search: "",
  status: "all",
  dateRange: "all",
  sort: "newest",
};

export function hasActiveFilters(filters: PaymentFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.dateRange !== "all" ||
    filters.sort !== "newest"
  );
}

function getPaymentTimestamp(record: PaymentRecord): number {
  if (!record.paymentDate) return 0;

  const timestamp = Date.parse(record.paymentDate);

  return Number.isFinite(timestamp) ? timestamp : 0;
}

function matchesDateRange(
  record: PaymentRecord,
  range: PaymentDateRange,
  now: number,
): boolean {
  if (range === "all") return true;

  const time = getPaymentTimestamp(record);

  if (!time || time > now) return false;

  const paymentDate = new Date(time);
  const currentDate = new Date(now);

  if (range === "year") {
    return (
      paymentDate.getFullYear() === currentDate.getFullYear()
    );
  }

  const days = range === "7d" ? 7 : 30;
  const startDate = new Date(now);

  startDate.setDate(startDate.getDate() - days);

  return time >= startDate.getTime();
}

function sortPaymentRecords(
  records: PaymentRecord[],
  sort: PaymentSortKey,
): PaymentRecord[] {
  const sorted = [...records];

  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) =>
          getPaymentTimestamp(a) - getPaymentTimestamp(b),
      );

    case "amount-high":
      return sorted.sort(
        (a, b) => b.amount - a.amount,
      );

    case "amount-low":
      return sorted.sort(
        (a, b) => a.amount - b.amount,
      );

    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          getPaymentTimestamp(b) - getPaymentTimestamp(a),
      );
  }
}

export function filterPaymentRecords(
  records: PaymentRecord[],
  filters: PaymentFilters,
): PaymentRecord[] {
  const query = filters.search.trim().toLowerCase();
  const now = Date.now();

  const filtered = records.filter((record) => {
    const searchableFields = [
      record.equipmentName,
      record.customerName,
      record.customerEmail,
      record.ownerName,
      record.transactionId,
      record.rentalReference,
    ];

    const matchesSearch =
      query === "" ||
      searchableFields.some((field) =>
        String(field ?? "").toLowerCase().includes(query),
      );

    const matchesStatus =
      filters.status === "all" ||
      record.status === filters.status;

    const matchesDate = matchesDateRange(
      record,
      filters.dateRange,
      now,
    );

    return matchesSearch && matchesStatus && matchesDate;
  });

  return sortPaymentRecords(filtered, filters.sort);
}
