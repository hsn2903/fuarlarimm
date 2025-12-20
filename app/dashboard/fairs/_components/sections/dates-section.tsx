// components/fair/sections/DatesSection.tsx
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

interface DatesSectionProps {
  form: UseFormReturn<FairFormValues>;
}

export default function DatesSection({ form }: DatesSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dates</h2>

      <FormField
        control={form.control}
        name="dateString"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date String</FormLabel>
            <FormControl>
              <Input placeholder="April 15-19, 2024" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
