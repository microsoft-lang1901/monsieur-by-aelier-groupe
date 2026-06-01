import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { ScreenState } from "@/components/ScreenState";
import { ProductGrid } from "@/components/ProductGrid";
import { getCatalogueOverview, searchMaterials } from "@/services/catalogueService";
import type { Material } from "@/domain/materials";
import type { Collection, Product } from "@/domain/products";
import { filterProducts } from "@/domain/search";
import { sharedStyles } from "@/theme/styles";
import { colors, radius, spacing, typography } from "@/theme/tokens";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [catalogueMissing, setCatalogueMissing] = useState(false);

  useEffect(() => {
    getCatalogueOverview()
      .then((snapshot) => {
        setMaterials(snapshot.materials);
        setCollections(snapshot.collections);
        setProducts(snapshot.products);
      })
      .catch(() => setCatalogueMissing(true));
  }, []);

  useEffect(() => {
    searchMaterials(query).then(setMaterials).catch(() => undefined);
  }, [query]);

  const categories = Array.from(new Set(products.map((product) => product.productData.category)));
  const filteredProducts = filterProducts(products, {
    query,
    category: selectedCategory,
    collectionId: selectedCollection
  });

  if (catalogueMissing) {
    return (
      <ScrollView style={sharedStyles.screen}>
        <ScreenState
          eyebrow="Material Search"
          title="Catalogue data required"
          body="Material-first discovery is generated from fabric programs in the canonical catalogue."
        />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.constrained, { gap: spacing.lg }]}>
        <Text style={sharedStyles.label}>Search</Text>
        <TextInput
          accessibilityLabel="Search materials"
          value={query}
          onChangeText={setQuery}
          placeholder="Material, colour, construction"
          placeholderTextColor={colors.stone}
          style={{
            minHeight: 44,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
            ...typography.body,
            color: colors.ink
          }}
        />

        <Text style={sharedStyles.label}>Materials</Text>
        <View style={{ gap: spacing.md }}>
          {materials.map((material) => (
            <Pressable
              key={material.id}
              accessibilityRole="button"
              accessibilityLabel={`Search ${material.name}`}
              onPress={() => setQuery(material.name)}
              style={{ borderWidth: 1, borderColor: colors.line, borderRadius: radius.sm, padding: spacing.md, gap: spacing.xs }}
            >
              <Text style={[typography.productName, { color: colors.ink }]}>{material.name}</Text>
              <Text style={[typography.body, { color: colors.espresso }]}>{material.editorialDescription}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={sharedStyles.label}>Categories</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
          {categories.map((category) => (
            <Pressable
              key={category}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${category}`}
              onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              style={{
                minHeight: 44,
                borderWidth: 1,
                borderColor: selectedCategory === category ? colors.ink : colors.line,
                borderRadius: radius.sm,
                paddingHorizontal: spacing.md,
                justifyContent: "center"
              }}
            >
              <Text style={[typography.label, { color: colors.espresso, textTransform: "uppercase" }]}>{category}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={sharedStyles.label}>Collections</Text>
        <View style={{ gap: spacing.sm }}>
          {collections.map((collection) => (
            <Pressable
              key={collection.id}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${collection.name}`}
              onPress={() => setSelectedCollection(selectedCollection === collection.id ? null : collection.id)}
              style={{ minHeight: 44, justifyContent: "center" }}
            >
              <Text style={[typography.body, { color: selectedCollection === collection.id ? colors.ink : colors.espresso }]}>
                {collection.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={sharedStyles.label}>Filter Panel</Text>
        <View style={{ gap: spacing.sm }}>
          <Text style={sharedStyles.body}>
            {filteredProducts.length} catalogue {filteredProducts.length === 1 ? "piece" : "pieces"} match the current material, category, and
            collection filters.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear filters"
            onPress={() => {
              setQuery("");
              setSelectedCategory(null);
              setSelectedCollection(null);
            }}
            style={sharedStyles.secondaryButton}
          >
            <Text style={sharedStyles.secondaryButtonText}>Clear Filters</Text>
          </Pressable>
        </View>

        <Text style={sharedStyles.label}>Catalogue Results</Text>
        <ProductGrid products={filteredProducts} />
      </View>
    </ScrollView>
  );
}
