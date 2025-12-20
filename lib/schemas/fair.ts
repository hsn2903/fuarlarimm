// schemas/fair.ts
import { z } from "zod";

// Hotel schema
export const hotelSchema = z.object({
  name: z.string().min(1, "Hotel name is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  images: z.array(z.string()),
});

// Program item schema
export const programItemSchema = z.object({
  date: z.string().min(1, "Date is required"),
  activity: z.string().min(1, "Activity is required"),
});

// Tour program schema
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

// Main fair schema
export const fairSchema = z.object({
  // Basic info
  fairId: z.string().min(1, "Fair ID is required"),
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
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
  logo: z.string().url("Invalid URL").optional().or(z.literal("")),
  coverImage: z.string().url("Invalid URL").optional().or(z.literal("")),

  // Display
  displayedProducts: z.string().optional(),
  tourNote: z.string().optional(),

  // Features
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  hasBanner: z.boolean(),
  isSectoral: z.boolean(),
  isDefiniteDeparture: z.boolean(),

  // Dates
  dateString: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),

  // Services
  extraServices: z.string().optional(),
  includedServices: z.string().optional(),

  // Hotel
  hotel: hotelSchema.optional(),

  // Fair Images
  fairImages: z
    .object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
    })
    .optional(),

  // Tour Images
  tourImages: z
    .object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
    })
    .optional(),

  // Tour Programs
  tourPrograms: z
    .array(tourProgramSchema)
    .min(1, "At least one tour program is required"),
});

// Type for form values
export type FairFormValues = z.infer<typeof fairSchema>;
