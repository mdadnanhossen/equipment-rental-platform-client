
"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import {
  addFavorite,
  removeFavorite,
} from "@/lib/api/favorites";
import { cn } from "cn";

interface Props {
  equipmentId: string;
  className?: string;
}

/**
 * Heart toggle that persists to MongoDB (`/api/favorites`).
 * Only rendered for signed-in customers; everyone else is sent to /signin.
 */
export default function FavoriteButton({
  equipmentId,
  className,
}: Props) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const role = session?.user?.role;

  const [isFavorite, setIsFavorite] = useState(false);
  const [checking, setChecking] = useState(false);
  const [busy, setBusy] = useState(false);

  const isAuthenticated = Boolean(session);

  
  useEffect(() => {
    if (isPending || !isAuthenticated || role !== "customer") {
      return;
    }

    let cancelled = false;

    async function checkFavorite() {
      setChecking(true);

      try {
        const { getFavorites } = await import("@/lib/api/favorites");
        const favorites = await getFavorites();

        if (!cancelled) {
          setIsFavorite(
            favorites.some(
              (entry) => entry.equipment._id === equipmentId
            )
          );
        }
      } catch {
        // Not signed in as a customer — leave the heart unselected.
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    checkFavorite();

    return () => {
      cancelled = true;
    };
  }, [equipmentId, isAuthenticated, isPending, role]);

  const toggle = useCallback(async () => {
    if (isPending) return;

    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    if (role !== "customer") {
      return;
    }

    const next = !isFavorite;
    setIsFavorite(next); // optimistic
    setBusy(true);

    try {
      if (next) {
        await addFavorite(equipmentId);
      } else {
        await removeFavorite(equipmentId);
      }
    } catch (error) {
      setIsFavorite(!next); // roll back

      if (
        error instanceof Error &&
        error.message === "AUTH_REQUIRED"
      ) {
        router.push("/signin");
      }
    } finally {
      setBusy(false);
    }
  }, [
    equipmentId,
    isAuthenticated,
    isPending,
    isFavorite,
    role,
    router,
  ]);

  // Hide the control for owners/admins (favorites are a customer feature).
  if (!isPending && role && role !== "customer") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy || checking}
      aria-label={
        isFavorite ? "Remove from favorites" : "Add to favorites"
      }
      title={
        isFavorite ? "Remove from favorites" : "Add to favorites"
      }
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background transition-colors hover:bg-muted disabled:opacity-50",
        isFavorite && "border-red-200 bg-red-50",
        className
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5",
          isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </button>
  );
}
