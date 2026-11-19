
import type { LucideIcon } from "lucide-react";

// Rentora user roles
export type TUserRole = "admin" | "owner" | "customer";

// Authenticated user
export type TUser = {
  name: string;
  email: string;
  image?: string | null;
  role: TUserRole;
};

// Dashboard Sidebar item
export type TDashboardSidebarItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: TUserRole[];
};

// Common API response
export type TCommonApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
