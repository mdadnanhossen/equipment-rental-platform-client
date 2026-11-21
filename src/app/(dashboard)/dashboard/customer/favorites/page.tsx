
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeartOff } from "lucide-react";
import {
  getFavorites,
  removeFavorite,
  type FavoriteEntry,
} from "@/lib/api/favorites";

export default function CustomerFavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      if (err instanceof Error && err.message === "AUTH_REQUIRED") {
        router.push("/signin");
        return;
      }

      setError(
        err instanceof Error ? err.message : "Failed to load favorites"
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleRemove = async (equipmentId: string) => {
    setRemovingId(equipmentId);
    setMessage("");

    try {
      await removeFavorite(equipmentId);

      setFavorites((previous) =>
        previous.filter(
          (entry) => entry.equipment._id !== equipmentId
        )
      );
      setMessage("Removed from favorites.");
    } catch (err) {
      if (err instanceof Error && err.message === "AUTH_REQUIRED") {
        router.push("/signin");
        return;
      }

      setMessage(
        err instanceof Error ? err.message : "Failed to remove favorite"
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center" role="status">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <p className="mt-3 text-sm text-muted-foreground">
          Loading favorites...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          type="button"
          onClick={fetchFavorites}
          className="mt-4 rounded-lg bg-black px-5 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Favorites</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Equipment you have saved for later.
        </p>
      </div>

      {message && (
        <p className="rounded-lg bg-muted px-4 py-2 text-sm">
          {message}
        </p>
      )}

      {favorites.length === 0 ? (
        <div className="rounded-xl border py-16 text-center">
          <HeartOff className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">
            No favorites yet
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart on any equipment to save it here.
          </p>
          <Link
            href="/equipment"
            className="mt-5 inline-block rounded-lg bg-black px-5 py-3 text-white"
          >
            Browse Equipment
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((entry) => (
            <div
              key={entry.favoriteId}
              className="flex flex-col overflow-hidden rounded-xl border bg-white"
            >
              <Link href={`/equipment/${entry.equipment._id}`}>
                {entry.equipment.images?.[0]?.url ? (
                  <img
                    src={entry.equipment.images[0].url}
                    alt={entry.equipment.title}
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-gray-100 text-gray-400">
                    No image available
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col space-y-2 p-4">
                <p className="text-xs text-gray-500">
                  {entry.equipment.category}
                </p>

                <h2 className="font-semibold">
                  {entry.equipment.title}
                </h2>

                <p className="text-sm text-gray-500">
                  {entry.equipment.location?.city}
                </p>

                <p className="font-bold">
                  ৳{entry.equipment.pricePerDay}
                  <span className="font-normal text-gray-500">
                    {" "}/ day
                  </span>
                </p>

                <div className="mt-auto flex gap-2 pt-2">
                  <Link
                    href={`/equipment/${entry.equipment._id}`}
                    className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-medium hover:bg-gray-50"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(entry.equipment._id)
                    }
                    disabled={removingId === entry.equipment._id}
                    className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {removingId === entry.equipment._id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
