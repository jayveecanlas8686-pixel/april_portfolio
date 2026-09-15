# Rule: Core tech stack

Default for all projects unless a project explicitly states otherwise:

| Layer      | Choice                                              |
|------------|------------------------------------------------------|
| Frontend   | JavaScript, React.js + Vite                          |
| Backend    | TypeScript, Node.js, Express.js                       |
| CSS/UI     | Tailwind CSS v4 + shadcn/ui                           |
| API        | Backend: gRPC/REST · Internal: tRPC/GraphQL · External: REST |
| Auth       | Better Auth                                           |
| Animation  | Framer Motion (React)                                 |
| Real-time  | Socket.io                                             |
| DB         | Supabase (Postgres) or SQL Server                     |
| ORM        | Postgres → Drizzle · **SQL Server → Prisma**           |

Don't swap in a different framework/library in place of these without a
concrete reason — "it's newer" or "I prefer it" is not a reason.

## The ORM choice follows the database

**Drizzle has no SQL Server support in any stable release.** Its `mssql`
dialect ships only on the unreleased `1.0.0-rc`/`beta` npm tags; `latest`
(0.45.x) has no `mssql` subpath at all. Drizzle's *documentation site*
documents the unreleased line, so the docs describe MSSQL support that you
cannot actually install — reading the docs is not enough, check the registry.

On SQL Server use **Prisma**, whose SQL Server support is generally
available. Better Auth's Prisma adapter accepts `provider: "sqlserver"`,
so Better Auth and the application share one client and one migration
history. (Better Auth's *Drizzle* adapter accepts only `pg`/`mysql`/`sqlite`,
so a Drizzle-on-SQL-Server design would force Better Auth onto Kysely and
leave you with two query layers over one database.)

### Prisma gotchas worth knowing before you start

1. **Pin the version exactly.** Prisma's `latest` npm tag has been a release
   candidate (`8.0.0-rc.x`) while the stable line sat on the `prev` tag
   (`7.10.0`). An unpinned `npm install prisma` silently installs an RC.
2. **Prisma 7+ reads the datasource URL from `prisma.config.ts`**, not from
   `schema.prisma` — the `datasource` block carries only `provider`. There is
   also no `--skip-generate` flag on `prisma migrate dev`.
3. **`prisma migrate dev` needs a shadow database, and on SQL Server that
   requires site-admin rights** to create one on demand. A correctly scoped
   application login won't have them. Provision a second empty database once
   and point `shadowDatabaseUrl` at it. Production `prisma migrate deploy`
   never uses one.
4. **`now()` maps to `CURRENT_TIMESTAMP`, which is server *local* time.** For
   audit or security timestamps use
   `@default(dbgenerated("SYSUTCDATETIME()"))` rather than depending on the
   server's timezone setting.
5. **`@@unique([...])` emits a real UNIQUE CONSTRAINT** on SQL Server, not
   just a unique index — which matters, because SQL Server refuses to let a
   FOREIGN KEY reference a unique index.
