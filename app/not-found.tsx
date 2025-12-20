import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hotel, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full">
            <Hotel className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Hotel Not Found</h1>
          <p className="text-lg text-gray-600">
            The hotel you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/dashboard/hotels">
              <Home className="mr-2 h-4 w-4" />
              Back to Hotels
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
