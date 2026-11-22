"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarRange,
  CreditCard,
  MapPin,
  Package,
  PlusCircle,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { getAllEquipment } from "@/lib/api/equipment";
import type { Equipment } from "@/types/equipment";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/home/reveal";
import {
  outlineLightButtonClass,
  primaryButtonClass,
} from "@/components/home/variants";

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Verified equipment owners" },
  { icon: CreditCard, label: "Secure online payments" },
  { icon: CalendarRange, label: "Flexible rental periods" },
] as const;

function formatPrice(value: number) {
  return `৳${value.toLocaleString("en-US")}`;
}


function HeroImageSkeleton() {
  return (
    <div
      className="aspect-[4/3] w-full animate-pulse rounded-[2rem] bg-white/10 sm:aspect-[16/10] lg:aspect-[4/5]"
      aria-hidden="true"
    />
  );
}


export function Hero() {
  const [items, setItems] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadHeroImagery() {
      try {
        const result = await getAllEquipment({ limit: 3, sortBy: "newest" });
        if (!cancelled) setItems(result.data ?? []);
      } catch {
        
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHeroImagery();

    return () => {
      cancelled = true;
    };
  }, []);

  const primary = items[0];
  const secondary = items[1];
  const hasImagery = Boolean(primary?.images?.[0]?.url);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-[#0B1220]"
    >
      {/* Decorative atmosphere: soft teal/amber glows + faint grid. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 right-[-10%] h-[26rem] w-[26rem] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #14B8A6 0%, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-32 left-[-5%] h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #F5B942 0%, transparent 65%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        {/* Copy */}
        <div>
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#5EEAD4]">
              <span
                aria-hidden="true"
                className="relative flex size-1.5"
              >
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#14B8A6] opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#14B8A6]" />
              </span>
              Rentora Equipment Marketplace
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1
              id="hero-heading"
              className="mt-6 text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Rent the equipment you need,{" "}
              <span className="text-[#2DD4BF]">when you need it.</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
              Rentora connects renters with verified equipment owners — from
              camera kits to construction gear. Compare daily rates, book in
              minutes and pay securely online.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/equipment"
                className={cn(primaryButtonClass, "group sm:w-auto")}
              >
                Browse Equipment
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/dashboard/owner/equipment/add"
                className={cn(outlineLightButtonClass, "sm:w-auto")}
              >
                <PlusCircle aria-hidden="true" className="size-4" />
                List Your Equipment
              </Link>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point.label}
                  className="flex items-center gap-2 text-sm text-[#CBD5E1]"
                >
                  <point.icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-[#14B8A6]"
                  />
                  {point.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Real-listing image composition */}
        <Reveal delay={200} className="relative">
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            {loading ? (
              <HeroImageSkeleton />
            ) : hasImagery ? (
              <>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] ring-1 ring-white/10 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)] sm:aspect-[16/10] lg:aspect-[4/5]">
                  <Image
                    src={primary.images[0].url}
                    alt={primary.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 44vw"
                    className="object-cover"
                    priority
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-transparent to-transparent"
                  />

                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#0B1220]/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    <span className="size-1.5 rounded-full bg-[#14B8A6]" />
                    Approved listing
                  </span>
                </div>

                {/* Real data card over the image */}
                <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 p-3.5 shadow-[0_18px_40px_-16px_rgba(2,6,23,0.55)] backdrop-blur sm:inset-x-4 sm:bottom-4 sm:p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#0B1220]">
                        {primary.title}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#64748B]">
                        <MapPin aria-hidden="true" className="size-3 shrink-0" />
                        {primary.location?.city || "Location available"}
                      </p>
                    </div>
                    <p className="shrink-0 text-right">
                      <span className="text-lg font-bold text-[#0B1220]">
                        {formatPrice(primary.pricePerDay)}
                      </span>
                      <span className="block text-[11px] font-medium text-[#64748B]">
                        per day
                      </span>
                    </p>
                  </div>
                </div>

                {/* Amber accent tag */}
                <span
                  aria-hidden="true"
                  className="absolute -left-3 top-10 hidden -rotate-6 rounded-lg bg-[#F5B942] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0B1220] shadow-[0_12px_28px_-12px_rgba(245,185,66,0.9)] lg:block"
                >
                  Rent by the day
                </span>

                {/* Secondary real image */}
                {secondary?.images?.[0]?.url ? (
                  <div className="absolute -right-3 bottom-24 hidden h-28 w-28 overflow-hidden rounded-2xl ring-4 ring-[#0B1220] shadow-[0_24px_50px_-18px_rgba(2,6,23,0.8)] xl:block">
                    <Image
                      src={secondary.images[0].url}
                      alt={secondary.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </>
            ) : (
              /* API unavailable / no approved listings yet */
              <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/10 bg-[#101B30] p-8 text-center sm:aspect-[16/10] lg:aspect-[4/5]">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-[#14B8A6]/15 text-[#2DD4BF]">
                  <Truck aria-hidden="true" className="size-7" />
                </span>
                <p className="max-w-xs text-sm leading-relaxed text-[#94A3B8]">
                  Freshly approved equipment appears here as soon as owners
                  publish their listings.
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-[#CBD5E1]">
                  <Package aria-hidden="true" className="size-3.5" />
                  Live marketplace imagery
                </span>
              </div>
            )}
          </div>
        </Reveal>
      </div>

    </section>
  );
}
