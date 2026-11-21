
// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { toast } from "sonner";
// import type { Equipment, EquipmentStatus } from "@/types/equipment";

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// type FilterStatus = "all" | EquipmentStatus;

// const filters: FilterStatus[] = [
//   "all",
//   "pending",
//   "approved",
//   "rejected",
// ];

// export default function AdminEquipmentPage() {
//   const [equipment, setEquipment] = useState<Equipment[]>([]);
//   const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [processingId, setProcessingId] = useState("");
//   const [rejectId, setRejectId] = useState("");
//   const [reason, setReason] = useState("");

//   // Fetch all equipment
//   const fetchEquipment = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${API_URL}/api/admin/equipment`,
//         {
//           credentials: "include",
//           cache: "no-store",
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to fetch equipment"
//         );
//       }

//       setEquipment(result.data || []);
//     } catch (err) {
//       const message =
//         err instanceof Error
//           ? err.message
//           : "Something went wrong";

//       setError(message);
//       toast.error(message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchEquipment();
//   }, [fetchEquipment]);

//   // Search and filter
//   const filteredEquipment = useMemo(() => {
//     return equipment.filter((item) => {
//       const matchesStatus =
//         activeFilter === "all" || item.status === activeFilter;

//       const searchText = search.toLowerCase();

//       const matchesSearch =
//         item.title.toLowerCase().includes(searchText) ||
//         item.category.toLowerCase().includes(searchText) ||
//         item.ownerName.toLowerCase().includes(searchText);

//       return matchesStatus && matchesSearch;
//     });
//   }, [equipment, activeFilter, search]);

//   // Status counts
//   const counts = useMemo(
//     () => ({
//       all: equipment.length,
//       pending: equipment.filter(
//         (item) => item.status === "pending"
//       ).length,
//       approved: equipment.filter(
//         (item) => item.status === "approved"
//       ).length,
//       rejected: equipment.filter(
//         (item) => item.status === "rejected"
//       ).length,
//     }),
//     [equipment]
//   );

//   // Approve or Reject
//   const handleStatusChange = async (
//     id: string,
//     action: "approve" | "reject"
//   ) => {
//     if (action === "reject" && !reason.trim()) {
//       toast.error("Please provide a rejection reason");
//       return;
//     }

//     const toastId = toast.loading(
//       action === "approve"
//         ? "Approving equipment..."
//         : "Rejecting equipment..."
//     );

//     try {
//       setProcessingId(id);

//       const response = await fetch(
//         `${API_URL}/api/admin/equipment/${id}/${action}`,
//         {
//           method: "PATCH",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           ...(action === "reject"
//             ? {
//                 body: JSON.stringify({ reason }),
//               }
//             : {}),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || `Failed to ${action} equipment`
//         );
//       }

//       setEquipment((previous) =>
//         previous.map((item) =>
//           item._id === id
//             ? {
//                 ...item,
//                 status:
//                   action === "approve" ? "approved" : "rejected",
//                 rejectionReason:
//                   action === "reject" ? reason : undefined,
//               }
//             : item
//         )
//       );

//       setRejectId("");
//       setReason("");

//       toast.success(
//         action === "approve"
//           ? "Equipment approved successfully!"
//           : "Equipment rejected successfully!",
//         { id: toastId }
//       );
//     } catch (err) {
//       toast.error(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong",
//         { id: toastId }
//       );
//     } finally {
//       setProcessingId("");
//     }
//   };

//   // Revoke Approval: Approved -> Pending
//   const handleRevokeApproval = async (id: string) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to revoke this equipment approval? It will return to Pending status."
//     );

//     if (!confirmed) return;

//     const toastId = toast.loading("Revoking equipment approval...");

//     try {
//       setProcessingId(id);

