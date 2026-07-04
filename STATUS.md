# Project Status

## What This Is

PersonalWebsite is an Angular 22 single-page application (originally scaffolded with Angular CLI 16 and since upgraded). It uses the NgModule-based app structure (`AppModule`, `AppRoutingModule`) with a single `AppComponent`. The entire toolchain now runs on the modern esbuild/Vite-based `@angular/build` builders — `build` on `@angular/build:application`, `serve` on `@angular/build:dev-server`, and unit tests on `@angular/build:unit-test` (Vitest, browserless via jsdom). The legacy `@angular-devkit/build-angular` webpack builder and the Karma/Jasmine/Puppeteer test stack have both been removed.

## Current State — 2026-07-04

**Health: green.** `npm ci` resolves cleanly (no `--legacy-peer-deps`) **with zero deprecation warnings**, `ng build` succeeds on the application builder (no deprecation notice), and `ng test` passes 8/8 **browserless** on Vitest (jsdom). The project is on **Angular 22.0.x** and **TypeScript 6.0.x**, running on **Node.js 24.x**.

**`npm audit` reports 0 vulnerabilities.** Migrating off the webpack builder removed the entire `webpack-dev-server` → `http-proxy-middleware` chain; the subsequent Karma → Vitest migration dropped the Karma/Jasmine/Puppeteer stack — which removed the last deprecated transitives (`inflight`, `glob@7`, `rimraf@3`) and shrank the dependency tree to ~453 packages (down from ~970 pre-cleanup). The remaining `piscina` RCE is patched via an `overrides` pin to `^5.2.0`. The `esbuild` and `@babel/core` pins remain load-bearing (their parents pin exact vulnerable versions — `@angular/build`/`compiler-cli` pin `@babel/core` to 7.29.0); the now-dead `webpack-dev-server` and `uuid` pins were dropped.

