"use client";

import Link from "next/link";
import { Suspense } from "react";
import { LogIn, Truck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  DesktopDashboardSubnav,
  DesktopNavigation,
} from "@/components/shared/DesktopNavigation";
import { MobileNavigation } from "@/components/shared/MobileNavigation";
import { UserMenu } from "@/components/shared/UserMenu";

function Logo() {
  return (
    <Link
      href="/"
      aria-label="Rentora home"
      className="flex h-full shrink-0 items-center gap-2.5"
    >
      <span
        aria-hidden="true"
        className="flex size-9 items-center justify-center rounded-xl bg-[#142B45] text-white"
      >
        <Truck className="size-5" />
      </span>
      <span className="text-lg font-bold tracking-tight text-[#142B45]">
        Rentora
      </span>
    </Link>
  );
}

/** Shown while the session request is still resolving. */
function AuthActionsSkeleton() {
  return (
    <div className="hidden items-center gap-2 md:flex" aria-hidden="true">
      <Skeleton className="h-9 w-20 rounded-lg" />
      <Skeleton className="h-9 w-28 rounded-lg" />
    </div>
  );
}

function LoggedOutActions() {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <Link
        href="/signin"
        className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-[#142B45] transition-colors hover:bg-[#F1F5F9]"
      >
        <LogIn className="size-4" aria-hidden="true" />
        Login
      </Link>
      <Link
        href="/signup"
        className={buttonVariants({
          className:
            "h-9 bg-[#142B45] px-4 text-sm font-medium text-white hover:bg-[#142B45]/90",
        })}
      >
        Get Started
      </Link>
    </div>
  );
}

/**
 * App-wide navbar: sticky, responsive, and driven by the real Better Auth
 * session. Desktop shows centered public links plus the role-based
 * dashboard subnav; mobile uses the Sheet drawer.
 */
export function Navbar() {
  const { isPending, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex h-full flex-1 items-center">
          <Logo />
        </div>

        {/* usePathname() suspends on dynamic routes without
            generateStaticParams, so these need their own boundaries to
            keep the static shell prerenderable. */}
        <Suspense
          fallback={
            <nav
              aria-label="Main"
              className="hidden h-full flex-1 items-center justify-center gap-1 lg:flex"
            />
          }
        >
          <DesktopNavigation />
        </Suspense>

        <div className="flex h-full flex-1 items-center justify-end gap-2 sm:gap-3">
          {isPending ? (
            <AuthActionsSkeleton />
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <LoggedOutActions />
          )}
          <Suspense
            fallback={<div className="size-10 lg:hidden" aria-hidden="true" />}
          >
            <MobileNavigation />
          </Suspense>
        </div>
      </div>

      {/* Role-based dashboard links (desktop only, signed-in only). */}
      {!isPending && isAuthenticated ? <DesktopDashboardSubnav /> : null}
    </header>
  );
}
