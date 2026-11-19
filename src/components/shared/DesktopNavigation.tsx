"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import {
  isPathActive,
  navForRole,
  PUBLIC_LINKS,
  ROLE_LABEL,
  type NavLink,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Centered desktop links (public routes). Hidden below `lg`, where the
 * Sheet drawer takes over.
 */
export function DesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="hidden h-full flex-1 items-center justify-center gap-1 lg:flex"
    >
      {PUBLIC_LINKS.map((link) => (
        <DesktopNavLink key={link.href} link={link} pathname={pathname} />
      ))}
    </nav>
  );
}

function DesktopNavLink({ link, pathname }: { link: NavLink; pathname: string }) {
  const active = isPathActive(pathname, link);

  return (
    <Link
      href={link.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative inline-flex h-full items-center px-3 text-sm font-medium transition-colors",
        active ? "text-[#142B45]" : "text-[#334155] hover:text-[#142B45]"
      )}
    >
      {link.label}
      {/* Emerald underline marks the active route. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#16A37A] transition-opacity",
          active ? "opacity-100" : "opacity-0"
        )}
      />
    </Link>
  );
}

/**
 * Second row shown (desktop only) while signed in: the role-based dashboard
 * links derived from the real session role, with a role badge.
 */
export function DesktopDashboardSubnav() {
  const pathname = usePathname();
  const { role } = useAuth();
  const links = navForRole(role);
  const badgeLabel = role ? ROLE_LABEL[role] : "Account";

  return (
    <div className="hidden border-t border-[#E2E8F0] bg-[#F8FAFC] lg:block">
      <nav
        aria-label="Dashboard"
        className="mx-auto flex h-11 w-full max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8"
      >
        <span
          className={cn(
            "mr-2 inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold",
            "bg-[#16A37A]/10 text-[#16A37A]"
          )}
        >
          {badgeLabel}
        </span>
        {links.map((link) => {
          const active = isPathActive(pathname, link);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
                active
                  ? "bg-white font-semibold text-[#142B45] ring-1 ring-[#E2E8F0]"
                  : "font-medium text-[#334155] hover:bg-white hover:text-[#142B45]"
              )}
            >
              <link.icon className="size-3.5" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
