import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FairFormValues } from "@/lib/schemas/fair";
import { createFair } from "@/app/_actions/fairs";
import FairForm from "../_components/fair-form";

export default function NewFairPage() {
  const handleSubmit = async (data: FairFormValues) => {
    "use server";
    return await createFair(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/fairs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Fair</h1>
          <p className="text-gray-600">Add a new fair to your system.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <FairForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
