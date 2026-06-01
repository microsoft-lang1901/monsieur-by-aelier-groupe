import { describe, expect, it } from "vitest";
import { createCheckoutIdempotencyKey, createCheckoutSession } from "../src/services/checkoutService";

describe("checkout", () => {
  it("creates a test checkout order for a cart", async () => {
    const session = await createCheckoutSession("client", [{ sku: "MK-001", quantity: 1 }], 980);
    expect(session.clientSecret).toContain("test_secret");
    expect(session.orderId).toContain("order_");
    expect(session.idempotencyKey).toContain("MK-001:1");
  });

  it("rejects empty carts", async () => {
    await expect(createCheckoutSession("client", [])).rejects.toThrow("requires at least one garment");
  });

  it("creates stable checkout idempotency keys", () => {
    const first = createCheckoutIdempotencyKey(
      "client",
      [
        { sku: "B", quantity: 1 },
        { sku: "A", quantity: 2 }
      ],
      1200
    );
    const second = createCheckoutIdempotencyKey(
      "client",
      [
        { sku: "A", quantity: 2 },
        { sku: "B", quantity: 1 }
      ],
      1200
    );
    expect(first).toBe(second);
  });
});
