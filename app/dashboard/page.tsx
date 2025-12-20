import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, Users, BarChart3, DollarSign } from "lucide-react";
import HotelStats from "./hotels/_components/hotel-stats";
import { getHotels } from "../_actions/hotels";

export default async function DashboardPage() {
  const hotelsResponse = await getHotels();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>

      <div className="space-y-6">
        {/* Hotel Stats */}
        <HotelStats hotels={hotelsResponse.hotels} />

        {/* Other Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Guests
              </CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-gray-500">+20.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Occupancy Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.2%</div>
              <p className="text-xs text-gray-500">+5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Hotel className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.7</div>
              <p className="text-xs text-gray-500">Out of 5 stars</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Hotels */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Hotels</CardTitle>
          </CardHeader>
          <CardContent>
            {hotelsResponse.hotels.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hotels yet. Create your first hotel!
              </p>
            ) : (
              <div className="space-y-4">
                {hotelsResponse.hotels.slice(0, 5).map((hotel) => (
                  <div
                    key={hotel.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{hotel.name}</h3>
                      <p className="text-sm text-gray-500">
                        {hotel.city && `${hotel.city}, `}
                        {hotel.country}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Created {new Date(hotel.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
