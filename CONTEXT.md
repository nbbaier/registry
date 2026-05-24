# Registry

A personal shadcn-compatible code registry for distributing TypeScript utility libraries to consumer projects via the shadcn CLI.

## Language

**Registry**:
The hosted collection of installable code items exposed at a public URL, with `registry.json` as its catalog entry point.
_Avoid_: Package, npm scope

**Registry item**:
One installable unit in the registry — a named bundle of source files plus metadata that the shadcn CLI can add to a consumer project.
_Avoid_: Component, package, snippet

**Lib item**:
A registry item of type `registry:lib` — TypeScript utilities (e.g. `Option`, `Result`) with no UI, hooks, or styling dependencies.
_Avoid_: Utility, helper, module

**Lib source**:
The TypeScript file you author and maintain (e.g. `registry/default/lib/option.ts`). One lib source maps to one lib item.
_Avoid_: Snippet, module

**Registry build**:
The step that transforms lib sources and `registry.json` into published JSON artifacts via `shadcn build`.
_Avoid_: Compile, bundle, deploy

**Published artifact**:
The static JSON file the shadcn CLI fetches at install time (e.g. `/r/option.json`).
_Avoid_: Package tarball, npm release

**Registry host**:
The Cloudflare deployment that serves published artifacts as static assets — no Worker script, no runtime logic.
_Avoid_: Server, API, backend

**Registry endpoint**:
The public base URL where the registry is reachable (e.g. `https://nbbaier-registry.nico-baier.workers.dev`).
_Avoid_: Domain, CDN URL

**Registry namespace**:
The `@`-prefixed handle consumers configure in `components.json` to install items by short name (e.g. `@nbbaier`).
_Avoid_: Scope, package name

**Consumer registry config**:
The one-time `components.json` entry that maps a namespace to the registry's item URL pattern (e.g. `"@nbbaier": "https://nbbaier-registry.nico-baier.workers.dev/r/{name}.json"`).
_Avoid_: Registry setup, shadcn config

**Registry dependency**:
A declared dependency from one lib item to another in the same registry, expressed as `@nbbaier/<item-name>` in `registryDependencies`. The shadcn CLI installs dependencies automatically when a consumer adds the dependent item.
_Avoid_: npm dependency, import path

**Registry version**:
The always-latest model — one published artifact URL per lib item with no semver pinning. Consumers re-run `shadcn add` to pick up updates.
_Avoid_: Release, semver tag

**Lib import alias**:
The import path convention for cross-item references in lib source — `@/lib/<item-name>`. Matches where installed files land in consumer projects and aligns with shadcn registry authoring conventions.
_Avoid_: Relative import, registry path

**npm dependency**:
An external package a lib item requires, declared in the item's `dependencies` field (e.g. `"zod@^3.0.0"`). The shadcn CLI installs these in the consumer project. Distinct from registry dependencies, which reference other lib items in this registry.
_Avoid_: Registry dependency, import

**Lib test**:
A co-located Vitest test file for a lib source (e.g. `option.test.ts` next to `option.ts`). Validates lib source in the registry repo; never included in published artifacts.
_Avoid_: Unit test, spec file

**Registry repo**:
The flat project layout at repo root — `registry.json`, `registry/default/lib/` for sources, `public/` for build output, `wrangler.jsonc` at root. No nested monorepo structure.
_Avoid_: Monorepo, workspace

**Registry deploy**:
Automated deployment via CI on push to main — test, build, then `wrangler deploy`. Broken lib sources never reach the registry endpoint.
_Avoid_: Release pipeline, publish

**v1 catalog**:
The four lib items ported from mulroy.dev for initial launch — `option`, `result`, `tagged-error`, and `redacted`.
_Avoid_: Starter kit, seed items

**Port fidelity**:
Faithful copy of mulroy.dev lib sources and tests for v1 — no cross-item wiring added during the port. Registry dependencies remain available for new or refactored items after the pipeline is proven.
_Avoid_: Fork, adaptation

