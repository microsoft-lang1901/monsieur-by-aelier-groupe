import { describe, expect, it } from "vitest";
import { canReserveCart, quoteShipping, quoteTax } from "../src/domain/commerce";

describe("commerce platform contracts", () => {
  it("reserves only available inventory", () => {
    expect(
      canReserveCart([{ sku: "AG-SU-001", quantity: 1 }], [{ sku: "AG-SU-001", availableQuantity: 2, status: "available" }])
    ).toBe(true);
    expect(
      canReserveCart([{ sku: "AG-SU-001", quantity: 2 }], [{ sku: "AG-SU-001", availableQuantity: 1, status: "available" }])
    ).toBe(false);
  });

  it("quotes domestic and international shipping boundaries", () => {
    expect(
      quoteShipping({
        name: "Client",
        line1: "1 Maison",
        city: "New York",
        region: "NY",
        postalCode: "10001",
        countryCode: "US"
      }).amountUsd
    ).toBe(25);
    expect(
      quoteShipping({
        name: "Client",
        line1: "1 Maison",
        city: "Paris",
        postalCode: "75001",
        countryCode: "FR"
      }).amountUsd
    ).toBe(65);
  });

  it("quotes tax boundary without hiding provider integration work", () => {
    expect(
      quoteTax(1000, {
        name: "Client",
        line1: "1 Maison",
        city: "New York",
        region: "NY",
        postalCode: "10001",
        countryCode: "US"
      }).amountUsd
    ).toBe(82.5);
  });
});
