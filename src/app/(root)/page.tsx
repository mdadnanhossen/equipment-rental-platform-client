import type { Metadata } from "next";

import { Categories } from "@/components/home/categories";
import { FeaturedEquipment } from "@/components/home/featured-equipment";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { OwnerCta } from "@/components/home/owner-cta";
import { Reviews } from "@/components/home/reviews";
import { SiteFooter } from "@/components/home/site-footer";
import { WhyRentora } from "@/components/home/why-rentora";

export const metadata: Metadata = {
  title: "Rentora — Equipment Rental Marketplace",
  description:
    "Rent verified equipment by the day or list your own gear and earn. Browse construction, photography, vehicle, agriculture, electronics and event equipment near you.",
};

/**
 * Marketing home page. Sections are server components wherever possible;
 * only the two API-driven sections (hero imagery and featured equipment) and
 * the scroll-reveal wrapper are client components.
 */
export default function Home() {
  return (
    <main className="bg-[#F8FAFC]">
      {/* Without JS the IntersectionObserver never runs, so reveal
          animations must fall back to fully visible content. */}
      <noscript>
        <style>{`.home-reveal{opacity:1 !important;transform:none !important}`}</style>
      </noscript>

      <Hero />
      <FeaturedEquipment />
      <Categories />
      <WhyRentora />
      <Reviews />
      <HowItWorks />
      <OwnerCta />
      <SiteFooter />
    </main>
  );
}
