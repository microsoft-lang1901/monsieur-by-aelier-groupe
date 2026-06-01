import { describe, expect, it } from "vitest";
import { parseCatalogueCsv } from "../src/domain/catalogue";
import { buildProducts } from "../src/domain/products";
import { filterProducts } from "../src/domain/search";

const csv = `sku,productName,category,silhouette,construction,fabricProgram,primaryColor,season,msrpUsd
SU-001,Navy Travel Suit,Suiting,Modern Business,Half Canvas,High Twist Wool,Navy,Travel,1595
KN-001,Cashmere Crewneck,Knitwear,Luxury Knit,N/A,Cashmere,Camel,Autumn/Winter,695
AC-001,Leather Weekender,Accessories,Travel Luxury,N/A,Full Grain Leather,Black,Year-Round,1495`;

const parsed = parseCatalogueCsv(csv);
if (!parsed.ok) throw new Error("Search fixture failed");
const products = buildProducts(parsed.products);

describe("product search filters", () => {
  it("filters by query", () => {
    expect(filterProducts(products, { query: "cashmere", category: null, collectionId: null })).toHaveLength(1);
  });

  it("filters by category", () => {
    expect(filterProducts(products, { query: "", category: "Accessories", collectionId: null })).toHaveLength(1);
  });

  it("filters by collection", () => {
    expect(filterProducts(products, { query: "", category: null, collectionId: "heritage-collections" })).toHaveLength(1);
  });
});
