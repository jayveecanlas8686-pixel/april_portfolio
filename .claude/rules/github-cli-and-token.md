# Standing rule: Always authenticate GitHub operations with the `backend/.env` token

For every push, PR creation, or other GitHub-facing operation (checking
repo existence, viewing PR/issue state, calling `gh api`, etc.), you
**MUST** use the **GitHub CLI (`gh`)** authenticated with the **GitHub
token stored in `backend/.env`** (`github_token=...`). Per
`env-and-node-modules-location.md` there is no repo-root `.env` — repo-level
tooling tokens live in `backend/.env`.

**Never rely on, or fall back to, whatever GitHub account happens to
already be logged into `gh`/the OS credential manager** — not even if it
looks like it matches the repo owner. Re-authenticate with the `.env`
token as an unconditional first step before any push/PR/`gh api` call, every
time, in every session. Do not skip this by checking `gh auth status` and
deciding the current session "looks fine" — ambient auth state is
untrusted by default.

This rule governs operations that reach GitHub (push, fetch from a private
remote, PR/issue creation, `gh api` calls). A plain local `git commit` is
unaffected — it never talks to GitHub and needs no token.

**Why:** a plain `git push`/`git fetch` over HTTPS, or an already-logged-in
`gh` session, silently uses whatever git credential or account is cached in
the environment, which may belong to a different GitHub account than the
one that owns this repo — especially likely when the repo is private. That
mismatch fails with a misleading `Repository not found` instead of a clear
permissions error, or worse, silently succeeds against the wrong account.
The `.env` token is scoped to the actual repo owner and reliably works
regardless of which account is active in the ambient environment —
important since automated/background sessions may not have the same
interactive login state a human's terminal does, and an interactive login
can silently drift to a different account between sessions.

**How to apply:**

1. Before doing ANY push, PR creation, or `gh api` call — unconditionally,
   not just when something looks wrong — authenticate with the `.env`
   token:
   ```bash
   token=$(grep -m1 '^github_token=' backend/.env | cut -d= -f2-)
   echo "$token" | gh auth login --with-token
   gh auth setup-git   # wires git's credential helper to gh, so plain `git push` also works afterward
   ```
2. Use `gh` subcommands (`gh repo view`, `gh pr create`, `gh pr view`,
   `gh api ...`) over raw `git`/HTTPS calls for anything that talks to
   GitHub's API (PR creation, repo metadata) — `git push`/`git fetch` are
   fine for plain ref transfer once `gh auth setup-git` has wired the
   credential helper, but only after step 1 has run.
3. Never print, log, or otherwise expose the token value itself — read it
   only to pass into `gh auth login --with-token` via a pipe, the same way
   any other secret in `.env` is handled.
4. If `backend/.env` or `github_token=` is missing, stop and ask the user for the
   token rather than falling back to ambient `gh`/credential-manager auth.
5. This does not override a project's own branch-policy rules (e.g. a
   `staging-only.md`-style rule restricting which branches may be pushed
   to, or which PRs may be opened) — this rule only fixes *how* an
   already-authorized push/PR authenticates, not what is authorized.
