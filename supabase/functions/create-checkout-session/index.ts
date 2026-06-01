import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@16.8.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-06-20"
});

serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { userId, cart, totalUsd, idempotencyKey } = await request.json();

  if (!userId || !Array.isArray(cart) || cart.length === 0) {
    return Response.json({ error: "A checkout requires at least one garment." }, { status: 400 });
  }

  if (!Number.isFinite(totalUsd) || totalUsd <= 0) {
    return Response.json({ error: "A checkout requires a valid order total." }, { status: 400 });
  }

  if (!idempotencyKey || typeof idempotencyKey !== "string") {
    return Response.json({ error: "A checkout requires an idempotency key." }, { status: 400 });
  }

  const paymentIntent = await stripe.paymentIntents.create(
    {
      amount: Math.round(totalUsd * 100),
      currency: "usd",
      metadata: {
        userId,
        skus: cart.map((line: { sku: string }) => line.sku).join(",")
      },
      automatic_payment_methods: {
        enabled: true
      }
    },
    {
      idempotencyKey
    }
  );

  return Response.json({
    clientSecret: paymentIntent.client_secret,
    orderId: paymentIntent.id,
    idempotencyKey
  });
});
