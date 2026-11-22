import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Package } from "lucide-react";

import type { Equipment } from "@/types/equipment";
import { cn } from "@/lib/utils";
import { cardClass } from "@/components/home/variants";

interface EquipmentCardProps {
  equipment: Equipment;
}

const CONDITION_LABEL: Record<string, string> = {
  new: "New",
  "like-new": "Like new",
  good: "Good",
  fair: "Fair",
};

function formatPrice(value: number) {
  return `৳${value.toLocaleString("en-US")}`;
}


export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const imageUrl = equipment.images?.[0]?.url;
  const available = equipment.availability === "available";

  return (
    <Link
      href={`/equipment/${equipment._id}`}
      aria-label={`View details for ${equipment.title}`}
      className={cn(
        cardClass,
        "group flex h-full flex-col overflow-hidden hover:-translate-y-1.5 hover:border-[#14B8A6]/60 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] focus-visible:ring-offset-2",
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F1F5F9]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={equipment.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center text-[#94A3B8]"
          >
            <Package className="size-9" />
          </span>
        )}

        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur",
            available
              ? "bg-[#14B8A6]/95 text-[#042F2A]"
              : "bg-[#F5B942]/95 text-[#451A03]",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-1.5 rounded-full",
              available ? "bg-[#042F2A]/70" : "bg-[#451A03]/70",
            )}
          />
          {available ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#0B1220]/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#475569]">
            {equipment.category}
          </span>
          {equipment.condition ? (
            <span className="text-[11px] font-medium text-[#94A3B8]">
              {CONDITION_LABEL[equipment.condition] ?? equipment.condition}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-[#0B1220] transition-colors group-hover:text-[#0D9488]">
          {equipment.title}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-[#64748B]">
          <MapPin aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="truncate">
            {equipment.location?.city || "Location available"}
          </span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#F1F5F9] pt-4">
          <div className="min-w-0">
            <p className="text-xl font-bold tracking-tight text-[#0B1220]">
              {formatPrice(equipment.pricePerDay)}
              <span className="ml-1 text-xs font-medium text-[#64748B]">
                / day
              </span>
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium uppercase tracking-wider text-[#94A3B8]">
              Daily rental
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#0D9488] transition-colors group-hover:bg-[#14B8A6]/10">
            View Details
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
