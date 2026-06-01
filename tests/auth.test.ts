import { describe, expect, it } from "vitest";
import { getCurrentClientIdentity } from "../src/services/authService";

describe("client identity", () => {
  it("falls back to local identity when Supabase is not configured", async () => {
    await expect(getCurrentClientIdentity()).resolves.toEqual({
      id: "local-client",
      isAuthenticated: false
    });
  });
});
