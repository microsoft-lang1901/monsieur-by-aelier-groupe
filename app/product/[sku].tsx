import { Image, ScrollView, Text, View } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { ScreenState } from "@/components/ScreenState";
import { FibrePassportPanel } from "@/components/product/FibrePassportPanel";
import type { Product } from "@/domain/products";
import { getProduct } from "@/services/catalogueService";
import { getCurrentClientIdentity } from "@/services/authService";
import { addToCart } from "@/storage/cartStorage";
import { saveToWardrobe, recordRecentlyViewed } from "@/storage/wardrobeStorage";
import { trackEvent } from "@/services/analytics";
import { brandAssets } from "@/theme/brandAssets";
import { sharedStyles } from "@/theme/styles";
import { colors, spacing, typography } from "@/theme/tokens";

export default function ProductDetailScreen() {
  const { sku } = useLocalSearchParams<{ sku: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [catalogueMissing, setCatalogueMissing] = useState(false);

  useEffect(() => {
    if (!sku) return;
    getProduct(sku)
      .then((result) => {
        setProduct(result);
        if (result) {
          recordRecentlyViewed(result.productData.sku);
          trackEvent({ name: "product_viewed", sku: result.productData.sku });
        }
      })
      .catch(() => setCatalogueMissing(true));
  }, [sku]);

  if (catalogueMissing) {
    return (
      <ScrollView style={sharedStyles.screen}>
        <ScreenState
          eyebrow="Product"
          title="Catalogue required"
          body="Product detail pages are generated from the canonical catalogue and cannot be manually duplicated."
        />
      </ScrollView>
    );
  }

  if (!product) {
    return (
      <ScrollView style={sharedStyles.screen}>
        <ScreenState eyebrow="Product" title="Piece not found" body="This SKU is not present in the loaded catalogue." />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <Image source={brandAssets.moodboard} accessibilityLabel={product.imagery.alt} style={{ width: "100%", aspectRatio: 0.82 }} />

      <View style={[sharedStyles.constrained, { gap: spacing.xl }]}>
        <View style={{ gap: spacing.sm }}>
          <Text style={sharedStyles.label}>{product.productData.category}</Text>
          <Text style={[typography.displayTitle, { color: colors.ink }]}>{product.productData.productName}</Text>
          <Text style={[typography.productPrice, { color: colors.espresso }]}>${product.productData.msrpUsd.toLocaleString("en-US")}</Text>
          <Text style={sharedStyles.body}>{product.editorialData.lead}</Text>
        </View>

        <FibrePassportPanel passport={product.fibrePassport} />

        <View style={{ gap: spacing.md }}>
          <Text style={sharedStyles.label}>Construction Details</Text>
          <Text style={sharedStyles.body}>{product.productData.construction}</Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={sharedStyles.label}>Colour Palette</Text>
          <Text style={sharedStyles.body}>{product.productData.primaryColor}</Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={sharedStyles.label}>Styling Notes</Text>
          {product.editorialData.stylingNotes.map((note) => (
            <Text key={note} style={sharedStyles.body}>
              {note}
            </Text>
          ))}
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={sharedStyles.label}>Size Guide</Text>
          <Text style={sharedStyles.body}>Sizing guidance is held for atelier confirmation and brand-specific grading.</Text>
        </View>

        <PrimaryCTA
          label="Save To Wardrobe"
          accessibilityLabel={`Save ${product.productData.productName} to wardrobe`}
          onPress={async () => {
            const identity = await getCurrentClientIdentity();
            saveToWardrobe(identity.id, product.productData.sku);
            trackEvent({ name: "wardrobe_saved", sku: product.productData.sku });
          }}
        />

        <PrimaryCTA
          label="Add For Checkout"
          accessibilityLabel={`Add ${product.productData.productName} for checkout`}
          onPress={() => addToCart(product.productData.sku)}
        />

        <Link href={{ pathname: "/checkout", params: { sku: product.productData.sku } }} style={sharedStyles.secondaryButtonText}>
          Proceed To Checkout
        </Link>
      </View>
    </ScrollView>
  );
}
