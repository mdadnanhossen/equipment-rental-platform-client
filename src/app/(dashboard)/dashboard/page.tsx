
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const role = session.user.role;

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  if (role === "owner") {
    redirect("/dashboard/owner");
  }

  if (role === "customer") {
    redirect("/dashboard/customer");
  }

  redirect("/signin");
}
