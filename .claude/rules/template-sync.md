# Standing rule: Keep the default template in sync

The scaffold at `c:\Users\JAYVEE CANLAS\Desktop\Defualt Project Structure`
is copied into every new project — it is not a one-time generator.

Whenever a real project surfaces a rule, convention, command, skill, agent,
or hook that's generic enough to apply to future projects (not just this
one), port that change back into the master copy at that path, not just the
local project.

Project-specific values (tech-stack deviations, deploy targets, per-project
conventions) stay local; only genuinely reusable improvements get
back-ported. Do this proactively when the change is made — don't wait to be
asked.
