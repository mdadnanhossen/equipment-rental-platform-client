
import React, { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import DashboardSidebar from "@/components/dashboard/shared/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/shared/DashboardHeader";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";

// Dashboard loading fallback
function DashboardLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <p className="text-sm text-muted-foreground">
        Loading dashboard...
      </p>
    </div>
  );
}

// Dynamic authenticated dashboard
async function AuthenticatedDashboard({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get request headers
  const requestHeaders = await headers();

  // Get authenticated session
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  // Redirect unauthenticated users
  if (!session) {
    redirect("/signin");
  }

  // Validate role
  const role = session.user.role;

  if (
    role !== "admin" &&
    role !== "owner" &&
    role !== "customer"
  ) {
    redirect("/signin");
  }

  // Get sidebar cookie
  const cookieStore = await cookies();

  const defaultOpen =
    cookieStore.get("sidebar_state")?.value !== "false";

  // Prepare user data
  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role,
  };

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <DashboardSidebar user={user} />

        <SidebarInset>
          <DashboardHeader />

          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

// Main dashboard layout
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AuthenticatedDashboard>
        {children}
      </AuthenticatedDashboard>
    </Suspense>
  );
}
