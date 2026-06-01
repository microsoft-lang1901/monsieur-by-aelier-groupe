import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const blockedTerms = [
  "sale",
  "flash sale",
  "hurry",
  "last chance",
  "trending",
  "best seller",
  "wishlist",
  "paypal",
  "klarna",
  "afterpay"
];

describe("content policy", () => {
  it("keeps blocked commerce language out of runtime code", () => {
    const runtimeText = ["app", "src"]
      .flatMap((root) => walk(root))
      .map((file) => readFileSync(file, "utf8").toLowerCase())
      .join("\n");

    for (const term of blockedTerms) {
      expect(runtimeText).not.toContain(term);
    }
  });
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) return walk(path);
    if (/\.(tsx?|jsx?)$/.test(path)) return [path];
    return [];
  });
}
