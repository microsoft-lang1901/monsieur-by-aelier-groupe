import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const cataloguePath = `${root}/data/catalogue/monsieur-catalogue.csv`;
const outputPath = `${root}/src/data/generatedCatalogue.ts`;
const requiredColumns = [
  ["sku", ["sku"]],
  ["productName", ["productname", "product name"]],
  ["category", ["category"]],
  ["silhouette", ["silhouette", "silhouette / style", "silhouette/style", "style"]],
  ["construction", ["construction"]],
  ["fabricProgram", ["fabricprogram", "fabric program"]],
  ["primaryColor", ["primarycolor", "primary color"]],
  ["season", ["season"]],
  ["msrpUsd", ["msrpusd", "msrp usd", "msrp"]]
];

if (!existsSync(cataloguePath)) {
  console.error(`Canonical catalogue CSV is required at data/catalogue/monsieur-catalogue.csv.`);
  process.exit(1);
}

const csv = readFileSync(cataloguePath, "utf8");
const header = csv.trim().split(/\r?\n/)[0]?.split(",").map((column) => column.trim().toLowerCase()) ?? [];
const missing = requiredColumns
  .filter(([, aliases]) => !aliases.some((alias) => header.includes(alias)))
  .map(([column]) => column);

if (missing.length > 0) {
  console.error(`Catalogue CSV is missing required columns: ${missing.join(", ")}`);
  process.exit(1);
}

writeFileSync(
  outputPath,
  `export const generatedCatalogueCsv: string | null = ${JSON.stringify(csv)};\n`,
  "utf8"
);

console.log(`Imported canonical catalogue from data/catalogue/monsieur-catalogue.csv.`);
