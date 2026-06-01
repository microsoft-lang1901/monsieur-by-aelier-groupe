import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, normalize } from "node:path";

const roots = ["app", "src"];
const allowedFiles = new Set([normalize("src/theme/tokens.ts")]);
const rawColorPattern = /#[0-9a-fA-F]{3,8}|rgba?\(/;
const failures = [];

for (const file of roots.flatMap((root) => walk(root))) {
  if (allowedFiles.has(normalize(file))) continue;
  const text = readFileSync(file, "utf8");
  if (rawColorPattern.test(text)) {
    failures.push(file);
  }
}

if (failures.length > 0) {
  console.error(`Raw colour values must use design tokens:\n${failures.join("\n")}`);
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) return walk(path);
    if (/\.(tsx?|jsx?)$/.test(path)) return [path];
    return [];
  });
}