**Registry name**:
The public identifier in `registry.json` metadata — `"nbbaier"`. Distinct from the Wrangler worker name and the consumer namespace, but aligned with both.
_Avoid_: Package name, project title

**Registry homepage**:
The URL in `registry.json` pointing to the live registry endpoint (`https://nbbaier-registry.nico-baier.workers.dev`). Can migrate to a custom domain later without changing item URL paths.
_Avoid_: Website, docs site

**Build output**:
The generated JSON under `public/r/` produced by `shadcn build`. Not committed to git — CI builds fresh on every deploy from lib sources and `registry.json`.
_Avoid_: Published artifacts (when referring to git), dist folder

**Port provenance**:
Attribution for code ported from mulroy.dev — a README credit plus a one-line provenance header at the top of each ported lib source file. Preserves lineage in the registry repo and in consumer projects after install.
_Avoid_: License notice, copyright block

**Registry license**:
MIT license on the registry repo, governing distribution of lib items from this registry. Distinct from port provenance — provenance credits mulroy.dev; MIT covers your distribution terms.
_Avoid_: SPDX, copyright

**Registry alias config**:
Minimal `components.json` plus tsconfig path aliases that map `@/lib/*` to `registry/default/lib/*`. Enables `shadcn build` and Vitest to resolve lib import aliases without Tailwind or UI scaffolding.
_Avoid_: shadcn config, tsconfig paths

**Local dev loop**:
Test, build, then preview — `bun test`, `bun run registry:build`, then `wrangler dev` to serve `public/` locally and verify artifact URLs before push.
_Avoid_: Dev server, hot reload

**Registry linting**:
Biome for lint and format on lib sources and tests. Runs locally and in CI before build. Existing `biome-ignore` comments in ported sources are preserved.
_Avoid_: ESLint, Prettier

**CI smoke test**:
End-to-end install verification in CI — after `shadcn build`, run `shadcn add` against the built `option.json` artifact in a temp project. Confirms published JSON is valid and installable before deploy.
_Avoid_: Integration test, e2e test

**Registry source repo**:
Public GitHub repository hosting lib sources, tests, and CI configuration. GitHub Actions runs the deploy pipeline on push to `main`.
_Avoid_: Git repo, GitHub project

**Registry README**:
Consumer and maintainer documentation at repo root — install instructions, item catalog, mulroy.dev attribution, local dev commands, and how to add new lib items.
_Avoid_: Docs site, wiki

**Registry TypeScript config**:
Strict mode enabled (`strict: true`) in the registry repo. Ported mulroy.dev sources are fixed to pass strict checking as part of the initial port — no relaxed compiler flags.
_Avoid_: tsconfig, compiler options

**GitHub repository**:
The public source repository at `github.com/nbbaier/registry`. Hosts lib sources, CI, and documentation — distinct from the Cloudflare registry endpoint consumers fetch artifacts from.
_Avoid_: Git repo, remote

## Example dialogue

**Dev**: I'm adding a new `Option` type to the registry.

**Expert**: That's a lib item — one registry item, one file under `registry/default/lib/`. Consumers configure `@nbbaier` once, then run `npx shadcn add @nbbaier/option` and get the file merged into their project's lib directory per their `components.json` aliases.

**Dev**: Should I also ship a `useOption` hook?

**Expert**: Not in v1. Hooks are a different item type (`registry:hook`). Lib-only scope keeps the registry and build pipeline simple until you explicitly expand.

**Dev**: `result` imports `TaggedError` — should consumers install both manually?

**Expert**: No. Declare `registryDependencies: ["@nbbaier/tagged-error"]` on the `result` lib item. One `npx shadcn add @nbbaier/result` pulls in both files.

**Dev**: Do I need to version each lib item separately?

**Expert**: Not in v1. Always-latest — one URL per item, no `@1.2.0` pinning. You ship carefully; consumers re-add to update.

**Dev**: How should `result.ts` import `TaggedError` in the registry source?

**Expert**: Use the lib import alias: `import { TaggedError } from "@/lib/tagged-error"`. The shadcn CLI resolves it against the consumer's `components.json` aliases on install.

