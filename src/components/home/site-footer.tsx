import Link from "next/link";
import { Truck } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

/** Explore — on-page anchors and the public marketplace routes. */
const EXPLORE_LINKS: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "All Equipment", href: "/equipment" },
  { label: "How It Works", href: "#how-heading" },
  { label: "Why Rentora", href: "#why-heading" },
  { label: "Customer Reviews", href: "#reviews-heading" },
];

/** Customer — account and browsing routes. */
const CUSTOMER_LINKS: FooterLink[] = [
  { label: "Browse Equipment", href: "/equipment" },
  { label: "Sign In", href: "/signin" },
  { label: "Create Account", href: "/signup" },
];

/** Owner — listing and dashboard routes. */
const OWNER_LINKS: FooterLink[] = [
  { label: "List Your Equipment", href: "/dashboard/owner/equipment/add" },
  { label: "Owner Dashboard", href: "/dashboard" },
  { label: "Get Started", href: "/signup" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <nav aria-label={title}>
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-[#94A3B8] transition-colors hover:text-[#2DD4BF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14B8A6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220] rounded"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Marketing footer for the home page. Only real, existing routes are linked —
 * contact details and social icons are intentionally omitted because the
 * project does not define any valid ones yet.
 */
export function SiteFooter() {
  return (
    <footer className="bg-[#0B1220] pt-14 sm:pt-16">
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="Rentora home"
              className="inline-flex items-center gap-2.5"
            >
              <span
                aria-hidden="true"
                className="flex size-9 items-center justify-center rounded-xl bg-[#14B8A6] text-[#042F2A]"
              >
                <Truck className="size-5" />
              </span>
              <span className="text-lg font-bold tracking-tight text-white">
                Rentora
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#94A3B8]">
              The equipment rental marketplace where verified owners list gear
              and renters book it by the day — securely, transparently and
              without the hassle.
            </p>
          </div>

          <LinkColumn title="Explore" links={EXPLORE_LINKS} />
          <LinkColumn title="For Customers" links={CUSTOMER_LINKS} />
          <LinkColumn title="For Owners" links={OWNER_LINKS} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#64748B]">
            {/* Static year avoids a server/client hydration mismatch. */}
            © 2026 Rentora. All rights reserved.
          </p>
          <p className="text-xs text-[#64748B]">
            Equipment rental marketplace
          </p>
        </div>
      </div>
    </footer>
  );
}
