
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Equipment } from "@/types/equipment";
import { getAllEquipment } from "@/lib/api/equipment";

const PAGE_SIZE = 9;

type SortOption = "newest" | "price-low" | "price-high";

export default function AllEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [rentalType, setRentalType] = useState("");
  const [availability, setAvailability] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Reset to the first page whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [search, category, location, rentalType, availability, minPrice, maxPrice, sortBy]);

  useEffect(() => {
    let cancelled = false;

    async function fetchEquipment() {
      try {
        setLoading(true);
        setError("");

        const result = await getAllEquipment({
          search,
          category,
          location,
          rentalType: rentalType as
            | "daily"
            | "weekly"
            | "monthly"
            | undefined,
          availability: availability as
            | "available"
            | "unavailable"
            | undefined,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          sortBy,
          page,
          limit: PAGE_SIZE,
        });

        if (!cancelled) {
          setEquipment(result.data || []);
          setTotalPages(Math.max(1, result.totalPages || 1));
          setTotal(result.total || 0);
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

    fetchEquipment();

    return () => {
      cancelled = true;
    };
  }, [
    search,
    category,
    location,
    rentalType,
    availability,
    minPrice,
    maxPrice,
    sortBy,
    page,
    reloadKey,
  ]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-5 py-10">
      <div>
        <h1 className="text-3xl font-bold">Explore Equipment</h1>
        <p className="mt-2 text-gray-500">
          Find the right equipment for your next project.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border p-3"
        />

        <input
          type="text"
          placeholder="Location (city or address)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-lg border p-3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="">All Categories</option>
          <option value="Construction">Construction</option>
          <option value="Photography">Photography</option>
          <option value="Electronics">Electronics</option>
          <option value="Tools">Tools</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={rentalType}
          onChange={(e) => setRentalType(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="">All Rental Types</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="rounded-lg border p-3"
        >
          <option value="">Any Availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>

        <input
          type="number"
          min="0"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="rounded-lg border p-3"
        />

        <input
          type="number"
          min="0"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="rounded-lg border p-3"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="rounded-lg border p-3"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Equipment list */}
      {loading ? (
        <div className="py-10 text-center" role="status">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <p className="mt-3 text-sm text-gray-500">
            Loading equipment...
          </p>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      ) : equipment.length === 0 ? (
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold">
            No equipment found
          </h2>
          <p className="mt-2 text-gray-500">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            {total} result{total === 1 ? "" : "s"}
          </p>

          {/* 3-column grid on desktop (per spec) */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {equipment.map((item) => (
              <Link
                key={item._id}
                href={`/equipment/${item._id}`}
                className="flex flex-col overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                {item.images?.[0]?.url ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gray-100 text-gray-400">
                    No image available
                  </div>
                )}

                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-gray-500">
                      {item.category}
                    </p>

                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium capitalize">
                      {item.rentalType || "daily"}
                    </span>
                  </div>

                  <h2 className="font-semibold">{item.title}</h2>

                  <p className="text-sm text-gray-500">
                    {item.location?.city}
                    {item.location?.address
                      ? `, ${item.location.address}`
                      : ""}
                  </p>

                  <p className="font-bold">
                    ৳{item.pricePerDay}
                    <span className="font-normal text-gray-500">
                      {" "}/ day
                    </span>
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span
                      className={`text-xs font-medium ${
                        item.availability === "available"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.availability === "available"
                        ? "Available"
                        : "Unavailable"}
                    </span>

                    <span className="text-sm font-medium underline">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-2 pt-4"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={
                      pageNumber === page ? "page" : undefined
                    }
                    className={`h-10 w-10 rounded-lg border text-sm ${
                      pageNumber === page
                        ? "border-black bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  setPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page >= totalPages}
                className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}
