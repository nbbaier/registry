A personal [shadcn-compatible registry](https://ui.shadcn.com/docs/registry) for TypeScript utility libraries, served directly from this public GitHub repository. Install items into any TypeScript project with the shadcn CLI — no React, no framework, and no `components.json` required.

## Install

Each item is distributed as a plain file (`registry:file`), so it installs into any project — Bun, Node, Deno, or a framework app — with no `components.json` and no framework detection:

```bash
# bun
bunx --bun shadcn@latest add nbbaier/registry/option

# pnpm
pnpm dlx shadcn@latest add add nbbaier/registry/option

# npm
npx shadcn@latest add nbbaier/registry/option

# yarn
yarn dlx shadcn@latest add nbbaier/registry/option
```

Files are written to your project root at `lib/<name>.ts` (e.g. `lib/option.ts`).

Pin to a branch, tag, or commit SHA with `#ref`:

```bash
npx shadcn@latest add nbbaier/registry/option#main
npx shadcn@latest add nbbaier/registry/option#v1.0.0
```

### Browse and inspect

```bash
npx shadcn@latest list nbbaier/registry                 # list every item
npx shadcn@latest search nbbaier/registry -q option     # search the catalog
npx shadcn@latest view nbbaier/registry/option          # inspect an item payload
npx shadcn@latest add nbbaier/registry/option --dry-run # preview without writing
```

## Available utilities

| Item           | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `option`       | Option type for representing optional values without null/undefined |
| `result`       | Result type for typed error handling without exceptions             |
| `tagged-error` | Mixin factory for discriminated error classes with typed props      |
| `redacted`     | Branded type preventing sensitive data from logging/serialization   |

Each item lands at `lib/<name>.ts`. If you prefer a `src/` layout, change the `target` in `registry.json` from `~/lib/<name>.ts` to `~/src/lib/<name>.ts`.

## Attribution

The v1 items (`option`, `result`, `tagged-error`) are adapted from [mulroy.dev](https://github.com/dmmulroy/mulroy.dev), and `redacted` from [this gist](https://gist.github.com/daliborgogic/0cddc4eb6f365e932932b8ef44d4d49b). Each ported source file includes a provenance header.

## Development

```bash
bun install
bun run test      # Vitest
bun run typecheck # strict TypeScript
bun run lint      # Biome check
bun run validate  # validate registry.json against the shadcn schema
```

### Adding a new item

1. Create `utils/<name>/<name>.ts` and optional `utils/<name>/<name>.test.ts`.
2. Add an entry to `registry.json`. Use `"type": "registry:item"` for the item, and a file of `"type": "registry:file"` with both a `path` (the source file) and a `target` (where it installs, e.g. `~/lib/<name>.ts`). The `target` is required for `registry:file` — it's what lets the item install without a `components.json`.
3. Run `bun run test`, `bun run lint`, and `bun run validate`.
4. Push to `main` — the item is immediately installable from GitHub.

There is no build or deploy step: the repository **is** the registry. Consumers fetch source files straight from GitHub when they run `shadcn add`.

## License

MIT — see [LICENSE](./LICENSE).
