// app/api/tradeshow/scrape/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { ExhibitionData, VenueData, ScrapeResult } from "@/types/tradeshow";

// Helper function to extract date information
function parseDateInfo(dateText: string) {
  const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4})/;
  const durationRegex = /(\d+)\s+days?/;
  const monthYearRegex = /[A-Za-z]+\.?\s+\d{4}/;

  const dateMatch = dateText.match(dateRegex);
  const durationMatch = dateText.match(durationRegex);
  const monthYearMatch = dateText.match(monthYearRegex);

  const rawDate = dateMatch ? dateMatch[1] : "";
  const duration = durationMatch ? parseInt(durationMatch[1]) : 0;

  // Calculate end date
  let endDate = "";
  if (rawDate && duration > 0) {
    const start = new Date(rawDate);
    const end = new Date(start);
    end.setDate(start.getDate() + duration - 1);
    endDate = end.toLocaleDateString("en-US");
  }

  return {
    start: rawDate,
    end: endDate,
    duration,
    monthYear: monthYearMatch ? monthYearMatch[0] : "",
    raw: dateText,
  };
}

// Helper to extract categories from description
function extractCategories(description: string): string[] {
  const categories: string[] = [];

  // Common categories based on keywords
  const categoryKeywords = [
    {
      category: "Chemical",
      keywords: ["chemical", "biotechnology", "chemistry"],
    },
    { category: "Aviation", keywords: ["helicopter", "aviation", "aerospace"] },
    { category: "Pet", keywords: ["pet", "animal", "veterinary"] },
    {
      category: "Construction",
      keywords: ["construction", "platform", "elevating", "access"],
    },
    {
      category: "Automotive",
      keywords: ["vehicle", "automotive", "bus", "transport"],
    },
    {
      category: "Technology",
      keywords: ["digital", "technology", "tech", "electronics", "circuit"],
    },
    { category: "Maritime", keywords: ["maritime", "ship", "marine"] },
    { category: "Textile", keywords: ["textile", "fabric", "nonwovens"] },
    {
      category: "Food",
      keywords: ["food", "beverage", "bakery", "dairy", "tea"],
    },
    { category: "Packaging", keywords: ["packaging", "label", "printing"] },
    { category: "Machinery", keywords: ["machinery", "equipment", "machine"] },
    { category: "Medical", keywords: ["dental", "medical", "health", "care"] },
    { category: "Sports", keywords: ["sports", "fishing", "outdoor"] },
    { category: "Lifestyle", keywords: ["lifestyle", "luxury", "fashion"] },
    {
      category: "Energy",
      keywords: ["energy", "heating", "boiler", "thermal"],
    },
  ];

  const descLower = description.toLowerCase();

  categoryKeywords.forEach(({ category, keywords }) => {
    if (keywords.some((keyword) => descLower.includes(keyword.toLowerCase()))) {
      categories.push(category);
    }
  });

  return [...new Set(categories)]; // Remove duplicates
}

// Helper to normalize frequency
function normalizeFrequency(freqText: string): string {
  const freq = freqText.toLowerCase();

  if (freq.includes("every 2 years")) return "Biennial";
  if (freq.includes("every 3 years")) return "Triennial";
  if (freq.includes("once a year") || freq.includes("annual")) return "Annual";
  if (freq.includes("twice a year")) return "Semi-annual";
  if (freq.includes("monthly")) return "Monthly";
  if (freq.includes("quarterly")) return "Quarterly";
  if (freq.includes("unknown")) return "Unknown";

  return "Other";
}

