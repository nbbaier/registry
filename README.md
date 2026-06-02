A personal [shadcn-compatible registry](https://ui.shadcn.com/docs/registry) for TypeScript utility libraries, served directly from this public GitHub repository. Install lib items into any project with the shadcn CLI.

## Install

Install a lib item directly from GitHub — no namespace or `components.json` setup required:

```bash
npx shadcn@latest add nbbaier/registry/option
```

Installed files land in your project's lib directory per your `components.json` aliases (typically `src/lib/`).

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

## Available lib items

| Item           | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| `option`       | Option type for representing optional values without null/undefined |
| `result`       | Result type for typed error handling without exceptions             |
| `tagged-error` | Mixin factory for discriminated error classes with typed props      |
| `redacted`     | Branded type preventing sensitive data from logging/serialization   |

## Attribution

The v1 lib items (`option`, `result`, `tagged-error`, `redacted`) are adapted from [mulroy.dev](https://github.com/dmmulroy/mulroy.dev). Each ported source file includes a provenance header.

## Development

```bash
bun install
bun test          # run Vitest
bun run typecheck # strict TypeScript
bun run lint      # Biome check
bun run validate  # validate registry.json against the shadcn schema
```

### Adding a new lib item

1. Create `registry/default/lib/<name>.ts` and optional `<name>.test.ts`
2. Add an entry to `registry.json` whose `files[].path` points at the source file
3. Run `bun test`, `bun run lint`, and `bun run validate`
4. Push to `main` — the item is immediately installable from GitHub

There is no build or deploy step: the repository **is** the registry. Consumers fetch source files straight from GitHub when they run `shadcn add`.

## License

MIT — see [LICENSE](./LICENSE).
