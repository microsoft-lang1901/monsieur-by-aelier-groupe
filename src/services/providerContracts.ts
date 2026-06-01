import type { CheckoutLine, CheckoutSession } from "./checkoutService";
import type { AtelierRequest, AtelierRequestPayload } from "./atelierService";
import type { ClientIdentity } from "./authService";
import type { AtelierOrder, ClientProfile } from "./accountService";
import type { CmsContentModelMap } from "@/domain/cms";
import type { InventoryItem, ShippingAddress, ShippingQuote, TaxQuote } from "@/domain/commerce";

export type CatalogueProvider = {
  getProducts(): Promise<CmsContentModelMap["product"][]>;
  getCollections(): Promise<CmsContentModelMap["collection"][]>;
  getMaterials(): Promise<CmsContentModelMap["material"][]>;
};

export type CmsProvider = {
  getCampaigns(): Promise<CmsContentModelMap["campaign"][]>;
  getLookbooks(): Promise<CmsContentModelMap["lookbook"][]>;
  getJournalEntries(): Promise<CmsContentModelMap["journal"][]>;
  getAtelierServices(): Promise<CmsContentModelMap["atelierService"][]>;
};

export type IdentityProvider = {
  getCurrentClient(): Promise<ClientIdentity>;
  signOut(): Promise<void>;
};

export type ClientDataProvider = {
  getProfile(clientId: string): Promise<ClientProfile>;
  saveProfile(profile: ClientProfile): Promise<ClientProfile>;
  getOrders(clientId: string): Promise<AtelierOrder[]>;
  recordOrder(clientId: string, order: AtelierOrder): Promise<AtelierOrder[]>;
};

export type WardrobeProvider = {
  getSavedPieces(clientId: string): Promise<string[]>;
  savePiece(clientId: string, sku: string): Promise<string[]>;
  removePiece(clientId: string, sku: string): Promise<string[]>;
  getRecentlyViewed(clientId: string): Promise<string[]>;
  recordRecentlyViewed(clientId: string, sku: string): Promise<string[]>;
};

export type InventoryProvider = {
  getAvailability(skus: string[]): Promise<InventoryItem[]>;
  reserveCart(clientId: string, cart: CheckoutLine[]): Promise<{ reservationId: string; expiresAt: string }>;
};

export type CheckoutProvider = {
  createSession(clientId: string, cart: CheckoutLine[], totalUsd: number): Promise<CheckoutSession>;
};

export type FulfilmentProvider = {
  quoteShipping(address: ShippingAddress): Promise<ShippingQuote>;
  createShipment(orderId: string, address: ShippingAddress): Promise<{ shipmentId: string; status: "created" }>;
};

export type TaxProvider = {
  quoteTax(subtotalUsd: number, address: ShippingAddress): Promise<TaxQuote>;
};

export type AtelierProvider = {
  createRequest(clientId: string, payload: AtelierRequestPayload): Promise<AtelierRequest>;
  getRequests(clientId: string): Promise<AtelierRequest[]>;
};

export type ObservabilityProvider = {
  captureEvent(name: string, properties?: Record<string, string | number | boolean>): void;
  captureError(error: Error, context?: Record<string, string | number | boolean>): void;
};
