import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CheckoutLine } from "../services/checkoutService";

const cartKey = "monsieur.cart";

export async function getCart(): Promise<CheckoutLine[]> {
  const raw = await AsyncStorage.getItem(cartKey);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((line): line is CheckoutLine => typeof line?.sku === "string" && Number.isFinite(line?.quantity))
      : [];
  } catch {
    return [];
  }
}

export async function addToCart(sku: string): Promise<CheckoutLine[]> {
  const current = await getCart();
  const existing = current.find((line) => line.sku === sku);
  const next = existing
    ? current.map((line) => (line.sku === sku ? { ...line, quantity: line.quantity + 1 } : line))
    : [{ sku, quantity: 1 }, ...current];

  await AsyncStorage.setItem(cartKey, JSON.stringify(next));
  return next;
}

export async function clearCart(): Promise<void> {
  await AsyncStorage.setItem(cartKey, JSON.stringify([]));
}
