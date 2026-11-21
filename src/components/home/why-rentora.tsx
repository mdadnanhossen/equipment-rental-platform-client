import {
  BadgeCheck,
  BadgeDollarSign,
  CalendarRange,
  CreditCard,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { cardClass } from "@/components/home/variants";

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: BadgeDollarSign,
    title: "Affordable Rental Prices",
    description:
      "Transparent daily rates with no hidden fees — pay only for the days you actually use the gear.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Equipment Owners",
    description:
      "Every listing is reviewed and approved by our team before it reaches the marketplace.",
  },
  {
    icon: CalendarRange,
    title: "Flexible Rental Periods",
    description:
      "Rent for a day, a weekend or longer — request the dates that fit your project.",
  },
  {
    icon: CreditCard,
    title: "Secure Online Payments",
    description:
      "Encrypted checkout with clear payment records and rental references for every order.",
  },
];

/** "Why choose Rentora" value-proposition grid. */
export function WhyRentora() {
  return (
    <section
      aria-labelledby="why-heading"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Why choose Rentora"
            headingId="why-heading"
            title="Built for renters and owners alike"
            description="A marketplace designed around trust, fair pricing and a rental experience that just works."
          />
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <li key={benefit.title}>
              <Reveal delay={index * 70}>
                <article
                  className={`${cardClass} group relative h-full overflow-hidden p-6 hover:-translate-y-1.5 hover:border-[#14B8A6]/60 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)]`}
                >
                  {/* Amber accent line revealed on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#F5B942] transition-transform duration-300 group-hover:scale-x-100"
                  />

                  <span
                    aria-hidden="true"
                    className="flex size-12 items-center justify-center rounded-xl bg-[#0B1220] text-white transition-colors duration-300 group-hover:bg-[#14B8A6] group-hover:text-[#042F2A]"
                  >
                    <benefit.icon className="size-6" />
                  </span>

                  <h3 className="mt-5 text-base font-semibold tracking-tight text-[#0B1220]">
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#64748B]">
                    {benefit.description}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
