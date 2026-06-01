import { ScrollView, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { ScreenState } from "@/components/ScreenState";
import { getCatalogueOverview } from "@/services/catalogueService";
import type { Collection } from "@/domain/products";
import { sharedStyles } from "@/theme/styles";
import { colors, spacing, typography } from "@/theme/tokens";

export default function CollectionsScreen() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [catalogueMissing, setCatalogueMissing] = useState(false);

  useEffect(() => {
    getCatalogueOverview()
      .then((snapshot) => setCollections(snapshot.collections))
      .catch(() => setCatalogueMissing(true));
  }, []);

  if (catalogueMissing) {
    return (
      <ScrollView style={sharedStyles.screen}>
        <ScreenState
          eyebrow="Catalogue Required"
          title="Collections are generated dynamically"
          body="No manual collection assignment is used. Add the canonical CSV to create catalogue-led chapters."
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.constrained, { gap: spacing.xl }]}>
        {collections.map((collection) => (
          <View key={collection.id} style={{ gap: spacing.md }}>
            <Text style={sharedStyles.label}>{collection.name}</Text>
            <Text style={sharedStyles.title}>{collection.description}</Text>
            <Text style={[typography.body, { color: colors.muted }]}>
              {collection.products.length} catalogue {collection.products.length === 1 ? "piece" : "pieces"}
            </Text>
            <ProductGrid products={collection.products} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
