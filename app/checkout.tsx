import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { PrimaryCTA } from "@/components/PrimaryCTA";
import { getCurrentClientIdentity } from "@/services/authService";
import { getCatalogueOverview } from "@/services/catalogueService";
import { recordAtelierOrder } from "@/services/accountService";
import { trackEvent } from "@/services/analytics";
import { createCheckoutSession } from "@/services/checkoutService";
import { clearCart, getCart } from "@/storage/cartStorage";
import { sharedStyles } from "@/theme/styles";
import { colors, spacing, typography } from "@/theme/tokens";
import type { CheckoutLine } from "@/services/checkoutService";

type CheckoutStep = "delivery" | "payment" | "confirmation";

export default function CheckoutScreen() {
  const { sku } = useLocalSearchParams<{ sku?: string }>();
  const [step, setStep] = useState<CheckoutStep>("delivery");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cart, setCart] = useState<CheckoutLine[]>([]);
  const [totalUsd, setTotalUsd] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const initialCart = sku ? [{ sku, quantity: 1 }] : [];
    const loadCart = initialCart.length > 0 ? Promise.resolve(initialCart) : getCart();

    loadCart.then(async (lines) => {
      setCart(lines);
      const snapshot = await getCatalogueOverview();
      const total = lines.reduce((sum, line) => {
        const product = snapshot.products.find((item) => item.productData.sku === line.sku);
        return sum + (product?.productData.msrpUsd ?? 0) * line.quantity;
      }, 0);
      setTotalUsd(total);
    });
  }, [sku]);

  async function handlePayment() {
    try {
      const identity = await getCurrentClientIdentity();
      const session = await createCheckoutSession(identity.id, cart, totalUsd);
      await recordAtelierOrder({
        id: session.orderId,
        createdAt: new Date().toISOString(),
        status: "confirmed",
        totalUsd
      });
      await clearCart();
      await trackEvent({ name: "checkout_confirmed", orderId: session.orderId, totalUsd });
      setOrderId(session.orderId);
      setNotice(null);
      setStep("confirmation");
    } catch {
      setNotice("Checkout could not be completed. Confirm the selected piece and try again.");
    }
  }

  return (
    <ScrollView style={sharedStyles.screen} contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.constrained, { gap: spacing.xl }]}>
        <View style={{ gap: spacing.sm }}>
          <Text style={sharedStyles.label}>Checkout</Text>
          <Text style={sharedStyles.title}>A measured purchase flow.</Text>
          <Text style={sharedStyles.body}>Delivery, payment, and confirmation are presented without additions or urgency mechanics.</Text>
          <Text style={[typography.productPrice, { color: colors.espresso }]}>${totalUsd.toLocaleString("en-US")}</Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <Text style={sharedStyles.label}>Delivery</Text>
          <Text style={sharedStyles.body}>Private client delivery details will be confirmed before dispatch.</Text>
          {step === "delivery" && <PrimaryCTA label="Continue To Payment" onPress={() => setStep("payment")} />}
        </View>

        <View style={{ gap: spacing.md, opacity: step === "delivery" ? 0.45 : 1 }}>
          <Text style={sharedStyles.label}>Payment</Text>
          <Text style={sharedStyles.body}>Stripe test mode supports card and wallet payment methods configured for the maison.</Text>
          {notice ? <Text style={sharedStyles.body}>{notice}</Text> : null}
          {step === "payment" && <PrimaryCTA label="Confirm Payment" onPress={handlePayment} />}
        </View>

        <View style={{ gap: spacing.md, opacity: step === "confirmation" ? 1 : 0.45 }}>
          <Text style={sharedStyles.label}>Confirmation</Text>
          <Text style={[typography.body, { color: colors.espresso }]}>
            {orderId ? `Order ${orderId} has been created.` : "Confirmation appears after payment."}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
