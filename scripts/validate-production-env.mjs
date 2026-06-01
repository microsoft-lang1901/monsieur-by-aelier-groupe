const required = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STRIPE_SECRET_KEY"
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing production environment variables:\n${missing.map((key) => `- ${key}`).join("\n")}`);
  process.exit(1);
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";

if (!supabaseUrl.startsWith("https://")) {
  console.error("EXPO_PUBLIC_SUPABASE_URL must be an https URL.");
  process.exit(1);
}

console.log("Production environment variables are present.");
