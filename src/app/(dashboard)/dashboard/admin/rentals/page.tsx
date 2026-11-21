
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Loader2,
  CalendarDays,
  UserRound,
  Package,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type RentalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "completed"
  | "cancelled";

interface Rental {
  _id: string;
  equipmentTitle?: string;
  equipmentImage?: string;
  customerName?: string;
  customerEmail?: string;
  ownerName?: string;
  startDate?: string;
  endDate?: string;
  rentalDays?: number;
  pricePerDay?: number;
  securityDeposit?: number;
  totalAmount?: number;
  quantity?: number;
  status: RentalStatus;
  createdAt?: string;
}

const statuses: RentalStatus[] = [
  "pending",
  "approved",
  "rejected",
  "active",
  "completed",
  "cancelled",
];

const statusStyles: Record<RentalStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  active: "bg-purple-100 text-purple-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

function formatDate(date?: string) {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "N/A";

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(amount?: number) {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
}

export default function RentalPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 20;

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (status !== "all") {
        params.set("status", status);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const response = await fetch(
        `${API_URL}/api/admin/rentals?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch rentals");
      }

      setRentals(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(Math.max(1, result.totalPages || 1));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleStatusChange = async (
    rentalId: string,
    newStatus: RentalStatus
  ) => {
    try {
      setUpdatingId(rentalId);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/rentals/${rentalId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update rental");
      }

      await fetchRentals();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Status update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (value: RentalStatus) => {
    switch (value) {
      case "approved":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="h-3.5 w-3.5" />;
      case "completed":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      default:
        return <Clock className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Rental Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor and manage all platform rental requests.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchRentals}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-primary/10 p-3">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Rentals
              </p>
              <h2 className="text-2xl font-bold">{total}</h2>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <div className="rounded-lg bg-yellow-100 p-3">
              <Clock className="h-5 w-5 text-yellow-700" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Current Page
              </p>
              <h2 className="text-2xl font-bold">
                {page} / {totalPages}
              </h2>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search equipment, customer or owner..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : rentals.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <Package className="mb-3 h-10 w-10 text-muted-foreground" />
              <h3 className="font-semibold">No rentals found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or status filter.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Rental Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Update Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rentals.map((rental) => (
                      <TableRow key={rental._id}>
                        <TableCell>
                          <div className="flex min-w-[170px] items-center gap-3">
                            {rental.equipmentImage ? (
                              <img
                                src={rental.equipmentImage}
                                alt={rental.equipmentTitle || "Equipment"}
                                className="h-12 w-12 rounded-lg border object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}

                            <div>
                              <p className="font-medium">
                                {rental.equipmentTitle || "Unknown Equipment"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {rental.quantity || 1}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="min-w-[150px]">
                            <p className="flex items-center gap-1 font-medium">
                              <UserRound className="h-3.5 w-3.5" />
                              {rental.customerName || "N/A"}
                            </p>
                            <p className="break-all text-xs text-muted-foreground">
                              {rental.customerEmail || "N/A"}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          {rental.ownerName || "N/A"}
                        </TableCell>

                        <TableCell>
                          <div className="min-w-[130px] text-sm">
                            <p className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                              {formatDate(rental.startDate)}
                            </p>
                            <p className="mt-1 text-muted-foreground">
                              to {formatDate(rental.endDate)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {rental.rentalDays || 0} days
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="font-semibold">
                          {formatPrice(rental.totalAmount)}
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[rental.status] || "bg-muted text-muted-foreground"}`}
                          >
                            {getStatusIcon(rental.status)}
                            {rental.status}
                          </span>
                        </TableCell>

                        <TableCell>
                          <Select
                            value={rental.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                rental._id,
                                value as RentalStatus
                              )
                            }
                            disabled={updatingId === rental._id}
                          >
                            <SelectTrigger className="w-[135px]">
                              {updatingId === rental._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              {statuses.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item.charAt(0).toUpperCase() + item.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {rentals.length} of {total} rentals
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((previous) => previous - 1)}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                  </Button>

                  <span className="text-sm font-medium">
                    {page} / {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((previous) => previous + 1)}
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
