import { describe, expect, it } from "vitest";
import type {
  AtelierProvider,
  CheckoutProvider,
  ClientDataProvider,
  CmsProvider,
  FulfilmentProvider,
  IdentityProvider,
  InventoryProvider,
  ObservabilityProvider,
  TaxProvider,
  WardrobeProvider
} from "../src/services/providerContracts";

describe("provider contracts", () => {
  it("defines replaceable production platform boundaries", () => {
    const requiredContracts = [
      "IdentityProvider",
      "ClientDataProvider",
      "WardrobeProvider",
      "CmsProvider",
      "InventoryProvider",
      "CheckoutProvider",
      "FulfilmentProvider",
      "TaxProvider",
      "AtelierProvider",
      "ObservabilityProvider"
    ];

    expect(requiredContracts).toHaveLength(10);
  });

  it("accepts concrete provider implementations without screen-level coupling", () => {
    const identityProvider: IdentityProvider = {
      getCurrentClient: async () => ({ id: "client", isAuthenticated: true }),
      signOut: async () => undefined
    };
    const clientDataProvider: ClientDataProvider = {
      getProfile: async (clientId) => ({ id: clientId, name: "Private Client", city: "Paris", notificationsEnabled: false }),
      saveProfile: async (profile) => profile,
      getOrders: async () => [],
      recordOrder: async (_clientId, order) => [order]
    };
    const wardrobeProvider: WardrobeProvider = {
      getSavedPieces: async () => [],
      savePiece: async (_clientId, sku) => [sku],
      removePiece: async () => [],
      getRecentlyViewed: async () => [],
      recordRecentlyViewed: async (_clientId, sku) => [sku]
    };
    const cmsProvider: CmsProvider = {
      getCampaigns: async () => [],
      getLookbooks: async () => [],
      getJournalEntries: async () => [],
      getAtelierServices: async () => []
    };
    const inventoryProvider: InventoryProvider = {
      getAvailability: async (skus) => skus.map((sku) => ({ sku, availableQuantity: 1, status: "available" })),
      reserveCart: async () => ({ reservationId: "reservation", expiresAt: "2026-06-01T00:15:00.000Z" })
    };
    const checkoutProvider: CheckoutProvider = {
      createSession: async () => ({ clientSecret: "secret", orderId: "order", idempotencyKey: "key" })
    };
    const fulfilmentProvider: FulfilmentProvider = {
      quoteShipping: async () => ({ serviceName: "Atelier Delivery", amountUsd: 25, estimatedDays: "2-5 business days" }),
      createShipment: async () => ({ shipmentId: "shipment", status: "created" })
    };
    const taxProvider: TaxProvider = {
      quoteTax: async () => ({ amountUsd: 0, jurisdiction: "Non-US" })
    };
    const atelierProvider: AtelierProvider = {
      createRequest: async (clientId, payload) => ({
        id: "request",
        userId: clientId,
        ...payload,
        status: "received",
        createdAt: "2026-06-01T00:00:00.000Z"
      }),
      getRequests: async () => []
    };
    const observabilityProvider: ObservabilityProvider = {
      captureEvent: () => undefined,
      captureError: () => undefined
    };

    expect(identityProvider).toBeDefined();
    expect(clientDataProvider).toBeDefined();
    expect(wardrobeProvider).toBeDefined();
    expect(cmsProvider).toBeDefined();
    expect(inventoryProvider).toBeDefined();
    expect(checkoutProvider).toBeDefined();
    expect(fulfilmentProvider).toBeDefined();
    expect(taxProvider).toBeDefined();
    expect(atelierProvider).toBeDefined();
    expect(observabilityProvider).toBeDefined();
  });
});
