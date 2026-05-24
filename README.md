# nbbaier registry

A personal [shadcn-compatible registry](https://ui.shadcn.com/docs/registry) for TypeScript utility libraries. Install lib items into any project with the shadcn CLI.

**Live endpoint:** `https://nbbaier-registry.nico-baier.workers.dev`

## Install

Add the registry namespace to your project's `components.json`:

```json
{
   "registries": {
      "@nbbaier": "https://nbbaier-registry.nico-baier.workers.dev/r/{name}.json"
   }
}
```

Install a lib item:

```bash
npx shadcn add @nbbaier/option
```

Or install directly by URL:

```bash
npx shadcn add https://nbbaier-registry.nico-baier.workers.dev/r/option.json
```

Installed files land in your project's lib directory per your `components.json` aliases (typically `src/lib/`).

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
bun test                  # run Vitest
bun run typecheck         # strict TypeScript
bun run lint              # Biome check
bun run registry:build    # build artifacts to public/r/
bun run preview           # serve public/ locally via wrangler dev
bun run smoke             # verify shadcn add works against built option.json
```

### Adding a new lib item

1. Create `registry/default/lib/<name>.ts` and optional `<name>.test.ts`
2. Add an entry to `registry.json`
3. Run `bun test`, `bun run registry:build`, and `bun run smoke`
4. Push to `main` — CI deploys automatically

### Deploy

CI deploys to Cloudflare on push to `main`. Required GitHub Actions secrets:

- `CLOUDFLARE_API_TOKEN` — Workers deploy permissions
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID

The live URL is set in `registry.json` as `homepage` and should match the deployed workers.dev subdomain.

## License

MIT — see [LICENSE](./LICENSE).
