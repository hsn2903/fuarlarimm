export interface Hotel {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  zip?: string | null;
  phone?: string | null;
  email?: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface HotelFormData {
  name: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  phone?: string;
  email?: string;
  images: string[];
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
