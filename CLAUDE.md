# use-custom-event

A typed custom event emitter for React using the Standard Schema interface for runtime validation.

## Commands

- `pnpm run build` — build with tsdown
- `pnpm run test` — run tests with vitest
- `pnpm run test:coverage` — run tests with coverage
- `pnpm run typecheck` — type-check with tsc
- `pnpm run lint` — oxlint across the repo
- `pnpm run format` — oxfmt across the repo
- `pnpm run format:check` — check formatting

## Conventions

- TypeScript strict mode, target ES2022
- No single-character variable names — use descriptive names
- No nested ternaries — use ts-pattern for complex conditionals
- Conventional Commits enforced via commitlint
- Exact pinned dependency versions (no `~`/`^`)
- oxlint for linting, oxfmt for formatting (no eslint/prettier)
- Vitest for testing with happy-dom environment

## Architecture

- `src/index.ts` — core custom event emitter using DOM CustomEvent API (no React dependency)
- `src/react.ts` — React bindings wrapping core event emitter with `useEventListener` hook
- `src/broadcast.ts` — core cross-tab event emitter using BroadcastChannel API (no React dependency)
- `src/broadcast-react.ts` — React bindings wrapping broadcast event emitter with `useEventListener` hook
- All modules accept any Standard Schema compliant validator (zod 3.24+, valibot, arktype, etc.)
- React is an optional peer dependency — only needed when importing from `/react` or `/broadcast/react` paths

## Supply Chain Config — Do Not Modify Without Approval

This repo enforces strict install-time supply chain defenses:

- Exact pinned versions (no `~`/`^`).
- `minimumReleaseAge` of 7 days (pnpm: minutes).
- Install/lifecycle scripts disabled by default; only packages in
  `onlyBuiltDependencies` (in `pnpm-workspace.yaml`) may run them.
- `blockExoticSubdeps: true`, `trustPolicy: no-downgrade` (in `pnpm-workspace.yaml`).

**Never disable, loosen, or bypass these settings** — including adding packages
to the script allow-list, shortening `minimumReleaseAge`, or setting
`dangerouslyAllowAllBuilds` — without explicit confirmation from the user in
the current conversation. A prior approval does not carry over.
