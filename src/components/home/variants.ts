/**
 * Shared button/interaction class strings for the marketing home page so
 * every CTA across sections uses one consistent style.
 */

/** Solid teal primary CTA (works on light and dark backgrounds). */
export const primaryButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#14B8A6] px-6 text-sm font-semibold text-[#0B1220] shadow-[0_10px_30px_-10px_rgba(20,184,166,0.6)] transition-all duration-200 hover:bg-[#0D9488] hover:shadow-[0_16px_36px_-12px_rgba(20,184,166,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] active:translate-y-px";

/** Outlined light CTA used on the midnight navy hero. */
export const outlineLightButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 text-sm font-semibold text-white transition-all duration-200 hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] active:translate-y-px";

/** Outlined dark CTA used on light sections. */
export const outlineDarkButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-6 text-sm font-semibold text-[#0B1220] transition-all duration-200 hover:border-[#0B1220] hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1220] focus-visible:ring-offset-2 active:translate-y-px";

/** Navy solid CTA used on the teal owner band. */
export const navyButtonClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0B1220] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(11,18,32,0.8)] transition-all duration-200 hover:bg-[#152238] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1220] focus-visible:ring-offset-2 focus-visible:ring-offset-[#14B8A6] active:translate-y-px";

/** Teal text link with arrow used for "View All" style actions. */
export const textLinkClass =
  "inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D9488] transition-colors hover:text-[#0B1220] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] focus-visible:ring-offset-2 rounded";

/** Standard card surface used across light sections. */
export const cardClass =
  "rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300";
