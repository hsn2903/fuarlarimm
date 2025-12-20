// components/fair/QuickActionsDropdown.tsx
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
  Edit,
  Copy,
  Eye,
  EyeOff,
  Star,
  Calendar,
  Trash2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Fair } from "@/lib/types/fair";
import { toast } from "sonner";

interface QuickActionsDropdownProps {
  fair: Fair;
  onTogglePublish: (
    id: string
  ) => Promise<{ success: boolean; error?: string }>;
  onToggleFeatured: (
    id: string
  ) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onDuplicate?: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export default function QuickActionsDropdown({
  fair,
  onTogglePublish,
  onToggleFeatured,
  onDelete,
  onDuplicate,
}: QuickActionsDropdownProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTogglePublish = async () => {
    setIsProcessing(true);
    try {
      const result = await onTogglePublish(fair.id);
      if (result.success) {
        toast.success(
          `Fair ${fair.isPublished ? "unpublished" : "published"} successfully`
        );
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleFeatured = async () => {
    setIsProcessing(true);
    try {
      const result = await onToggleFeatured(fair.id);
      if (result.success) {
        toast.success(
          `Fair ${fair.isFeatured ? "removed from" : "added to"} featured`
        );
      } else {
        toast.error(result.error || "Failed to update featured status");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDuplicate = async () => {
    if (!onDuplicate) return;

    setIsProcessing(true);
    try {
      const result = await onDuplicate(fair.id);
      if (result.success) {
        toast.success("Fair duplicated successfully");
        setShowDuplicateDialog(false);
      } else {
        toast.error(result.error || "Failed to duplicate fair");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={isProcessing}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link href={`/fairs/${fair.slug}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Live
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={`/admin/fairs/${fair.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>

          {onDuplicate && (
            <DropdownMenuItem onClick={() => setShowDuplicateDialog(true)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleTogglePublish}>
            {fair.isPublished ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleToggleFeatured}>
            {fair.isFeatured ? (
              <>
                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                Remove Featured
              </>
            ) : (
              <>
                <Star className="mr-2 h-4 w-4" />
                Mark as Featured
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Fair</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{fair.name}&quot;? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setIsProcessing(true);
                try {
                  const result = await onDelete(fair.id);
                  if (result.success) {
                    toast.success(`Fair "${fair.name}" deleted successfully`);
                    setShowDeleteDialog(false);
                  } else {
                    toast.error(result.error || "Failed to delete fair");
                  }
                } catch (error) {
                  toast.error("An unexpected error occurred");
                } finally {
                  setIsProcessing(false);
                }
              }}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Duplicate Confirmation Dialog */}
      {onDuplicate && (
        <AlertDialog
          open={showDuplicateDialog}
          onOpenChange={setShowDuplicateDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Duplicate Fair</AlertDialogTitle>
              <AlertDialogDescription>
                This will create a copy of &quot;{fair.name}&quot; with
                &quot;Copy&quot; appended to the name. You can edit the
                duplicate after creation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isProcessing}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDuplicate}
                disabled={isProcessing}
              >
                {isProcessing ? "Duplicating..." : "Duplicate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