//       const response = await fetch(
//         `${API_URL}/api/admin/equipment/${id}`,
//         {
//           method: "PATCH",
//           credentials: "include",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             status: "pending",
//             rejectionReason: "",
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(
//           result.message || "Failed to revoke approval"
//         );
//       }

//       setEquipment((previous) =>
//         previous.map((item) =>
//           item._id === id
//             ? {
//                 ...item,
//                 status: "pending",
//                 rejectionReason: undefined,
//               }
//             : item
//         )
//       );

//       toast.success(
//         "Equipment approval revoked successfully!",
//         { id: toastId }
//       );
//     } catch (err) {
//       toast.error(
//         err instanceof Error
//           ? err.message
//           : "Something went wrong",
//         { id: toastId }
//       );
//     } finally {
//       setProcessingId("");
//     }
//   };

//   return (
//     <div className="space-y-6 p-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold">All Equipment</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage all equipment submitted by owners.
//           </p>
//         </div>

//         <button
//           onClick={fetchEquipment}
//           disabled={loading}
//           className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
//         >
//           {loading ? "Refreshing..." : "Refresh"}
//         </button>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="rounded-lg bg-red-50 p-4 text-red-600">
//           {error}
//         </div>
//       )}

//       {/* Status Cards */}
//       <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
//         {filters.map((filter) => (
//           <button
//             key={filter}
//             onClick={() => setActiveFilter(filter)}
//             className={`rounded-xl border p-4 text-left transition ${
//               activeFilter === filter
//                 ? "border-black bg-black text-white"
//                 : "bg-white hover:bg-gray-50"
//             }`}
//           >
//             <p className="text-sm capitalize">
//               {filter} Equipment
//             </p>

//             <p className="mt-1 text-2xl font-bold">
//               {counts[filter]}
//             </p>
//           </button>
//         ))}
//       </div>

//       {/* Search */}
//       <input
//         type="search"
//         value={search}
//         onChange={(event) => setSearch(event.target.value)}
//         placeholder="Search by title, category or owner..."
//         className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
//       />

//       {/* Equipment List */}
//       {loading ? (
//         <div className="py-10 text-center text-gray-500">
//           Loading equipment...
//         </div>
//       ) : filteredEquipment.length === 0 ? (
//         <div className="rounded-xl border p-10 text-center">
//           <h2 className="font-semibold">No equipment found</h2>

//           <p className="mt-2 text-sm text-gray-500">
//             No equipment matches your selected filter.
//           </p>
//         </div>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//           {filteredEquipment.map((item) => (
//             <div
//               key={item._id}
//               className="overflow-hidden rounded-xl border bg-white"
//             >
//               {/* Image */}
//               {item.images?.[0]?.url && (
//                 <img
//                   src={item.images[0].url}
//                   alt={item.title}
//                   className="h-48 w-full object-cover"
//                 />
//               )}

//               <div className="space-y-3 p-4">
//                 {/* Title and Status */}
//                 <div className="flex items-start justify-between gap-2">
//                   <div>
//                     <h2 className="font-semibold">
//                       {item.title}
//                     </h2>

//                     <p className="text-sm text-gray-500">
//                       {item.category} · {item.location?.city}
//                     </p>
//                   </div>

//                   <span
//                     className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
//                       item.status === "approved"
//                         ? "bg-green-100 text-green-700"
//                         : item.status === "rejected"
//                         ? "bg-red-100 text-red-700"
//                         : "bg-yellow-100 text-yellow-700"
//                     }`}
//                   >
//                     {item.status}
//                   </span>
//                 </div>

//                 {/* Price */}
//                 <p className="font-semibold">
//                   ৳{item.pricePerDay} / day
//                 </p>

//                 {/* Owner */}
//                 <p className="text-sm text-gray-600">
//                   Owner: {item.ownerName}
//                 </p>

//                 {/* Rejection Reason */}
//                 {item.status === "rejected" &&
//                   item.rejectionReason && (
//                     <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
//                       Reason: {item.rejectionReason}
//                     </p>
//                   )}

//                 {/* Pending Actions */}
//                 {item.status === "pending" && (
//                   rejectId === item._id ? (
//                     <div className="space-y-2">
//                       <textarea
//                         value={reason}
//                         onChange={(event) =>
//                           setReason(event.target.value)
//                         }
//                         placeholder="Write rejection reason..."
//                         rows={3}
//                         className="w-full rounded-lg border p-3 outline-none focus:border-red-500"
//                       />

//                       <div className="flex gap-2">
//                         <button
//                           onClick={() =>
//                             handleStatusChange(item._id, "reject")
//                           }
//                           disabled={processingId === item._id}
//                           className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-50"
//                         >
//                           Confirm Reject
//                         </button>

//                         <button
//                           onClick={() => {
//                             setRejectId("");
//                             setReason("");
//                           }}
//                           className="rounded-lg border px-3 py-2"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() =>
//                           handleStatusChange(item._id, "approve")
//                         }
//                         disabled={processingId === item._id}
//                         className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700 disabled:opacity-50"
//                       >
//                         {processingId === item._id
//                           ? "Processing..."
//                           : "Approve"}
//                       </button>

//                       <button
//                         onClick={() => {
//                           setRejectId(item._id);
//                           setReason("");
//                         }}
//                         disabled={processingId === item._id}
//                         className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
//                       >
//                         Reject
//                       </button>
//                     </div>
//                   )
//                 )}

//                 {/* Approved Action */}
//                 {item.status === "approved" && (
//                   <button
//                     onClick={() =>
//                       handleRevokeApproval(item._id)
//                     }
//                     disabled={processingId === item._id}
//                     className="w-full rounded-lg border border-orange-500 px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
//                   >
//                     {processingId === item._id
//                       ? "Processing..."
//                       : "Revoke Approval"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Equipment, EquipmentStatus } from "@/types/equipment";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FilterStatus = "all" | EquipmentStatus;

const filters: FilterStatus[] = [
  "all",
  "pending",
  "approved",
  "rejected",
];

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState("");
  const [rejectId, setRejectId] = useState("");
  const [reason, setReason] = useState("");

  // Fetch all equipment
  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/equipment`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch equipment"
        );
      }

      setEquipment(result.data || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // Search and filter
  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesStatus =
        activeFilter === "all" || item.status === activeFilter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(searchText) ||
        item.category.toLowerCase().includes(searchText) ||
        item.ownerName.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [equipment, activeFilter, search]);

  // Status counts
  const counts = useMemo(
    () => ({
      all: equipment.length,
      pending: equipment.filter(
        (item) => item.status === "pending"
      ).length,
      approved: equipment.filter(
        (item) => item.status === "approved"
      ).length,
      rejected: equipment.filter(
        (item) => item.status === "rejected"
      ).length,
    }),
    [equipment]
  );

  // Approve or Reject equipment
  const handleStatusChange = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    if (processingId) return;

    if (action === "reject" && !reason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    const toastId = toast.loading(
      action === "approve"
        ? "Approving equipment..."
        : "Rejecting equipment..."
    );

    try {
      setProcessingId(id);

      const response = await fetch(
        `${API_URL}/api/admin/equipment/${id}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          ...(action === "reject"
            ? {
                body: JSON.stringify({ reason }),
              }
            : {}),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Failed to ${action} equipment`
        );
      }

      setEquipment((previous) =>
        previous.map((item) =>
          item._id === id
            ? {
                ...item,
                status:
                  action === "approve" ? "approved" : "rejected",
                rejectionReason:
                  action === "reject" ? reason.trim() : undefined,
              }
            : item
        )
      );

      setRejectId("");
      setReason("");

      toast.success(
        action === "approve"
          ? "Equipment approved successfully!"
          : "Equipment rejected successfully!",
        { id: toastId }
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong",
        { id: toastId }
      );
    } finally {
      setProcessingId("");
    }
  };

  // Revoke approval confirmation
  const handleRevokeApproval = (id: string) => {
  if (processingId) return;

  toast("Revoke equipment approval?", {
    description: "This equipment will return to Pending status.",
    duration: Infinity,
    action: {
      label: "Confirm",
      onClick: () => {
        void revokeApproval(id);
      },
    },
    cancel: {
      label: "Cancel",
      onClick: () => {},
    },
  });
};

  // Revoke Approval: Approved -> Pending
  const revokeApproval = async (id: string) => {
    if (processingId) return;

    const toastId = toast.loading(
      "Revoking equipment approval..."
    );

    try {
      setProcessingId(id);

      const response = await fetch(
        `${API_URL}/api/admin/equipment/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "pending",
            rejectionReason: "",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to revoke approval"
        );
      }

      setEquipment((previous) =>
        previous.map((item) =>
          item._id === id
            ? {
                ...item,
                status: "pending",
                rejectionReason: undefined,
              }
            : item
        )
      );

      toast.success(
        "Equipment approval revoked successfully!",
        { id: toastId }
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong",
        { id: toastId }
      );
    } finally {
      setProcessingId("");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">All Equipment</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all equipment submitted by owners.
          </p>
        </div>

        <button
          onClick={fetchEquipment}
          disabled={loading || !!processingId}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Status Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-xl border p-4 text-left transition ${
              activeFilter === filter
                ? "border-black bg-black text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <p className="text-sm capitalize">
              {filter} Equipment
            </p>

            <p className="mt-1 text-2xl font-bold">
              {counts[filter]}
            </p>
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search by title, category or owner..."
        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-black"
      />

      {/* Equipment List */}
      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading equipment...
        </div>
      ) : filteredEquipment.length === 0 ? (
        <div className="rounded-xl border p-10 text-center">
          <h2 className="font-semibold">No equipment found</h2>

          <p className="mt-2 text-sm text-gray-500">
            No equipment matches your selected filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEquipment.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden rounded-xl border bg-white"
            >
              {/* Image */}
              {item.images?.[0]?.url && (
                <img
                  src={item.images[0].url}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="space-y-3 p-4">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold">
                      {item.title}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {item.category} · {item.location?.city}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      item.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : item.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Price */}
                <p className="font-semibold">
                  ৳{item.pricePerDay} / day
                </p>

                {/* Owner */}
                <p className="text-sm text-gray-600">
                  Owner: {item.ownerName}
                </p>

                {/* Rejection Reason */}
                {item.status === "rejected" &&
                  item.rejectionReason && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                      Reason: {item.rejectionReason}
                    </p>
                  )}

                {/* Pending Actions */}
                {item.status === "pending" &&
                  (rejectId === item._id ? (
                    <div className="space-y-2">
                      <textarea
                        value={reason}
                        onChange={(event) =>
                          setReason(event.target.value)
                        }
                        placeholder="Write rejection reason..."
                        rows={3}
                        className="w-full rounded-lg border p-3 outline-none focus:border-red-500"
                      />

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(item._id, "reject")
                          }
                          disabled={!!processingId}
                          className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-white disabled:opacity-50"
                        >
                          {processingId === item._id
                            ? "Processing..."
                            : "Confirm Reject"}
                        </button>

                        <button
                          onClick={() => {
                            setRejectId("");
                            setReason("");
                          }}
                          disabled={!!processingId}
                          className="rounded-lg border px-3 py-2 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleStatusChange(item._id, "approve")
                        }
                        disabled={!!processingId}
                        className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        {processingId === item._id
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        onClick={() => {
                          setRejectId(item._id);
                          setReason("");
                        }}
                        disabled={!!processingId}
                        className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  ))}

                {/* Approved Action */}
                {item.status === "approved" && (
                  <button
                    onClick={() =>
                      handleRevokeApproval(item._id)
                    }
                    disabled={!!processingId}
                    className="w-full rounded-lg border border-orange-500 px-3 py-2 text-sm font-medium text-orange-600 transition hover:bg-orange-50 disabled:opacity-50"
                  >
                    {processingId === item._id
                      ? "Processing..."
                      : "Revoke Approval"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
