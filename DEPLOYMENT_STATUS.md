# MONSIEUR Deployment Status

## Local Release Gates

Run:

```bash
npm run release:local
```

Current local release gates are expected to pass:

- Catalogue import
- TypeScript
- Token compliance
- Forbidden-content compliance
- Supabase policy check
- Accessibility lint
- Contrast check
- Brand asset check
- Deployment config check
- Automated tests
- Web export

## Production Gate

Run only in a shell with real production/test deployment credentials:

```bash
npm run release:production-check
```

This intentionally fails until these values are configured:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`

## EAS Deployment

Before native deployment:

1. Run `npx eas init` and commit the real generated EAS project id.
2. Configure EAS secrets for Supabase and Stripe.
3. Apply `supabase/schema.sql`.
4. Deploy `supabase/functions/create-checkout-session`.
5. Run physical iOS and Android QA from `docs/qa-script.md`.

The app is code-ready for deployment. Store submission remains blocked until external credentials, deployed services, and physical-device payment QA are complete.
