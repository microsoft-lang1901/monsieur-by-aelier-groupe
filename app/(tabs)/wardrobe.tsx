import { ScrollView, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { ScreenState } from "@/components/ScreenState";
import { getCatalogueOverview } from "@/services/catalogueService";
import { getRecentlyViewed, getSavedPieces } from "@/storage/wardrobeStorage";
import { sharedStyles } from "@/theme/styles";
import { colors, spacing, typography } from "@/theme/tokens";
import type { Product } from "@/domain/products";

export default function WardrobeScreen() {
  const [savedPieces, setSavedPieces] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useFocusEffect(
    useCallback(() => {
      Promise.all([getSavedPieces(), getRecentlyViewed(), getCatalogueOverview()]).then(([saved, recent, snapshot]) => {
        setSavedPieces(saved);
        setRecentlyViewed(recent);
        setSavedProducts(snapshot.products.filter((product) => saved.includes(product.productData.sku)));
        setRecentProducts(snapshot.products.filter((product) => recent.includes(product.productData.sku)));

        const relatedSkus = saved
          .flatMap((sku) => snapshot.products.find((product) => product.productData.sku === sku)?.relationships.relatedSkus ?? [])
          .filter((sku) => !saved.includes(sku));
        setRecommendations(snapshot.products.filter((product) => relatedSkus.includes(product.productData.sku)).slice(0, 4));
      });
    }, [])
  );

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.constrained, { gap: spacing.xl }]}>
        <Text style={sharedStyles.label}>Wardrobe Archive</Text>
        {savedPieces.length === 0 ? (
          <ScreenState
            eyebrow="Saved Pieces"
            title="Your archive is quiet for now"
            body="Saved catalogue pieces will appear here for later consideration and outfit curation."
          />
        ) : savedProducts.length > 0 ? (
          <ProductGrid products={savedProducts} />
        ) : (
          <View style={{ gap: spacing.sm }}>
            {savedPieces.map((sku) => (
              <Text key={sku} style={[typography.body, { color: colors.espresso }]}>
                {sku}
              </Text>
            ))}
          </View>
        )}

        <View style={{ gap: spacing.md }}>
          <Text style={sharedStyles.label}>Complete The Expression</Text>
          {recommendations.length > 0 ? (
            <ProductGrid products={recommendations} />
          ) : (
            <Text style={sharedStyles.body}>Save a catalogue piece to generate related wardrobe recommendations.</Text>
          )}
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={sharedStyles.label}>Recently Viewed</Text>
          {recentlyViewed.length === 0 ? (
            <Text style={sharedStyles.body}>Viewed pieces will be archived here.</Text>
          ) : recentProducts.length > 0 ? (
            <ProductGrid products={recentProducts} />
          ) : (
            recentlyViewed.map((sku) => (
              <Text key={sku} style={[typography.body, { color: colors.espresso }]}>
                {sku}
              </Text>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
