## Learned User Preferences

- Prefer separate git commits for tooling/config changes versus documentation updates.
- Do not add `tsconfig` `paths` or Vitest `resolve.alias` for `@/lib/*` unless the codebase actually imports with those aliases.
- Use the Thermos skill (`thermos`) for parallel thermo-nuclear branch and code-quality reviews on this repo.

## Learned Workspace Facts

- Personal shadcn-compatible TypeScript utility registry; the public GitHub repository is the registry (no build or deploy step).
- Lib sources live at `utils/<name>/<name>.ts` with co-located `*.test.ts`; `registry.json` `path` fields point there.
- Consumer install `target` remains `~/lib/<name>.ts` via the shadcn CLI (`registry:file`).
- No `components.json` in this repo; consumers can install items without one.
- Cross-item imports in-repo use relative paths (e.g. `../tagged-error/tagged-error`), not `@/lib` aliases.
- `tsconfig.json` includes `utils/**/*.ts` and `scripts/**/*.ts` only.
- Run tests with `bun run test` (Vitest, `utils/**/*.test.ts`); CI uses the same — not `bun test`.
- Dev loop: `bun install`, `bun run test`, `bun run typecheck`, `bun run lint`, `bun run validate`.
- v1 catalog items: `option`, `result`, `tagged-error`, `redacted` (ported from mulroy.dev with port fidelity).
