/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  maxImages?: number;
}

export default function ImageUpload({
  value,
  onChange,
  disabled = false,
  maxImages = 10,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxImages - value.length;

      if (fileArray.length > remainingSlots) {
        toast.success(
          `You can only upload ${remainingSlots} more image${
            remainingSlots > 1 ? "s" : ""
          }.`
        );
        return;
      }

      setUploading(true);
      setProgress(0);

      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        try {
          // Validate file type
          if (!file.type.startsWith("image/")) {
            toast.error(`${file.name} is not an image file.`);
            continue;
          }

          // Validate file size (4MB max)
          if (file.size > 4 * 1024 * 1024) {
            toast.error(`${file.name} exceeds 4MB limit.`);
            continue;
          }

          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();

          if (data.success && data.data?.secure_url) {
            uploadedUrls.push(data.data.secure_url);
            setProgress((prev) => prev + 100 / fileArray.length);
          } else {
            throw new Error("Invalid response from server");
          }
        } catch (error) {
          console.error("Upload error:", error);
          toast.error(`Failed to upload ${file.name}.`);
        }
      }

      if (uploadedUrls.length > 0) {
        const newUrls = [...value, ...uploadedUrls];
        onChange(newUrls);
        toast.success(
          `Uploaded ${uploadedUrls.length} image${
            uploadedUrls.length > 1 ? "s" : ""
          } successfully.`
        );
      }

      setUploading(false);
      setProgress(0);

      // Reset the input
      if (event.target) {
        event.target.value = "";
      }
    },
    [value, onChange, maxImages]
  );

  const removeImage = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        const inputEvent = {
          target: {
            files,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        handleFileChange(inputEvent);
      }
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="images">Hotel Images</Label>
        <p className="text-sm text-gray-500 mt-1">
          Upload up to {maxImages} images. Supported formats: JPG, PNG, WebP
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          uploading
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 rounded-full bg-gray-100">
            {uploading ? (
              <Upload className="h-8 w-8 text-blue-500 animate-pulse" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>

          <div className="space-y-2">
            {uploading ? (
              <>
                <p className="font-medium">Uploading images...</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
              </>
            ) : (
              <>
                <p className="font-medium">
                  Drag & drop images here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Upload up to {maxImages - value.length} more image
                  {maxImages - value.length !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={disabled || uploading || value.length >= maxImages}
            className="relative"
          >
            <Upload className="mr-2 h-4 w-4" />
            Choose Images
            <Input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              disabled={disabled || uploading || value.length >= maxImages}
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </Button>
        </div>
      </div>

      {/* Image Preview Grid */}
      {value.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">
              {value.length} image{value.length !== 1 ? "s" : ""} selected
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([])}
              disabled={disabled}
            >
              Clear all
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {value.map((url, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border"
              >
                <img
                  src={url}
                  alt={`Hotel image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
