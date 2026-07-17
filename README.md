# MONSIEUR by Aelier Groupe

Catalogue-driven luxury menswear mobile MVP.

## Current State

The repository is scaffolded for Expo React Native with typed catalogue ingestion, product generation, five-tab navigation, wardrobe persistence, Supabase boundaries, Stripe test-mode checkout boundaries, token checks, and content checks.

The canonical catalogue CSV is required before catalogue-dependent screens can show real product data.

Expected file:

```text
data/catalogue/monsieur-catalogue.csv
```

Required CSV columns:

```text
sku,productName,category,silhouette,construction,fabricProgram,primaryColor,season,msrpUsd
```

The importer also accepts the production catalogue headers:

```text
SKU,Product Name,Category,Silhouette / Style,Construction,Fabric Program,Primary Color,Season,MSRP USD
```

## Commands

```bash
npm install
npm run start
npm run verify
```

`npm run verify` includes TypeScript, token checks, content checks, Supabase policy checks, accessibility checks, contrast checks, brand asset checks, and tests.

For a deterministic web build check:

```bash
npm run import:catalogue
npm run build:web
npm run serve:web
npm run lan:url
```

Open the served build from the same computer at `http://127.0.0.1:8082`. From a phone on the same Wi-Fi, use the computer's LAN IP, for example `http://192.168.x.x:8082`; `127.0.0.1` on a phone points back to the phone, not the development machine.

## Environment

Create `.env` or Expo environment variables:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

Stripe checkout creation is represented by `supabase/functions/create-checkout-session/index.ts` and should be deployed with Supabase once project secrets are configured.

## Release Readiness

See:

- `DEPLOYMENT_STATUS.md`
- `docs/tier-1-ecommerce-platform-task-list.md`
- `docs/tier-1-stage-completion-status.md`
- `docs/provider-integration-plan.md`
- `docs/production-checklist.md`
- `docs/qa-script.md`
- `docs/native-build.md`

## GitHub Deployment

The repository includes:

- `.github/workflows/verify.yml` for pull request and release checks.
- `.github/workflows/deploy-web.yml` for GitHub Pages web deployment from `main`.
- `.github/workflows/native-preview.yml` for manual EAS Android/iOS preview builds once `EXPO_TOKEN` is configured.

After the repository is pushed to GitHub, enable Pages with GitHub Actions as the source in repository settings. The native mobile release still requires EAS credentials, Apple Developer, Google Play Console, Supabase, and Stripe production configuration.


<!-- portfolio-maintenance-20260717:readme:start -->
## Repository Documentation

The `2026-07-17` maintenance snapshot records the repository at `5047131afab78e77ab91069ad7e52cd96f8e7b7f` without changing runtime behavior:

- [Project status](docs/PROJECT_STATUS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Setup](docs/SETUP.md)
- [Operations](docs/OPERATIONS.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
- [Changelog](CHANGELOG.md)

The canonical catalogue and production environment evidence remain required for a real release.
<!-- portfolio-maintenance-20260717:readme:end -->
