
"use client";

import { useSession } from "@/lib/auth-client";
import {
  UserRound,
  Mail,
  ShieldCheck,
  CalendarDays,
  Loader2,
  ShoppingBag,
} from "lucide-react";

export default function CustomerProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Please login to view your profile.
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Customer Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your personal and account information.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="h-32 bg-primary/10" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Customer"}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-12 w-12 text-muted-foreground" />
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold">
              {user.name || "Customer"}
            </h2>

            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <ShoppingBag className="h-4 w-4" />
              Customer
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <h2 className="mb-5 text-lg font-semibold">
          Personal Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">
                {user.name || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email Address</p>
              <p className="break-all font-medium">
                {user.email || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Role</p>
              <p className="font-medium capitalize">
                {user.role || "customer"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Account Created</p>
              <p className="font-medium">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
