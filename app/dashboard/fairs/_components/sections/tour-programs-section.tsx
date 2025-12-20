// components/fair/sections/TourProgramsSection.tsx
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
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface TourProgramsSectionProps {
  form: UseFormReturn<FairFormValues>;
}

export default function TourProgramsSection({
  form,
}: TourProgramsSectionProps) {
  const [expandedProgram, setExpandedProgram] = useState<number | null>(0);

  const tourPrograms = form.watch("tourPrograms");

  const addProgram = () => {
    const newProgram = {
      programId: `program-${Date.now()}`,
      title1: "",
      title2: "",
      title3: "",
      singlePersonPrice: "",
      twoPersonPrice: "",
      programs: [],
    };
    form.setValue("tourPrograms", [...tourPrograms, newProgram]);
    setExpandedProgram(tourPrograms.length);
  };

  const removeProgram = (index: number) => {
    const newPrograms = tourPrograms.filter((_, i) => i !== index);
    form.setValue("tourPrograms", newPrograms);
    if (expandedProgram === index) {
      setExpandedProgram(null);
    } else if (expandedProgram && expandedProgram > index) {
      setExpandedProgram(expandedProgram - 1);
    }
  };

  const addProgramItem = (programIndex: number) => {
    const newPrograms = [...tourPrograms];
    newPrograms[programIndex].programs.push({
      date: "",
      activity: "",
    });
    form.setValue("tourPrograms", newPrograms);
  };

  const removeProgramItem = (programIndex: number, itemIndex: number) => {
    const newPrograms = [...tourPrograms];
    newPrograms[programIndex].programs.splice(itemIndex, 1);
    form.setValue("tourPrograms", newPrograms);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tour Programs</h2>
        <Button type="button" onClick={addProgram} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </div>

      {tourPrograms.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No tour programs added yet.</p>
          <Button
            type="button"
            onClick={addProgram}
            variant="ghost"
            className="mt-2"
          >
            Add your first program
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tourPrograms.map((program, programIndex) => (
            <div
              key={programIndex}
              className="border rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setExpandedProgram(
                        expandedProgram === programIndex ? null : programIndex
                      )
                    }
                  >
                    {expandedProgram === programIndex ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <div>
                    <h3 className="font-medium">
                      {program.title1 || `Program ${programIndex + 1}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ID: {program.programId}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProgram(programIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {expandedProgram === programIndex && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`tourPrograms.${programIndex}.programId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Program ID *</FormLabel>
                          <FormControl>
                            <Input placeholder="ekonomik" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`tourPrograms.${programIndex}.title1`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title 1</FormLabel>
                          <FormControl>
                            <Input placeholder="Ekonomik Paket" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tourPrograms.${programIndex}.title2`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title 2</FormLabel>
                          <FormControl>
                            <Input placeholder="4 Gece 5 Gün" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tourPrograms.${programIndex}.title3`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title 3</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="3* Holiday Inn Express"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`tourPrograms.${programIndex}.singlePersonPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Single Person Price</FormLabel>
                          <FormControl>
                            <Input placeholder="890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`tourPrograms.${programIndex}.twoPersonPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Two Person Price</FormLabel>
                          <FormControl>
                            <Input placeholder="250" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Daily Program</h4>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addProgramItem(programIndex)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Day
                      </Button>
                    </div>

                    {program.programs.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">Day {itemIndex + 1}</h5>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeProgramItem(programIndex, itemIndex)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`tourPrograms.${programIndex}.programs.${itemIndex}.date`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="1. Gün" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`tourPrograms.${programIndex}.programs.${itemIndex}.activity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Activity</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Description of the day's activities..."
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
