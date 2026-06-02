# Registry

A personal shadcn-compatible code registry for distributing TypeScript utility libraries to consumer projects via the shadcn CLI. The registry is served **directly from this public GitHub repository** — no build step, no hosting, no deploy. The repository is the registry.

## Language

**Registry**:
The collection of installable code items declared by `registry.json` at the repository root. The public GitHub repository itself is the registry; there is no separate hosted service.
_Avoid_: Package, npm scope

**GitHub registry**:
The distribution model in use — a public `github.com` repository with a root `registry.json` that the shadcn CLI reads directly. Consumers install with an `owner/repo/item` address.
_Avoid_: Hosted registry, registry server

**Registry item**:
One installable unit in the registry — a named bundle of source files plus metadata that the shadcn CLI can add to a consumer project.
_Avoid_: Component, package, snippet

**Lib item**:
A registry item of type `registry:item` — TypeScript utilities (e.g. `Option`, `Result`) with no UI, hooks, or styling dependencies.
_Avoid_: Utility, helper, module

**Lib source**:
The TypeScript file you author and maintain (e.g. `utils/option/option.ts`). One lib source maps to one lib item, and is the exact file consumers receive — there is no generated intermediate.
_Avoid_: Snippet, module

**Item address**:
The `owner/repo/item` string consumers pass to `shadcn add` (e.g. `nbbaier/registry/option`). The first two segments are the GitHub owner and repository; remaining segments are the registry item name.
_Avoid_: URL, install path

**Ref**:
The optional `#branch`, `#tag`, or `#commit-sha` suffix on an item address (e.g. `nbbaier/registry/option#v1.0.0`). With no ref, the CLI uses the repository default branch. Full 40-character SHAs are the most reproducible.
_Avoid_: Version tag, release

**Registry validation**:
The check that the root `registry.json` is well-formed, resolves includes, validates items, and confirms referenced source files exist — `shadcn registry validate registry.json` locally, or `shadcn registry validate nbbaier/registry` against GitHub.
_Avoid_: Build, compile

**Registry dependency**:
A declared dependency from one lib item to another, expressed in `registryDependencies`. For items in this repository, use the full GitHub item address (e.g. `nbbaier/registry/tagged-error`). The shadcn CLI installs dependencies automatically when a consumer adds the dependent item.
_Avoid_: npm dependency, import path

**Registry version**:
The always-latest model — installing an item without a ref always fetches the current default branch. Consumers re-run `shadcn add`, or pin a `#ref`, to control updates. There is no semver publishing.
_Avoid_: Release, semver tag

**Lib import alias**:
The import path convention in **consumer** projects after install — `@/lib/<item-name>` when configured via the consumer's shadcn aliases. In the registry repo, cross-item references use relative imports between `utils/` directories (e.g. `../tagged-error/tagged-error`).
_Avoid_: Registry repo path, install path

**npm dependency**:
An external package a lib item requires, declared in the item's `dependencies` field (e.g. `"zod@^3.0.0"`). The shadcn CLI installs these in the consumer project. Distinct from registry dependencies, which reference other lib items in this registry.
_Avoid_: Registry dependency, import

**Lib test**:
A co-located Vitest test file for a lib source (e.g. `utils/option/option.test.ts` next to `option.ts`). Validates lib source in the registry repo; never listed in an item's `files`, so it never reaches consumers.
_Avoid_: Unit test, spec file

**Registry repo**:
The flat project layout at repo root — `registry.json` as the catalog, `utils/<item-name>/` for lib sources and co-located tests. No build output directory, no `wrangler.jsonc`, no nested monorepo structure.
_Avoid_: Monorepo, workspace

**Registry CI**:
GitHub Actions on push to `main` and on pull requests — lint, typecheck, test, then validate `registry.json`. Broken sources or an invalid registry never land on `main`. There is no deploy job.
_Avoid_: Deploy pipeline, release pipeline

