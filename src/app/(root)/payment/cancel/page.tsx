
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function PaymentCancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rentalId = searchParams.get("rentalId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTryAgain = async () => {
    if (!rentalId) {
      setError("Rental ID is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/payments/create-checkout-session",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rentalId }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to create checkout session."
        );
      }

      if (!result.checkoutUrl) {
        throw new Error("Checkout URL was not returned.");
      }

      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border p-8 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-4xl text-red-600">
          ✕
        </div>

        <h1 className="mt-6 text-3xl font-bold text-red-600">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-gray-600">
          Your payment was not completed. Your rental request
          remains unchanged. You can try again whenever you are ready.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleTryAgain}
          disabled={loading || !rentalId}
          className="mt-7 w-full rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Redirecting..." : "Try Again"}
        </button>

        <button
          onClick={() => router.push("/dashboard/customer/rentals")}
          className="mt-3 w-full rounded-lg border px-6 py-3 font-semibold hover:bg-gray-50"
        >
          Back to My Rentals
        </button>
      </div>
    </main>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
