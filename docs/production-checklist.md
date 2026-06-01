# MONSIEUR Production Release Checklist

The application is not considered production-ready until every item in this checklist is completed and verified.

## Brand Assets

Replace all temporary assets before release.

Required:

- MONSIEUR application icon
- iOS App Store icon set
- Android adaptive icon set
- Splash screen artwork
- Launch screen branding
- Notification icon assets
- Social sharing preview assets

Repository asset paths:

```text
assets/icon.png
assets/adaptive-icon.png
assets/splash.png
assets/notification-icon.png
assets/social-preview.png
```

Automated check:

```bash
npm run lint:assets
```

Rules:

- Assets must use approved MONSIEUR brand artwork.
- No Expo placeholders.
- No default React Native assets.
- No temporary logos.
- No stock imagery.

## Application Identifiers

iOS bundle identifier:

```text
com.aeliergroupe.monsieur
```

Android application id:

```text
com.aeliergroupe.monsieur
```

Apple Pay merchant id:

```text
merchant.com.aeliergroupe.monsieur
```

Expo/EAS:

```text
Set production EAS project id in app.json.
```

Verification:

- EAS build succeeds.
- Store metadata aligns with bundle ids.
- Merchant identifier is verified.

## Environment Configuration

Required public environment variables:

```env
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Required server secrets:

```env
STRIPE_SECRET_KEY=
```

Validation:

```bash
npm run validate:env
```

Verification:

- No missing variables.
- No production secrets committed.
- Build passes environment validation.

## Supabase Configuration

Database:

```text
supabase/schema.sql
```

Verification:

- Tables created.
- Indexes created.
- Constraints verified.
- Row-level security enabled on all client-facing tables.
- Wardrobe access restricted to owner.
- Orders restricted to owner.
- Profile data restricted to owner.
- Private Client data protected.
- Service role access verified.

Functions:

```text
supabase/functions/create-checkout-session
```

Verification:

- Stripe checkout session created successfully.
- Authentication verified.
- Error handling verified.

No production client data may be stored before RLS verification is complete.

## Catalogue Validation

The uploaded Aelier Groupe catalogue is the source of truth.

```bash
npm run import:catalogue
```

Verification:

- All products imported.
- No duplicate SKUs.
- Collection mapping complete.
- Material mapping complete.
- Fibre Passport generation complete.
- Product relationships generated.

## Application Verification

```bash
npm run verify
```

Verification must confirm:

- Product pages render.
- Search functions.
- Wardrobe persistence functions.
- Checkout flow functions.
- Account system functions.
- Collection generation functions.
- Fibre Passport system functions.

## Web Build

```bash
npm run build:web
```

Verification:

- Production build succeeds.
- No warnings blocking deployment.
- Bundle size acceptable.
- Assets optimized.

## Continuous Integration

Workflow:

```text
.github/workflows/verify.yml
```

Requirements:

- Runs on release branch.
- Runs catalogue import.
- Runs tests.
- Runs build verification.
- Blocks failing deployments.

## Accessibility Validation

Automated:

- Accessibility lint passes.
- Contrast validation passes.
- Accessibility tests pass.

Manual:

- VoiceOver verified.
- TalkBack verified.
- Dynamic Type verified.
- Large text verified.
- Reduce Motion verified.
- Touch targets verified.

Accessibility failures block release.

## Web QA

Generate local network URL:

```bash
npm run lan:url
```

Verification devices:

- iPhone
- Android
- Tablet

Checks:

- Navigation
- Images
- Typography
- Search
- Checkout
- Wardrobe
- Fibre Passport
- Collection browsing

## Native Device QA

iOS physical device:

- Apple Pay
- Push notifications
- Deep links
- Checkout
- Dynamic Type
- Dark imagery rendering

Android physical device:

- Google Pay
- Push notifications
- Deep links
- Checkout
- Typography
- Performance

## Pre-Launch Audit

Confirm absence of prohibited patterns:

```text
Sale
Flash Sale
Limited Time
Last Chance
Trending
Best Seller
People Viewing
Wishlist
PayPal
Klarna
Afterpay
BNPL
```

Verification:

- Automated content scan passes.
- Manual UX review passes.

## Release Gate

Production release is approved only when:

- Brand assets finalized.
- Environment validated.
- Supabase deployed.
- Stripe functioning.
- Catalogue imported.
- Verification passes.
- Build succeeds.
- CI succeeds.
- Accessibility passes.
- Web QA passes.
- Native QA passes.
- Luxury UX audit passes.

Only then may the application be submitted to the Apple App Store and Google Play Store under the MONSIEUR by Aelier Groupe production release process.
