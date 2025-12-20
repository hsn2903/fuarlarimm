import { readFileSync } from "fs";
import { join } from "path";

const filePath = join(
  process.cwd(),
  "app/dashboard/fairs/_components/sections/images-section.tsx"
);
let content = readFileSync(filePath, "utf8");

console.log("Searching for field.value.filter...");
let index = 0;
while ((index = content.indexOf("filter", index)) !== -1) {
  console.log(`\nOccurence at index ${index}:`);
  console.log(content.substring(index - 100, index + 100));
  index += 1;
}
