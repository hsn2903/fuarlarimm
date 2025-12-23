// Base types
export interface ProgramItem {
  date: string;
  activity: string;
}

export interface TourProgramType {
  id: string;
  programId: string;
  title1: string;
  title2: string;
  title3: string;
  singlePersonPrice: string;
  twoPersonPrice: string;
  programs: ProgramItem[];
}

export interface HotelType {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  images: string[];
}

export interface FairImagesType {
  id: number;
  name: string;
  description: string | null;
  images: string[];
}

export interface TourImagesType {
  id: number;
  name: string;
  description: string | null;
  images: string[];
}

// Main Fair type
export interface Fair {
  // Basic info
  id: string;
  fairId: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  website: string | null;

  // Location
  venue: string | null;
  city: string | null;
  country: string | null;

  // Type
  type: string | null;
  category: string | null;

  // Images
  logo: string | null;
  coverImage: string | null;

  displayedProducts: string | null;
  tourNote: string | null;

  // Features
  isFeatured: boolean;
  isPublished: boolean;
  hasBanner: boolean;
  isSectoral: boolean;
  isDefiniteDeparture: boolean;

  // Dates
  dateString: string | null;
  startDate: Date | null;
  endDate: Date | null;

  // Services
  extraServices: string | null;
  includedServices: string | null;

  // Relations
  hotel?: HotelType | null;
  fairImages?: FairImagesType | null;
  tourImages?: TourImagesType | null;
  tourPrograms: TourProgramType[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Form data type (for create/update)
export interface FairFormData {
  // Basic info
  fairId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  website: string;

  // Location
  venue: string;
  city: string;
  country: string;

  // Type
  type: string;
  category: string;

  // Images
  logo: string;
  coverImage: string;

  displayedProducts: string;
  tourNote: string;

  // Features
  isFeatured: boolean;
  isPublished: boolean;
  hasBanner: boolean;
  isSectoral: boolean;
  isDefiniteDeparture: boolean;

  // Dates
  dateString: string;
  startDate: string;
  endDate: string;

  // Services
  extraServices: string;
  includedServices: string;

  // Hotel
  hotel?: {
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    zip: string;
    phone: string;
    email: string;
    images: string[];
  };

  // Fair Images
  fairImages?: {
    name: string;
    description: string;
    images: string[];
  };

  // Tour Images
  tourImages?: {
    name: string;
    description: string;
    images: string[];
  };

  // Tour Programs
  tourPrograms: {
    programId: string;
    title1: string;
    title2: string;
    title3: string;
    singlePersonPrice: string;
    twoPersonPrice: string;
    programs: ProgramItem[];
  }[];
}
