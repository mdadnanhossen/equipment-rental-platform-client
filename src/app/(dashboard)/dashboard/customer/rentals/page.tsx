
"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Rental {
  _id: string;
  equipmentTitle: string;
  equipmentImage?: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  pricePerDay: number;
  securityDeposit: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function CustomerRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/rentals/my-rentals`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch rentals");
      }

      setRentals(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  // Stripe Checkout
  const handlePayNow = async (rentalId: string) => {
    try {
      setProcessingId(rentalId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
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
          result.message || "Failed to create checkout session"
        );
      }

      if (!result.checkoutUrl) {
        throw new Error("Stripe Checkout URL not found");
      }

      window.location.href = result.checkoutUrl;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment failed"
      );
      setProcessingId(null);
    }
  };

  const cancelRental = async (rentalId: string) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) {
      return;
    }

    try {
      setProcessingId(rentalId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/rentals/${rentalId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel rental");
      }

      setMessage(result.message);
      await fetchRentals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  const openEditForm = (rental: Rental) => {
    setEditingId(rental._id);
    setStartDate(rental.startDate.slice(0, 10));
    setEndDate(rental.endDate.slice(0, 10));
    setMessage("");
    setError("");
  };

  const updateRental = async (rentalId: string) => {
    if (!startDate || !endDate) {
      setError("Please select both dates");
      return;
    }

    try {
      setProcessingId(rentalId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/api/rentals/${rentalId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ startDate, endDate }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update rental");
      }

      setMessage(result.message);
      setEditingId(null);
      await fetchRentals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading your rentals...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">My Rentals</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage your equipment rental requests.
        </p>
      </div>

      {message && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {rentals.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="font-semibold">No rentals found</h2>
          <p className="mt-2 text-sm text-gray-500">
            Browse equipment and send your first rental request.
          </p>
          <a
            href="/equipment"
            className="mt-4 inline-block rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white"
          >
            Browse Equipment
          </a>
        </div>
      ) : (
        <div className="grid gap-5">
          {rentals.map((rental) => (
            <div
              key={rental._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row">
                {rental.equipmentImage && (
                  <img
                    src={rental.equipmentImage}
                    alt={rental.equipmentTitle}
                    className="h-28 w-full rounded-lg object-cover sm:w-36"
                  />
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">
                      {rental.equipmentTitle}
                    </h2>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                      {rental.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">
                    Start Date: {rental.startDate.slice(0, 10)}
                  </p>

                  <p className="text-sm text-gray-600">
                    End Date: {rental.endDate.slice(0, 10)}
                  </p>

                  <p className="text-sm text-gray-600">
                    Duration: {rental.rentalDays} days
                  </p>

                  <div className="space-y-1 border-t pt-3 text-sm">
                    <p>Price per day: ৳{rental.pricePerDay}</p>
                    <p>Rental amount: ৳{rental.totalAmount}</p>
                    <p>Security deposit: ৳{rental.securityDeposit}</p>

                    <p className="font-semibold capitalize">
                      Payment: {rental.paymentStatus}
                    </p>
                  </div>

                  {/* Pay Now Button */}
                  {rental.status === "approved" &&
                    rental.paymentStatus === "unpaid" && (
                      <div className="pt-3">
                        <button
                          onClick={() => handlePayNow(rental._id)}
                          disabled={processingId === rental._id}
                          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {processingId === rental._id
                            ? "Redirecting..."
                            : "Pay Now"}
                        </button>
                      </div>
                    )}

                  {rental.paymentStatus === "paid" && (
                    <div className="pt-3">
                      <span className="inline-block rounded-lg bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                        ✓ Payment Completed
                      </span>
                    </div>
                  )}

                  {rental.status === "pending" && (
                    <div className="flex flex-wrap gap-3 pt-3">
                      <button
                        onClick={() => openEditForm(rental)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                      >
                        Edit Request
                      </button>

                      <button
                        onClick={() => cancelRental(rental._id)}
                        disabled={processingId === rental._id}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        {processingId === rental._id
                          ? "Processing..."
                          : "Cancel Request"}
                      </button>
                    </div>
                  )}

                  {editingId === rental._id && (
                    <div className="mt-4 space-y-4 rounded-lg border bg-gray-50 p-4">
                      <h3 className="font-semibold">Edit Rental Dates</h3>

                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={new Date().toISOString().slice(0, 10)}
                          className="w-full rounded-lg border bg-white p-2"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || new Date().toISOString().slice(0, 10)}
                          className="w-full rounded-lg border bg-white p-2"
                        />
                      </div>

                      <p className="text-sm text-gray-600">
                        New duration:{" "}
                        {startDate && endDate && endDate > startDate
                          ? (Date.parse(endDate) - Date.parse(startDate)) /
                            86400000
                          : 0}{" "}
                        days
                      </p>

                      <p className="text-sm font-semibold">
                        New rental amount: ৳
                        {startDate && endDate && endDate > startDate
                          ? ((Date.parse(endDate) - Date.parse(startDate)) /
                              86400000) *
                            rental.pricePerDay
                          : 0}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => updateRental(rental._id)}
                          disabled={processingId === rental._id}
                          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                        >
                          {processingId === rental._id
                            ? "Saving..."
                            : "Save Changes"}
                        </button>

                        <button
                          onClick={() => setEditingId(null)}
                          disabled={processingId === rental._id}
                          className="rounded-lg border px-4 py-2 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
