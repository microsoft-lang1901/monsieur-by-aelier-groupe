import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const files = ["app", "src"].flatMap((root) => walk(root));
const failures = [];

for (const file of files) {
  const text = readFileSync(file, "utf8");
  const pressableCount = count(text, /<Pressable\b/g);
  const roleCount = count(text, /accessibilityRole=/g);

  if (pressableCount > roleCount) {
    failures.push(`${file}: every Pressable needs an accessibilityRole`);
  }

  const imageCount = count(text, /<Image\b|<ImageBackground\b/g);
  const imageLabelCount = count(text, /accessibilityLabel=/g);

  if (imageCount > 0 && imageLabelCount === 0) {
    failures.push(`${file}: image elements need accessibility labels`);
  }
}

if (failures.length > 0) {
  console.error(`Accessibility check failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Accessibility check passed.");

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) return walk(path);
    if (/\.(tsx?|jsx?)$/.test(path)) return [path];
    return [];
  });
}

function count(text, pattern) {
  return text.match(pattern)?.length ?? 0;
}
