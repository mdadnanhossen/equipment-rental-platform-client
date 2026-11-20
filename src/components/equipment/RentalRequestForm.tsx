
"use client";

import { useState } from "react";
import type { Equipment } from "@/types/equipment";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  equipment: Equipment;
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function RentalRequestForm({ equipment }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const rentalDays =
    startDate && endDate
      ? Math.ceil(
          (Date.parse(endDate) - Date.parse(startDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalAmount =
    rentalDays > 0
      ? rentalDays * equipment.pricePerDay
      : 0;

  const securityDeposit = equipment.securityDeposit || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!startDate || !endDate) {
      setMessage("Please select both rental dates.");
      return;
    }

    if (rentalDays < 1) {
      setMessage("End date must be after start date.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/rentals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          equipmentId: equipment._id,
          startDate,
          endDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Rental request failed.");
      }

      setSuccess(true);
      setMessage("Rental request submitted successfully!");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card p-5 space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Rent This Equipment</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          ৳{equipment.pricePerDay.toLocaleString()} / day
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Start Date
          </label>
          <input
            type="date"
            min={getTodayDate()}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            End Date
          </label>
          <input
            type="date"
            min={startDate || getTodayDate()}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2"
            required
          />
        </div>

        {rentalDays > 0 && (
          <div className="space-y-2 rounded-lg bg-muted p-4">
            <div className="flex justify-between text-sm">
              <span>Rental Duration</span>
              <span>{rentalDays} days</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Rental Amount</span>
              <span>৳{totalAmount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Security Deposit</span>
              <span>৳{securityDeposit.toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Estimated Total</span>
              <span>
                ৳{(totalAmount + securityDeposit).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {message && (
          <p
            className={`text-sm ${
              success ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || equipment.availability !== "available"}
          className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Send Rental Request"}
        </button>
      </form>
    </div>
  );
}
