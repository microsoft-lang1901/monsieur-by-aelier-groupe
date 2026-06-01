import type { CatalogueProduct } from "./catalogue";
import { inferMaterialFamily } from "./materials";

export type ProductEditorialData = {
  lead: string;
  stylingNotes: string[];
};

export type FibrePassport = {
  composition: string;
  originRegion: string;
  constructionMethod: string;
  garmentWeight: string;
  gauge: string;
  micronCount: string;
  traceabilityStatement: string;
};

export type ProductRelationships = {
  collectionId: string;
  materialId: string;
  relatedSkus: string[];
};

export type ProductImagery = {
  hero: string;
  gallery: string[];
  alt: string;
};

export type Product = {
  productData: CatalogueProduct;
  editorialData: ProductEditorialData;
  fibrePassport: FibrePassport;
  relationships: ProductRelationships;
  imagery: ProductImagery;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  products: Product[];
};

export const collectionDefinitions = [
  {
    id: "maille-parisienne",
    name: "Maille Parisienne",
    description: "Knitwear edited for quiet daily use.",
    categories: ["Knitwear"]
  },
  {
    id: "continental-sport",
    name: "Continental Sport",
    description: "Structured jackets and softened tailoring for movement.",
    categories: ["Sportscoats", "Tailored Jackets"]
  },
  {
    id: "heritage-collections",
    name: "Heritage Collections",
    description: "The central wardrobe: suiting, shirting, outerwear, and trousers.",
    categories: ["Suiting", "Shirting", "Outerwear", "Trousers"]
  },
  {
    id: "evening-atelier",
    name: "Evening Atelier",
    description: "Evening pieces with restraint and ceremony.",
    categories: ["Eveningwear"]
  },
  {
    id: "voyage-accessories",
    name: "Voyage Accessories",
    description: "Objects for travel, care, and daily carrying.",
    categories: ["Accessories"]
  }
] as const;

export function buildProducts(catalogue: CatalogueProduct[]): Product[] {
  const products = catalogue.map((item) => {
    const materialName = inferMaterialFamily(item);
    const materialId = materialName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const collectionId = getCollectionIdForCategory(item.category);

    return {
      productData: item,
      editorialData: {
        lead: `${item.productName} in ${item.primaryColor}, cut as ${item.silhouette}.`,
        stylingNotes: [
          "Wear with tonal layers and polished leather.",
          "Keep the silhouette clean and the palette restrained."
        ]
      },
      fibrePassport: {
        composition: item.fabricProgram || "To Be Confirmed By Atelier",
        originRegion: "To Be Confirmed By Atelier",
        constructionMethod: item.construction || "To Be Confirmed By Atelier",
        garmentWeight: "To Be Confirmed By Atelier",
        gauge: item.category === "Knitwear" ? "To Be Confirmed By Atelier" : "Not applicable",
        micronCount: materialName.includes("Wool") || materialName.includes("Cashmere") ? "To Be Confirmed By Atelier" : "Not applicable",
        traceabilityStatement: "Material details are recorded for atelier confirmation before publication."
      },
      relationships: {
        collectionId,
        materialId,
        relatedSkus: []
      },
      imagery: {
        hero: "brand-moodboard",
        gallery: ["brand-moodboard"],
        alt: `${item.productName} in ${item.primaryColor}`
      }
    };
  });

  return products.map((product) => ({
    ...product,
    relationships: {
      ...product.relationships,
      relatedSkus: getRelatedProducts(product, products)
        .slice(0, 4)
        .map((candidate) => candidate.productData.sku)
    }
  }));
}

function getRelatedProducts(product: Product, products: Product[]): Product[] {
  const related = products.filter((candidate) => {
    if (candidate.productData.sku === product.productData.sku) return false;
    return (
      candidate.relationships.collectionId === product.relationships.collectionId ||
      candidate.relationships.materialId === product.relationships.materialId
    );
  });

  if (related.length > 0) return related;

  return products.filter((candidate) => candidate.productData.sku !== product.productData.sku);
}

export function buildCollections(products: Product[]): Collection[] {
  return collectionDefinitions.map((definition) => ({
    id: definition.id,
    name: definition.name,
    description: definition.description,
    categories: [...definition.categories],
    products: products.filter((product) => definition.categories.some((category) => category === product.productData.category))
  }));
}

export function getCollectionIdForCategory(category: string): string {
  const collection = collectionDefinitions.find((definition) => definition.categories.some((candidate) => candidate === category));
  return collection?.id ?? "heritage-collections";
}
