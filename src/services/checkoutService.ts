import { supabase } from "./supabaseClient";

export type CheckoutLine = {
  sku: string;
  quantity: number;
};

export type CheckoutSession = {
  clientSecret: string;
  orderId: string;
  idempotencyKey: string;
};

export async function createCheckoutSession(userId: string, cart: CheckoutLine[], totalUsd?: number): Promise<CheckoutSession> {
  if (cart.length === 0) {
    throw new Error("A checkout requires at least one garment.");
  }

  const idempotencyKey = createCheckoutIdempotencyKey(userId, cart, totalUsd);

  if (supabase) {
    const { data, error } = await supabase.functions.invoke<CheckoutSession>("create-checkout-session", {
      body: { userId, cart, totalUsd, idempotencyKey }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (data?.clientSecret && data.orderId) {
      return data;
    }
  }

  return {
    clientSecret: `test_secret_${userId}`,
    orderId: `order_${Date.now()}`,
    idempotencyKey
  };
}

export function createCheckoutIdempotencyKey(userId: string, cart: CheckoutLine[], totalUsd?: number): string {
  const cartKey = cart
    .map((line) => `${line.sku}:${line.quantity}`)
    .sort()
    .join("|");
  return `${userId}:${cartKey}:${totalUsd ?? "pending"}`;
}
