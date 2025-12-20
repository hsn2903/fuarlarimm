/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/pagination";
import {
  getHotels,
  getDistinctCities,
  getDistinctCountries,
  HotelFilters as HotelFiltersType,
} from "@/app/_actions/hotels";
import { Plus } from "lucide-react";
import HotelExport from "./_components/hotel-export";
import HotelFilters from "./_components/hotel-filters";
import HotelTable from "./_components/hotel-table";

interface HotelsPageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    country?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const params = await searchParams;

  const filters: HotelFiltersType = {
    search: params.search || undefined,
    city: params.city || undefined,
    country: params.country || undefined,
    sortBy: (params.sortBy as any) || undefined,
    sortOrder: (params.sortOrder as any) || undefined,
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 10,
  };

  const [hotelsResponse, cities, countries] = await Promise.all([
    getHotels(filters),
    getDistinctCities(),
    getDistinctCountries(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotels</h1>
          <p className="text-gray-500 mt-2">
            Manage your hotel properties and their information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <HotelExport hotels={hotelsResponse.hotels} />
          <Button asChild>
            <Link href="/dashboard/hotels/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Hotel
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <HotelFilters cities={cities} countries={countries} />

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">All Hotels</h2>
              <p className="text-sm text-gray-500">
                Showing {hotelsResponse.hotels.length} of {hotelsResponse.total}{" "}
                hotel{hotelsResponse.total !== 1 ? "s" : ""}
                {params.search && ` for "${params.search}"`}
                {params.city && ` in ${params.city}`}
                {params.country && `, ${params.country}`}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Sorted by: {params.sortBy || "Date Created"} (
              {params.sortOrder || "desc"})
            </div>
          </div>
        </div>

        <div className="p-6">
          <HotelTable hotels={hotelsResponse.hotels} />
        </div>

        <div className="p-6 border-t">
          <Pagination
            currentPage={hotelsResponse.page}
            totalPages={hotelsResponse.totalPages}
            totalItems={hotelsResponse.total}
            itemsPerPage={hotelsResponse.limit}
          />
        </div>
      </div>
    </div>
  );
}
