
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { signOut, useSession } from "@/lib/auth-client";
import { isUserRole, type UserRole } from "@/lib/navigation";

type SessionData = ReturnType<typeof useSession>["data"];

export type SessionUser = NonNullable<SessionData>["user"];

export interface AuthState {
  user: SessionUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isPending: boolean;
  isRefetching: boolean;
}

export function useAuth(): AuthState {
  const { data, isPending, isRefetching } = useSession();

  const user = data?.user ?? null;
  const rawRole: unknown = user?.role;

  return {
    user,
    role: isUserRole(rawRole) ? rawRole : null,
    isAuthenticated: user !== null,
    isPending,
    isRefetching,
  };
}

export interface SignOutState {
  signOutAndRedirect: () => Promise<void>;
  isSigningOut: boolean;
}

export function useSignOut(): SignOutState {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOutAndRedirect = useCallback(async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  }, [isSigningOut, router]);

  return { signOutAndRedirect, isSigningOut };
}
