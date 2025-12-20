import { Fair } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Globe,
  Building,
  Tag,
  Image as ImageIcon,
  Package,
  Hotel,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";

interface FairDetailViewProps {
  fair: Fair;
}

export default function FairDetailView({ fair }: FairDetailViewProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return format(new Date(date), "MMMM dd, yyyy");
  };

  const renderBoolean = (value: boolean) => {
    return value ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-300" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Basic information about the fair</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Fair ID:</span>
                <span className="text-sm">{fair.fairId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Venue:</span>
                <span className="text-sm">{fair.venue || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Website:</span>
                <span className="text-sm">
                  {fair.website ? (
                    <a
                      href={fair.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {fair.website}
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Dates:</span>
                <span className="text-sm">
                  {formatDate(fair.startDate)} - {formatDate(fair.endDate)}
                </span>
              </div>
              {fair.dateString && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">Date String:</span>
                  <span className="text-sm">{fair.dateString}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm">
                  {fair.city}, {fair.country}
                </span>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-2">
            <h3 className="font-medium">Short Description</h3>
            <p className="text-sm text-gray-600">
              {fair.shortDescription || "No short description"}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Full Description</h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {fair.description || "No description"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features & Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Fair configuration flags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Published</span>
                {renderBoolean(fair.isPublished)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Featured</span>
                {renderBoolean(fair.isFeatured)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Has Banner</span>
                {renderBoolean(fair.hasBanner)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sectoral</span>
                {renderBoolean(fair.isSectoral)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Definite Departure</span>
                {renderBoolean(fair.isDefiniteDeparture)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>Additional services information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Included Services</h4>
                <p className="text-sm text-gray-600">
                  {fair.includedServices || "No services specified"}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Extra Services</h4>
                <p className="text-sm text-gray-600">
                  {fair.extraServices || "No extra services specified"}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Displayed Products</h4>
                <p className="text-sm text-gray-600">
                  {fair.displayedProducts || "No products specified"}
                </p>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Tour Note</h4>
                <p className="text-sm text-gray-600">
                  {fair.tourNote || "No tour note"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotel Information */}
      {fair.hotel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hotel className="w-5 h-5" />
              Hotel Information
            </CardTitle>
            <CardDescription>
              Accommodation details for the fair
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{fair.hotel.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {fair.hotel.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Address:</span>{" "}
                    {fair.hotel.address}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">City:</span> {fair.hotel.city}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Country:</span>{" "}
                    {fair.hotel.country}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">ZIP:</span> {fair.hotel.zip}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Phone:</span>{" "}
                    {fair.hotel.phone}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {fair.hotel.email}
                  </div>
                </div>
              </div>

              {fair.hotel.images && fair.hotel.images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Hotel Images</h4>
                  <div className="flex gap-2 overflow-x-auto py-2">
                    {fair.hotel.images.map((image, index) => (
                      <div
                        key={index}
                        className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={image}
                          alt={`Hotel image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tour Programs */}
      {fair.tourPrograms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tour Programs</CardTitle>
            <CardDescription>
              {fair.tourPrograms.length} tour packages available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {fair.tourPrograms.map((program, index) => (
                <div key={program.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {program.title1}
                      </h3>
                      <p className="text-gray-600">{program.title2}</p>
                      <p className="text-sm text-gray-500">{program.title3}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">
                          Single Person
                        </div>
                        <div className="text-xl font-bold">
                          ${program.singlePersonPrice}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Two Persons</div>
                        <div className="text-xl font-bold">
                          ${program.twoPersonPrice}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Array.isArray(program.programs) &&
                      program.programs.map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-20 flex-shrink-0">
                            <Badge variant="outline">{item.date}</Badge>
                          </div>
                          <div className="flex-1 text-sm">{item.activity}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images */}
      <div className="grid md:grid-cols-2 gap-6">
        {fair.logo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Logo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={fair.logo}
                  alt={`${fair.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {fair.coverImage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Cover Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={fair.coverImage}
                  alt={`${fair.name} cover`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
