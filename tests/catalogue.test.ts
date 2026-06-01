import { describe, expect, it } from "vitest";
import { parseCatalogueCsv } from "../src/domain/catalogue";
import { buildMaterials } from "../src/domain/materials";
import { buildCollections, buildProducts } from "../src/domain/products";

const csv = `sku,productName,category,silhouette,construction,fabricProgram,primaryColor,season,msrpUsd
MK-001,Soft Cashmere Polo,Knitwear,Relaxed polo,Fully fashioned,Cashmere,Ivory,Winter 2026,980
TJ-001,Continental Jacket,Tailored Jackets,Single breasted,Half canvas,Fine Wool,Espresso,Autumn 2026,2200
AC-001,Voyage Card Holder,Accessories,Compact,Folded edge,Leather,Ink,Core,420`;

const presentationCsv = `SKU,Product Name,Category,Silhouette / Style,Construction,Fabric Program,Primary Color,Season,MSRP USD
AG-SU-001,SOUL 01 Soft Tailored Suit,Suiting,Relaxed Mediterranean,Half Canvas,Super 120s Tropical Wool,Navy,Year-Round,1495`;

describe("catalogue import", () => {
  it("parses the required catalogue schema", () => {
    const result = parseCatalogueCsv(csv);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.products).toHaveLength(3);
      expect(result.products[0].msrpUsd).toBe(980);
    }
  });

  it("rejects missing required columns", () => {
    const result = parseCatalogueCsv("sku,productName\nA,Piece");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.missingColumns).toContain("category");
  });

  it("accepts catalogue presentation headers", () => {
    const result = parseCatalogueCsv(presentationCsv);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.products[0]).toMatchObject({
        sku: "AG-SU-001",
        productName: "SOUL 01 Soft Tailored Suit",
        silhouette: "Relaxed Mediterranean",
        msrpUsd: 1495
      });
    }
  });
});

describe("product generation", () => {
  const parsed = parseCatalogueCsv(csv);
  if (!parsed.ok) throw new Error("Fixture failed");

  it("creates one product and Fibre Passport per catalogue row", () => {
    const products = buildProducts(parsed.products);
    expect(products).toHaveLength(parsed.products.length);
    expect(products.every((product) => product.fibrePassport.traceabilityStatement.length > 0)).toBe(true);
  });

  it("generates product relationships from catalogue context", () => {
    const products = buildProducts(parsed.products);
    expect(products.find((product) => product.productData.sku === "MK-001")?.relationships.relatedSkus.length).toBeGreaterThan(0);
  });

  it("maps products into generated collections", () => {
    const collections = buildCollections(buildProducts(parsed.products));
    expect(collections.find((collection) => collection.id === "maille-parisienne")?.products).toHaveLength(1);
    expect(collections.find((collection) => collection.id === "continental-sport")?.products).toHaveLength(1);
    expect(collections.find((collection) => collection.id === "voyage-accessories")?.products).toHaveLength(1);
  });

  it("generates material families from catalogue fields", () => {
    const materials = buildMaterials(parsed.products);
    expect(materials.map((material) => material.name)).toEqual(expect.arrayContaining(["Cashmere", "Fine Wool", "Leather"]));
  });
});
