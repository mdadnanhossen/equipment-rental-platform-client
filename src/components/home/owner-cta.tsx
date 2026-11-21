import Link from "next/link";
import { ArrowRight, PlusCircle, Truck } from "lucide-react";

import { Reveal } from "@/components/home/reveal";
import { navyButtonClass, outlineDarkButtonClass } from "@/components/home/variants";

/** Teal conversion band encouraging owners to list their equipment. */
export function OwnerCta() {
  return (
    <section
      aria-labelledby="owner-cta-heading"
      className="relative isolate overflow-hidden bg-[#14B8A6] py-16 sm:py-20 lg:py-24"
    >
      {/* Decorative watermark */}
      <Truck
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rotate-[-8deg] text-[#0B1220]/10 sm:h-80 sm:w-80"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full border-[16px] border-[#0B1220]/10"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#0B1220]/70">
              <span aria-hidden="true" className="h-px w-7 bg-[#0B1220]/50" />
              Become an equipment owner
            </p>

            <h2
              id="owner-cta-heading"
              className="mt-3 text-3xl font-semibold tracking-tight text-[#0B1220] text-balance sm:text-4xl"
            >
              Turn idle equipment into steady income.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#0B1220]/80 text-pretty">
              List the gear gathering dust, set your own daily rate and reach
              renters who need it. Our team reviews every listing before it
              goes live on the marketplace.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                href="/dashboard/owner/equipment/add"
                className={navyButtonClass}
              >
                <PlusCircle aria-hidden="true" className="size-4" />
                List Your Equipment
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>

              <Link href="/equipment" className={outlineDarkButtonClass}>
                Browse Equipment
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
