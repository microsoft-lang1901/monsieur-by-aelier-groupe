import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSavedPieces, saveToWardrobe } from "../src/storage/wardrobeStorage";

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

describe("wardrobe archive", () => {
  beforeEach(() => store.clear());

  it("persists saved pieces", async () => {
    await saveToWardrobe("client", "MK-001");
    await expect(getSavedPieces()).resolves.toEqual(["MK-001"]);
  });
});
