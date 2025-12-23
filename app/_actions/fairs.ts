/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { fairSchema } from "@/lib/validations";
import { z } from "zod";
import prisma from "@/lib/prisma";
import type { Fair, ProgramItem } from "@/lib/types";

// Serialize Prisma data to Fair type
function serializeFair(fair: any): Fair {
  return {
    ...fair,
    tourPrograms: fair.tourPrograms.map((tp: any) => ({
      id: tp.id,
      title1: tp.title1,
      title2: tp.title2,
      title3: tp.title3,
      singlePersonPrice: tp.singlePersonPrice,
      twoPersonPrice: tp.twoPersonPrice,
      programs: Array.isArray(tp.programs)
        ? (tp.programs as ProgramItem[])
        : [],
    })),
  };
}

// Get all fairs
export async function getFairs() {
  try {
    const fairs = await prisma.fair.findMany({
      include: {
        hotel: true,
        fairImages: true,
        tourImages: true,
        tourPrograms: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedFairs = fairs.map(serializeFair);
    return { success: true, data: serializedFairs };
  } catch (error) {
    console.error("Error fetching fairs:", error);
    return { success: false, error: "Failed to fetch fairs" };
  }
}

// Get a single fair by ID
export async function getFairById(id: string) {
  try {
    const fair = await prisma.fair.findUnique({
      where: { id },
      include: {
        hotel: true,
        fairImages: true,
        tourImages: true,
        tourPrograms: true,
      },
    });

    if (!fair) {
      return { success: false, error: "Fair not found" };
    }

    const serializedFair = serializeFair(fair);
    return { success: true, data: serializedFair };
  } catch (error) {
    console.error("Error fetching fair:", error);
    return { success: false, error: "Failed to fetch fair" };
  }
}

// Create a new fair
export async function createFair(data: z.infer<typeof fairSchema>) {
  try {
    // Validate input
    const validatedData = fairSchema.parse(data);

    // Parse dates
    const startDate = validatedData.startDate
      ? new Date(validatedData.startDate)
      : null;
    const endDate = validatedData.endDate
      ? new Date(validatedData.endDate)
      : null;

    // Create fair with nested relations
    const fair = await prisma.fair.create({
      data: {
        fairId: validatedData.fairId,
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        shortDescription: validatedData.shortDescription,
        website: validatedData.website,
        venue: validatedData.venue,
        city: validatedData.city,
        country: validatedData.country,
        type: validatedData.type,
        category: validatedData.category,
        logo: validatedData.logo,
        coverImage: validatedData.coverImage,
        displayedProducts: validatedData.displayedProducts,
        tourNote: validatedData.tourNote,
        isFeatured: validatedData.isFeatured,
        isPublished: validatedData.isPublished,
        hasBanner: validatedData.hasBanner,
        isSectoral: validatedData.isSectoral,
        isDefiniteDeparture: validatedData.isDefiniteDeparture,
        dateString: validatedData.dateString,
        startDate,
        endDate,
        extraServices: validatedData.extraServices,
        includedServices: validatedData.includedServices,
        // Create hotel if provided
        hotel: validatedData.hotel
          ? {
              create: {
                name: validatedData.hotel.name,
                description: validatedData.hotel.description,
                address: validatedData.hotel.address,
                city: validatedData.hotel.city,
                country: validatedData.hotel.country,
                zip: validatedData.hotel.zip,
                phone: validatedData.hotel.phone,
                email: validatedData.hotel.email,
                images: validatedData.hotel.images || [],
              },
            }
          : undefined,
        // Create fair images if provided
        fairImages: validatedData.fairImages
          ? {
              create: {
                name: validatedData.fairImages.name,
                description: validatedData.fairImages.description,
                images: validatedData.fairImages.images || [],
              },
            }
          : undefined,
        // Create tour images if provided
        tourImages: validatedData.tourImages
          ? {
              create: {
                name: validatedData.tourImages.name,
                description: validatedData.tourImages.description,
                images: validatedData.tourImages.images || [],
              },
            }
          : undefined,
        // Create tour programs
        tourPrograms: {
          create: validatedData.tourPrograms.map((program) => ({
            programId: program.programId,
            title1: program.title1,
            title2: program.title2,
            title3: program.title3,
            singlePersonPrice: program.singlePersonPrice,
            twoPersonPrice: program.twoPersonPrice,
            programs: program.programs,
          })),
        },
      },
      include: {
        hotel: true,
        fairImages: true,
        tourImages: true,
        tourPrograms: true,
      },
    });

    revalidatePath("/dashboard/fairs");
    const serializedFair = serializeFair(fair);
    return {
      success: true,
      data: serializedFair,
      message: "Fair created successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    console.error("Error creating fair:", error);
    return { success: false, error: "Failed to create fair" };
  }
}

// Delete a fair
export async function deleteFair(id: string) {
  try {
    // Delete related records first
    await prisma.tourProgram.deleteMany({
      where: { fairId: id },
    });

    // Delete the fair (cascade will handle relations)
    await prisma.fair.delete({
      where: { id },
    });

    revalidatePath("/dashboard/fairs");
    return { success: true, message: "Fair deleted successfully" };
  } catch (error) {
    console.error("Error deleting fair:", error);
    return { success: false, error: "Failed to delete fair" };
  }
}

// Update an existing fair
export async function updateFair(id: string, data: z.infer<typeof fairSchema>) {
  try {
    // Validate input
    const validatedData = fairSchema.parse(data);

    // Parse dates
    const startDate = validatedData.startDate
      ? new Date(validatedData.startDate)
      : null;
    const endDate = validatedData.endDate
      ? new Date(validatedData.endDate)
      : null;

    // First, delete existing tour programs
    await prisma.tourProgram.deleteMany({
      where: { fairId: id },
    });

    // Update fair with nested relations
    const fair = await prisma.fair.update({
      where: { id },
      data: {
        fairId: validatedData.fairId,
        name: validatedData.name,
        slug: validatedData.slug,
        description: validatedData.description,
        shortDescription: validatedData.shortDescription,
        website: validatedData.website,
        venue: validatedData.venue,
        city: validatedData.city,
        country: validatedData.country,
        type: validatedData.type,
        category: validatedData.category,
        logo: validatedData.logo,
        coverImage: validatedData.coverImage,
        displayedProducts: validatedData.displayedProducts,
        tourNote: validatedData.tourNote,
        isFeatured: validatedData.isFeatured,
        isPublished: validatedData.isPublished,
        hasBanner: validatedData.hasBanner,
        isSectoral: validatedData.isSectoral,
        isDefiniteDeparture: validatedData.isDefiniteDeparture,
        dateString: validatedData.dateString,
        startDate,
        endDate,
        extraServices: validatedData.extraServices,
        includedServices: validatedData.includedServices,
        // Update or create hotel
        hotel: validatedData.hotel
          ? {
              upsert: {
                create: {
                  name: validatedData.hotel.name,
                  description: validatedData.hotel.description,
                  address: validatedData.hotel.address,
                  city: validatedData.hotel.city,
                  country: validatedData.hotel.country,
                  zip: validatedData.hotel.zip,
                  phone: validatedData.hotel.phone,
                  email: validatedData.hotel.email,
                  images: validatedData.hotel.images || [],
                },
                update: {
                  name: validatedData.hotel.name,
                  description: validatedData.hotel.description,
                  address: validatedData.hotel.address,
                  city: validatedData.hotel.city,
                  country: validatedData.hotel.country,
                  zip: validatedData.hotel.zip,
                  phone: validatedData.hotel.phone,
                  email: validatedData.hotel.email,
                  images: validatedData.hotel.images || [],
                },
              },
            }
          : { delete: true },
        // Update or create fair images
        fairImages: validatedData.fairImages
          ? {
              upsert: {
                create: {
                  name: validatedData.fairImages.name,
                  description: validatedData.fairImages.description,
                  images: validatedData.fairImages.images || [],
                },
                update: {
                  name: validatedData.fairImages.name,
                  description: validatedData.fairImages.description,
                  images: validatedData.fairImages.images || [],
                },
              },
            }
          : { delete: true },
        // Update or create tour images
        tourImages: validatedData.tourImages
          ? {
              upsert: {
                create: {
                  name: validatedData.tourImages.name,
                  description: validatedData.tourImages.description,
                  images: validatedData.tourImages.images || [],
                },
                update: {
                  name: validatedData.tourImages.name,
                  description: validatedData.tourImages.description,
                  images: validatedData.tourImages.images || [],
                },
              },
            }
          : { delete: true },
        // Create new tour programs
        tourPrograms: {
          create: validatedData.tourPrograms.map((program) => ({
            programId: program.programId,
            title1: program.title1,
            title2: program.title2,
            title3: program.title3,
            singlePersonPrice: program.singlePersonPrice,
            twoPersonPrice: program.twoPersonPrice,
            programs: program.programs,
          })),
        },
      },
      include: {
        hotel: true,
        fairImages: true,
        tourImages: true,
        tourPrograms: true,
      },
    });

    revalidatePath("/dashboard/fairs");
    revalidatePath(`/dashboard/fairs/${id}`);
    revalidatePath(`/dashboard/fairs/${id}/edit`);

    const serializedFair = serializeFair(fair);
    return {
      success: true,
      data: serializedFair,
      message: "Fair updated successfully",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    console.error("Error updating fair:", error);
    return { success: false, error: "Failed to update fair" };
  }
}

// Toggle fair publish status
export async function toggleFairPublish(id: string, isPublished: boolean) {
  try {
    const fair = await prisma.fair.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/dashboard/fairs");
    return {
      success: true,
      data: fair,
      message: `Fair ${isPublished ? "published" : "unpublished"} successfully`,
    };
  } catch (error) {
    console.error("Error toggling fair publish status:", error);
    return { success: false, error: "Failed to update fair status" };
  }
}

// Toggle fair featured status
export async function toggleFairFeatured(id: string, isFeatured: boolean) {
  try {
    const fair = await prisma.fair.update({
      where: { id },
      data: { isFeatured },
    });

    revalidatePath("/dashboard/fairs");
    return {
      success: true,
      data: fair,
      message: `Fair ${isFeatured ? "featured" : "unfeatured"} successfully`,
    };
  } catch (error) {
    console.error("Error toggling fair featured status:", error);
    return { success: false, error: "Failed to update fair featured status" };
  }
}
