"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, PackageSearch, RotateCcw } from "lucide-react";

import { getAllEquipment } from "@/lib/api/equipment";
import type { Equipment } from "@/types/equipment";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { EquipmentCard } from "@/components/home/equipment-card";
import {
  cardClass,
  outlineDarkButtonClass,
  primaryButtonClass,
  textLinkClass,
} from "@/components/home/variants";

/** Backend supports MongoDB `limit` — capped at 6 by the spec. */
const FEATURED_LIMIT = 6;

function CardSkeleton() {
  return (
    <div
      className={`${cardClass} animate-pulse overflow-hidden`}
      aria-hidden="true"
    >
      <div className="aspect-[4/3] w-full bg-[#E2E8F0]/70" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-24 rounded-md bg-[#E2E8F0]/70" />
        <div className="h-5 w-3/4 rounded-md bg-[#E2E8F0]/70" />
        <div className="h-4 w-1/2 rounded-md bg-[#E2E8F0]/70" />
        <div className="h-8 w-full rounded-md bg-[#E2E8F0]/70" />
      </div>
    </div>
  );
}


export function FeaturedEquipment() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumped by the retry button to re-run the fetch effect below.
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchFeatured() {
      try {
        const result = await getAllEquipment({
          limit: FEATURED_LIMIT,
          sortBy: "newest",
        });
        if (!cancelled) {
          setItems(result.data ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setItems([]);
          setError(
            err instanceof Error ? err.message : "Failed to load equipment",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFeatured();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };

  return (
    <section
      aria-labelledby="featured-heading"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Featured equipment"
            headingId="featured-heading"
            title="Ready to rent, approved by our team"
            description="Approved listings from verified owners — every item is reviewed before it reaches the marketplace."
            align="start"
            action={
              <Link href="/equipment" className={textLinkClass}>
                View All Equipment
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10 sm:mt-12">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: FEATURED_LIMIT }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div
              role="status"
              className={`${cardClass} flex flex-col items-center justify-center gap-3 px-6 py-14 text-center`}
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-[#F5B942]/15 text-[#92400E]">
                <PackageSearch aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="font-semibold text-[#0B1220]">
                  We couldn&apos;t load the equipment
                </p>
                <p className="mt-1 text-sm text-[#64748B]">{error}</p>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className={`${outlineDarkButtonClass} h-10 px-4`}
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <div
              role="status"
              className={`${cardClass} flex flex-col items-center justify-center gap-3 px-6 py-14 text-center`}
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-[#14B8A6]/10 text-[#0D9488]">
                <PackageSearch aria-hidden="true" className="size-6" />
              </span>
              <div>
                <p className="font-semibold text-[#0B1220]">
                  No approved equipment yet
                </p>
                <p className="mt-1 text-sm text-[#64748B]">
                  New listings appear here right after admin approval.
                </p>
              </div>
              <Link
                href="/equipment"
                className={`${outlineDarkButtonClass} h-10 px-4`}
              >
                Browse all equipment
              </Link>
            </div>
          ) : (
            <Reveal>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((equipment) => (
                  <EquipmentCard key={equipment._id} equipment={equipment} />
                ))}
              </div>

              <div className="mt-9 flex justify-center lg:hidden">
                <Link href="/equipment" className={primaryButtonClass}>
                  Browse All Equipment
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
