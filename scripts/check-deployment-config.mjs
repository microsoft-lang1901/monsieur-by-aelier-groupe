import { readFileSync } from "node:fs";

const app = JSON.parse(readFileSync("app.json", "utf8")).expo;
const failures = [];

if (app.name !== "MONSIEUR") failures.push("app.json: app name must be MONSIEUR");
if (app.slug !== "monsieur-by-aelier-groupe") failures.push("app.json: slug mismatch");
if (app.scheme !== "monsieur") failures.push("app.json: URL scheme mismatch");
if (app.ios?.bundleIdentifier !== "com.aeliergroupe.monsieur") failures.push("app.json: iOS bundle id mismatch");
if (app.android?.package !== "com.aeliergroupe.monsieur") failures.push("app.json: Android package mismatch");
if (app.plugins?.some((plugin) => Array.isArray(plugin) && plugin[0] === "@stripe/stripe-react-native" && plugin[1]?.merchantIdentifier !== "merchant.com.aeliergroupe.monsieur") !== false) {
  failures.push("app.json: Stripe merchant identifier mismatch");
}
if (app.extra?.eas?.projectId === "monsieur-local") failures.push("app.json: fake EAS project id must not be committed");
if (!app.ios?.buildNumber) failures.push("app.json: iOS buildNumber required");
if (!Number.isInteger(app.android?.versionCode)) failures.push("app.json: Android versionCode required");

if (failures.length > 0) {
  console.error(`Deployment config check failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Deployment config check passed.");
