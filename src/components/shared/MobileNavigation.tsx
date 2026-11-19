"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Truck } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth, useSignOut } from "@/hooks/use-auth";
import {
  isPathActive,
  navForRole,
  PUBLIC_LINKS,
  ROLE_LABEL,
  type NavLink,
} from "@/lib/navigation";
import { cn, initialsOf } from "@/lib/utils";

const linkClass = "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors";

/**
 * Hamburger + Sheet drawer for small screens. Contains every navigation
 * link (public and role-based), the auth actions, and closes on any link
 * click or logout.
 */
export function MobileNavigation() {
  const pathname = usePathname();
  const { user, role, isPending, isAuthenticated } = useAuth();
  const { signOutAndRedirect, isSigningOut } = useSignOut();
  const [isOpen, setIsOpen] = useState(false);

  const dashboardLinks = navForRole(role);
  const badgeLabel = role ? ROLE_LABEL[role] : "Account";

  const handleLogout = () => {
    setIsOpen(false);
    void signOutAndRedirect();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger
        aria-label="Open navigation menu"
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-10 text-[#142B45] hover:bg-[#F1F5F9] lg:hidden"
          />
        }
      >
        <Menu />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 gap-0 border-l border-[#E2E8F0] bg-white"
      >
        <SheetHeader className="border-b border-[#E2E8F0]">
          <SheetTitle className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-lg bg-[#142B45] text-white"
            >
              <Truck className="size-4" />
            </span>
            <span className="text-base font-bold text-[#142B45]">Rentora</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigation menu
          </SheetDescription>
        </SheetHeader>

        <nav
          aria-label="Mobile"
          className="flex-1 overflow-y-auto px-3 py-4"
        >
          <span className="block px-3 pb-2 text-xs font-semibold tracking-wide text-[#94A3B8] uppercase">
            Menu
          </span>
          <ul className="flex flex-col gap-1">
            {PUBLIC_LINKS.map((link) => (
              <MobileNavLink
                key={link.href}
                link={link}
                pathname={pathname}
              />
            ))}
          </ul>

          {isPending ? (
            <div className="mt-6 flex flex-col gap-2" aria-hidden="true">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-3/4 rounded-lg" />
            </div>
          ) : isAuthenticated ? (
            <div className="mt-6">
              <div className="flex items-center gap-2 px-3 pb-2">
                <span className="text-xs font-semibold tracking-wide text-[#94A3B8] uppercase">
                  Dashboard
                </span>
                <span className="rounded-full bg-[#16A37A]/10 px-2 py-0.5 text-[11px] font-semibold text-[#16A37A]">
                  {badgeLabel}
                </span>
              </div>
              <ul className="flex flex-col gap-1">
                {dashboardLinks.map((link) => (
                  <MobileNavLink
                    key={link.href}
                    link={link}
                    pathname={pathname}
                  />
                ))}
              </ul>
            </div>
          ) : null}
        </nav>

        <SheetFooter className="border-t border-[#E2E8F0]">
          {isPending ? (
            <div className="flex w-full flex-col gap-2" aria-hidden="true">
              <Skeleton className="h-11 w-full rounded-lg" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex w-full flex-col gap-3">
              <div className="flex items-center gap-3 rounded-lg bg-[#F8FAFC] px-3 py-3 ring-1 ring-[#E2E8F0]">
                <Avatar size="sm" className="border border-[#E2E8F0]">
                  {user.image ? <AvatarImage src={user.image} alt="" /> : null}
                  <AvatarFallback className="bg-[#16A37A] text-[11px] font-semibold text-white">
                    {initialsOf(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[#142B45]">
                    {user.name}
                  </span>
                  <span className="block truncate text-xs text-[#64748B]">
                    {user.email}
                  </span>
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                disabled={isSigningOut}
                onClick={handleLogout}
                className="h-11 w-full justify-start gap-2.5 px-3 text-sm font-medium text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
              >
                <LogOut aria-hidden="true" />
                {isSigningOut ? "Logging out…" : "Logout"}
              </Button>
            </div>
          ) : (
            <div className="flex w-full flex-col gap-2">
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href="/signin"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-11 w-full text-sm font-medium text-[#142B45]"
                    )}
                  />
                }
              >
                Login
              </SheetClose>
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href="/signup"
                    className={cn(
                      buttonVariants(),
                      "h-11 w-full bg-[#142B45] text-sm font-medium text-white hover:bg-[#142B45]/90"
                    )}
                  />
                }
              >
                Register
              </SheetClose>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function MobileNavLink({ link, pathname }: { link: NavLink; pathname: string }) {
  const active = isPathActive(pathname, link);

  return (
    <li>
      <SheetClose
        nativeButton={false}
        render={
          <Link
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              linkClass,
              active
                ? "bg-[#F1F5F9] font-semibold text-[#142B45]"
                : "text-[#334155] hover:bg-[#F1F5F9] hover:text-[#142B45]"
            )}
          />
        }
      >
        <link.icon className="size-4 shrink-0" aria-hidden="true" />
        {link.label}
      </SheetClose>
    </li>
  );
}
