import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["app", "src"];
const forbidden = [
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

const files = roots.flatMap((root) => walk(root));
const failures = [];

for (const file of files) {
  const text = readFileSync(file, "utf8").toLowerCase();
  for (const term of forbidden) {
    if (text.includes(term)) {
      failures.push(`${file}: ${term}`);
    }
  }
}

if (failures.length > 0) {
  console.error(`Forbidden commerce/content patterns found:\n${failures.join("\n")}`);
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
