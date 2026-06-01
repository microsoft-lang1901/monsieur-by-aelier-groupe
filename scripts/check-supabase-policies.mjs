import { readFileSync } from "node:fs";

const schema = readFileSync("supabase/schema.sql", "utf8").toLowerCase();
const tables = ["client_profiles", "wardrobe_items", "inventory_items", "atelier_orders", "atelier_order_items", "atelier_requests"];
const failures = [];

for (const table of tables) {
  if (!schema.includes(`alter table ${table} enable row level security`)) {
    failures.push(`${table}: missing row level security`);
  }
  if (!schema.includes(` on ${table}`)) {
    failures.push(`${table}: missing policy`);
  }
}

if (!schema.includes("auth.uid()")) {
  failures.push("policies must scope access with auth.uid()");
}

if (failures.length > 0) {
  console.error(`Supabase policy check failed:\n${failures.join("\n")}`);
  process.exit(1);
}

console.log("Supabase policy check passed.");
