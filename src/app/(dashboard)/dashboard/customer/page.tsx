
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Heart,
  Search,
  Wallet,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CustomerDashboardPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRentals() {
      try {
        const response = await fetch(
          `${API_URL}/api/rentals/my-rentals`,
          { credentials: "include" }
        );

        if (!response.ok) {
          setRentals([]);
          return;
        }

        const result = await response.json();
        setRentals(result.data || []);
      } catch (error) {
        console.error("Failed to fetch rentals:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRentals();
  }, []);

  const activeRentals = rentals.filter(
    (rental) =>
      rental.status === "approved" ||
      rental.status === "active"
  );

  const totalSpent = rentals.reduce(
    (total, rental) => total + Number(rental.totalAmount || 0),
    0
  );

  const stats = [
    {
      title: "Total Rentals",
      value: rentals.length,
      icon: CalendarCheck,
    },
    {
      title: "Active Rentals",
      value: activeRentals.length,
      icon: Wallet,
    },
    {
      title: "Total Spent",
      value: `৳${totalSpent.toLocaleString()}`,
      icon: Wallet,
    },
    {
      title: "Favorites",
      value: "—",
      icon: Heart,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Customer Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your equipment rentals and activities.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="mt-3 text-2xl font-bold">
                {loading ? "..." : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Quick Actions</h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/equipment"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          >
            <Search className="h-4 w-4" />
            Browse Equipment
          </Link>

          <Link
            href="/dashboard/customer/rentals"
            className="rounded-lg border px-4 py-2"
          >
            My Rentals
          </Link>

          <Link
            href="/dashboard/customer/favorites"
            className="rounded-lg border px-4 py-2"
          >
            My Favorites
          </Link>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Recent Rentals</h2>

        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Loading rentals...
          </p>
        ) : rentals.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              You have not rented any equipment yet.
            </p>

            <Link
              href="/equipment"
              className="mt-3 inline-block text-sm font-medium text-primary"
            >
              Explore Equipment →
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {rentals.slice(0, 5).map((rental) => (
              <div
                key={rental._id}
                className="flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {rental.equipmentTitle || "Equipment Rental"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {rental.status}
                  </p>
                </div>

                <p className="font-semibold">
                  ৳{Number(rental.totalAmount || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
