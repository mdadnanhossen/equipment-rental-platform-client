
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  Package,
  ClipboardList,
  Clock,
  CheckCircle2,
  Wallet,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AdminAnalytics {
  users: {
    total: number;
    newThisMonth: number;
  };
  equipment: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  rentals: {
    total: number;
    pending: number;
    approved: number;
    completed: number;
    thisMonth: number;
    byStatus: Record<string, number>;
  };
  revenue: {
    total: number;
    paidTransactions: number;
  };
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: AdminAnalytics;
}

const formatBDT = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const AdminDashboard = () => {
  const [analytics, setAnalytics] =
    useState<AdminAnalytics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/analytics`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load admin analytics"
        );
      }

      setAnalytics(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const stats = analytics
    ? [
        {
          title: "Total Users",
          value: analytics.users.total,
          description: `+${analytics.users.newThisMonth} new this month`,
          icon: Users,
          color: "bg-blue-50 text-blue-600",
        },
        {
          title: "Total Equipment",
          value: analytics.equipment.total,
          description: `${analytics.equipment.approved} approved listings`,
          icon: Package,
          color: "bg-purple-50 text-purple-600",
        },
        {
          title: "Pending Approvals",
          value: analytics.equipment.pending,
          description: "Equipment waiting for review",
          icon: Clock,
          color: "bg-amber-50 text-amber-600",
        },
        {
          title: "Total Bookings",
          value: analytics.rentals.total,
          description: `${analytics.rentals.thisMonth} bookings this month`,
          icon: ClipboardList,
          color: "bg-indigo-50 text-indigo-600",
        },
        {
          title: "Completed Rentals",
          value: analytics.rentals.completed,
          description: "Successfully completed rentals",
          icon: CheckCircle2,
          color: "bg-green-50 text-green-600",
        },
        {
          title: "Total Revenue",
          value: formatBDT(analytics.revenue.total),
          description: `${analytics.revenue.paidTransactions} paid transactions`,
          icon: Wallet,
          color: "bg-emerald-50 text-emerald-600",
        },
      ]
    : [];

  const equipmentStatuses = analytics
    ? [
        {
          label: "Approved",
          value: analytics.equipment.approved,
          color: "bg-green-500",
        },
        {
          label: "Pending",
          value: analytics.equipment.pending,
          color: "bg-amber-500",
        },
        {
          label: "Rejected",
          value: analytics.equipment.rejected,
          color: "bg-red-500",
        },
      ]
    : [];

  const rentalStatuses = analytics
    ? [
        { label: "Pending", value: analytics.rentals.byStatus.pending || 0 },
        { label: "Approved", value: analytics.rentals.byStatus.approved || 0 },
        { label: "Active", value: analytics.rentals.byStatus.active || 0 },
        { label: "Completed", value: analytics.rentals.byStatus.completed || 0 },
        { label: "Rejected", value: analytics.rentals.byStatus.rejected || 0 },
        { label: "Cancelled", value: analytics.rentals.byStatus.cancelled || 0 },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-5">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />

          <h2 className="text-xl font-bold">
            Unable to Load Dashboard
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error || "Dashboard information is unavailable."}
          </p>

          <button
            onClick={fetchAnalytics}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const equipmentTotal = analytics.equipment.total || 1;
  const rentalTotal = analytics.rentals.total || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <ShieldCheck className="h-4 w-4" />
            Platform Administration
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor users, equipment, bookings and platform revenue.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Monthly Overview */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <TrendingUp className="h-6 w-6" />
            </div>

            <div>
              <h2 className="font-bold">Monthly Overview</h2>
              <p className="text-sm text-muted-foreground">
                Platform activity this month
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  New Users
                </p>
                <p className="mt-1 text-xl font-bold">
                  {analytics.users.newThisMonth}
                </p>
              </div>

              <Users className="h-7 w-7 text-blue-500" />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  New Bookings
                </p>
                <p className="mt-1 text-xl font-bold">
                  {analytics.rentals.thisMonth}
                </p>
              </div>

              <ClipboardList className="h-7 w-7 text-indigo-500" />
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Counts are based on records created during the current month.
          </p>
        </section>

        {/* Equipment Status */}
        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="font-bold">Equipment Overview</h2>
            <p className="text-sm text-muted-foreground">
              Listing approval status
            </p>
          </div>

          <div className="mb-5 flex h-4 overflow-hidden rounded-full bg-muted">
            {equipmentStatuses.map((item) => (
              <div
                key={item.label}
                className={`${item.color} transition-all`}
                style={{
                  width: `${(item.value / equipmentTotal) * 100}%`,
                }}
              />
            ))}
          </div>

          <div className="space-y-4">
            {equipmentStatuses.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${item.color}`}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>

                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Rental Status */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="font-bold">Rental Status Overview</h2>
          <p className="text-sm text-muted-foreground">
            Current booking distribution across the platform
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rentalStatuses.map((item) => {
            const percentage =
              (item.value / rentalTotal) * 100;

            return (
              <div
                key={item.label}
                className="rounded-xl border p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {item.label}
                  </p>

                  <span className="text-lg font-bold">
                    {item.value}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {percentage.toFixed(1)}% of all bookings
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Revenue Summary */}
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Wallet className="h-7 w-7" />
            </div>

            <div>
              <h2 className="font-bold">Platform Revenue</h2>
              <p className="text-sm text-muted-foreground">
                Total successful payments
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-2xl font-bold text-emerald-600">
              {formatBDT(analytics.revenue.total)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {analytics.revenue.paidTransactions} successful transactions
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