**Hosting.** The site is **live** at the apex custom domain **`https://jmaff.dev/`**, served from GitHub Pages (`gh-pages` branch, custom domain `jmaff.dev`, Enforce HTTPS on). The deploy build uses `--base-href /` and ships `src/CNAME` (`jmaff.dev`, registered in `angular.json` assets) into the published output so the custom domain survives `keep_files: false` on each deploy ([#62](https://github.com/J-MaFf/PersonalWebsite/issues/62)). DNS (4 A + 4 AAAA at Cloudflare, DNS-only) and the Pages enablement/HTTPS settings were applied via the GitHub API ([#69](https://github.com/J-MaFf/PersonalWebsite/issues/69)).

### Components

| File / Area | Description |
|---|---|
| `src/app/app.module.ts` | Root NgModule — declares `AppComponent`, imports `BrowserModule` + `AppRoutingModule`. |
| `src/app/app-routing.module.ts` | Router configuration (currently an empty route table). |
| `src/app/app.component.*` | Root component (`app-root`): TypeScript, template, styles, and spec. Non-standalone (`standalone: false`); `changeDetection: ChangeDetectionStrategy.Eager` (set by the v22 migration to preserve pre-v22 behavior). |
| `src/main.ts` | Bootstraps `AppModule` via `platformBrowser()` from `@angular/platform-browser` (migrated off the deprecated `platformBrowserDynamic`). |
| `angular.json` | All targets on `@angular/build` — `build` → `:application`, `serve` → `:dev-server`, `test` → `:unit-test` (Vitest runner). The `test` target builds via a dedicated `build:testing` configuration that adds the `zone.js/testing` polyfill. |
| `tsconfig.json` | TS 6.0 compatible — dropped `baseUrl`/`downlevelIteration`; `esModuleInterop` added by the application-builder migration. |
| `tsconfig.spec.json` | Spec tsconfig — `types: ["vitest/globals"]` (was `["jasmine"]`), so `describe`/`it`/`expect` resolve to Vitest globals. |
| `.github/workflows/ci.yml` | CI — builds and tests browserless on Node.js 24 for every push/PR to `main` or `2026-review`. |
| `.github/dependabot.yml` | Dependabot configuration for the npm ecosystem. |
| `.beads/` | Beads (`bd`) task/memory layer beneath GitHub Issues. Dolt-only sync: only `config.yaml` + `metadata.json` (+ `README.md`, `.gitignore`) are tracked; bead state syncs via `refs/dolt/data` (`bd dolt push`/`pull`). |
| `CLAUDE.md` / `AGENTS.md` | Repo-level AI-agent rules: build/test commands, architecture, and the beads workflow reconciled with git-policies (issue → branch → PR stays the shippable unit; merges human-gated). |

### Resolved Issues

| Issue | Description | PR |
|---|---|---|
| [#14](https://github.com/J-MaFf/PersonalWebsite/issues/14) | esbuild RCE (GHSA-gv7w-rqvm-qjhr, esbuild < 0.28.1) | [#15](https://github.com/J-MaFf/PersonalWebsite/pull/15) |
| [#16](https://github.com/J-MaFf/PersonalWebsite/issues/16) | Angular 21 production build broken by stale scaffold config (TS pin, tsconfig, NgModule) | [#17](https://github.com/J-MaFf/PersonalWebsite/pull/17) |
| [#18](https://github.com/J-MaFf/PersonalWebsite/issues/18) | 14 Dependabot alerts across transitive dev dependencies | [#19](https://github.com/J-MaFf/PersonalWebsite/pull/19) |
| [#20](https://github.com/J-MaFf/PersonalWebsite/issues/20) | `ng test` could not run (no browser) + stale test scaffold | [#21](https://github.com/J-MaFf/PersonalWebsite/pull/21) |
| [#22](https://github.com/J-MaFf/PersonalWebsite/issues/22) | Migrate unit tests off the legacy karma builder | [#24](https://github.com/J-MaFf/PersonalWebsite/pull/24) |
| [#23](https://github.com/J-MaFf/PersonalWebsite/issues/23) | Bump zone.js off the stale `~0.13.0` pin | [#25](https://github.com/J-MaFf/PersonalWebsite/pull/25) |
| [#54](https://github.com/J-MaFf/PersonalWebsite/issues/54) | Upgrade Angular 21 → 22 (unblocks TypeScript 6.0) | [#55](https://github.com/J-MaFf/PersonalWebsite/pull/55) |
| [#46](https://github.com/J-MaFf/PersonalWebsite/issues/46) | Security: vite / webpack-dev-server / @babel/core Dependabot alerts | [#55](https://github.com/J-MaFf/PersonalWebsite/pull/55) |
| [#56](https://github.com/J-MaFf/PersonalWebsite/issues/56) | Post-Angular-22 cleanup: application builder + clear deprecations | [#57](https://github.com/J-MaFf/PersonalWebsite/pull/57) |
| [#58](https://github.com/J-MaFf/PersonalWebsite/issues/58) | Migrate unit tests from Karma to Vitest (browserless; sheds deprecated transitives) | [#60](https://github.com/J-MaFf/PersonalWebsite/pull/60) |
| [#61](https://github.com/J-MaFf/PersonalWebsite/issues/61) | Adopt beads (`bd`) for AI task tracking | [#70](https://github.com/J-MaFf/PersonalWebsite/pull/70) |
| [#62](https://github.com/J-MaFf/PersonalWebsite/issues/62) | Serve site at apex custom domain `jmaff.dev` (CNAME + `--base-href /`) | [#68](https://github.com/J-MaFf/PersonalWebsite/pull/68) |
| [#69](https://github.com/J-MaFf/PersonalWebsite/issues/69) | DNS + Pages setup to bring jmaff.dev live (Pages enabled + custom domain + HTTPS via API) | — (no PR; settings change) |

### Open Issues

None.

## Natural Next Steps

- **Trim `app.component.css`** — at 2.8 kB it exceeds the 2 kB component-style budget, producing a non-blocking build **warning**. Either trim the styles or raise the `anyComponentStyle` budget in `angular.json`.
- Replace the placeholder `AppComponent` content and add real routes (with specs) as pages are built.

## Prerequisites to Run

- **Node.js ≥ 22.22.3** (24.x recommended; CI runs 24) and npm 10+/11+. Angular 22's CLI refuses older Node.
- Install dependencies: `npm install` (or `npm ci`).
- Develop: `npm start` (serves at `http://localhost:4200`).
- Build: `npm run build`.
- Test (browserless): `npx ng test --watch=false`. Tests run on **Vitest** in a Node.js + jsdom environment — no browser, Chromium, or Puppeteer required. The `@angular/build:unit-test` builder provides the DOM via the `jsdom` devDependency, so the suite runs identically locally, in containers, and in CI.
