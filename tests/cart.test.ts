import { beforeEach, describe, expect, it, vi } from "vitest";
import { addToCart, getCart } from "../src/storage/cartStorage";

const store = new Map<string, string>();

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn((key: string) => Promise.resolve(store.get(key) ?? null)),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
      return Promise.resolve();
    })
  }
}));

describe("cart", () => {
  beforeEach(() => store.clear());

  it("adds catalogue pieces for checkout", async () => {
    await addToCart("MK-001");
    await addToCart("MK-001");
    await expect(getCart()).resolves.toEqual([{ sku: "MK-001", quantity: 2 }]);
  });
});
