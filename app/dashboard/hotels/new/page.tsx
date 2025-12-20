"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HotelFormData } from "@/lib/types/hotel";
import { createHotel } from "@/app/_actions/hotels";
import HotelForm from "../_components/hotel-form";

export default function CreateHotelPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: HotelFormData) => {
    setIsSubmitting(true);
    try {
      await createHotel(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/hotels">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Hotel</h1>
          <p className="text-gray-500 mt-2">
            Create a new hotel property in your portfolio
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <HotelForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
