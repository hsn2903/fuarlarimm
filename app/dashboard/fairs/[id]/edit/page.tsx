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
  const fair = await getFairById(id);

  if (!fair) {
    notFound();
  }

  const handleSubmit = async (data: FairFormValues) => {
    "use server";
    return await updateFair(id, data);
  };

  const initialData: FairFormValues & { id: string } = {
    id: fair.id,
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
    hotel: fair.hotel || {
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
    fairImages: fair.fairImages || {
      name: "",
      description: "",
      images: [],
    },
    tourImages: fair.tourImages || {
      name: "",
      description: "",
      images: [],
    },
    tourPrograms: fair.tourPrograms || [],
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
