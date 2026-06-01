import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseCatalogueCsv } from "../src/domain/catalogue";
import { buildCollections, buildProducts } from "../src/domain/products";
import { buildMaterials } from "../src/domain/materials";

const csv = readFileSync("data/catalogue/monsieur-catalogue.csv", "utf8");
const parsed = parseCatalogueCsv(csv);
if (!parsed.ok) throw new Error(parsed.reason);

describe("real catalogue", () => {
  it("imports the canonical product file", () => {
    expect(parsed.products).toHaveLength(28);
  });

  it("contains no duplicate SKUs", () => {
    const skus = parsed.products.map((product) => product.sku);
    expect(new Set(skus).size).toBe(skus.length);
  });

  it("generates all required collections from the canonical file", () => {
    const collections = buildCollections(buildProducts(parsed.products));
    expect(collections.every((collection) => collection.products.length > 0)).toBe(true);
  });

  it("generates materials and fibre passports for every product", () => {
    const products = buildProducts(parsed.products);
    const materials = buildMaterials(parsed.products);
    expect(materials.length).toBeGreaterThan(0);
    expect(products.every((product) => product.fibrePassport.composition.length > 0)).toBe(true);
  });
});
