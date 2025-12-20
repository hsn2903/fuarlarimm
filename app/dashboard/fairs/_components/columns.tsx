"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  Globe,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Fair } from "@/lib/types/fair";
import { deleteFair, toggleFairStatus } from "@/app/_actions/fairs";

// Create a toast component
const toastStyle = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-500 text-white",
  info: "bg-blue-500 text-white",
};

// Mock toast function for now (we'll implement proper toast in next chapter)
const toastMock = {
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string) => console.log(`❌ ${message}`),
};

export const columns: ColumnDef<Fair>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const fair = row.original;
      return (
        <div className="flex items-center gap-3">
          {fair.logo && (
            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fair.logo}
                alt={fair.name}
                className="h-8 w-8 object-contain"
              />
            </div>
          )}
          <div className="flex flex-col">
            <div className="font-medium">{fair.name}</div>
            <div className="text-sm text-gray-500">{fair.slug}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return type || "-";
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const fair = row.original;
      return (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin size={14} />
          {fair.city}, {fair.country}
        </div>
      );
    },
  },
  {
    accessorKey: "dates",
    header: "Dates",
    cell: ({ row }) => {
      const fair = row.original;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar size={14} />
          {fair.startDate && fair.endDate
            ? `${new Date(fair.startDate).toLocaleDateString()} - ${new Date(
                fair.endDate
              ).toLocaleDateString()}`
            : fair.dateString || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const fair = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          <Badge
            variant={fair.isPublished ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={async () => {
              const result = await toggleFairStatus(fair.id, "isPublished");
              if (result.success) {
                toastMock.success(
                  `Fair ${
                    fair.isPublished ? "unpublished" : "published"
                  } successfully`
                );
              } else {
                toastMock.error(result.error || "Failed to toggle status");
              }
            }}
          >
            {fair.isPublished ? "Published" : "Draft"}
          </Badge>
          {fair.isFeatured && (
            <Badge
              variant="outline"
              className="border-yellow-300 text-yellow-700"
            >
              <Star size={12} className="mr-1" />
              Featured
            </Badge>
          )}
          {fair.isDefiniteDeparture && (
            <Badge
              variant="outline"
              className="border-green-300 text-green-700"
            >
              Definite
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return date.toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const fair = row.original;

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this fair?")) {
          const result = await deleteFair(fair.id);
          if (result.success) {
            toastMock.success("Fair deleted successfully");
          } else {
            toastMock.error(result.error || "Failed to delete fair");
          }
        }
      };

      const handleToggleFeatured = async () => {
        const result = await toggleFairStatus(fair.id, "isFeatured");
        if (result.success) {
          toastMock.success(
            `Fair ${fair.isFeatured ? "removed from" : "added to"} featured`
          );
        } else {
          toastMock.error(result.error || "Failed to toggle featured status");
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/fairs/${fair.slug}`} target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                View Live
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/fairs/${fair.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleFeatured}>
              <Star className="mr-2 h-4 w-4" />
              {fair.isFeatured ? "Remove Featured" : "Mark as Featured"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
