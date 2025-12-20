// components/fair/FairFilters.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, Calendar, MapPin, Star, Eye, EyeOff, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FairFiltersProps {
  filters: {
    status: string[];
    featured: boolean | null;
    type: string[];
    country: string[];
  };
  onFiltersChange: (filters: any) => void;
  availableTypes: string[];
  availableCountries: string[];
}

export default function FairFilters({
  filters,
  onFiltersChange,
  availableTypes,
  availableCountries,
}: FairFiltersProps) {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const activeFilterCount = [
    filters.status.length,
    filters.featured !== null ? 1 : 0,
    filters.type.length,
    filters.country.length,
    dateRange.from ? 1 : 0,
    dateRange.to ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      featured: null,
      type: [],
      country: [],
    });
    setDateRange({ from: "", to: "" });
  };

  const clearFilter = (filterType: keyof typeof filters, value?: string) => {
    if (value) {
      onFiltersChange({
        ...filters,
        [filterType]: filters[filterType].filter((v) => v !== value),
      });
    } else {
      onFiltersChange({
        ...filters,
        [filterType]: [],
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Filter Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-2 h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 rounded-sm px-1 font-normal"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.status.includes("published")}
            onCheckedChange={(checked) => {
              const newStatus = checked
                ? [...filters.status, "published"]
                : filters.status.filter((s) => s !== "published");
              onFiltersChange({ ...filters, status: newStatus });
            }}
          >
            <Eye className="mr-2 h-4 w-4 text-green-600" />
            Published
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.status.includes("draft")}
            onCheckedChange={(checked) => {
              const newStatus = checked
                ? [...filters.status, "draft"]
                : filters.status.filter((s) => s !== "draft");
              onFiltersChange({ ...filters, status: newStatus });
            }}
          >
            <EyeOff className="mr-2 h-4 w-4 text-gray-600" />
            Draft
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Featured</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={filters.featured === true}
            onCheckedChange={(checked) => {
              onFiltersChange({
                ...filters,
                featured: checked ? true : null,
              });
            }}
          >
            <Star className="mr-2 h-4 w-4 text-yellow-600" />
            Featured Only
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Type</DropdownMenuLabel>
          {availableTypes.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={filters.type.includes(type)}
              onCheckedChange={(checked) => {
                const newTypes = checked
                  ? [...filters.type, type]
                  : filters.type.filter((t) => t !== type);
                onFiltersChange({ ...filters, type: newTypes });
              }}
            >
              {type}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Country</DropdownMenuLabel>
          {availableCountries.map((country) => (
            <DropdownMenuCheckboxItem
              key={country}
              checked={filters.country.includes(country)}
              onCheckedChange={(checked) => {
                const newCountries = checked
                  ? [...filters.country, country]
                  : filters.country.filter((c) => c !== country);
                onFiltersChange({ ...filters, country: newCountries });
              }}
            >
              {country}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Calendar className="mr-2 h-4 w-4" />
            Date
            {(dateRange.from || dateRange.to) && (
              <Badge
                variant="secondary"
                className="ml-2 rounded-sm px-1 font-normal"
              >
                {dateRange.from && dateRange.to ? "Range" : "Set"}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Date Range</h4>
              <p className="text-sm text-muted-foreground">
                Filter fairs by date range
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="from" className="text-sm">
                  From
                </label>
                <input
                  id="from"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="col-span-2 h-8 rounded border border-input bg-background px-3 py-1 text-sm"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="to" className="text-sm">
                  To
                </label>
                <input
                  id="to"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="col-span-2 h-8 rounded border border-input bg-background px-3 py-1 text-sm"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <>
          {filters.status.map((status) => (
            <Badge key={status} variant="secondary" className="h-8">
              {status === "published" ? "Published" : "Draft"}
              <button
                onClick={() => clearFilter("status", status)}
                className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.featured !== null && (
            <Badge variant="secondary" className="h-8">
              Featured
              <button
                onClick={() => onFiltersChange({ ...filters, featured: null })}
                className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {filters.type.map((type) => (
            <Badge key={type} variant="secondary" className="h-8">
              {type}
              <button
                onClick={() => clearFilter("type", type)}
                className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {filters.country.map((country) => (
            <Badge key={country} variant="secondary" className="h-8">
              {country}
              <button
                onClick={() => clearFilter("country", country)}
                className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {(dateRange.from || dateRange.to) && (
            <Badge variant="secondary" className="h-8">
              Date Range
              <button
                onClick={() => setDateRange({ from: "", to: "" })}
                className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8"
          >
            Clear All
          </Button>
        </>
      )}
    </div>
  );
}
