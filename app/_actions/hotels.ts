/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/prisma";
import { Hotel, HotelFormData } from "@/lib/types/hotel";
import { revalidatePath } from "next/cache";

// export async function getHotels() {
//   try {
//     const hotels = await prisma.hotel.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     return hotels;
//   } catch (error) {
//     console.error("Error fetching hotels:", error);
//     throw new Error("Failed to fetch hotels");
//   }
// }

export interface HotelFilters {
  search?: string;
  city?: string;
  country?: string;
  sortBy?: "name" | "createdAt" | "city" | "country";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface HotelResponse {
  hotels: Hotel[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export async function getHotels(
  filters?: HotelFilters
): Promise<HotelResponse> {
  try {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    // Search filter (name or description)
    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // City filter
    if (filters?.city) {
      whereClause.city = { contains: filters.city, mode: "insensitive" };
    }

    // Country filter
    if (filters?.country) {
      whereClause.country = { contains: filters.country, mode: "insensitive" };
    }

    // Sorting
    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || "asc";
    } else {
      orderBy.createdAt = "desc"; // Default sort by creation date
    }

    // Get total count
    const total = await prisma.hotel.count({ where: whereClause });

    // Get paginated hotels
    const hotels = await prisma.hotel.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        country: true,
        zip: true,
        phone: true,
        email: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      hotels,
      total,
      page,
      limit,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw new Error("Failed to fetch hotels");
  }
}
export async function getHotelById(id: string) {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
    });

    if (!hotel) {
      throw new Error("Hotel not found");
    }

    return hotel;
  } catch (error) {
    console.error("Error fetching hotel:", error);
    throw new Error("Failed to fetch hotel");
  }
}

export async function getDistinctCities() {
  try {
    const cities = await prisma.hotel.findMany({
      select: {
        city: true,
      },
      where: {
        city: {
          not: null,
        },
      },
      distinct: ["city"],
      orderBy: {
        city: "asc",
      },
    });

    return cities.map((city) => city.city).filter(Boolean) as string[];
  } catch (error) {
    console.error("Error fetching distinct cities:", error);
    return [];
  }
}

export async function getDistinctCountries() {
  try {
    const countries = await prisma.hotel.findMany({
      select: {
        country: true,
      },
      where: {
        country: {
          not: null,
        },
      },
      distinct: ["country"],
      orderBy: {
        country: "asc",
      },
    });

    return countries
      .map((country) => country.country)
      .filter(Boolean) as string[];
  } catch (error) {
    console.error("Error fetching distinct countries:", error);
    return [];
  }
}

export async function createHotel(formData: HotelFormData) {
  try {
    // Validation
    if (!formData.name.trim()) {
      throw new Error("Hotel name is required");
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      throw new Error("Invalid email format");
    }

    const hotel = await prisma.hotel.create({
      data: formData,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        country: true,
        zip: true,
        phone: true,
        email: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath("/dashboard/hotels");
    return hotel;
  } catch (error) {
    console.error("Error creating hotel:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create hotel");
  }
}

export async function updateHotel(id: string, formData: HotelFormData) {
  try {
    // Validation
    if (!formData.name.trim()) {
      throw new Error("Hotel name is required");
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      throw new Error("Invalid email format");
    }

    const hotel = await prisma.hotel.update({
      where: { id },
      data: formData,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        country: true,
        zip: true,
        phone: true,
        email: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath("/dashboard/hotels");
    revalidatePath(`/dashboard/hotels/${id}`);
    revalidatePath(`/dashboard/hotels/edit/${id}`);
    return hotel;
  } catch (error) {
    console.error("Error updating hotel:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update hotel");
  }
}

export async function deleteHotel(id: string) {
  try {
    await prisma.hotel.delete({
      where: { id },
    });

    revalidatePath("/dashboard/hotels");
    return { success: true };
  } catch (error) {
    console.error("Error deleting hotel:", error);
    throw new Error("Failed to delete hotel");
  }
}

// export async function getHotelById(id: string) {
//   try {
//     const hotel = await prisma.hotel.findUnique({
//       where: { id },
//     });

//     if (!hotel) {
//       throw new Error("Hotel not found");
//     }

//     return hotel;
//   } catch (error) {
//     console.error("Error fetching hotel:", error);
//     throw new Error("Failed to fetch hotel");
//   }
// }

// export async function createHotel(formData: HotelFormData) {
//   try {
//     // Validation
//     if (!formData.name.trim()) {
//       throw new Error("Hotel name is required");
//     }

//     if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
//       throw new Error("Invalid email format");
//     }

//     const hotel = await prisma.hotel.create({
//       data: formData,
//     });

//     revalidatePath("/dashboard/hotels");
//     return hotel;
//   } catch (error) {
//     console.error("Error creating hotel:", error);
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error("Failed to create hotel");
//   }
// }

// export async function updateHotel(id: string, formData: HotelFormData) {
//   try {
//     // Validation
//     if (!formData.name.trim()) {
//       throw new Error("Hotel name is required");
//     }

//     if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
//       throw new Error("Invalid email format");
//     }

//     const hotel = await prisma.hotel.update({
//       where: { id },
//       data: formData,
//     });

//     revalidatePath("/dashboard/hotels");
//     revalidatePath(`/dashboard/hotels/${id}`);
//     revalidatePath(`/dashboard/hotels/edit/${id}`);
//     return hotel;
//   } catch (error) {
//     console.error("Error updating hotel:", error);
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error("Failed to update hotel");
//   }
// }

// export async function deleteHotel(id: string) {
//   try {
//     await prisma.hotel.delete({
//       where: { id },
//     });

//     revalidatePath("/dashboard/hotels");
//     return { success: true };
//   } catch (error) {
//     console.error("Error deleting hotel:", error);
//     throw new Error("Failed to delete hotel");
//   }
// }