**Dev**: Can lib items pull in npm packages like `zod`?

**Expert**: Not in v1 — pure TypeScript only, no `dependencies` field. Later, specific items can opt in by declaring npm dependencies; the CLI handles install in the consumer project. Most items should stay zero-deps.

**Dev**: Should tests ship to consumers?

**Expert**: No. Co-locate `*.test.ts` next to each lib source, run with Vitest before deploy. Only the lib file is listed in the item's `files` array — tests never appear in published artifacts.

**Dev**: Do we need a Worker to serve the JSON?

**Expert**: No. Assets-only deploy — `wrangler.jsonc` points at `./public`, no `main` script. Cloudflare serves `/r/*.json` from the edge after `shadcn build` writes to `public/r/`.

**Dev**: How do updates get shipped?

**Expert**: Push to main. CI runs tests, `shadcn build`, and `wrangler deploy`. No manual deploy step for production.

**Dev**: What ships in v1?

**Expert**: All four mulroy.dev lib items — `option`, `result`, `tagged-error`, `redacted`. Enough to validate the full pipeline and give consumers a useful starting catalog.

**Dev**: Should we wire `result` to depend on `TaggedError` during the port?

**Expert**: Not yet. Faithful port — copy source and tests as-is, all four items independent. Add registry dependencies when you actually need cross-item imports, not to demo the feature on day one.

**Dev**: What should the registry be called publicly?

**Expert**: `"name": "nbbaier"` in `registry.json`, Wrangler worker `"nbbaier-registry"`, homepage at `https://nbbaier-registry.nico-baier.workers.dev`. Matches the `@nbbaier` consumer namespace. Custom domain can come later.

**Dev**: Should `public/r/` be in git?

**Expert**: No. CI-only — `public/r/` is build output, gitignored. CI runs `shadcn build` before deploy so artifacts always match sources.

**Dev**: How do we credit mulroy.dev for the ported lib items?

**Expert**: README attribution plus a provenance header on each ported file. Your registry repo gets its own license; headers preserve lineage when consumers install via `shadcn add`.

**Dev**: What license covers the registry?

**Expert**: MIT on the registry repo. Standard for utility libs — consumers can use and modify installed files freely. Provenance headers credit mulroy.dev separately.

**Dev**: Do we need a full shadcn project setup in the registry repo?

**Expert**: No. Minimal `components.json` for aliases only, plus tsconfig paths mapping `@/lib/*` to `registry/default/lib/*`. Enough for `shadcn build` and Vitest — no Tailwind or UI config.

**Dev**: How do I verify changes locally before pushing?

**Expert**: `bun test`, then `bun run registry:build`, then `wrangler dev`. Hit `http://localhost:8787/r/option.json` to confirm the same URLs the shadcn CLI will fetch in production.

**Dev**: Do we need a linter?

**Expert**: Yes — Biome for lint and format. Run `biome check` locally and in CI before build. Ported `biome-ignore` comments stay; Biome respects them.

**Dev**: How do we know the published JSON actually works for consumers?

**Expert**: CI smoke test — after build, `shadcn add` against the built `option.json` in a temp project. One independent item is enough to catch broken artifacts before deploy.

**Dev**: Should the GitHub repo be public?

**Expert**: Yes. Public repo plus GitHub Actions — sources, tests, and provenance are inspectable; CI deploys on push to `main`.

**Dev**: What goes in the README?

**Expert**: Consumer setup plus maintainer workflow — install commands, item catalog, mulroy.dev credit, local dev, how to add a lib item. `CONTEXT.md` stays the glossary; README is the human guide.

**Dev**: Should we relax TypeScript for the port?

**Expert**: No. Strict mode on, fix any port issues upfront. Lib items should type-check cleanly; consumers with strict projects won't hit surprises.

**Dev**: What should the GitHub repo be called?

**Expert**: `registry` — `github.com/nbbaier/registry`. Matches your local folder; the account name provides enough context.
