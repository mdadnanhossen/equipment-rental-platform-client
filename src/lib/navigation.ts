import type { LucideIcon } from "lucide-react";
import {
  CalendarRange,
  ClipboardList,
  Heart,
  Info,
  LayoutDashboard,
  Mail,
  Package,
  Plus,
  Truck,
  UserRound,
  Users,
} from "lucide-react";

/** Roles understood by the marketplace. Drives all role-based navigation. */
export type UserRole = "customer" | "owner" | "admin";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  /** When true the link is only active on the exact route (not child routes). */
  exact?: boolean;
}

/** Public marketing/support links shown in the main navigation. */
export const PUBLIC_LINKS: NavLink[] = [
  { label: "Home", href: "/", icon: Truck, exact: true },
  { label: "All Equipment", href: "/equipment", icon: Package },
  { label: "How It Works", href: "/how-it-works", icon: Info },
  { label: "About Us", href: "/about", icon: Users },
  { label: "Contact", href: "/contact", icon: Mail },
];

/**
 * Dashboard navigation per role. Read from the Better Auth session only —
 * never from localStorage or hardcoded state.
 */
export const ROLE_NAV: Record<UserRole, NavLink[]> = {
  customer: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "My Rentals", href: "/dashboard/rentals", icon: ClipboardList },
    { label: "Favorites", href: "/dashboard/favorites", icon: Heart },
    { label: "My Profile", href: "/profile", icon: UserRound },
  ],
  owner: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "Add Equipment", href: "/dashboard/equipment/new", icon: Plus },
    { label: "My Equipment", href: "/dashboard/equipment", icon: Truck },
    {
      label: "My Equipment Rentals",
      href: "/dashboard/equipment/rentals",
      icon: CalendarRange,
    },
    { label: "My Profile", href: "/profile", icon: UserRound },
  ],
  admin: [
    { label: "Admin Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "All Users", href: "/dashboard/users", icon: Users },
    { label: "All Equipment", href: "/dashboard/equipment", icon: Package },
    { label: "All Rentals", href: "/dashboard/rentals", icon: ClipboardList },
    { label: "My Profile", href: "/profile", icon: UserRound },
  ],
};

/** Display labels for roles (badges in the navbar and drawer). */
export const ROLE_LABEL: Record<UserRole, string> = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
};

/**
 * Settings route used by the account dropdown. Set to `null` to hide the
 * "Settings" item (it is only rendered when the route exists).
 */
export const SETTINGS_HREF: string | null = "/settings";

export function isUserRole(value: unknown): value is UserRole {
  return value === "customer" || value === "owner" || value === "admin";
}

/**
 * Role-based dashboard links. Unknown or missing roles fall back to the
 * customer navigation so the navbar never renders an empty menu.
 */
export function navForRole(role: UserRole | null | undefined): NavLink[] {
  return ROLE_NAV[isUserRole(role) ? role : "customer"];
}

/**
 * Account dropdown order (spec): My Profile, Dashboard, then the role's
 * remaining links. Derived from ROLE_NAV so the dropdown can never drift
 * from the drawer or the desktop subnav.
 */
export function accountDropdownNav(role: UserRole | null | undefined): NavLink[] {
  const links = navForRole(role);
  const profile = links.find((link) => link.href === "/profile");
  const dashboard = links.find((link) => link.href === "/dashboard");
  const rest = links.filter((link) => link !== profile && link !== dashboard);

  return [
    ...(profile ? [profile] : []),
    ...(dashboard ? [dashboard] : []),
    ...rest,
  ];
}

/** Active-route check: exact for `/` and `exact` links, prefix otherwise. */
export function isPathActive(pathname: string, link: NavLink): boolean {
  if (link.exact || link.href === "/") {
    return pathname === link.href;
  }
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}
