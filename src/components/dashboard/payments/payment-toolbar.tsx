import type { LucideIcon } from "lucide-react";
import { ArrowUpDown, CalendarDays, Search, X } from "lucide-react";

import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  PaymentDateRange,
  PaymentScope,
  PaymentSortKey,
  PaymentStatusFilter,
} from "@/components/dashboard/payments/types";

const STATUS_OPTIONS: { value: PaymentStatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const DATE_OPTIONS: { value: PaymentDateRange; label: string }[] = [
  { value: "all", label: "Any date" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "year", label: "This year" },
];

const SORT_OPTIONS: { value: PaymentSortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "amount-high", label: "Amount: high to low" },
  { value: "amount-low", label: "Amount: low to high" },
];

const PLACEHOLDER: Record<PaymentScope, string> = {
  owner: "Search equipment, customer or transaction ID...",
  admin: "Search equipment, customer, owner or transaction ID...",
};

function labelOf<T extends string>(
  options: { value: T; label: string }[],
  value: T,
): string {
  return options.find((option) => option.value === value)?.label ?? "";
}

interface FilterSelectProps<T extends string> {
  icon: LucideIcon;
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  className?: string;
}

function FilterSelect<T extends string>({
  icon: Icon,
  label,
  value,
  options,
  onChange,
  className,
}: FilterSelectProps<T>) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as T)}>
      <SelectTrigger aria-label={label} className={cn("h-9", className)}>
        <Icon aria-hidden="true" className="size-4 text-muted-foreground" />

        <SelectValue>{(selected: string) => labelOf(options, selected as T)}</SelectValue>
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface PaymentToolbarProps {
  scope: PaymentScope;
  search: string;
  onSearchChange: (value: string) => void;
  status: PaymentStatusFilter;
  onStatusChange: (value: PaymentStatusFilter) => void;
  dateRange: PaymentDateRange;
  onDateRangeChange: (value: PaymentDateRange) => void;
  sort: PaymentSortKey;
  onSortChange: (value: PaymentSortKey) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

/**
 * Search + status, date and sort filters. Controls are UI-only: they update
 * local view state over static sample records and never call an API.
 */
export function PaymentToolbar({
  scope,
  search,
  onSearchChange,
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  sort,
  onSortChange,
  onClear,
  hasActiveFilters,
}: PaymentToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-xs">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={PLACEHOLDER[scope]}
          aria-label="Search payments"
          className="h-9 bg-background pr-3 pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FilterSelect
          icon={Search}
          label="Filter by payment status"
          value={status}
          options={STATUS_OPTIONS}
          onChange={onStatusChange}
          className="w-[160px]"
        />

        <FilterSelect
          icon={CalendarDays}
          label="Filter by payment date"
          value={dateRange}
          options={DATE_OPTIONS}
          onChange={onDateRangeChange}
          className="w-[150px]"
        />

        <FilterSelect
          icon={ArrowUpDown}
          label="Sort payments"
          value={sort}
          options={SORT_OPTIONS}
          onChange={onSortChange}
          className="w-[190px]"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="text-muted-foreground"
        >
          <X />
          Clear filters
        </Button>
      </div>
    </div>
  );
}
