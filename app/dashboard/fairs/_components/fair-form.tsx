// components/fair/FairForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fairSchema, FairFormValues } from "@/lib/schemas/fair";
import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import BasicInfoSection from "./sections/basic-info-section";
import LocationSection from "./sections/location-section";
import FeaturesSection from "./sections/features-section";
import DatesSection from "./sections/dates-section";
import ServicesSection from "./sections/services-section";
import HotelSection from "./sections/hotel-section";
import ImagesSection from "./sections/images-section";
import TourProgramsSection from "./sections/tour-programs-section";

interface FairFormProps {
  initialData?: FairFormValues & { id?: string };
  onSubmit: (
    data: FairFormValues
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function FairForm({ initialData, onSubmit }: FairFormProps) {
  const defaultValues: FairFormValues = {
    fairId: initialData?.fairId || "",
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    website: initialData?.website || "",
    venue: initialData?.venue || "",
    city: initialData?.city || "",
    country: initialData?.country || "",
    type: initialData?.type || "",
    category: initialData?.category || "",
    logo: initialData?.logo || "",
    coverImage: initialData?.coverImage || "",
    displayedProducts: initialData?.displayedProducts || "",
    tourNote: initialData?.tourNote || "",
    isFeatured: initialData?.isFeatured || false,
    isPublished: initialData?.isPublished || false,
    hasBanner: initialData?.hasBanner || false,
    isSectoral: initialData?.isSectoral || false,
    isDefiniteDeparture: initialData?.isDefiniteDeparture || false,
    dateString: initialData?.dateString || "",
    startDate: initialData?.startDate || "",
    endDate: initialData?.endDate || "",
    extraServices: initialData?.extraServices || "",
    includedServices: initialData?.includedServices || "",
    hotel: initialData?.hotel || {
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
    fairImages: initialData?.fairImages || {
      name: "",
      description: "",
      images: [],
    },
    tourImages: initialData?.tourImages || {
      name: "",
      description: "",
      images: [],
    },
    tourPrograms: initialData?.tourPrograms || [],
  };

  const form = useForm<FairFormValues>({
    resolver: zodResolver(fairSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = async (data: FairFormValues) => {
    try {
      const result = await onSubmit(data);
      if (result.success) {
        toast.success(
          initialData?.id
            ? "Fair updated successfully"
            : "Fair created successfully"
        );
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit as any)}
        className="space-y-8"
      >
        <BasicInfoSection form={form as any} />
        <LocationSection form={form as any} />
        <FeaturesSection form={form as any} />
        <DatesSection form={form as any} />
        <ServicesSection form={form as any} />
        <HotelSection form={form as any} />
        <ImagesSection form={form as any} />
        <TourProgramsSection form={form as any} />

        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {initialData?.id ? "Update Fair" : "Create Fair"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
