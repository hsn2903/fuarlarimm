import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  ArrowLeft,
  Edit,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getHotelById } from "@/app/_actions/hotels";

interface HotelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HotelDetailPage({
  params,
}: HotelDetailPageProps) {
  const { id } = await params;
  const hotel = await getHotelById(id);

  if (!hotel) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/hotels">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{hotel.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{hotel.city || "No location set"}</Badge>
              <Badge variant="secondary">
                {hotel.country || "No country set"}
              </Badge>
            </div>
          </div>
        </div>

        <Button asChild>
          <Link href={`/dashboard/hotels/edit/${hotel.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Hotel
          </Link>
        </Button>
      </div>

      {/* Images Section */}
      {hotel.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hotel.images.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden"
                >
                  <Image
                    src={url}
                    alt={`${hotel.name} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotel Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Hotel Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hotel.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {hotel.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Location Details</h3>
                <div className="space-y-1">
                  {hotel.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-600">{hotel.address}</span>
                    </div>
                  )}
                  {(hotel.city || hotel.country) && (
                    <div className="flex items-start gap-2">
                      <Globe className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-600">
                        {[hotel.city, hotel.country].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                  {hotel.zip && (
                    <div className="text-gray-600">ZIP: {hotel.zip}</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Contact Information</h3>
                <div className="space-y-1">
                  {hotel.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{hotel.phone}</span>
                    </div>
                  )}
                  {hotel.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{hotel.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata Card */}
        <Card>
          <CardHeader>
            <CardTitle>Hotel Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">System Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hotel ID</span>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {hotel.id}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Images Count</span>
                  <Badge variant="outline">{hotel.images.length}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Timestamps</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Created</span>
                  </div>
                  <span className="text-gray-800">
                    {formatDate(hotel.createdAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Last Updated</span>
                  </div>
                  <span className="text-gray-800">
                    {formatDate(hotel.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
