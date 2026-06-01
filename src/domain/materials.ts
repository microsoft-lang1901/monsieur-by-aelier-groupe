import type { CatalogueProduct } from "./catalogue";

export type Material = {
  id: string;
  name: string;
  composition: string;
  seasonality: string;
  handFeel: string;
  editorialDescription: string;
};

const materialFamilies = [
  "Cashmere",
  "Silk-Cashmere",
  "Merino",
  "Fine Wool",
  "Wool Blend",
  "Linen Blend",
  "Cotton",
  "Leather",
  "Technical Outerwear"
] as const;

type MaterialFamily = (typeof materialFamilies)[number];

const materialCopy: Record<MaterialFamily, Omit<Material, "id" | "name">> = {
  Cashmere: {
    composition: "Cashmere",
    seasonality: "Cool weather",
    handFeel: "Soft, warm, and dry to the touch",
    editorialDescription: "A quiet material for pieces worn close to the body and kept for years."
  },
  "Silk-Cashmere": {
    composition: "Silk and cashmere blend",
    seasonality: "Transitional",
    handFeel: "Fluid, light, and softly warm",
    editorialDescription: "A refined blend for knitwear with drape and restraint."
  },
  Merino: {
    composition: "Merino wool",
    seasonality: "All season",
    handFeel: "Fine, resilient, and smooth",
    editorialDescription: "A precise wool for daily tailoring and knitwear."
  },
  "Fine Wool": {
    composition: "Fine wool",
    seasonality: "All season",
    handFeel: "Clean, structured, and breathable",
    editorialDescription: "A foundation material for tailored wardrobes."
  },
  "Wool Blend": {
    composition: "Wool blend",
    seasonality: "Cool weather",
    handFeel: "Structured and substantial",
    editorialDescription: "A pragmatic material family for outerwear and tailored layers."
  },
  "Linen Blend": {
    composition: "Linen blend",
    seasonality: "Warm weather",
    handFeel: "Dry, airy, and relaxed",
    editorialDescription: "A relaxed material for measured summer dressing."
  },
  Cotton: {
    composition: "Cotton",
    seasonality: "All season",
    handFeel: "Crisp, familiar, and breathable",
    editorialDescription: "A precise everyday material for shirting and trousers."
  },
  Leather: {
    composition: "Leather",
    seasonality: "All season",
    handFeel: "Smooth, dense, and structured",
    editorialDescription: "A durable material for objects carried daily."
  },
  "Technical Outerwear": {
    composition: "Technical textile",
    seasonality: "Weather protective",
    handFeel: "Light, compact, and protective",
    editorialDescription: "A modern material family reserved for practical outer layers."
  }
};

export function inferMaterialFamily(product: CatalogueProduct): MaterialFamily {
  const source = `${product.fabricProgram} ${product.category} ${product.construction}`.toLowerCase();

  if (source.includes("silk") && source.includes("cashmere")) return "Silk-Cashmere";
  if (source.includes("cashmere")) return "Cashmere";
  if (source.includes("merino")) return "Merino";
  if (source.includes("linen")) return "Linen Blend";
  if (source.includes("cotton") || source.includes("shirt")) return "Cotton";
  if (source.includes("leather") || source.includes("accessor")) return "Leather";
  if (source.includes("technical") || source.includes("outerwear")) return "Technical Outerwear";
  if (source.includes("blend")) return "Wool Blend";
  return "Fine Wool";
}

export function buildMaterials(products: CatalogueProduct[]): Material[] {
  const names = Array.from(new Set(products.map(inferMaterialFamily)));

  return names.map((name) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    ...materialCopy[name]
  }));
}
