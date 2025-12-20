// components/fair/BulkOperations.tsx
"use client";

import { useState } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  Trash2,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  Star,
  Globe,
  Calendar,
} from "lucide-react";
import { Table } from "@tanstack/react-table";
import { Fair } from "@/lib/types/fair";
import { toast } from "sonner";

interface BulkOperationsProps {
  table: Table<Fair>;
  onBulkDelete: (
    ids: string[]
  ) => Promise<{ success: boolean; error?: string }>;
  onBulkUpdate: (
    ids: string[],
    updates: Partial<Fair>
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function BulkOperations({
  table,
  onBulkDelete,
  onBulkUpdate,
}: BulkOperationsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original.id);

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    try {
      const result = await onBulkDelete(selectedIds);
      if (result.success) {
        toast.success(`${selectedIds.length} fair(s) deleted successfully`);
        table.resetRowSelection();
      } else {
        toast.error(result.error || "Failed to delete fairs");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBulkUpdate = async (updates: Partial<Fair>) => {
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    try {
      const result = await onBulkUpdate(selectedIds, updates);
      if (result.success) {
        toast.success(`${selectedIds.length} fair(s) updated successfully`);
        table.resetRowSelection();
      } else {
        toast.error(result.error || "Failed to update fairs");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedIds.length === 0) {
    return (
      <div className="flex items-center text-sm text-gray-500">
        <Square className="mr-2 h-4 w-4" />
        No fairs selected
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">
          {selectedIds.length} fair(s) selected
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isProcessing}>
              <MoreHorizontal className="mr-2 h-4 w-4" />
              Bulk Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Bulk Operations</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleBulkUpdate({ isPublished: true })}
            >
              <Eye className="mr-2 h-4 w-4" />
              Publish Selected
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleBulkUpdate({ isPublished: false })}
            >
              <EyeOff className="mr-2 h-4 w-4" />
              Unpublish Selected
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleBulkUpdate({ isFeatured: true })}
            >
              <Star className="mr-2 h-4 w-4" />
              Mark as Featured
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleBulkUpdate({ isFeatured: false })}
            >
              <Star className="mr-2 h-4 w-4" />
              Remove Featured
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.resetRowSelection()}
          disabled={isProcessing}
        >
          Clear Selection
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedIds.length} fair(s). This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
