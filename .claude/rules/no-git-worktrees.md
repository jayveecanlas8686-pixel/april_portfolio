# Standing rule: No git worktrees

Never use `superpowers:using-git-worktrees`, `EnterWorktree`, or manual
`git worktree add` for this project. Always work directly on the current
branch in the primary working directory.

This overrides any workflow skill (including
`superpowers:subagent-driven-development`) that would otherwise create or
require an isolated worktree — skip that step and proceed in place instead.
