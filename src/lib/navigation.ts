import type { LucideIcon } from "lucide-react";
import {
  CalendarRange,
  ClipboardList,
  Heart,
  LayoutDashboard,
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

/** Public links shown in the main navigation (only routes that exist). */
export const PUBLIC_LINKS: NavLink[] = [
  { label: "Home", href: "/", icon: Truck, exact: true },
  { label: "All Equipment", href: "/equipment", icon: Package },
];

/**
 * Dashboard navigation per role. Read from the Better Auth session only —
 * never from localStorage or hardcoded state. Hrefs mirror the sidebar
 * (`DashboardSidebar.tsx`) so both menus always agree.
 */
export const ROLE_NAV: Record<UserRole, NavLink[]> = {
  customer: [
    { label: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard, exact: true },
    { label: "My Rentals", href: "/dashboard/customer/rentals", icon: ClipboardList },
    { label: "Favorites", href: "/dashboard/customer/favorites", icon: Heart },
    { label: "My Profile", href: "/dashboard/customer/profile", icon: UserRound },
  ],
  owner: [
    { label: "Dashboard", href: "/dashboard/owner", icon: LayoutDashboard, exact: true },
    { label: "Add Equipment", href: "/dashboard/owner/equipment/add", icon: Plus },
    { label: "My Equipment", href: "/dashboard/owner/equipment", icon: Truck },
    {
      label: "My Equipment Rentals",
      href: "/dashboard/owner/rentals",
      icon: CalendarRange,
    },
    { label: "My Profile", href: "/dashboard/owner/profile", icon: UserRound },
  ],
  admin: [
    { label: "Admin Dashboard", href: "/dashboard/admin", icon: LayoutDashboard, exact: true },
    { label: "All Users", href: "/dashboard/admin/users", icon: Users },
    { label: "All Equipment", href: "/dashboard/admin/equipment", icon: Package },
    { label: "All Rentals", href: "/dashboard/admin/rentals", icon: ClipboardList },
    { label: "My Profile", href: "/dashboard/admin/profile", icon: UserRound },
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
 * "Settings" item (no /settings route exists yet).
 */
export const SETTINGS_HREF: string | null = null;

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
  const profile = links.find((link) => link.href.endsWith("/profile"));
  const dashboard = links.find((link) => link.exact);
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
