# Project Instructions

Standing rules and skill/plugin routing for this project are split into
individual files under `.claude/` so each can be read and updated on its
own. **This file is an index, not the content** — open the linked file
before acting on the rule/routing it covers.

## Standing rules — `.claude/rules/`

- [tech-stack.md](.claude/rules/tech-stack.md) — default tech stack for all projects
- [template-sync.md](.claude/rules/template-sync.md) — keep the default project scaffold in sync
- [no-git-worktrees.md](.claude/rules/no-git-worktrees.md) — never use git worktrees on this project
- [staging-only.md](.claude/rules/staging-only.md) — commit/push to `staging` only, never `main`
- [github-cli-and-token.md](.claude/rules/github-cli-and-token.md) — use `gh` CLI + the `.env` `github_token` for git/GitHub operations
- [deployment-service-tokens.md](.claude/rules/deployment-service-tokens.md) — use `.env` access tokens for Vercel, Railway, and Supabase, never an ambient CLI login
- [senior-engineer-mindset.md](.claude/rules/senior-engineer-mindset.md) — how to approach every change
- [skill-plugin-usage.md](.claude/rules/skill-plugin-usage.md) — match plugin/skill to the task, announce it
- [folder-discipline.md](.claude/rules/folder-discipline.md) — backend/frontend/shared split, `.docs/.superpowers/` doc ordering
- [env-and-node-modules-location.md](.claude/rules/env-and-node-modules-location.md) — `.env` and `node_modules/` only ever inside `backend/` or `frontend/`

## Skill & plugin routing — `.claude/skills/`

(none currently — skill selection is left to native skill-description
matching; add a file here only for routing guidance that isn't derivable
from a skill's own description, e.g. disambiguating same-named skills)

## Standing rule: Adding a new rule or skill

Never edit an existing file in `.claude/rules/` or `.claude/skills/` to bolt
on an unrelated rule, and never add rule/skill content directly to this
file. Instead:

1. Create a new `.md` file — one rule or one routing topic per file, named
   for what it covers (e.g. `.claude/rules/no-force-push.md`).
2. Place it in the folder it belongs to: `.claude/rules/` for a standing
   rule, `.claude/skills/` for plugin/skill routing guidance.
3. Add a one-line bullet for it under the matching index section above
   (`## Standing rules` or `## Skill & plugin routing`) in the same format
   as the existing entries — link + short description. This file must stay
   in sync with what actually exists in those folders.
