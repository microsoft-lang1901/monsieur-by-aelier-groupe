import type { CheckoutLine } from "@/services/checkoutService";

export type AvailabilityStatus = "available" | "reserved" | "unavailable" | "atelier-confirmation-required";

export type InventoryItem = {
  sku: string;
  availableQuantity: number;
  status: AvailabilityStatus;
};

export type OrderStatus = "confirmed" | "preparing" | "dispatched" | "complete" | "cancelled";

export type ShippingAddress = {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode: string;
  countryCode: string;
};

export type ShippingQuote = {
  serviceName: string;
  amountUsd: number;
  estimatedDays: string;
};

export type TaxQuote = {
  amountUsd: number;
  jurisdiction: string;
};

export function canReserveCart(cart: CheckoutLine[], inventory: InventoryItem[]): boolean {
  return cart.every((line) => {
    const item = inventory.find((candidate) => candidate.sku === line.sku);
    if (!item) return false;
    if (item.status !== "available") return false;
    return item.availableQuantity >= line.quantity;
  });
}

export function quoteShipping(address: ShippingAddress): ShippingQuote {
  const international = address.countryCode.toUpperCase() !== "US";
  return {
    serviceName: international ? "International Atelier Delivery" : "Domestic Atelier Delivery",
    amountUsd: international ? 65 : 25,
    estimatedDays: international ? "5-10 business days" : "2-5 business days"
  };
}

export function quoteTax(subtotalUsd: number, address: ShippingAddress): TaxQuote {
  const taxable = address.countryCode.toUpperCase() === "US";
  return {
    amountUsd: taxable ? Math.round(subtotalUsd * 0.0825 * 100) / 100 : 0,
    jurisdiction: taxable ? address.region ?? "US" : "Non-US"
  };
}
