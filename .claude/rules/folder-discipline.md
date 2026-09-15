# Rule: Folder discipline (prevent AI-created duplicates)

**Hard rule:** Strict 2-package split — `backend/` and `frontend/` at the
repo root. Every file lives in the package it belongs to, by purpose, never
by convenience or at the repo root:

- **`backend/`** — server/DB-side code, e.g. Express routes, Drizzle
  schema/models, Supabase migrations, services, API tests, `backend/.env`,
  `backend/package.json`, `backend/node_modules/`.
- **`frontend/`** — UI-side code, e.g. React pages/components/state, static
  assets, frontend tests, `frontend/.env`, `frontend/package.json`,
  `frontend/node_modules/`.
- **`shared/`** (repo root) — code used by both sides (schemas, types,
  constants), defined once, never duplicated into either package.

This split applies to any project shape, not only client-server web apps.
For a project whose native process boundary has different names (e.g. an
Electron app's `main`/`renderer` processes), still rename into
`backend/`/`frontend/` rather than keeping the framework's default
scaffold names as an exception — `backend/` is whichever side owns
process/OS/data-layer logic, `frontend/` is whichever side owns the UI.
Update every path this touches in the same pass: workspace/package-manager
config, tsconfig `extends`/`references`, bundler and packaging config,
build scripts — a rename isn't done until the project still builds, tests,
and packages cleanly under the new paths.

Before creating anything: pick the right package by purpose, check it
doesn't already exist elsewhere, and move (don't duplicate) anything found
in the wrong place.

## `.docs/.superpowers/`

Dot-prefixed, repo root — the one and only location for plans/specs/sdd
artifacts (task briefs, reports, review diffs, progress ledger).
**Local-only scratch, gitignored, never committed.** Redirect any
skill-proposed path (`docs/superpowers/...`, `superpowers/` no-dot, or a
bare `.superpowers/` at repo root) into `.docs/.superpowers/` instead. Keep
it current as work progresses.

- **Doc order is fixed: `specs/` → `plans/` → `sdd/`** (task brief, then
  task report). Never skip ahead — a plan needs a spec to point to, and an
  sdd task brief/report needs a plan to point to. If the earlier doc
  doesn't exist yet, create it first (even a short one) rather than jumping
  straight to the later stage.
- **Every task, file move, or modification gets a doc in
  `.docs/.superpowers/`.** Before starting any non-trivial change, confirm
  a spec/plan/sdd entry covers it — write one if it doesn't — and write the
  matching task report in `sdd/` when the work is done. Trivial one-off
  actions (typo fix, quick question) are exempt.
- `plans/` — plan briefs (`PLAN-00x-*.md`)
- `specs/` — product spec(s), source of truth for product behavior
- `sdd/` — software design documents (module/component design, contracts).
  Task briefs/reports/reviews from `subagent-driven-development` MUST be
  named `task-<plan-name>-<task-number>-<brief|report>.md` (e.g.
  `task-pos-core-5-brief.md`), never the bare `task-<N>-brief.md` default —
  plans run sequentially over time and the bare form collides across
  sub-projects, silently overwriting a prior plan's history. When calling
  the `task-brief` script, always pass the third `OUTFILE` argument with
  this naming instead of accepting its default output path.

## Other folder rules

- **`node_modules/` and `.env`** — one per package
  (`backend/node_modules` + `backend/.env`, `frontend/node_modules` +
  `frontend/.env`), never shared, never at the repo root, never in
  `shared/`. See `env-and-node-modules-location.md` for the full rule.
- **`.gitignore`** — exactly ONE at the repo root. Never create per-package
  `.gitignore` files (`backend/.gitignore`, `frontend/.gitignore`). All
  ignore patterns (Node, `.env`, `.docs/.superpowers/`, build output) live
  in that single root file.
- **`CLAUDE.md`/`AGENTS.md`** — exactly one `CLAUDE.md` (project-wide
  routing/process rules) and exactly one `AGENTS.md` (agent behavioral
  guardrails, e.g. file-upload/DB-growth constraints) at the repo root.
  Never create per-package copies of either. Scaffolding tools generate
  their own by default (e.g. `create-next-app` writes `frontend/AGENTS.md`
  + `frontend/CLAUDE.md`) — delete them immediately after any scaffold
  command instead of leaving them in place.