export async function GET(request: NextRequest) {
  try {
    const url = "https://www.eventseye.com/fairs/c1_trade-shows_china.html";

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const exhibitions: ExhibitionData[] = [];
    const allVenues: VenueData[] = [];
    const cities: Set<string> = new Set();
    const dateSet: Set<string> = new Set();

    // Extract total count from caption
    const captionText = $("table.tradeshows caption").text();
    const totalMatch = captionText.match(/(\d+)\s+Trade Shows/);
    const total = totalMatch ? parseInt(totalMatch[1]) : 0;

    // Process each exhibition row
    $("table.tradeshows tbody tr").each((index, element) => {
      const $row = $(element);

      // Extract basic information
      const $exhibitionLink = $row.find("td:first-child a");
      const exhibitionName = $exhibitionLink.find("b").text().trim();
      const description = $exhibitionLink.find("i").text().trim();
      const link = $exhibitionLink.attr("href") || "";
      const id = link.split("-").pop()?.split(".")[0] || `ex-${index}`;

      const cycle = $row.find("td:nth-child(2)").text().trim();
      const dateText = $row.find("td:last-child").text().trim();

      // Parse date information
      const dateInfo = parseDateInfo(dateText);
      if (dateInfo.start) {
        dateSet.add(dateInfo.start);
      }

      // Extract venues
      const venues: VenueData[] = [];
      const $venueColumn = $row.find("td:nth-child(3)");
      let currentVenue: Partial<VenueData> = {};

      $venueColumn.find("a").each((i, venueElement) => {
        const $venue = $(venueElement);
        const text = $venue.text().trim();
        const href = $venue.attr("href") || "";

        if (href.includes("pl1_trade-shows_")) {
          // This is a venue
          if (currentVenue.name) {
            venues.push(currentVenue as VenueData);
          }
          const venueId = href.split("_").pop()?.split(".")[0];
          currentVenue = {
            name: text,
            venueLink: href,
            venueId,
            location: "",
          };
        } else if (href.includes("cy1_trade-shows-")) {
          // This is a city
          const city = text;
          cities.add(city);

          if (currentVenue.name) {
            currentVenue.location = city;
            venues.push(currentVenue as VenueData);
            allVenues.push(currentVenue as VenueData);
            currentVenue = {};
          } else {
            // Venue without venue name, just city
            currentVenue = {
              name: "",
              location: city,
              venueLink: "",
            };
            venues.push(currentVenue as VenueData);
            allVenues.push(currentVenue as VenueData);
            currentVenue = {};
          }
        }
      });

      // Add last venue if exists
      if (currentVenue.name) {
        venues.push(currentVenue as VenueData);
        allVenues.push(currentVenue as VenueData);
      }

      // Extract categories from description and name
      const categories = extractCategories(`${exhibitionName} ${description}`);

      // Determine if date is confirmed or tentative
      const isConfirmed =
        !dateText.includes("?") && !dateText.includes("unknown");

      // Create exhibition data
      const exhibition: ExhibitionData = {
        id,
        exhibitionName,
        description,
        link: `https://www.eventseye.com/fairs/${link}`,
        cycle,
        venues,
        date: dateInfo,
        category: categories.length > 0 ? categories : undefined,
        frequency: normalizeFrequency(cycle),
        isConfirmed,
      };

      exhibitions.push(exhibition);
    });

    // Calculate statistics
    const byCity: Record<string, number> = {};
    const byFrequency: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    exhibitions.forEach((exhibition) => {
      // Count by city
      exhibition.venues.forEach((venue) => {
        if (venue.location) {
          byCity[venue.location] = (byCity[venue.location] || 0) + 1;
        }
      });

      // Count by frequency
      byFrequency[exhibition.frequency] =
        (byFrequency[exhibition.frequency] || 0) + 1;

      // Count by month
      if (exhibition.date.start) {
        const month = exhibition.date.start.split("/")[0];
        byMonth[month] = (byMonth[month] || 0) + 1;
      }
    });

    // Get date range
    const dates = Array.from(dateSet).filter(Boolean).sort();

    const result: ScrapeResult = {
      total,
      exhibitions,
      venues: allVenues.filter(
        (v, i, a) =>
          a.findIndex(
            (v2) => v2.name === v.name && v2.location === v.location
          ) === i
      ), // Unique venues
      cities: Array.from(cities).sort(),
      dateRange: {
        earliest: dates[0] || "",
        latest: dates[dates.length - 1] || "",
      },
      statistics: {
        byCity,
        byFrequency,
        byMonth,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json(
      {
        error: "Failed to scrape data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint for custom URL scraping
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Similar scraping logic as GET but for custom URL
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    // ... rest of the scraping logic

    return NextResponse.json({ message: "Scraping initiated", url });
  } catch (error) {
    console.error("Custom scraping error:", error);
    return NextResponse.json(
      { error: "Failed to scrape custom URL" },
      { status: 500 }
    );
  }
}
