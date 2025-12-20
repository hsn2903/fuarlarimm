"use client";

import { useState, useEffect, useCallback } from "react";
import { Hotel } from "@/lib/types/hotel";
import HotelTable from "./hotel-table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface HotelInfiniteScrollProps {
  initialHotels: Hotel[];
  total: number;
  fetchMore: (page: number) => Promise<Hotel[]>;
}

export default function HotelInfiniteScroll({
  initialHotels,
  total,
  fetchMore,
}: HotelInfiniteScrollProps) {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [page, setPage] = useState(2); // Start from page 2 since we have initial data
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHotels.length < total);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newHotels = await fetchMore(page);
      setHotels((prev) => [...prev, ...newHotels]);
      setPage((prev) => prev + 1);
      setHasMore(newHotels.length > 0);
    } catch (error) {
      console.error("Failed to load more hotels:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, fetchMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, loadMore]);

  return (
    <div className="space-y-4">
      <HotelTable hotels={hotels} />

      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMore}
            disabled={loading}
            variant="outline"
            className="w-48"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Hotels"
            )}
          </Button>
        </div>
      )}

      {!hasMore && hotels.length > 0 && (
        <p className="text-center text-gray-500 py-4">No more hotels to load</p>
      )}
    </div>
  );
}
