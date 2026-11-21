/**
 * Shared equipment types mirroring the shapes produced by the Express
 * backend (`equipment.model.js` / `equipment.routes.js`). Dates arrive as
 * ISO strings because they are serialized by `JSON.stringify`.
 */

export type EquipmentCondition = "new" | "like-new" | "good" | "fair";

export type EquipmentStatus = "pending" | "approved" | "rejected";

export type EquipmentAvailability = "available" | "unavailable";

export type RentalType = "daily" | "weekly" | "monthly";

export interface EquipmentImage {
  url: string;
  publicId?: string;
}

export interface EquipmentLocation {
  city: string;
  address: string;
}

export interface Equipment {
  _id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  /** Single rental price used for every rental type (per day). */
  pricePerDay: number;
  /** daily | weekly | monthly label for the listing. */
  rentalType: RentalType;
  /** Available quantity of units. */
  quantity: number;
  /** Free-text rental terms & conditions shown at booking. */
  rentalTerms: string;
  securityDeposit: number;
  condition: EquipmentCondition;
  images: EquipmentImage[];
  location: EquipmentLocation;
  availability: EquipmentAvailability;
  status: EquipmentStatus;
  ownerId: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

/** Query accepted by `GET /api/equipment` (public, approved only). */
export interface EquipmentQuery {
  search?: string;
  category?: string;
  location?: string;
  rentalType?: RentalType;
  availability?: EquipmentAvailability;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "newest" | "price-low" | "price-high";
  page?: number;
  limit?: number;
}

/** Envelope returned by the public equipment list endpoint. */
export interface EquipmentResponse {
  success: boolean;
  message: string;
  data: Equipment[];
  total: number;
  page: number;
  totalPages: number;
}

/** Body posted by owners when creating a listing. */
export interface CreateEquipmentPayload {
  title: string;
  description: string;
  category: string;
  brand: string;
  model: string;
  rentalType: RentalType;
  /** Single rental price field (per day) for every rental type. */
  pricePerDay: number;
  quantity: number;
  rentalTerms: string;
  securityDeposit: number;
  condition: EquipmentCondition;
  images: EquipmentImage[];
  location: EquipmentLocation;
}