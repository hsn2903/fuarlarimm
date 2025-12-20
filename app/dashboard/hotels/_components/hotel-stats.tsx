"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel } from "@/lib/types/hotel";
import { Building, MapPin, Image, Calendar } from "lucide-react";

interface HotelStatsProps {
  hotels: Hotel[];
}

export default function HotelStats({ hotels }: HotelStatsProps) {
  const totalHotels = hotels.length;
  const hotelsWithImages = hotels.filter((h) => h.images.length > 0).length;
  const hotelsWithLocation = hotels.filter((h) => h.city || h.country).length;
  const hotelsWithContact = hotels.filter((h) => h.email || h.phone).length;

  const stats = [
    {
      title: "Total Hotels",
      value: totalHotels,
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "With Location",
      value: hotelsWithLocation,
      percentage:
        totalHotels > 0
          ? Math.round((hotelsWithLocation / totalHotels) * 100)
          : 0,
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "With Images",
      value: hotelsWithImages,
      percentage:
        totalHotels > 0
          ? Math.round((hotelsWithImages / totalHotels) * 100)
          : 0,
      icon: Image,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "With Contact",
      value: hotelsWithContact,
      percentage:
        totalHotels > 0
          ? Math.round((hotelsWithContact / totalHotels) * 100)
          : 0,
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {"percentage" in stat && (
                <p className="text-xs text-gray-500 mt-1">
                  {stat.percentage}% of total
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
