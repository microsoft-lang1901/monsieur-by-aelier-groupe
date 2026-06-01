import { runtimeCatalogueRepository } from "@/data/runtimeCatalogueRepository";
import type { Collection, Product } from "@/domain/products";
import type { Material } from "@/domain/materials";

let snapshotPromise: ReturnType<typeof runtimeCatalogueRepository.load> | null = null;

async function getSnapshot() {
  snapshotPromise ??= runtimeCatalogueRepository.load();
  return snapshotPromise;
}

export async function getCollection(collectionId: string): Promise<Collection | null> {
  const snapshot = await getSnapshot();
  return snapshot.collections.find((collection) => collection.id === collectionId) ?? null;
}

export async function getProduct(sku: string): Promise<Product | null> {
  const snapshot = await getSnapshot();
  return snapshot.products.find((product) => product.productData.sku === sku) ?? null;
}

export async function searchMaterials(query: string): Promise<Material[]> {
  const snapshot = await getSnapshot();
  const normalized = query.trim().toLowerCase();

  if (!normalized) return snapshot.materials;

  return snapshot.materials.filter((material) =>
    [material.name, material.composition, material.editorialDescription].some((value) => value.toLowerCase().includes(normalized))
  );
}

export async function getCatalogueOverview() {
  return getSnapshot();
}
