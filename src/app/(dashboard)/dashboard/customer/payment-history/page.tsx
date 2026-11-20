
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Payment {
  _id: string;
  rentalId: string;
  equipmentTitle: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  transactionId: string | null;
  paidAt: string | null;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  data: Payment[];
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/payments/history`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result: PaymentResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to fetch payment history"
        );
      }

      setPayments(result.data || []);
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
    fetchPayments();
  }, [fetchPayments]);

  const totalPaid = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Customer Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Payment History
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          View all your equipment rental payments and transactions.
        </p>
      </div>

      {/* Summary */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Payments
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {payments.length}
            </h2>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Amount Paid
            </p>

            <h2 className="mt-2 text-2xl font-bold text-green-600">
              {formatAmount(totalPaid, "bdt")}
            </h2>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Loading payment history...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="font-medium text-red-600">{error}</p>

          <button
            onClick={fetchPayments}
            className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && payments.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-gray-800">
            ৳
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            No Payment History
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Your completed rental payments will appear here.
          </p>

          <Link
            href="/browse-equipment"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Browse Equipment
          </Link>
        </div>
      )}

      {/* Payment Table */}
      {!loading && !error && payments.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-5 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {payments.length} transaction(s) found
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-5 py-4">Equipment</th>
                  <th className="px-5 py-4">Transaction ID</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Payment Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Rental ID</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                      {payment.equipmentTitle}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="font-mono text-xs text-gray-600 dark:text-gray-300"
                        title={payment.transactionId || ""}
                      >
                        {payment.transactionId
                          ? `${payment.transactionId.slice(0, 14)}...`
                          : "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                      {formatAmount(
                        payment.amount,
                        payment.currency
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                      {formatDate(payment.paidAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {payment.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="font-mono text-xs text-gray-600 dark:text-gray-300"
                        title={payment.rentalId}
                      >
                        {payment.rentalId.slice(0, 10)}...
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/customer/rentals"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to My Rentals
        </Link>
      </div>
    </div>
  );
}