**v1 catalog**:
The four lib items ported from mulroy.dev for initial launch — `option`, `result`, `tagged-error`, and `redacted`.
_Avoid_: Starter kit, seed items

**Port fidelity**:
Faithful copy of mulroy.dev lib sources and tests for v1 — no cross-item wiring added during the port. Registry dependencies remain available for new or refactored items after the pattern is proven.
_Avoid_: Fork, adaptation

**Registry name**:
The public identifier in `registry.json` metadata — `"nbbaier"`. Distinct from the GitHub `owner/repo` slug used in install addresses, but aligned with the owner handle.
_Avoid_: Package name, project title

**Registry homepage**:
The URL in `registry.json` metadata pointing at the source repository — `https://github.com/nbbaier/registry`.
_Avoid_: Website, endpoint, CDN URL

**Port provenance**:
Attribution for code ported from mulroy.dev — a README credit plus a one-line provenance header at the top of each ported lib source file. Preserves lineage in the registry repo and in consumer projects after install.
_Avoid_: License notice, copyright block

**Registry license**:
MIT license on the registry repo, governing distribution of lib items from this registry. Distinct from port provenance — provenance credits mulroy.dev; MIT covers your distribution terms.
_Avoid_: SPDX, copyright

**Local dev loop**:
Test, lint, validate — `bun run test` (Vitest), `bun run lint`, then `bun run validate` to confirm `registry.json` is valid and every referenced source file exists before pushing.
_Avoid_: Dev server, hot reload, preview

**Registry linting**:
Biome for lint and format on lib sources and tests. Runs locally and in CI before validation. Existing `biome-ignore` comments in ported sources are preserved.
_Avoid_: ESLint, Prettier

**Registry source repo**:
The public GitHub repository at `github.com/nbbaier/registry`. It hosts lib sources, tests, CI, and `registry.json` — and is itself the registry consumers install from.
_Avoid_: Git repo, GitHub project

**Registry README**:
Consumer and maintainer documentation at repo root — install instructions, item catalog, mulroy.dev attribution, local dev commands, and how to add new lib items.
_Avoid_: Docs site, wiki

**Registry TypeScript config**:
Strict mode enabled (`strict: true`) in the registry repo. Ported mulroy.dev sources are fixed to pass strict checking as part of the initial port — no relaxed compiler flags.
_Avoid_: tsconfig, compiler options

## Example dialogue

**Dev**: I'm adding a new `Option` type to the registry.

**Expert**: That's a lib item — one registry item, one source file under `utils/option/option.ts` (listed in `registry.json`). Consumers run `npx shadcn add nbbaier/registry/option` and get `lib/option.ts` at the install `target`. No registry-repo `components.json` — consumers bring their own alias config if they use `@/lib` imports.

**Dev**: Should I also ship a `useOption` hook?

**Expert**: Not in v1. Hooks are a different item type (`registry:hook`). Lib-only scope keeps the registry simple until you explicitly expand.

**Dev**: `result` imports `TaggedError` — should consumers install both manually?

**Expert**: No. Declare `registryDependencies: ["nbbaier/registry/tagged-error"]` on the `result` lib item — use the full GitHub item address. One `npx shadcn add nbbaier/registry/result` pulls in both files.

**Dev**: Do I need to version each lib item separately?

**Expert**: Not in v1. Always-latest — installing without a ref fetches the default branch. Consumers who want stability pin a `#ref` (a branch, tag, or full commit SHA). You ship carefully; consumers re-add to update.

**Dev**: How should `result.ts` import `TaggedError` in the registry source?

**Expert**: In this repo, use a relative import: `import { TaggedError } from "../tagged-error/tagged-error"`. After install, consumers can use `@/lib/tagged-error` if their project defines that alias — the shadcn CLI maps paths on their side, not in the registry source tree.

**Dev**: Can lib items pull in npm packages like `zod`?

