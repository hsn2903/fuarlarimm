// components/fair/sections/ImagesSection.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { FairFormValues } from "@/lib/schemas/fair";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ImagesSectionProps {
  form: UseFormReturn<FairFormValues>;
}

export default function ImagesSection({ form }: ImagesSectionProps) {
  const watchLogo = form.watch("logo");
  const watchCoverImage = form.watch("coverImage");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Images</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/logo.png"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchLogo && (
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Logo Preview:</p>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={watchLogo}
                  alt="Logo preview"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/cover.jpg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchCoverImage && (
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Cover Image Preview:</p>
              <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={watchCoverImage}
                  alt="Cover preview"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fair Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Fair Images</h3>
        </div>

        <FormField
          control={form.control}
          name="fairImages.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input placeholder="Exhibition Hall Photos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fairImages.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description of the fair images..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fairImages.images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs</FormLabel>
              <div className="space-y-2">
                {field.value?.map((image, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={image}
                      onChange={(e) => {
                        const newImages = [...(field.value || [])];
                        newImages[index] = e.target.value;
                        field.onChange(newImages);
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newImages = (field.value || []).filter(
                          (_, i) => i !== index
                        );
                        field.onChange(newImages);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    field.onChange([...(field.value || []), ""]);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image URL
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Tour Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Tour Images</h3>
        </div>

        <FormField
          control={form.control}
          name="tourImages.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input placeholder="Tour Package Photos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tourImages.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description of the tour images..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tourImages.images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs</FormLabel>
              <div className="space-y-2">
                {field.value?.map((image, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={image}
                      onChange={(e) => {
                        const newImages = [...(field.value || [])];
                        newImages[index] = e.target.value;
                        field.onChange(newImages);
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newImages = (field.value || []).filter(
                          (_, i) => i !== index
                        );
                        field.onChange(newImages);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    field.onChange([...(field.value || []), ""]);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image URL
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
