import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Handshake, ShieldCheck, Sparkles, Timer, Truck } from "lucide-react";

interface Perk {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PERKS: Perk[] = [
  {
    icon: ShieldCheck,
    title: "Verified owners",
    description: "Every listing is reviewed before it goes live.",
  },
  {
    icon: Handshake,
    title: "Protected rentals",
    description: "Secure deposits and clear agreements on each booking.",
  },
  {
    icon: Timer,
    title: "Book in minutes",
    description: "Pick your dates, confirm, and grab the gear.",
  },
];

/**
 * Shared shell for `/signin` and `/signup`: a branded panel on large
 * screens, a compact header on small screens, and the form card in the
 * middle. The panel links back to the marketing site.
 */
const AuthLayout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex min-h-dvh bg-[#F8FAFC]">
      {/* Brand panel — desktop only. */}
      <aside className="relative hidden w-full shrink-0 flex-col justify-between overflow-hidden bg-[#142B45] px-10 py-10 text-white lg:flex lg:w-[44%] xl:w-[46%]">
        {/* Decorative glows. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-32 size-80 rounded-full bg-[#16A37A]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -bottom-40 size-96 rounded-full bg-white/5 blur-3xl"
        />

        <Link
          href="/"
          className="relative flex items-center gap-2.5"
          aria-label="Rentora home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
            <Truck className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Rentora</span>
        </Link>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#16A37A]/15 px-3 py-1 text-xs font-semibold text-[#6EE7B7] ring-1 ring-[#16A37A]/30">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Equipment rental marketplace
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
            Rent the gear you need, right when you need it.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/70">
            Sign in to book tools, machines and vehicles from trusted owners
            near you — or list your own equipment and earn.
          </p>

          <ul className="mt-8 space-y-4">
            {PERKS.map((perk) => (
              <li key={perk.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                  <perk.icon
                    className="size-4 text-[#6EE7B7]"
                    aria-hidden="true"
                  />
                </span>
                <span>
                  <span className="block text-sm font-semibold">
                    {perk.title}
                  </span>
                  <span className="block text-sm text-white/60">
                    {perk.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/50">
          Trusted by renters and owners across the country.
        </p>
      </aside>

      {/* Form column. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3.5 lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Rentora home"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#142B45] text-white">
              <Truck className="size-4" />
            </span>
            <span className="text-base font-bold tracking-tight text-[#142B45]">
              Rentora
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#64748B] transition-colors hover:text-[#142B45]"
          >
            Back to home
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
          <div className="w-full max-w-md rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.05)] sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
