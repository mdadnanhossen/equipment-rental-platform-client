
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Package,
  ClipboardList,
  Clock,
  CheckCircle2,
  Wallet,
  TrendingUp,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Equipment {
  _id: string;
  title: string;
  status: string;
  pricePerDay: number;
}

interface RentalRequest {
  _id: string;
  equipmentTitle: string;
  customerName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

interface Payment {
  _id: string;
  equipmentTitle: string;
  customerName: string;
  amount: number;
  paymentStatus: string;
  paidAt?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

const formatBDT = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

async function fetchData<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result: ApiResponse<T[]> = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Failed to load data");
  }

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid API response");
  }

  return result.data;
}

const OwnerDashboard = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const loadDashboard = async () => {
    setLoading(true);
    setErrors([]);

    const results = await Promise.allSettled([
      fetchData<Equipment>("/api/equipment/my-equipment"),
      fetchData<RentalRequest>("/api/owner/rentals/my-requests"),
      fetchData<Payment>("/api/payments/owner/history"),
    ]);

    const messages: string[] = [];

    if (results[0].status === "fulfilled") {
      setEquipment(results[0].value);
    } else {
      messages.push("Equipment data could not be loaded.");
    }

    if (results[1].status === "fulfilled") {
      setRentals(results[1].value);
    } else {
      messages.push("Rental requests could not be loaded.");
    }

    if (results[2].status === "fulfilled") {
      setPayments(results[2].value);
    } else {
      messages.push("Payment history could not be loaded.");
    }

    setErrors(messages);
    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const paidPayments = payments.filter(
      (payment) =>
        payment.paymentStatus === "paid" &&
        Number.isFinite(Number(payment.amount))
    );

    const totalEarnings = paidPayments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    );

    return {
      totalEquipment: equipment.length,
      totalRequests: rentals.length,
      pendingRequests: rentals.filter(
        (rental) => rental.status === "pending"
      ).length,
      completedRentals: rentals.filter(
        (rental) => rental.status === "completed"
      ).length,
      totalEarnings,
    };
  }, [equipment, rentals, payments]);

  const monthlyEarnings = useMemo(() => {
    const months: {
      label: string;
      year: number;
      month: number;
      amount: number;
    }[] = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        label: date.toLocaleDateString("en-US", {
          month: "short",
        }),
        year: date.getFullYear(),
        month: date.getMonth(),
        amount: 0,
      });
    }

    payments.forEach((payment) => {
      if (
        payment.paymentStatus !== "paid" ||
        !payment.paidAt
      ) {
        return;
      }

      const paidDate = new Date(payment.paidAt);

      if (Number.isNaN(paidDate.getTime())) return;

      const month = months.find(
        (item) =>
          item.year === paidDate.getFullYear() &&
          item.month === paidDate.getMonth()
      );

      if (month) {
        month.amount += Number(payment.amount) || 0;
      }
    });

    return months;
  }, [payments]);

  const maxMonthlyEarning = Math.max(
    ...monthlyEarnings.map((item) => item.amount),
    1
  );

  const statCards = [
    {
      title: "Total Equipment",
      value: stats.totalEquipment,
      description: "Your listed equipment",
      icon: Package,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Rental Requests",
      value: stats.totalRequests,
      description: "Total rental requests",
      icon: ClipboardList,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      description: "Waiting for your response",
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Completed Rentals",
      value: stats.completedRentals,
      description: "Successfully completed",
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Earnings",
      value: formatBDT(stats.totalEarnings),
      description: "From successful payments",
      icon: Wallet,
      color: "bg-emerald-50 text-emerald-600",
    },
  ];

  const recentRentals = [...rentals]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading owner dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Owner Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your equipment, rental requests and earnings.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* API errors */}
      {errors.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-2 font-semibold text-amber-800">
            Some dashboard information could not be loaded:
          </p>
          {errors.map((error) => (
            <p key={error} className="text-sm text-amber-700">
              • {error}
            </p>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Monthly Earnings */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <TrendingUp className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Monthly Earnings
            </h2>
            <p className="text-sm text-gray-500">
              Successful payments over the last six months
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {monthlyEarnings.map((item) => (
            <div
              key={`${item.year}-${item.month}`}
              className="grid grid-cols-[45px_1fr_auto] items-center gap-3"
            >
              <span className="text-sm font-medium text-gray-500">
                {item.label}
              </span>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${
                      (item.amount / maxMonthlyEarning) * 100
                    }%`,
                  }}
                />
              </div>

              <span className="min-w-[75px] text-right text-sm font-semibold text-gray-800">
                {formatBDT(item.amount)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Rental Requests */}
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Rental Requests
            </h2>
            <p className="text-sm text-gray-500">
              Your latest customer requests
            </p>
          </div>

          <Link
            href="/dashboard/owner/rental-requests"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentRentals.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            No rental requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Equipment</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentRentals.map((rental) => (
                  <tr key={rental._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {rental.equipmentTitle}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {rental.customerName}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {formatBDT(Number(rental.totalAmount) || 0)}
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      {formatDate(rental.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          rental.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : rental.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : rental.status === "rejected" ||
                              rental.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default OwnerDashboard;
