import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Cpu,
  HardHat,
  PartyPopper,
  Sprout,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { cardClass, textLinkClass } from "@/components/home/variants";
import { cn } from "@/lib/utils";

interface CategoryItem {
  name: string;
  description: string;
  icon: LucideIcon;
  /** Alternating icon-tile treatments keep the grid lively but consistent. */
  tint: "teal" | "amber" | "navy";
}

const CATEGORIES: CategoryItem[] = [
  {
    name: "Construction Equipment",
    description: "Scaffold, mixers and site machinery",
    icon: HardHat,
    tint: "teal",
  },
  {
    name: "Photography Equipment",
    description: "Cameras, lenses and lighting kits",
    icon: Camera,
    tint: "amber",
  },
  {
    name: "Vehicles & Transportation",
    description: "Bikes, cars and cargo movers",
    icon: Truck,
    tint: "navy",
  },
  {
    name: "Agriculture Equipment",
    description: "Tractors, tillers and harvest gear",
    icon: Sprout,
    tint: "teal",
  },
  {
    name: "Electronics",
    description: "Projectors, laptops and audio gear",
    icon: Cpu,
    tint: "navy",
  },
  {
    name: "Event Equipment",
    description: "Tents, stages and sound systems",
    icon: PartyPopper,
    tint: "amber",
  },
];

const TINT_CLASS: Record<CategoryItem["tint"], string> = {
  teal: "bg-[#14B8A6]/12 text-[#0D9488] group-hover:bg-[#14B8A6] group-hover:text-[#042F2A]",
  amber: "bg-[#F5B942]/18 text-[#92400E] group-hover:bg-[#F5B942] group-hover:text-[#451A03]",
  navy: "bg-[#0B1220]/6 text-[#0B1220] group-hover:bg-[#0B1220] group-hover:text-white",
};

/**
 * Popular categories — static marketing navigation that links to the public
 * equipment listing route.
 */
export function Categories() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Popular categories"
            headingId="categories-heading"
            title="Browse by what you're looking for"
            description="Six categories covering every project — pick one and see what's available near you."
            action={
              <Link href="/equipment" className={textLinkClass}>
                View all categories
              </Link>
            }
          />
        </Reveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <li key={category.name}>
              <Reveal delay={index * 60}>
                <Link
                  href="/equipment"
                  className={cn(
                    cardClass,
                    "group flex h-full items-start gap-4 p-5 hover:-translate-y-1 hover:border-[#14B8A6]/60 hover:shadow-[0_20px_44px_-24px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] focus-visible:ring-offset-2 sm:p-6",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                      TINT_CLASS[category.tint],
                    )}
                  >
                    <category.icon className="size-6" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold tracking-tight text-[#0B1220]">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-sm text-[#64748B]">
                      {category.description}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#0D9488]">
                      Explore
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
