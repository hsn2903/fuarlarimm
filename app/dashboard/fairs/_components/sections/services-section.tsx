// components/fair/sections/ServicesSection.tsx
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
import { Textarea } from "@/components/ui/textarea";

interface ServicesSectionProps {
  form: UseFormReturn<FairFormValues>;
}

export default function ServicesSection({ form }: ServicesSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Services</h2>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="includedServices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Included Services</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hotel, Airport Transfer, Fair Pass, Breakfast"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extraServices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Services</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Visa Assistance, Translation Services, Factory Visits, VIP Lounge"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
