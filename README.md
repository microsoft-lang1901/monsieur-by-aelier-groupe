# Monsieur by Aelier Groupe

Deployment-ready private-client web experience for Monsieur by Aelier Groupe.

## Run Locally

```powershell
npm install
$env:MONSIEUR_SESSION_SECRET="local-development-secret"
$env:MONSIEUR_CLIENT_ACCESS_CODE="atelier"
npm start
```

Open `http://localhost:4173`.

## Vercel Deployment

The app is configured for Vercel:

- Static frontend: `public`
- Serverless API: `api/[...route].js`
- Shared backend logic: `lib/monsieur-api.js`
- Project config: `vercel.json`

Required Vercel environment variables:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MONSIEUR_SESSION_SECRET=
MONSIEUR_CLIENT_ACCESS_CODE=
```

Run `supabase/schema.sql` in Supabase before production deployment.

## Verification

```powershell
npm run build
node -e "require('./lib/monsieur-api'); require('./api/[...route].js'); console.log('modules ok')"
```