**Expert**: Not in v1 — pure TypeScript only, no `dependencies` field. Later, specific items can opt in by declaring npm dependencies; the CLI handles install in the consumer project. Most items should stay zero-deps.

**Dev**: Should tests ship to consumers?

**Expert**: No. Co-locate `*.test.ts` next to each lib source, run with Vitest before pushing. Only the lib file is listed in the item's `files` array — tests are never referenced, so they never reach consumers.

**Dev**: Do we need a Worker or any server to serve the items?

**Expert**: No. There is no host. The shadcn CLI reads `registry.json` and the source files straight from the GitHub repo. Push to `main` and the item is installable.

**Dev**: How do updates get shipped?

**Expert**: Push to main. CI runs lint, typecheck, tests, and `registry validate`. Once merged, consumers pick up the change on their next `shadcn add`. No build, no deploy.

**Dev**: What ships in v1?

**Expert**: All four mulroy.dev lib items — `option`, `result`, `tagged-error`, `redacted`. Enough to validate the pattern and give consumers a useful starting catalog.

**Dev**: Should we wire `result` to depend on `TaggedError` during the port?

**Expert**: Not yet. Faithful port — copy source and tests as-is, all four items independent. Add registry dependencies when you actually need cross-item imports, not to demo the feature on day one.

**Dev**: What should the registry be called publicly?

**Expert**: `"name": "nbbaier"` in `registry.json`, homepage at `https://github.com/nbbaier/registry`. The install address is `nbbaier/registry/<item>` — the GitHub `owner/repo` slug.

**Dev**: Is there any build output to gitignore?

**Expert**: No. The repo is the registry — no `public/r/`, no generated JSON. The files under `utils/` referenced by `registry.json` are exactly what consumers receive (at the install `target` path).

**Dev**: How do we credit mulroy.dev for the ported lib items?

**Expert**: README attribution plus a provenance header on each ported file. Your registry repo gets its own license; headers preserve lineage when consumers install via `shadcn add`.

**Dev**: What license covers the registry?

**Expert**: MIT on the registry repo. Standard for utility libs — consumers can use and modify installed files freely. Provenance headers credit mulroy.dev separately.

**Dev**: Do we need a full shadcn project setup in the registry repo?

**Expert**: No shadcn UI scaffold — no `components.json` in this repo. `tsconfig.json` includes `utils/**/*.ts`; Vitest runs `utils/**/*.test.ts`. Use relative imports between items under `utils/`.

**Dev**: How do I verify changes locally before pushing?

**Expert**: `bun run test`, `bun run lint`, then `bun run validate`. Validation confirms `registry.json` is well-formed and every referenced source file exists — the same checks the CLI runs before a consumer installs.

**Dev**: Do we need a linter?

**Expert**: Yes — Biome for lint and format. Run `biome check` locally and in CI before validation. Ported `biome-ignore` comments stay; Biome respects them.

**Dev**: How do consumers pin to a specific version of an item?

**Expert**: With a `#ref` on the install address — `nbbaier/registry/option#v1.0.0` for a tag, or a full 40-character commit SHA for the most reproducible pin. No ref means the default branch.

**Dev**: Should the GitHub repo be public?

**Expert**: Yes — it has to be. GitHub registries only work with public `github.com` repositories. The repo being public is what makes the items installable. Sources, tests, and provenance are all inspectable.

**Dev**: What goes in the README?

**Expert**: Consumer setup plus maintainer workflow — install commands, item catalog, mulroy.dev credit, local dev, how to add a lib item. `CONTEXT.md` stays the glossary; README is the human guide.

**Dev**: Should we relax TypeScript for the port?

**Expert**: No. Strict mode on, fix any port issues upfront. Lib items should type-check cleanly; consumers with strict projects won't hit surprises.

**Dev**: What should the GitHub repo be called?

**Expert**: `registry` — `github.com/nbbaier/registry`. It doubles as the install address `nbbaier/registry/<item>`, so the name is part of the public API.
