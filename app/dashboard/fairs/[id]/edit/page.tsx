// app/admin/fairs/[id]/edit/page.tsx
import FairForm from "@/app/dashboard/fairs/_components/fair-form";
import { getFairById, updateFair } from "@/app/_actions/fairs";
import { FairFormValues } from "@/lib/schemas/fair";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditFairPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFairPage({ params }: EditFairPageProps) {
  const { id } = await params;
  const response = await getFairById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const fair = response.data;

  const handleSubmit = async (data: FairFormValues) => {
    "use server";
    return await updateFair(id, data);
  };

  const initialData: FairFormValues & { id: string } = {
    id: fair.id,
    fairId: fair.fairId || fair.id,
    name: fair.name,
    slug: fair.slug,
    description: fair.description || "",
    shortDescription: fair.shortDescription || "",
    website: fair.website || "",
    venue: fair.venue || "",
    city: fair.city || "",
    country: fair.country || "",
    type: fair.type || "",
    category: fair.category || "",
    logo: fair.logo || "",
    coverImage: fair.coverImage || "",
    displayedProducts: fair.displayedProducts || "",
    tourNote: fair.tourNote || "",
    isFeatured: fair.isFeatured,
    isPublished: fair.isPublished,
    hasBanner: fair.hasBanner,
    isSectoral: fair.isSectoral,
    isDefiniteDeparture: fair.isDefiniteDeparture,
    dateString: fair.dateString || "",
    startDate: fair.startDate
      ? new Date(fair.startDate).toISOString().split("T")[0]
      : "",
    endDate: fair.endDate
      ? new Date(fair.endDate).toISOString().split("T")[0]
      : "",
    extraServices: fair.extraServices || "",
    includedServices: fair.includedServices || "",
    hotel: fair.hotel
      ? {
          name: fair.hotel.name,
          description: fair.hotel.description || undefined,
          address: fair.hotel.address || undefined,
          city: fair.hotel.city || undefined,
          country: fair.hotel.country || undefined,
          zip: fair.hotel.zip || undefined,
          phone: fair.hotel.phone || undefined,
          email: fair.hotel.email || undefined,
          images: fair.hotel.images,
        }
      : {
          name: "",
          description: "",
          address: "",
          city: "",
          country: "",
          zip: "",
          phone: "",
          email: "",
          images: [],
        },
    fairImages: fair.fairImages
      ? {
          name: fair.fairImages.name,
          description: fair.fairImages.description || undefined,
          images: fair.fairImages.images,
        }
      : {
          name: "",
          description: "",
          images: [],
        },
    tourImages: fair.tourImages
      ? {
          name: fair.tourImages.name,
          description: fair.tourImages.description || undefined,
          images: fair.tourImages.images,
        }
      : {
          name: "",
          description: "",
          images: [],
        },
    tourPrograms: fair.tourPrograms
      ? fair.tourPrograms.map((tp) => ({
          programId: tp.id,
          title1: tp.title1,
          title2: tp.title2,
          title3: tp.title3,
          singlePersonPrice: tp.singlePersonPrice,
          twoPersonPrice: tp.twoPersonPrice,
          programs: tp.programs,
        }))
      : [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/fairs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Fair</h1>
          <p className="text-gray-600">Update fair information.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <FairForm initialData={initialData} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
