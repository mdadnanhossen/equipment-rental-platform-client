
"use client";

import Link from "next/link";
import { Bell, ChevronDown, LogOut, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useSignOut } from "@/hooks/use-auth";
import {
  accountDropdownNav,
  ROLE_LABEL,
  SETTINGS_HREF,
  type NavLink,
} from "@/lib/navigation";
import { cn, initialsOf } from "@/lib/utils";

const menuItemClass = cn(
  "cursor-pointer gap-2.5 text-[#334155] focus:text-[#142B45]"
);

/** Single menu entry: role link rendered as a real next/link. */
function AccountMenuItem({ link }: { link: NavLink }) {
  return (
    <DropdownMenuItem
      render={<Link href={link.href} />}
      className={menuItemClass}
    >
      <link.icon aria-hidden="true" />
      {link.label}
    </DropdownMenuItem>
  );
}

/**
 * Desktop account area:
 * Dashboard shortcut, notification bell, and profile dropdown.
 */
export function UserMenu() {
  const { user, role, isPending } = useAuth();
  const { signOutAndRedirect, isSigningOut } = useSignOut();

  if (isPending) {
    return (
      <div
        className="hidden items-center gap-2 md:flex"
        aria-hidden="true"
      >
        <Skeleton className="h-9 w-28 rounded-lg" />
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  // Role-based items in dropdown order: My Profile, Dashboard, then the rest.
  const [profileLink, dashboardLink, ...restLinks] =
    accountDropdownNav(role);

  const settingsLink: NavLink | null = SETTINGS_HREF
    ? {
        label: "Settings",
        href: SETTINGS_HREF,
        icon: Settings,
      }
    : null;

  return (
    <div className="hidden items-center gap-1.5 md:flex">
      {/* Dashboard shortcut */}
      {dashboardLink ? (
        <Link
          href={dashboardLink.href}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-medium text-[#142B45] transition-colors hover:bg-[#F8FAFC]"
        >
          <dashboardLink.icon
            className="size-4"
            aria-hidden="true"
          />
          {dashboardLink.label}
        </Link>
      ) : null}

      {/* Notifications */}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Notifications"
        className="relative text-[#334155] hover:text-[#142B45]"
      >
        <Bell />

        <span
          aria-hidden="true"
          className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#16A37A] ring-2 ring-white"
        />
      </Button>

      {/* Account dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Open account menu"
          className="flex h-9 items-center gap-2 rounded-full pr-2 pl-1 text-sm font-medium text-[#334155] transition-colors outline-none select-none hover:bg-[#F1F5F9] hover:text-[#142B45] focus-visible:ring-2 focus-visible:ring-[#16A37A]/40"
        >
          <Avatar size="sm" className="border border-[#E2E8F0]">
            {user.image ? (
              <AvatarImage src={user.image} alt="" />
            ) : null}

            <AvatarFallback className="bg-[#16A37A] text-[11px] font-semibold text-white">
              {initialsOf(user.name)}
            </AvatarFallback>
          </Avatar>

          <span className="hidden max-w-28 truncate sm:inline">
            {user.name}
          </span>

          <ChevronDown
            className="size-3.5 opacity-60"
            aria-hidden="true"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 p-1.5"
        >
          {/* Account summary */}
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar
              size="sm"
              className="shrink-0 border border-[#E2E8F0]"
            >
              {user.image ? (
                <AvatarImage src={user.image} alt="" />
              ) : null}

              <AvatarFallback className="bg-[#16A37A] text-[11px] font-semibold text-white">
                {initialsOf(user.name)}
              </AvatarFallback>
            </Avatar>

            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-semibold text-[#142B45]">
                {user.name}
              </span>

              <span className="truncate text-xs text-[#64748B]">
                {user.email}
              </span>

              {role ? (
                <span className="mt-1 w-fit rounded-full bg-[#16A37A]/10 px-2 py-0.5 text-[11px] font-semibold text-[#16A37A]">
                  {ROLE_LABEL[role]}
                </span>
              ) : null}
            </span>
          </div>

          <DropdownMenuSeparator />

          {/* My Profile + Dashboard */}
          {profileLink ? (
            <AccountMenuItem link={profileLink} />
          ) : null}

          {dashboardLink ? (
            <AccountMenuItem link={dashboardLink} />
          ) : null}

          {/* Role-specific destinations */}
          {restLinks.length > 0 ? (
            <>
              <DropdownMenuSeparator />

              {restLinks.map((link) => (
                <AccountMenuItem
                  key={link.href}
                  link={link}
                />
              ))}
            </>
          ) : null}

          {/* Settings */}
          {settingsLink ? (
            <>
              <DropdownMenuSeparator />
              <AccountMenuItem link={settingsLink} />
            </>
          ) : null}

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            variant="destructive"
            disabled={isSigningOut}
            onClick={() => void signOutAndRedirect()}
            className="cursor-pointer"
          >
            <LogOut aria-hidden="true" />
            {isSigningOut ? "Logging out…" : "Logout"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
