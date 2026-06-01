import { Image, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import type { Product } from "@/domain/products";
import { brandAssets } from "@/theme/brandAssets";
import { colors, radius, spacing, typography } from "@/theme/tokens";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={{ pathname: "/product/[sku]", params: { sku: product.productData.sku } }} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={`Open ${product.productData.productName}`}>
        <View style={{ gap: spacing.sm }}>
          <Image
            source={brandAssets.moodboard}
            accessibilityLabel={product.imagery.alt}
            style={{ width: "100%", aspectRatio: 0.78, borderRadius: radius.sm, backgroundColor: colors.taupe }}
          />
          <Text style={[typography.productName, { color: colors.ink }]}>{product.productData.productName}</Text>
          <Text style={[typography.label, { color: colors.muted, textTransform: "uppercase" }]}>
            {product.productData.primaryColor} / {product.productData.fabricProgram}
          </Text>
          <Text style={[typography.productPrice, { color: colors.espresso }]}>${product.productData.msrpUsd.toLocaleString("en-US")}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
