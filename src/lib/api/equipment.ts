
import type {
  Equipment,
  EquipmentImage,
  EquipmentQuery,
  EquipmentResponse,
} from "@/types/equipment";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Upload equipment images
export async function uploadEquipmentImages(
  files: File[]
): Promise<EquipmentImage[]> {
  if (!files.length) {
    throw new Error("Please select at least one image");
  }

  if (files.length > 5) {
    throw new Error("You can upload a maximum of 5 images");
  }

  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });

  const response = await fetch(
    `${API_URL}/api/equipment/upload-images`,
    {
      method: "POST",
      body: formData,
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to upload equipment images"
    );
  }

  return result.data as EquipmentImage[];
}

// Get all public approved equipment
export async function getAllEquipment(
  query: EquipmentQuery = {}
): Promise<EquipmentResponse> {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.location) params.set("location", query.location);
  if (query.rentalType) params.set("rentalType", query.rentalType);
  if (query.availability) {
    params.set("availability", query.availability);
  }
  if (query.minPrice !== undefined) {
    params.set("minPrice", String(query.minPrice));
  }
  if (query.maxPrice !== undefined) {
    params.set("maxPrice", String(query.maxPrice));
  }
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.page !== undefined) {
    params.set("page", String(query.page));
  }
  if (query.limit !== undefined) {
    params.set("limit", String(query.limit));
  }

  const response = await fetch(
    `${API_URL}/api/equipment?${params.toString()}`
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to fetch equipment"
    );
  }

  return result as EquipmentResponse;
}

// Get one approved equipment detail
export async function getEquipmentById(
  id: string
): Promise<Equipment> {
  const response = await fetch(
    `${API_URL}/api/equipment/${id}`
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Failed to fetch equipment details"
    );
  }

  return result.data as Equipment;
}
