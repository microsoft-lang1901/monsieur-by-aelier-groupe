import { ImageBackground, ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { ProductGrid } from "@/components/ProductGrid";
import { ScreenState } from "@/components/ScreenState";
import { getCatalogueOverview } from "@/services/catalogueService";
import type { Product } from "@/domain/products";
import { brandAssets } from "@/theme/brandAssets";
import { sharedStyles } from "@/theme/styles";
import { colors, spacing, typography } from "@/theme/tokens";

export default function HomeScreen() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [catalogueMissing, setCatalogueMissing] = useState(false);

  useEffect(() => {
    getCatalogueOverview()
      .then((snapshot) => setFeaturedProducts(snapshot.products.slice(0, 4)))
      .catch(() => setCatalogueMissing(true));
  }, []);

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <ImageBackground
        source={brandAssets.moodboard}
        resizeMode="cover"
        accessibilityLabel="MONSIEUR editorial moodboard"
        style={{ minHeight: 520, justifyContent: "flex-end" }}
      >
        <View style={{ padding: spacing.lg, backgroundColor: colors.ivoryOverlay, gap: spacing.md }}>
          <Text style={[typography.label, { color: colors.espresso, textTransform: "uppercase" }]}>MONSIEUR by Aelier Groupe</Text>
          <Text style={[typography.displayHero, { color: colors.ink }]}>Quietly Refined.</Text>
          <Text style={[typography.editorialLead, { color: colors.espresso }]}>
            A catalogue-led wardrobe for the modern European gentleman.
          </Text>
        </View>
      </ImageBackground>

      <View style={[sharedStyles.constrained, { gap: spacing.lg }]}>
        <Text style={sharedStyles.label}>Editorial Lead</Text>
        <Text style={sharedStyles.title}>The private boutique as a mobile archive.</Text>
        <Text style={sharedStyles.body}>
          MONSIEUR presents material, construction, and silhouette before persuasion. Each garment begins in the catalogue and is
          expanded with atelier intelligence.
        </Text>
        <Link href="/collections" style={sharedStyles.secondaryButtonText} accessibilityLabel="Open collections">
          View Collections
        </Link>
      </View>

      <View style={[sharedStyles.constrained, { gap: spacing.lg }]}>
        <Text style={sharedStyles.label}>Featured Products</Text>
        {catalogueMissing ? (
          <ScreenState
            eyebrow="Catalogue Required"
            title="Awaiting canonical CSV"
            body="Add the uploaded catalogue to data/catalogue/monsieur-catalogue.csv to generate products, collections, materials, and Fibre Passports."
          />
        ) : (
          <ProductGrid products={featuredProducts} />
        )}
      </View>
    </ScrollView>
  );
}
