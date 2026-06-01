import { View } from "react-native";
import type { Product } from "@/domain/products";
import { spacing } from "@/theme/tokens";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
};

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <View style={{ gap: spacing.lg }}>
      {products.map((product) => (
        <ProductCard key={product.productData.sku} product={product} />
      ))}
    </View>
  );
}
