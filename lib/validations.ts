import { z } from "zod";

export const programItemSchema = z.object({
  date: z.string().min(1, "Date is required"),
  activity: z.string().min(1, "Activity is required"),
});

export const tourProgramSchema = z.object({
  programId: z.string().min(1, "Program ID is required"),
  title1: z.string().min(1, "Title 1 is required"),
  title2: z.string().min(1, "Title 2 is required"),
  title3: z.string().min(1, "Title 3 is required"),
  singlePersonPrice: z.string().min(1, "Single person price is required"),
  twoPersonPrice: z.string().min(1, "Two person price is required"),
  programs: z
    .array(programItemSchema)
    .min(1, "At least one program item is required"),
});

export const hotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  images: z.array(z.string()).optional(),
});

export const fairImagesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const tourImagesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const fairSchema = z.object({
  // Basic info
  fairId: z.string().min(1, "Fair ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),

  // Location
  venue: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  // Type
  type: z.string().optional(),
  category: z.string().optional(),

  // Images
  logo: z.string().optional(),
  coverImage: z.string().optional(),

  displayedProducts: z.string().optional(),
  tourNote: z.string().optional(),

  // Features
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  hasBanner: z.boolean().default(false),
  isSectoral: z.boolean().default(false),
  isDefiniteDeparture: z.boolean().default(false),

  // Dates
  dateString: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  // Services
  extraServices: z.string().optional(),
  includedServices: z.string().optional(),

  // Relations
  hotel: hotelSchema.optional(),
  fairImages: fairImagesSchema.optional(),
  tourImages: tourImagesSchema.optional(),
  tourPrograms: z
    .array(tourProgramSchema)
    .min(1, "At least one tour program is required"),
});

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation - accepts various formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleaned = phone.replace(/[\s\(\)\-]/g, "");
  return phoneRegex.test(cleaned);
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateImageUrls(urls: string[]): boolean {
  return urls.length <= 10; // Max 10 images
}
