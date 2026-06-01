# Native Build Guide

## Prerequisites

- Expo account and EAS CLI access.
- A completed `npx eas login` session locally, or an `EXPO_TOKEN` repository secret in GitHub.
- Supabase project with `supabase/schema.sql` applied.
- Supabase edge function deployed from `supabase/functions/create-checkout-session`.
- Stripe test or live keys configured for the selected environment.

## Local Verification

```bash
npm install
npm run import:catalogue
npm run verify
npm run build:web
```

## Preview Build

```bash
npm run eas:init
npm run build:android:preview
npm run build:ios:preview
```

For GitHub Actions preview builds:

1. Create an Expo access token from Expo account settings.
2. Add it to GitHub repository secrets as `EXPO_TOKEN`.
3. Run the `Native Preview Build` workflow manually.

The first EAS init must be completed before the workflow can build, because `app.json` needs the real EAS project id.

## Production Build

```bash
npm run release:production-check
npx eas build --profile production --platform android --non-interactive
npx eas build --profile production --platform ios --non-interactive
```

Do not submit production builds until the manual QA script passes on physical devices.
