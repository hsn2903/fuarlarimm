// app/actions/scrape.ts
"use server";

import * as cheerio from "cheerio";

export interface ExhibitionData {
  fairName: string;
  cycle: string;
  date: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
}

export async function scrapeExhibitions() {
  try {
    const response = await fetch(
      "https://www.eventseye.com/fairs/c1_trade-shows_china.html",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const exhibitions: ExhibitionData[] = [];

    $("table.tradeshows tbody tr").each((index, element) => {
      const $row = $(element);

      const fairName = $row.find("td:first-child a b").text().trim();
      const cycle = $row.find("td:nth-child(2)").text().trim();
      const dateText = $row.find("td:last-child").text().trim();
      const venue = $row.find("td:nth-child(3)").text().trim();
      const description = $row.find("td i").text().trim();

      // Date parsing
      let startDate = dateText;
      let endDate = dateText;

      if (dateText.includes("-")) {
        const match = dateText.match(/([A-Za-z]+)\s+(\d+)-(\d+),\s*(\d+)/);
        if (match) {
          const [, month, startDay, endDay, year] = match;
          startDate = `${month} ${startDay}, ${year}`;
          endDate = `${month} ${endDay}, ${year}`;
        }
      }

      exhibitions.push({
        fairName: fairName || "Bilinmiyor",
        cycle: cycle || "Bilinmiyor",
        date: dateText,
        venue: venue || "Bilinmiyor",
        description: description || "Açıklama bulunmuyor",
        startDate,
        endDate,
      });
    });

    return exhibitions;
  } catch (error) {
    console.error("Veri toplama hatası:", error);
    throw error;
  }
}
