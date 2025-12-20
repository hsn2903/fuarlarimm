"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Hotel,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { Fair } from "@/lib/types";
import { deleteFair } from "@/app/_actions/fairs";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";

interface FairsTableProps {
  fairs: Fair[];
}

export default function FairsTable({ fairs }: FairsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fairToDelete, setFairToDelete] = useState<Fair | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDeleteClick = (fair: Fair) => {
    setFairToDelete(fair);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fairToDelete) return;

    setIsDeleting(true);
    const result = await deleteFair(fairToDelete.id);

    if (result.success) {
      toast.success(result.message);
      setDeleteDialogOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }

    setIsDeleting(false);
    setFairToDelete(null);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return format(new Date(date), "MMM dd, yyyy");
  };

  const getStatusBadge = (fair: Fair) => {
    if (!fair.isPublished) {
      return (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 border-yellow-200"
        >
          Draft
        </Badge>
      );
    }

    const now = new Date();
    const startDate = fair.startDate ? new Date(fair.startDate) : null;
    const endDate = fair.endDate ? new Date(fair.endDate) : null;

    if (startDate && endDate) {
      if (now < startDate) {
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Upcoming
          </Badge>
        );
      } else if (now > endDate) {
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Ended
          </Badge>
        );
      } else {
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Active
          </Badge>
        );
      }
    }

    return (
      <Badge
        variant="outline"
        className="bg-green-50 text-green-700 border-green-200"
      >
        Published
      </Badge>
    );
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fair</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Features</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fairs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  No fairs found. Create your first fair to get started.
                </TableCell>
              </TableRow>
            ) : (
              fairs.map((fair) => (
                <TableRow key={fair.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {fair.logo ? (
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={fair.logo}
                            alt={fair.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{fair.name}</div>
                        <div className="text-sm text-gray-500">
                          {fair.fairId}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {fair.city}, {fair.country}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {formatDate(fair.startDate)} -{" "}
                        {formatDate(fair.endDate)}
                      </div>
                      {fair.dateString && (
                        <div className="text-xs text-gray-500">
                          {fair.dateString}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(fair)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {fair.isFeatured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      {fair.hasBanner && (
                        <Badge variant="secondary" className="text-xs">
                          Banner
                        </Badge>
                      )}
                      {fair.isSectoral && (
                        <Badge variant="secondary" className="text-xs">
                          Sectoral
                        </Badge>
                      )}
                      {fair.hotel && (
                        <Badge variant="secondary" className="text-xs">
                          <Hotel className="w-3 h-3 mr-1" />
                          Hotel
                        </Badge>
                      )}
                      {fair.tourPrograms.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {fair.tourPrograms.length} Tours
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/fairs/${fair.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/fairs/${fair.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(fair)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Fair</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the fair "{fairToDelete?.name}"?
              This action cannot be undone and will permanently delete all
              associated data including tour programs, hotel information, and
              images.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
