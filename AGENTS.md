# Agent Instructions

## Supply Chain Config — Do Not Modify Without Approval

This repo enforces strict install-time supply chain defenses:

- Exact pinned versions (no `~`/`^`).
- `minimumReleaseAge` of 7 days (pnpm: minutes, in `pnpm-workspace.yaml`).
- Install/lifecycle scripts disabled by default; only packages in
  `onlyBuiltDependencies` (pnpm, in `pnpm-workspace.yaml`) may run them.
- `blockExoticSubdeps: true`, `trustPolicy: no-downgrade` (in `pnpm-workspace.yaml`).

**Never disable, loosen, or bypass these settings** — including adding packages
to the script allow-list, shortening `minimumReleaseAge`, or setting
`dangerouslyAllowAllBuilds` — without explicit confirmation from the user in
the current conversation. A prior approval does not carry over.

## Conventions

- Use Conventional Commits for all commit messages.
- No `~`/`^` in dependency versions — exact pins only.
- Run `pnpm run lint` and `pnpm run format:check` before committing.
- Node >=24.15.0, ES2022 target.
