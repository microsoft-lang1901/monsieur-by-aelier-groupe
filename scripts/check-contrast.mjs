import { readFileSync } from "node:fs";

const tokenSource = readFileSync("src/theme/tokens.ts", "utf8");
const colors = Object.fromEntries(
  Array.from(tokenSource.matchAll(/^\s+([a-zA-Z]+):\s+"(#[0-9A-Fa-f]{6})"/gm)).map((match) => [match[1], match[2]])
);

const pairs = [
  ["ink", "ivory"],
  ["espresso", "ivory"],
  ["muted", "ivory"],
  ["paper", "ink"],
  ["espresso", "paper"],
  ["ink", "paper"]
];

const failures = [];

for (const [foreground, background] of pairs) {
  const ratio = contrastRatio(colors[foreground], colors[background]);
  if (ratio < 4.5) {
    failures.push(`${foreground} on ${background}: ${ratio.toFixed(2)}`);
  }
}

if (failures.length > 0) {
  console.error(`Contrast check failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Contrast check passed.");

function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(hex) {
  const [red, green, blue] = hexToRgb(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
}
