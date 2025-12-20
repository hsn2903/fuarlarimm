import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";
import Link from "next/link";
import { getFairs } from "@/app/_actions/fairs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FairsTable from "./_components/fairs-table";
import { Fair } from "@/lib/types";

export default async function FairsPage() {
  const result = await getFairs();
  const fairs: Fair[] = result.success && result.data ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fairs</h1>
          <p className="text-gray-500 mt-2">
            Manage all your fairs, create new ones, and update existing ones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtre
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            İndir
          </Button>
          <Button asChild>
            <Link href="/dashboard/fairs/new">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Fuar
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Toplam Fuar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fairs.length}</div>
            <p className="text-xs text-gray-500 mt-1">Sistemdeki tüm fuarlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Yayınlanan Fuarlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fairs.filter((f) => f.isPublished).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Yayınlanan fuarlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Öne Çıkan Fuarlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fairs.filter((f) => f.isFeatured).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Öne çıkan fuarlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Yaklaşan Fuarlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                fairs.filter(
                  (f) => f.startDate && new Date(f.startDate) > new Date()
                ).length
              }
            </div>
            <p className="text-xs text-gray-500 mt-1">Yaklaşan fuarlar</p>
          </CardContent>
        </Card>
      </div>

      {/* Fairs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Fairs</CardTitle>
          <CardDescription>
            A comprehensive list of all fairs in the system with actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FairsTable fairs={fairs} />
        </CardContent>
      </Card>
    </div>
  );
}
