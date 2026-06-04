# Deployment Status

## Ready

- Vercel static output directory is `public`.
- API routes are handled by `api/[...route].js`.
- The backend no longer depends on a long-running listener for production.
- Production writes require Supabase; local JSON is development-only.
- Private API routes require a signed session cookie.
- Supabase schema includes explicit service-role grants for newer Data API defaults.

## Required Before Production

Set these Vercel environment variables:

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
MONSIEUR_SESSION_SECRET
MONSIEUR_CLIENT_ACCESS_CODE
```

Then run the SQL in `supabase/schema.sql` against the production Supabase project.

## Last Local Verification

- `npm run build`
- Module load check for `lib/monsieur-api` and `api/[...route].js`
- Local health endpoint
- Unauthenticated private route returns `401`
- Authenticated private route succeeds
- Browser smoke test for launcher and product page
