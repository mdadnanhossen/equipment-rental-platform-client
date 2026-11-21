
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Equipment } from "@/types/equipment";
import { useSession } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

/**
 * Booking modal for a single equipment listing.
 *
 * Collects start/end dates, quantity, contact number, delivery address and
 * additional notes, shows the duration + total estimate live, validates
 * availability, and requires an accepted copy of the owner's rental terms.
 */
export default function RentalRequestForm({ equipment }: Props) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const availableQuantity = equipment.quantity || 1;

  const rentalDays =
    startDate && endDate
      ? Math.ceil(
          (Date.parse(endDate) - Date.parse(startDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  const rentalAmount =
    rentalDays > 0
      ? rentalDays * equipment.pricePerDay * quantity
      : 0;

  const securityDeposit = equipment.securityDeposit || 0;
  const isAvailable = equipment.availability === "available";

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

    if (!Number.isInteger(quantity) || quantity < 1) {
      setMessage("Quantity must be at least 1.");
      return;
    }

    if (quantity > availableQuantity) {
      setMessage(
        `Only ${availableQuantity} unit(s) available.`
      );
      return;
    }

    if (!contactNumber.trim()) {
      setMessage("Contact number is required.");
      return;
    }

    if (!termsAccepted) {
      setMessage("Please accept the rental terms to continue.");
      return;
    }

    // Authentication: anonymous users must sign in first.
    if (!isPending && !session) {
      router.push("/signin");
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
          quantity,
          contactNumber: contactNumber.trim(),
          deliveryAddress: deliveryAddress.trim(),
          notes: notes.trim(),
        }),
      });

      const result = await response.json();

      if (response.status === 401) {
        router.push("/signin");
        return;
      }

      if (!response.ok) {
        throw new Error(result.message || "Rental request failed.");
      }

      setSuccess(true);
      setMessage("Rental request submitted successfully!");
      setStartDate("");
      setEndDate("");
      setQuantity(1);
      setDeliveryAddress("");
      setNotes("");
      setTermsAccepted(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="w-full" size="lg" />}>
        {isAvailable ? "Rent This Equipment" : "Currently Unavailable"}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {equipment.title}</DialogTitle>
          <DialogDescription>
            ৳{equipment.pricePerDay.toLocaleString()} / day ·{" "}
            {availableQuantity} unit(s) available
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Quantity
            </label>
            <input
              type="number"
              min={1}
              max={availableQuantity}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, Number(e.target.value) || 1))
              }
              className="w-full rounded-lg border bg-background px-3 py-2"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {availableQuantity} unit(s) in stock
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Contact Number *
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="+880 1XXX XXXXXX"
              className="w-full rounded-lg border bg-background px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Delivery Address
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Where should the equipment be delivered?"
              maxLength={300}
              className="w-full rounded-lg border bg-background px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything the owner should know..."
              maxLength={1000}
              rows={3}
              className="w-full rounded-lg border bg-background px-3 py-2"
            />
          </div>

          {rentalDays > 0 && (
            <div className="space-y-2 rounded-lg bg-muted p-4">
              <div className="flex justify-between text-sm">
                <span>Rental Duration</span>
                <span>{rentalDays} days</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>
                  Rental Amount ({quantity} × {rentalDays} days × ৳
                  {equipment.pricePerDay.toLocaleString()})
                </span>
                <span>৳{rentalAmount.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Security Deposit</span>
                <span>৳{securityDeposit.toLocaleString()}</span>
              </div>

              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Estimated Total</span>
                <span>
                  ৳
                  {(rentalAmount + securityDeposit).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Rental terms & conditions from the owner */}
          <div className="rounded-lg border p-4">
            <p className="mb-2 text-sm font-semibold">
              Rental Terms &amp; Conditions
            </p>
            <p className="max-h-28 overflow-y-auto whitespace-pre-line text-xs text-muted-foreground">
              {equipment.rentalTerms?.trim() ||
                "No specific terms provided by the owner. Standard marketplace rules apply: return the equipment on time, in the same condition, and pay the security deposit upfront."}
            </p>

            <label className="mt-3 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1"
                required
              />
              <span>
                I have read and accept the rental terms &
                conditions
              </span>
            </label>
          </div>

          {!isAvailable && (
            <p className="text-sm font-medium text-red-500">
              This equipment is currently unavailable for booking.
            </p>
          )}

          {message && (
            <p
              className={`text-sm ${
                success ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
              {success && (
                <Link
                  href="/dashboard/customer/rentals"
                  className="ml-2 underline"
                >
                  View My Rentals
                </Link>
              )}
            </p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || !isAvailable}
              className="w-full sm:w-auto"
            >
              {loading ? "Submitting..." : "Send Rental Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
