
/**
 * Favorites API — persisted in MongoDB via `/api/favorites`
 * (customer-only; session cookie is forwarded with `credentials: "include"`).
 */

import type { Equipment } from "@/types/equipment";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface FavoriteEntry {
  favoriteId: string;
  equipment: Equipment;
}

async function parse<T>(response: Response): Promise<T> {
  const result = await response.json();

  if (!response.ok || !result.success) {
    if (response.status === 401) {
      throw new Error("AUTH_REQUIRED");
    }

    throw new Error(result.message || "Request failed");
  }

  return result.data as T;
}

/** List the signed-in customer's favorites (joined with equipment). */
export async function getFavorites(): Promise<FavoriteEntry[]> {
  const response = await fetch(`${API_URL}/api/favorites`, {
    credentials: "include",
    cache: "no-store",
  });

  return parse<FavoriteEntry[]>(response);
}

/** Add equipment to favorites (idempotent). */
export async function addFavorite(
  equipmentId: string
): Promise<void> {
  const response = await fetch(`${API_URL}/api/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ equipmentId }),
  });

  await parse<unknown>(response);
}

/** Remove equipment from favorites. */
export async function removeFavorite(
  equipmentId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/favorites/${equipmentId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  await parse<unknown>(response);
}
