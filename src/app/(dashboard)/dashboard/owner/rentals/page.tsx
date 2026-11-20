
"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RentalRequest {
  _id: string;
  equipmentTitle: string;
  equipmentImage?: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  pricePerDay: number;
  securityDeposit: number;
  totalAmount: number;
  status: "pending" | "approved" | "rejected" | "active" | "completed" | "cancelled";
  paymentStatus: string;
  createdAt: string;
}

export default function OwnerRentalRequestsPage() {
  const [rentals, setRentals] = useState<RentalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/owner/rentals/my-requests`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch rental requests");
      }

      setRentals(result.data || []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const updateRentalStatus = async (
    rentalId: string,
    action: "approve" | "reject"
  ) => {
    try {
      setProcessingId(rentalId);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/owner/rentals/${rentalId}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update rental");
      }

      setMessage(result.message);
      await fetchRentals();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading rental requests...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Rental Requests</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage rental requests for your equipment.
        </p>
      </div>

      {message && (
        <p className="rounded-lg bg-gray-100 p-3 text-sm text-gray-700">
          {message}
        </p>
      )}

      {rentals.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="font-semibold">No rental requests found</h2>
          <p className="mt-2 text-sm text-gray-500">
            New rental requests will appear here.
          </p>
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
                    Customer: {rental.customerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {rental.customerEmail}
                  </p>
                  <p className="text-sm text-gray-600">
                    Dates: {rental.startDate.slice(0, 10)} to{" "}
                    {rental.endDate.slice(0, 10)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {rental.rentalDays} days
                  </p>

                  <div className="pt-2 text-sm">
                    <p>Price per day: ৳{rental.pricePerDay}</p>
                    <p>Rental amount: ৳{rental.totalAmount}</p>
                    <p>Security deposit: ৳{rental.securityDeposit}</p>
                    <p className="font-semibold">
                      Payment: {rental.paymentStatus}
                    </p>
                  </div>

                  {rental.status === "pending" && (
                    <div className="flex flex-wrap gap-3 pt-3">
                      <button
                        onClick={() =>
                          updateRentalStatus(rental._id, "approve")
                        }
                        disabled={processingId === rental._id}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        {processingId === rental._id
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        onClick={() =>
                          updateRentalStatus(rental._id, "reject")
                        }
                        disabled={processingId === rental._id}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                      >
                        Reject
                      </button>
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
