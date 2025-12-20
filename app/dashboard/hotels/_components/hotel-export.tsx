/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";
import { Hotel } from "@/lib/types/hotel";
import { toast } from "sonner";

interface HotelExportProps {
  hotels: Hotel[];
}

export default function HotelExport({ hotels }: HotelExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = () => {
    setIsExporting(true);
    try {
      const dataStr = JSON.stringify(hotels, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hotels-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Hotels exported as JSON file");
    } catch (error) {
      toast.error("Failed to export hotels");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    setIsExporting(true);
    try {
      const headers = [
        "Name",
        "Description",
        "City",
        "Country",
        "Address",
        "Email",
        "Phone",
        "Created At",
      ];
      const csvRows = [
        headers.join(","),
        ...hotels.map((hotel) =>
          [
            `"${hotel.name.replace(/"/g, '""')}"`,
            `"${(hotel.description || "").replace(/"/g, '""')}"`,
            `"${(hotel.city || "").replace(/"/g, '""')}"`,
            `"${(hotel.country || "").replace(/"/g, '""')}"`,
            `"${(hotel.address || "").replace(/"/g, '""')}"`,
            `"${(hotel.email || "").replace(/"/g, '""')}"`,
            `"${(hotel.phone || "").replace(/"/g, '""')}"`,
            `"${new Date(hotel.createdAt).toISOString()}"`,
          ].join(",")
        ),
      ];

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hotels-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Hotels exported as CSV file");
    } catch (error) {
      toast.error("Failed to export hotels");
    } finally {
      setIsExporting(false);
    }
  };

  if (hotels.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToJSON}>
          <FileText className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
