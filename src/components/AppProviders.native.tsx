import type { ReactElement } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { env } from "@/services/env";

type AppProvidersProps = {
  children: ReactElement;
};

export function AppProviders({ children }: AppProvidersProps) {
  if (!env.stripePublishableKey) {
    return <>{children}</>;
  }

  return (
    <StripeProvider publishableKey={env.stripePublishableKey} merchantIdentifier="merchant.com.aeliergroupe.monsieur">
      <>{children}</>
    </StripeProvider>
  );
}
