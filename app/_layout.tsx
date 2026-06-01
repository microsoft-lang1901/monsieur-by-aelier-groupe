import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppProviders } from "@/components/AppProviders";
import { colors } from "@/theme/tokens";

export default function RootLayout() {
  return (
    <AppProviders>
      <>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.ivory },
            headerTintColor: colors.ink,
            headerTitleStyle: { fontFamily: "serif" },
            contentStyle: { backgroundColor: colors.ivory }
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="product/[sku]" options={{ title: "Product" }} />
          <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
        </Stack>
      </>
    </AppProviders>
  );
}
