# Standing rule: Always authenticate Vercel, Railway, and Supabase with the `backend/.env` access token

For every Vercel, Railway, or Supabase CLI or API operation (deploys, env
var management, project linking, database migrations/pushes, etc.), you
**MUST** authenticate using that service's access token stored in
`backend/.env` — never whatever account or session happens to
already be logged into that CLI locally.

This is the same rule as `github-cli-and-token.md`, extended to the other
third-party services this stack touches. GitHub keeps its own file (`gh`
CLI has more steps — `gh auth login`, `gh auth setup-git`); this file
covers the deploy/DB-platform side.

**Why:** the same rationale as the GitHub rule — an ambient CLI login may
belong to a different account, org, or project than the one this repo
actually deploys to, especially on shared or automated machines. That
mismatch either fails cryptically or, worse, silently succeeds against the
wrong project/environment (e.g. deploying to someone else's Vercel
project, or migrating the wrong Supabase database). The `.env` token is
scoped to the actual project and works regardless of ambient session
state.

**How to apply, per service:**

### Vercel
- Token lives in `backend/.env` as `vercel_token=`.
- Pass it explicitly on every command, don't rely on `vercel login`:
  ```bash
  token=$(grep -m1 '^vercel_token=' backend/.env | cut -d= -f2-)
  vercel <command> --token="$token"
  ```

### Railway
- Token lives in `backend/.env` as `railway_token=`.
- Export it before running CLI commands — the Railway CLI reads
  `RAILWAY_TOKEN` from the environment automatically:
  ```bash
  export RAILWAY_TOKEN=$(grep -m1 '^railway_token=' backend/.env | cut -d= -f2-)
  railway <command>
  ```

### Supabase
- Token lives in `backend/.env` as `supabase_access_token=`.
- Export it before running CLI commands — the Supabase CLI reads
  `SUPABASE_ACCESS_TOKEN` from the environment automatically:
  ```bash
  export SUPABASE_ACCESS_TOKEN=$(grep -m1 '^supabase_access_token=' backend/.env | cut -d= -f2-)
  supabase <command>
  ```
- For direct API/DB calls that don't go through the CLI (e.g. a migration
  script hitting Postgres directly), use the project's service-role key or
  connection string from `.env` — never a personal or ambient credential.

**Common to all three:**

1. Never print, log, or otherwise expose a token value — read it only to
   pipe/export into the tool's own auth mechanism, the same way any other
   secret in `backend/.env` is handled.
2. If `backend/.env` or the relevant `<service>_token=` key is missing, stop and
   ask the user for it rather than falling back to ambient CLI login.
3. This does not override a project's own deploy/branch-policy rules (e.g.
   `staging-only.md`) — this rule only fixes *how* an already-authorized
   operation authenticates, not what is authorized or when it's allowed to
   run.
