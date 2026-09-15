# Standing rule: `.env` and `node_modules/` live ONLY in `backend/` or `frontend/`

There must be **no `.env` file and no `node_modules/` folder anywhere
outside `backend/` and `frontend/`** — not at the repo root, not in
`shared/`, not in any other directory. There are no exceptions.

Valid locations, and the complete list of them:

- `backend/.env` · `backend/node_modules/`
- `frontend/.env` · `frontend/node_modules/`

Anything else is a violation: `./.env`, `./node_modules/`,
`shared/.env`, `shared/node_modules/`, `.docs/node_modules/`, etc.

**Why:** a root `.env` merges two packages' secrets into one blast radius
and makes it ambiguous which process is supposed to read a given key; a
root `node_modules/` lets either package silently import a dependency it
never declared, so the build passes locally and breaks the moment that
package is installed or deployed on its own. Keeping both per-package
means each side's dependency graph and secret set are exactly what its own
`package.json` / `.env` declares.

## How to apply

### `.env`
- Put each key in the package whose process actually reads it: DB
  credentials, connection strings, server-side API keys, service-role keys
  → `backend/.env`. Anything the browser bundle reads (`VITE_*` and
  friends) → `frontend/.env`.
- **Repo-level tooling tokens** (`github_token`, `vercel_token`,
  `railway_token`, `supabase_access_token`) live in **`backend/.env`** —
  they are operational/deploy-side credentials, and `backend/` is the side
  that owns process/OS/data-layer concerns. The other rules that refer to
  "the `.env` token" mean `backend/.env`; read them from there.
- Never duplicate a key into both packages to avoid a move. If both sides
  genuinely need the same value, it is a frontend value (public) or the
  frontend should be getting it from the backend at runtime (secret).
- Never create a root `.env` "just for local dev" or as a convenience
  aggregate — tooling that wants one is configured to point at
  `backend/.env` instead.

### `node_modules/`
- **Always `cd` into `backend/` or `frontend/` before any install.** Never
  run `npm install` / `npm ci` / `npm run` from the repo root.
- Every dependency is declared in that package's own `package.json`. If
  both packages need a library, each declares it — that is not
  duplication, it is two independent dependency graphs.
- **No npm/pnpm/yarn workspaces**, and no root `package.json` that hoists
  a shared `node_modules/`. Workspace hoisting is exactly the root
  `node_modules/` this rule forbids.
- `shared/` is consumed as a plain local file dependency
  (`"shared": "file:../shared"`) from each package, so the symlink lands
  inside `backend/node_modules/` and `frontend/node_modules/`. `shared/`
  itself stays dependency-free where possible; it never gets its own
  `node_modules/`.
- If a root `node_modules/` appears, delete it and re-install from inside
  the package — do not leave it there because "it works".
