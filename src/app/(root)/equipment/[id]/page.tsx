
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Equipment } from "@/types/equipment";
import RentalRequestForm from "@/components/equipment/RentalRequestForm";
import FavoriteButton from "@/components/equipment/favorite-button";
import { getEquipmentById } from "@/lib/api/equipment";

export default function EquipmentDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchDetails() {
      try {
        setLoading(true);
        setError("");

        const data = await getEquipmentById(id);

        if (!cancelled) {
          setEquipment(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load equipment"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) fetchDetails();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading equipment details...
      </div>
    );
  }

  if (error || !equipment) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold">
          Equipment not found
        </h2>
        <p className="mt-2 text-sm text-red-500">
          {error}
        </p>
        <Link
          href="/equipment"
          className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
        >
          Back to Equipment
        </Link>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <Link
        href="/equipment"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-black"
      >
        ← Back to Equipment
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
          {equipment.images?.length > 0 ? (
            <>
              <img
                src={equipment.images[selectedImage]?.url}
                alt={equipment.title}
                className="h-[400px] w-full rounded-xl object-cover"
              />

              <div className="mt-4 grid grid-cols-4 gap-3">
                {equipment.images.map((image, index) => (
                  <button
                    key={image.publicId || image.url}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-lg border-2 ${
                      selectedImage === index
                        ? "border-black"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${equipment.title} ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              No image available
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {equipment.category}
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  {equipment.title}
                </h1>
              </div>

              <FavoriteButton equipmentId={equipment._id} />
            </div>

            <p className="mt-3 text-gray-500">
              {equipment.location.city},{" "}
              {equipment.location.address}
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Rental Price
              </p>

              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                {equipment.rentalType || "daily"} rental
              </span>
            </div>

            <p className="mt-1 text-3xl font-bold">
              ৳{equipment.pricePerDay}
              <span className="text-base font-normal text-gray-500">
                {" "}/ day
              </span>
            </p>

            <div className="mt-3 space-y-1 text-sm text-gray-500">
              <p>
                Available Quantity:{" "}
                <span className="font-medium text-gray-700">
                  {equipment.quantity || 1} unit(s)
                </span>
              </p>

              {equipment.securityDeposit !== undefined && (
                <p>
                  Security Deposit: ৳{equipment.securityDeposit}
                </p>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold">
              Equipment Description
            </h2>
            <p className="whitespace-pre-line leading-7 text-gray-600">
              {equipment.description}
            </p>
          </div>

          <div className="space-y-3 border-t pt-5">
            <h2 className="text-lg font-semibold">
              Equipment Information
            </h2>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-gray-500">Brand</span>
              <span>{equipment.brand || "Not specified"}</span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-gray-500">Model</span>
              <span>{equipment.model || "Not specified"}</span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-gray-500">Condition</span>
              <span className="capitalize">
                {equipment.condition}
              </span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-gray-500">Rental Type</span>
              <span className="capitalize">
                {equipment.rentalType || "daily"}
              </span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-gray-500">Quantity</span>
              <span>{equipment.quantity || 1} unit(s)</span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-gray-500">Owner</span>
              <span>{equipment.ownerName}</span>
            </div>

            <div className="flex justify-between gap-3 text-sm">
              <span className="text-gray-500">Availability</span>
              <span
                className={
                  equipment.availability === "available"
                    ? "font-medium text-green-600"
                    : "font-medium text-red-600"
                }
              >
                {equipment.availability}
              </span>
            </div>
          </div>

          {/* Rental terms & conditions */}
          <div className="rounded-xl border p-5">
            <h2 className="text-lg font-semibold">
              Rental Terms &amp; Conditions
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
              {equipment.rentalTerms?.trim() ||
                "No specific terms provided by the owner. Standard marketplace rules apply: return the equipment on time, in the same condition, and pay the security deposit upfront."}
            </p>
          </div>

          {equipment.availability === "available" ? (
  <RentalRequestForm equipment={equipment} />
) : (
  <button
    type="button"
    disabled
    className="w-full rounded-lg bg-gray-400 px-5 py-4 font-semibold text-white"
  >
    Currently Unavailable
  </button>
)}
        </div>
      </div>
    </main>
  );
}
