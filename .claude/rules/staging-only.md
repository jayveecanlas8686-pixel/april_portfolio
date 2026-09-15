# Standing rule: Commit and push to `staging`, never `main`

All work happens on the `staging` branch: commit there, push there
(`origin/staging`).

- Never push `main` directly.
- Never merge `staging` → `main` locally.
- Never open the `staging` → `main` PR — the user promotes `staging` to
  `main` via a manual PR on GitHub themselves.
