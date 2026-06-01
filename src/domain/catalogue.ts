export type CatalogueProduct = {
  sku: string;
  productName: string;
  category: string;
  silhouette: string;
  construction: string;
  fabricProgram: string;
  primaryColor: string;
  season: string;
  msrpUsd: number;
};

export const catalogueColumns = [
  "sku",
  "productName",
  "category",
  "silhouette",
  "construction",
  "fabricProgram",
  "primaryColor",
  "season",
  "msrpUsd"
] as const;

export type CatalogueColumn = (typeof catalogueColumns)[number];

const headerAliases: Record<CatalogueColumn, string[]> = {
  sku: ["sku"],
  productName: ["productname", "product name"],
  category: ["category"],
  silhouette: ["silhouette", "silhouette / style", "silhouette/style", "style"],
  construction: ["construction"],
  fabricProgram: ["fabricprogram", "fabric program"],
  primaryColor: ["primarycolor", "primary color"],
  season: ["season"],
  msrpUsd: ["msrpusd", "msrp usd", "msrp"]
};

export type CatalogueImportResult =
  | { ok: true; products: CatalogueProduct[] }
  | { ok: false; reason: string; missingColumns?: string[] };

const normalizeHeader = (value: string) => value.trim();

export function parseCatalogueCsv(csv: string): CatalogueImportResult {
  const rows = csv
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => parseCsvLine(line));

  if (rows.length < 2) {
    return { ok: false, reason: "Catalogue CSV must include a header row and at least one product." };
  }

  const headers = rows[0].map(normalizeHeader);
  const columnIndexes = Object.fromEntries(
    catalogueColumns.map((column) => [column, findHeaderIndex(headers, headerAliases[column])])
  ) as Record<CatalogueColumn, number>;
  const missingColumns = catalogueColumns.filter((column) => columnIndexes[column] === -1);

  if (missingColumns.length > 0) {
    return { ok: false, reason: "Catalogue CSV is missing required columns.", missingColumns };
  }

  const products: CatalogueProduct[] = [];

  for (const row of rows.slice(1)) {
    const record = Object.fromEntries(
      catalogueColumns.map((column) => [column, row[columnIndexes[column]]?.trim() ?? ""])
    ) as Record<CatalogueColumn, string>;
    const price = Number(record.msrpUsd);

    if (!Number.isFinite(price)) {
      return { ok: false, reason: `Invalid msrpUsd for SKU ${record.sku || "unknown"}.` };
    }

    products.push({
      sku: record.sku,
      productName: record.productName,
      category: record.category,
      silhouette: record.silhouette,
      construction: record.construction,
      fabricProgram: record.fabricProgram,
      primaryColor: record.primaryColor,
      season: record.season,
      msrpUsd: price
    });
  }

  return { ok: true, products };
}

function normalizeHeaderKey(value: string): string {
  return value.trim().toLowerCase();
}

function findHeaderIndex(headers: string[], aliases: string[]): number {
  const normalized = headers.map(normalizeHeaderKey);
  return normalized.findIndex((header) => aliases.includes(header));
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      cells.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}
