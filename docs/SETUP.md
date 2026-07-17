# Setup

Local setup guidance for MONSIEUR by Aelier Groupe, derived from the tracked manifests and root scripts at `5047131afab78e77ab91069ad7e52cd96f8e7b7f`.

<!-- portfolio-maintenance-20260717:setup:start -->
## Prerequisites and Install

```powershell
npm ci
```
Use `.env.example` only as a variable-name template. Keep real values outside Git and never commit `.env` files.
Available root commands:
- `npm run start`
- `npm run typecheck`
- `npm run test`
- `npm run verify`

## Component Manifests

- `package.json`

## Setup Boundary

Do not run deployment, production migration, billing, provider, or destructive data commands as part of local setup. Use repository-specific environment and approval documentation where present.
<!-- portfolio-maintenance-20260717:setup:end -->
