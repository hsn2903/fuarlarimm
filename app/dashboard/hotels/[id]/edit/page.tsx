import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getHotelById, updateHotel } from "@/app/_actions/hotels";
import { HotelFormData } from "@/lib/types/hotel";
import EditHotelForm from "../../_components/edit-hotel-form";

interface EditHotelPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditHotelPage({ params }: EditHotelPageProps) {
  const { id } = await params;

  if (!id) {
    redirect("/dashboard/hotels");
  }

  const hotel = await getHotelById(id);

  if (!hotel) {
    notFound();
  }

  const hotelFormData: HotelFormData = {
    name: hotel.name,
    description: hotel.description || "",
    address: hotel.address || "",
    city: hotel.city || "",
    country: hotel.country || "",
    zip: hotel.zip || "",
    phone: hotel.phone || "",
    email: hotel.email || "",
    images: hotel.images,
  };

  const handleSubmit = async (data: HotelFormData) => {
    "use server";
    await updateHotel(id, data);
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Hotel</h1>
          <p className="text-gray-500 mt-2">
            Update hotel information and images
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <EditHotelForm
          hotelId={id}
          initialData={hotelFormData}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
