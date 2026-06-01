# Native Build Guide

## Prerequisites

- Expo account and EAS CLI access.
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
npx eas init
npx eas build --profile preview --platform android
npx eas build --profile preview --platform ios
```

## Production Build

```bash
npm run release:production-check
npx eas build --profile production --platform android
npx eas build --profile production --platform ios
```

Do not submit production builds until the manual QA script passes on physical devices.
