import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, normalize } from "node:path";

describe("token policy", () => {
  it("keeps raw colours inside token definitions", () => {
    const rawColorPattern = /#[0-9a-fA-F]{3,8}|rgba?\(/;
    const files = ["app", "src"].flatMap((root) => walk(root)).filter((file) => normalize(file) !== normalize("src/theme/tokens.ts"));

    const offenders = files.filter((file) => rawColorPattern.test(readFileSync(file, "utf8")));
    expect(offenders).toEqual([]);
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
