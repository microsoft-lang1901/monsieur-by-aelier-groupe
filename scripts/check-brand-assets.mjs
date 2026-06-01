import { existsSync, statSync, readFileSync } from "node:fs";

const requiredAssets = [
  "assets/icon.png",
  "assets/adaptive-icon.png",
  "assets/splash.png",
  "assets/notification-icon.png",
  "assets/social-preview.png"
];

const failures = [];

for (const asset of requiredAssets) {
  if (!existsSync(asset)) {
    failures.push(`${asset}: missing`);
    continue;
  }

  if (statSync(asset).size === 0) {
    failures.push(`${asset}: empty`);
  }
}

const appConfig = JSON.parse(readFileSync("app.json", "utf8")).expo;

if (appConfig.icon !== "./assets/icon.png") failures.push("app.json: missing production icon path");
if (appConfig.splash?.image !== "./assets/splash.png") failures.push("app.json: missing splash artwork path");
if (appConfig.android?.adaptiveIcon?.foregroundImage !== "./assets/adaptive-icon.png") {
  failures.push("app.json: missing Android adaptive icon foreground");
}
if (appConfig.android?.notification?.icon !== "./assets/notification-icon.png") {
  failures.push("app.json: missing Android notification icon");
}
if (appConfig.web?.favicon !== "./assets/icon.png") failures.push("app.json: missing web favicon");

if (failures.length > 0) {
  console.error(`Brand asset check failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Brand asset check passed.");
