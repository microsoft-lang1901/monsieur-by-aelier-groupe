import type { Product } from "./products";

export type ProductSearchFilters = {
  query: string;
  category: string | null;
  collectionId: string | null;
};

export function filterProducts(products: Product[], filters: ProductSearchFilters): Product[] {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        product.productData.productName,
        product.productData.category,
        product.productData.construction,
        product.productData.fabricProgram,
        product.productData.primaryColor,
        product.productData.season
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesCategory = !filters.category || product.productData.category === filters.category;
    const matchesCollection = !filters.collectionId || product.relationships.collectionId === filters.collectionId;
    return matchesQuery && matchesCategory && matchesCollection;
  });
}
