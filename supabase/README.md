Monsieur Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor or as a migration.
3. Set environment variables before starting the server:

```powershell
$env:SUPABASE_URL="https://your-project.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
$env:MONSIEUR_SESSION_SECRET="a-long-random-secret"
$env:MONSIEUR_CLIENT_ACCESS_CODE="private-client-access-code"
```

Without the Supabase variables, local development automatically falls back to `data/db.json`.
On Vercel, Supabase is required for persistent records, and private API routes require the
session secret plus client access code.

Note: recent Supabase projects may require explicit Data API grants/exposure for SQL-created tables. RLS is enabled in the schema, and the local server is designed to use the service role key on the backend only.
