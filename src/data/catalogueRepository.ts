import type { CatalogueProduct } from "@/domain/catalogue";
import { parseCatalogueCsv } from "@/domain/catalogue";
import { buildMaterials, type Material } from "@/domain/materials";
import { buildCollections, buildProducts, type Collection, type Product } from "@/domain/products";

export const catalogueCsvPath = "data/catalogue/monsieur-catalogue.csv";

export type CatalogueRepositorySnapshot = {
  products: Product[];
  collections: Collection[];
  materials: Material[];
};

export type CatalogueRepository = {
  load(): Promise<CatalogueRepositorySnapshot>;
};

export class MissingCatalogueError extends Error {
  constructor() {
    super(`Canonical catalogue CSV is required at ${catalogueCsvPath}.`);
    this.name = "MissingCatalogueError";
  }
}

export function createSnapshotFromCatalogue(catalogue: CatalogueProduct[]): CatalogueRepositorySnapshot {
  const products = buildProducts(catalogue);
  return {
    products,
    collections: buildCollections(products),
    materials: buildMaterials(catalogue)
  };
}

export function createCsvCatalogueRepository(readCsv: () => Promise<string | null>): CatalogueRepository {
  return {
    async load() {
      const csv = await readCsv();

      if (!csv) {
        throw new MissingCatalogueError();
      }

      const parsed = parseCatalogueCsv(csv);

      if (!parsed.ok) {
        throw new Error(parsed.missingColumns?.length ? `${parsed.reason} ${parsed.missingColumns.join(", ")}` : parsed.reason);
      }

      return createSnapshotFromCatalogue(parsed.products);
    }
  };
}
