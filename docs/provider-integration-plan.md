# Provider Integration Plan

MONSIEUR is now structured so core app screens can remain stable while production providers are swapped in behind service contracts.

## Implemented Boundaries

- Identity: Supabase Auth through `getCurrentClientIdentity`, with local client fallback.
- Client dossier: profile and order archive service with Supabase paths and local persistence.
- Wardrobe archive: Supabase wardrobe table when authenticated, local persistence otherwise.
- Atelier requests: Supabase request table when authenticated, local persistence otherwise.
- Checkout: Supabase Edge Function boundary for Stripe PaymentIntent creation, with local test session fallback.
- Inventory, shipping, tax, CMS, fulfilment, observability: typed provider contracts in `src/services/providerContracts.ts`.

## Production Wiring Sequence

1. Create the Supabase production project and apply `supabase/schema.sql`.
2. Configure Supabase Auth providers, redirect URLs, and row-level security validation.
3. Deploy `supabase/functions/create-checkout-session` with `STRIPE_SECRET_KEY`.
4. Set Expo secrets for Supabase and Stripe public keys.
5. Connect provider implementations for inventory, fulfilment, tax, CMS, and observability.
6. Run `npm run release:production-check` after environment variables are set.
7. Build native release candidates with EAS and validate Apple Pay / Google Pay on physical devices.

## Current Completion State

The local codebase is release-gated and provider-ready. External production services still need credentials, deployment, and live transaction validation before the platform can be represented as fully deployed.
