"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface PaymentData {
  rentalId: string;
  equipmentTitle: string;
  paymentStatus: string;
  rentalStatus: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  transactionExists: boolean;
}

export default function PaymentSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPaymentStatus = useCallback(async () => {
    if (!sessionId) {
      setError("Payment session ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/payments/session-status?session_id=${encodeURIComponent(sessionId)}`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to verify payment status."
        );
      }

      setPayment(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchPaymentStatus();
  }, [fetchPaymentStatus]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
          <h1 className="text-xl font-semibold">
            Verifying your payment...
          </h1>
          <p className="mt-2 text-gray-500">
            Please wait while we check your transaction.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Payment Verification Failed
          </h1>

          <p className="mt-3 text-gray-600">{error}</p>

          <button
            onClick={fetchPaymentStatus}
            className="mt-6 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!payment) return null;

  if (payment.paymentStatus !== "paid") {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-yellow-600">
            Payment Pending
          </h1>

          <p className="mt-3 text-gray-600">
            Your payment has not been confirmed yet.
            Please check again shortly.
          </p>

          <button
            onClick={fetchPaymentStatus}
            className="mt-6 rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
          >
            Check Payment Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border p-8 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold text-green-600">
          Payment Successful!
        </h1>

        <p className="mt-3 text-gray-600">
          Your payment has been verified successfully.
        </p>

        <div className="mt-8 space-y-4 rounded-xl bg-gray-50 p-5 text-left">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Equipment</span>
            <span className="font-semibold">
              {payment.equipmentTitle}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-semibold">
              {payment.currency.toUpperCase()}{" "}
              {payment.amount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Payment Status</span>
            <span className="font-semibold text-green-600">
              Paid
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-gray-500">Rental Status</span>
            <span className="font-semibold capitalize">
              {payment.rentalStatus}
            </span>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500">
              Transaction Rental ID
            </p>
            <p className="mt-1 break-all text-sm font-medium">
              {payment.rentalId}
            </p>
          </div>
        </div>

        <a
          href="/dashboard/customer/rentals"
          className="mt-8 inline-block w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
        >
          Go to My Rentals
        </a>
      </div>
    </main>
  );
}