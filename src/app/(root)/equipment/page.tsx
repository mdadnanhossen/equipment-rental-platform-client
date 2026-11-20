
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Equipment } from "@/types/equipment";
import { getAllEquipment } from "@/lib/api/equipment";

export default function AllEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<
    "newest" | "price-low" | "price-high"
  >("newest");

  useEffect(() => {
    let cancelled = false;

    async function fetchEquipment() {
      try {
        setLoading(true);
        setError("");

        const result = await getAllEquipment({
          search,
          category,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          sortBy,
          page: 1,
          limit: 12,
        });

        if (!cancelled) {
          setEquipment(result.data || []);
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
  }, [search, category, minPrice, maxPrice, sortBy]);

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-5 py-10">
      <div>
        <h1 className="text-3xl font-bold">Explore Equipment</h1>
        <p className="mt-2 text-gray-500">
          Find the right equipment for your next project.
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="search"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          onChange={(e) =>
            setSortBy(
              e.target.value as "newest" | "price-low" | "price-high"
            )
          }
          className="rounded-lg border p-3"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Equipment list */}
      {loading ? (
        <p className="py-10 text-center">Loading equipment...</p>
      ) : error ? (
        <p className="rounded-lg bg-red-50 p-4 text-center text-red-600">
          {error}
        </p>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {equipment.map((item) => (
            <Link
              key={item._id}
              href={`/equipment/${item._id}`}
              className="overflow-hidden rounded-xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
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

              <div className="space-y-2 p-4">
                <p className="text-xs text-gray-500">
                  {item.category}
                </p>

                <h2 className="font-semibold">
                  {item.title}
                </h2>

                <p className="text-sm text-gray-500">
                  {item.location?.city}
                </p>

                <p className="font-bold">
                  ৳{item.pricePerDay}
                  <span className="font-normal text-gray-500">
                    {" "}/ day
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
