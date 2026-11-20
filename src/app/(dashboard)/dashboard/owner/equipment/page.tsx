
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Equipment } from "@/types/equipment";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MyEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchMyEquipment() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/equipment/my-equipment`,
        { credentials: "include" }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load equipment");
      }

      setEquipment(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyEquipment();
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this equipment?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/equipment/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete equipment");
      }

      setEquipment((previous) =>
        previous.filter((item) => item._id !== id)
      );

      setSuccess("Equipment deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete equipment"
      );
    } finally {
      setDeletingId(null);
    }
  }

  const statusStyle: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  if (loading) {
    return <div className="p-6">Loading your equipment...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">My Equipment</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your equipment listings.
          </p>
        </div>

        <Link
          href="/dashboard/owner/equipment/add"
          className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
        >
          + Add Equipment
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </p>
      )}

      {equipment.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="text-lg font-semibold">No equipment found</h2>
          <p className="mt-2 text-sm text-gray-500">
            You have not added any equipment yet.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Total listings: {equipment.length}
          </p>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                {item.images?.[0]?.url ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
                    No image available
                  </div>
                )}

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold">{item.title}</h2>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        statusStyle[item.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500">
                    {item.category} · {item.condition}
                  </p>

                  <p className="font-semibold">
                    ৳{item.pricePerDay} / day
                  </p>

                  <p className="text-sm text-gray-500">
                    {item.location?.city}
                  </p>

                  {item.status === "rejected" &&
                    item.rejectionReason && (
                      <p className="rounded-lg bg-red-50 p-2 text-sm text-red-600">
                        Reason: {item.rejectionReason}
                      </p>
                    )}

<Link
  href={`/dashboard/owner/equipment/${item._id}/edit`}
  className="block w-full rounded-lg border border-blue-500 px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50"
>
  Edit Equipment
</Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="w-full rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingId === item._id
                      ? "Deleting..."
                      : "Delete Equipment"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
