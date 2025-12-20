import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function HotelsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            404 - Hotel Not Found
          </h1>
          <p className="text-gray-600">
            The hotel you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/hotels">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hotels List
          </Link>
        </Button>
      </div>
    </div>
  );
}
