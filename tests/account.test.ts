import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAtelierOrders, getClientProfile, recordAtelierOrder, saveClientProfile } from "../src/services/accountService";
import { createAtelierRequest, getAtelierRequests } from "../src/services/atelierService";

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

describe("account dossier", () => {
  beforeEach(() => store.clear());

  it("persists client profile preferences", async () => {
    const profile = await getClientProfile();
    await saveClientProfile({ ...profile, notificationsEnabled: true });
    await expect(getClientProfile()).resolves.toMatchObject({ notificationsEnabled: true });
  });

  it("persists atelier order archive", async () => {
    await recordAtelierOrder({
      id: "order_1",
      createdAt: "2026-06-01T00:00:00.000Z",
      status: "confirmed",
      totalUsd: 1495
    });
    await expect(getAtelierOrders()).resolves.toHaveLength(1);
  });

  it("persists private consultation requests", async () => {
    await createAtelierRequest("client", {
      subject: "Wardrobe Consultation",
      notes: "Client requested an appointment.",
      preferredContact: "email"
    });
    await expect(getAtelierRequests()).resolves.toHaveLength(1);
  });
});
