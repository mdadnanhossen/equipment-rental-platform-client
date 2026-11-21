import { Star } from "lucide-react";

import { initialsOf } from "@/lib/utils";
import { Reveal } from "@/components/home/reveal";
import { SectionHeading } from "@/components/home/section-heading";
import { cardClass } from "@/components/home/variants";

interface DemoReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
}

/**
 * Demo reviews — there is no review API in this project yet, so this content
 * is intentionally labelled as sample data everywhere it appears (section
 * chip, per-card badge and footnote) and can be swapped for the real API
 * later without touching the layout.
 */
const DEMO_REVIEWS: DemoReview[] = [
  {
    id: "r1",
    name: "Ayaan Rahman",
    rating: 5,
    comment:
      "Booked a DSLR kit for a weekend shoot. Pickup was smooth, the owner answered within minutes and the gear worked perfectly.",
  },
  {
    id: "r2",
    name: "Mehjabin Chowdhury",
    rating: 5,
    comment:
      "Listed my camera gear on Rentora and it got booked twice in the first month. Payments and records were clear every step.",
  },
  {
    id: "r3",
    name: "Tanvir Hasan",
    rating: 4,
    comment:
      "Needed a generator for a one-day event. Comparing daily rates took seconds and checkout was straightforward.",
  },
  {
    id: "r4",
    name: "Sabila Islam",
    rating: 5,
    comment:
      "The verified-owner badges made it easy to trust a listing I'd never used before. Would rent again for our next shoot.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={
            index < rating
              ? "size-4 fill-[#F5B942] text-[#F5B942]"
              : "size-4 text-[#E2E8F0]"
          }
        />
      ))}
    </div>
  );
}

/** Customer reviews section (clearly marked sample content). */
export function Reviews() {
  return (
    <section
      aria-labelledby="reviews-heading"
      className="bg-[#F8FAFC] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Customer reviews"
            headingId="reviews-heading"
            title="What renters and owners say"
            action={
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F5B942]/50 bg-[#F5B942]/12 px-3.5 py-1.5 text-xs font-semibold text-[#92400E]">
                <Star aria-hidden="true" className="size-3.5 fill-[#F5B942] text-[#F5B942]" />
                Sample content
              </span>
            }
          />
        </Reveal>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {DEMO_REVIEWS.map((review, index) => (
            <li key={review.id}>
              <Reveal delay={index * 70}>
                <figure
                  className={`${cardClass} flex h-full flex-col p-6 hover:-translate-y-1.5 hover:border-[#14B8A6]/60 hover:shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)]`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <Stars rating={review.rating} />
                    <span className="rounded-full bg-[#F5B942]/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#92400E]">
                      Demo
                    </span>
                  </div>

                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-[#475569]">
                    “{review.comment}”
                  </blockquote>

                  <figcaption className="mt-5 flex items-center gap-3 border-t border-[#F1F5F9] pt-4">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0B1220] text-xs font-bold text-white"
                    >
                      {initialsOf(review.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-[#0B1220]">
                        {review.name}
                      </span>
                      <span className="block text-xs text-[#94A3B8]">
                        Sample review
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={120}>
          <p className="mt-8 text-center text-xs leading-relaxed text-[#94A3B8]">
            Sample reviews shown for layout purposes — they are not genuine
            customer testimonials and will be replaced by verified reviews once
            the review API is available.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
