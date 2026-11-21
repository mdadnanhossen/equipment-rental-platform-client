import {
  CalendarCheck,
  CreditCard,
  KeyRound,
  Search,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: Search,
    title: "Browse Equipment",
    description:
      "Explore approved listings near you and compare transparent daily rates.",
  },
  {
    number: "02",
    icon: CalendarCheck,
    title: "Book Equipment",
    description:
      "Pick your rental dates and send a booking request to the owner.",
  },
  {
    number: "03",
    icon: CreditCard,
    title: "Make Payment",
    description:
      "Pay securely online with encrypted checkout and a clear receipt.",
  },
  {
    number: "04",
    icon: KeyRound,
    title: "Enjoy Your Rental",
    description:
      "Collect your gear, get to work and return it when the rental ends.",
  },
];

/** Four-step "How it works" band on midnight navy. */
export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-heading"
      className="relative isolate overflow-hidden bg-[#0B1220] py-16 sm:py-20 lg:py-24"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #14B8A6 0%, transparent 65%)" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            headingId="how-heading"
            tone="light"
            title="From browsing to booking in four steps"
            description="A simple, transparent flow — no phone calls, no paperwork, no surprises."
          />
        </Reveal>

        <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Dashed connector behind the step icons (desktop only) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-8 top-7 hidden border-t border-dashed border-white/20 lg:block"
          />

          {STEPS.map((step, index) => (
            <li key={step.number} className="relative">
              <Reveal delay={index * 90}>
                <div className="relative z-10">
                  <span className="flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-[#132038] text-[#2DD4BF] shadow-[0_16px_36px_-18px_rgba(2,6,23,0.9)]">
                    <step.icon aria-hidden="true" className="size-6" />
                  </span>

                  <p className="mt-5 text-xs font-bold tracking-[0.25em] text-[#5EEAD4]">
                    {step.number}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#94A3B8]">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
