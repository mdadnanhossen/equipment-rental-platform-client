
"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Rental {
  _id: string;
  equipmentTitle: string;
  equipmentImage?: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  quantity?: number;
  pricePerDay: number;
  securityDeposit: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

function formatDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString();
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
    return (
      <div className="p-6" role="status">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <p className="mt-3 text-center text-sm text-gray-500">
          Loading your rentals...
        </p>
      </div>
    );
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
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Equipment Name</th>
                <th className="px-4 py-3">Start Date</th>
                <th className="px-4 py-3">End Date</th>
                <th className="px-4 py-3">Booking Date</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Booking Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {rentals.map((rental) => (
                <Fragment key={rental._id}>
                  <tr className="align-top">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {rental.equipmentImage && (
                          <img
                            src={rental.equipmentImage}
                            alt={rental.equipmentTitle}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        )}

                        <div>
                          <p className="font-medium">
                            {rental.equipmentTitle}
                          </p>

                          {(rental.quantity ?? 1) > 1 && (
                            <p className="text-xs text-gray-500">
                              Quantity: {rental.quantity}
                            </p>
                          )}

                          <p className="text-xs text-gray-500">
                            {rental.rentalDays} days × ৳
                            {rental.pricePerDay}/day
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {formatDate(rental.startDate)}
                    </td>

                    <td className="px-4 py-3">
                      {formatDate(rental.endDate)}
                    </td>

                    <td className="px-4 py-3">
                      {formatDate(rental.createdAt)}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      ৳{rental.totalAmount.toLocaleString()}
                      <p className="text-xs font-normal text-gray-500">
                        + ৳{rental.securityDeposit} deposit
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          rental.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : rental.paymentStatus === "refunded"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {rental.paymentStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          rental.status === "approved"
                            ? "bg-blue-100 text-blue-700"
                            : rental.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : rental.status === "rejected" ||
                                  rental.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : rental.status === "active"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        {rental.status === "approved" &&
                          rental.paymentStatus === "unpaid" && (
                            <button
                              onClick={() => handlePayNow(rental._id)}
                              disabled={processingId === rental._id}
                              className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {processingId === rental._id
                                ? "Redirecting..."
                                : "Pay Now"}
                            </button>
                          )}

                        {rental.status === "pending" && (
                          <>
                            <button
                              onClick={() => openEditForm(rental)}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white"
                            >
                              Edit Request
                            </button>

                            <button
                              onClick={() => cancelRental(rental._id)}
                              disabled={processingId === rental._id}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                            >
                              {processingId === rental._id
                                ? "Processing..."
                                : "Cancel"}
                            </button>
                          </>
                        )}

                        {rental.paymentStatus === "paid" && (
                          <span className="text-xs font-medium text-green-700">
                            ✓ Paid
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {editingId === rental._id && (
                    <tr>
                      <td colSpan={8} className="bg-gray-50 px-4 py-4">
                        <div className="space-y-4">
                          <h3 className="font-semibold">
                            Edit Rental Dates
                          </h3>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium">
                                Start Date
                              </label>
                              <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                  setStartDate(e.target.value)
                                }
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
                                min={
                                  startDate ||
                                  new Date().toISOString().slice(0, 10)
                                }
                                className="w-full rounded-lg border bg-white p-2"
                              />
                            </div>
                          </div>

                          <p className="text-sm font-semibold">
                            New rental amount: ৳
                            {startDate && endDate && endDate > startDate
                              ? ((Date.parse(endDate) -
                                  Date.parse(startDate)) /
                                  86400000) *
                                rental.pricePerDay *
                                (rental.quantity ?? 1)
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
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
