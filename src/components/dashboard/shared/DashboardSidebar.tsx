
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  CalendarCheck,
  CalendarDays,
  ChevronsUpDown,
  CreditCard,
  Heart,
  House,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import type {
  TDashboardSidebarItem,
  TUser,
  TUserRole,
} from "@/types";

import { signOut } from "@/lib/auth-client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// Rentora role-based navigation

const roleBasedSidebarItems: Record<
  TUserRole,
  TDashboardSidebarItem[]
> = {
  // Customer Dashboard
  customer: [
    {
      title: "Dashboard",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      title: "Browse Equipment",
      href: "/equipment",
      icon: Search,
    },
    {
      title: "My Rentals",
      href: "/dashboard/customer/rentals",
      icon: CalendarCheck,
    },
    {
      title: "Payment History",
      href: "/dashboard/customer/payment-history",
      icon: CreditCard,
    },
    {
      title: "Favorites",
      href: "/dashboard/customer/favorites",
      icon: Heart,
    },
    {
      title: "My Profile",
      href: "/dashboard/customer/profile",
      icon: UserRound,
    },
  ],

  // Equipment Owner Dashboard
  owner: [
    {
      title: "Dashboard",
      href: "/dashboard/owner",
      icon: LayoutDashboard,
    },
    {
      title: "Add Equipment",
      href: "/dashboard/owner/equipment/add",
      icon: PlusCircle,
    },
    {
      title: "My Equipment",
      href: "/dashboard/owner/equipment",
      icon: Building2,
    },
    {
      title: "My Equipment Rentals",
      href: "/dashboard/owner/rentals",
      icon: CalendarCheck,
    },
    {
      title: "Payment History",
      href: "/dashboard/owner/payment-history",
      icon: CreditCard,
    },
    {
      title: "My Profile",
      href: "/dashboard/owner/profile",
      icon: UserRound,
    },
  ],

  // Admin Dashboard
  admin: [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      title: "All Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "All Equipment",
      href: "/dashboard/admin/equipment",
      icon: Building2,
    },
    {
      title: "All Rentals",
      href: "/dashboard/admin/rentals",
      icon: CalendarCheck,
    },
    {
      title: "Payments",
      href: "/dashboard/admin/payments",
      icon: CreditCard,
    },
    {
      title: "My Profile",
      href: "/dashboard/admin/profile",
      icon: UserRound,
    },
  ],
};


// Runtime role validation
const isValidRole = (role: unknown): role is TUserRole => {
  return (
    role === "admin" ||
    role === "owner" ||
    role === "customer"
  );
};

// Active route checker
const isActivePath = (pathname: string, href: string) => {
  const dashboardRoutes = [
    "/dashboard/customer",
    "/dashboard/owner",
    "/dashboard/admin",
  ];

  if (dashboardRoutes.includes(href)) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

const DashboardSidebar = ({ user }: { user: TUser | null }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { isMobile, setOpenMobile } = useSidebar();

  const role = isValidRole(user?.role) ? user.role : null;

  const sidebarItems = role
    ? roleBasedSidebarItems[role]
    : [];

  // Close sidebar after mobile navigation
  const closeMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      setOpenMobile(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <Sidebar collapsible="icon">
      {/* Sidebar Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Rentora"
              render={
  <Link
    href="/"
    onClick={closeMobile}
  />
}
            >
              <div className="grid aspect-square size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <House />
              </div>

              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">
                  Rentora
                </span>

                <span className="truncate text-xs text-sidebar-foreground/70">
                  Dashboard
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const { title, href, icon: Icon } = item;

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      tooltip={title}
                      isActive={isActivePath(pathname, href)}
                      render={
                        <Link
                          href={href}
                          onClick={closeMobile}
                        />
                      }
                    >
                      <Icon />
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {!role && (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <UserRound />
                    <span>Role not assigned</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Dropdown */}
      {user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuButton
                      size="lg"
                      className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
                    />
                  }
                >
                  <Avatar className="rounded-lg">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                      className="rounded-lg"
                    />

                    <AvatarFallback className="rounded-lg">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.name}
                    </span>

                    <span className="truncate text-xs text-sidebar-foreground/70">
                      {user.email}
                    </span>
                  </div>

                  <ChevronsUpDown className="ml-auto" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="min-w-56"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="truncate">
                      Signed in as {role ?? "Unknown"}
                    </DropdownMenuLabel>

                    <DropdownMenuItem
                      render={
                        <Link href="/" onClick={closeMobile} />
                      }
                    >
                      <House />
                      Back to site
                    </DropdownMenuItem>

                    {role && (
                      <DropdownMenuItem
                        render={
                          <Link
                            href={`/dashboard/${role}/profile`}
                            onClick={closeMobile}
                          />
                        }
                      >
                        <UserRound />
                        My Profile
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
