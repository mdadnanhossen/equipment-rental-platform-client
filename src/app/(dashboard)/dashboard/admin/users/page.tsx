
"use client";

import { useCallback, useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: "admin" | "owner" | "customer";
  image?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/users`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch users");
      }

      setUsers(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.role?.toLowerCase().includes(value)
    );
  });

  const roleCounts = {
    admin: users.filter((user) => user.role === "admin").length,
    owner: users.filter((user) => user.role === "owner").length,
    customer: users.filter((user) => user.role === "customer").length,
  };

  if (loading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            View all registered Rentora users.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="rounded-lg border px-4 py-2 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="mt-1 text-2xl font-bold">{users.length}</h2>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Admins</p>
          <h2 className="mt-1 text-2xl font-bold">{roleCounts.admin}</h2>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Owners</p>
          <h2 className="mt-1 text-2xl font-bold">{roleCounts.owner}</h2>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Customers</p>
          <h2 className="mt-1 text-2xl font-bold">{roleCounts.customer}</h2>
        </div>
      </div>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by name, email or role..."
        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
      />

      {error ? (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Account</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id || user.id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-semibold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}

                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>

                  <td className="p-4">{user.email}</td>

                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1 capitalize">
                      {user.role}
                    </span>
                  </td>

                  <td className="p-4 text-green-600">Registered</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
