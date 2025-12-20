import { notFound } from "next/navigation";
import { getFairById } from "@/app/_actions/fairs";
import FairDetailView from "@/app/dashboard/fairs/_components/fair-detail-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

interface FairDetailPageProps {
  params: {
    id: string;
  };
}

export default async function FairDetailPage({ params }: FairDetailPageProps) {
  const result = await getFairById(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const fair = result.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/fairs">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Fairs
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{fair.name}</h1>
            <p className="text-gray-500 mt-1">
              {fair.fairId} • {fair.city}, {fair.country}
            </p>
          </div>
        </div>

        <Button asChild>
          <Link href={`/dashboard/fairs/${fair.id}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Fair
          </Link>
        </Button>
      </div>

      <FairDetailView fair={fair} />
    </div>
  );
}
