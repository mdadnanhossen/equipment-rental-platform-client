
export type EquipmentStatus = "pending" | "approved" | "rejected";

export type EquipmentAvailability = "available" | "unavailable";

export type EquipmentCondition =
  | "new"
  | "like-new"
  | "good"
  | "fair";

export type EquipmentImage = {
  url: string;
  publicId?: string;
};

export interface Equipment {
  _id: string;

  title: string;
  description: string;
  category: string;

  brand?: string;
  model?: string;

  pricePerDay: number;
  securityDeposit?: number;

  condition: EquipmentCondition;

  images: EquipmentImage[];

  location: {
    city: string;
    address: string;
  };

  availability: EquipmentAvailability;

  status: EquipmentStatus;
  rejectionReason?: string;

  ownerId: string;
  ownerName: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateEquipmentPayload {
  title: string;
  description: string;
  category: string;

  brand?: string;
  model?: string;

  pricePerDay: number;
  securityDeposit?: number;

  condition: EquipmentCondition;

  images: EquipmentImage[];

  location: {
    city: string;
    address: string;
  };
}

export type UpdateEquipmentPayload =
  Partial<CreateEquipmentPayload> & {
    availability?: EquipmentAvailability;
  };

export interface EquipmentQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;

  sortBy?: "newest" | "price-low" | "price-high";

  page?: number;
  limit?: number;
}

export interface EquipmentResponse {
  success: boolean;
  message: string;
  data: Equipment[];
  total?: number;
  page?: number;
  totalPages?: number;
}

export type TUserRole = "admin" | "owner" | "customer";

export interface TUser {
  name: string;
  email: string;
  image?: string | null;
  role: TUserRole;
}

export interface TDashboardSidebarItem {
  title: string;
  url: string;
  icon: React.ElementType;
}
