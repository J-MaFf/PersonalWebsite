# Project Status

## What This Is

PersonalWebsite is an Angular 22 single-page application (originally scaffolded with Angular CLI 16 and since upgraded). It uses the NgModule-based app structure (`AppModule`, `AppRoutingModule`) with a single `AppComponent`. `build`/`serve` currently run on the legacy `@angular-devkit/build-angular:browser` (webpack) builder — now deprecated in Angular 22 — while unit tests run on the esbuild-based `@angular/build:karma` builder with Karma + Jasmine and headless Chromium.

## Current State — 2026-06-20

**Health: green.** `npm ci` resolves cleanly (no `--legacy-peer-deps`), `ng build` succeeds, and `ng test` passes 8/8 headless. The project is on **Angular 22.0.x** and **TypeScript 6.0.x**, running on **Node.js 24.x**.

`npm audit` reports 6 findings (2 moderate, 4 high), all confined to the deprecated webpack builder toolchain (`@angular-devkit/build-angular` → `webpack-dev-server` → `http-proxy-middleware`) and `@angular/build`'s `piscina`. These **pre-date the Angular 22 upgrade** (verified against the prior lockfile) and are tracked under Natural Next Steps; the application-builder migration removes most of them.

### Components

| File / Area | Description |
|---|---|
| `src/app/app.module.ts` | Root NgModule — declares `AppComponent`, imports `BrowserModule` + `AppRoutingModule`. |
| `src/app/app-routing.module.ts` | Router configuration (currently an empty route table). |
| `src/app/app.component.*` | Root component (`app-root`): TypeScript, template, styles, and spec. Non-standalone (`standalone: false`); `changeDetection: ChangeDetectionStrategy.Eager` (set by the v22 migration to preserve pre-v22 behavior). |
| `angular.json` | Build/serve target `@angular-devkit/build-angular:browser` (webpack, deprecated); test target `@angular/build:karma` (esbuild). |
| `tsconfig.json` | TS 6.0 compatible — dropped the now-removed-in-TS-7 `baseUrl` (no `paths` mapping) and `downlevelIteration` (no-op at the ES2022 target). |
| `karma.conf.js` | Headless test config — resolves `CHROME_BIN` from Puppeteer's bundled Chromium and defines the `ChromeHeadlessNoSandbox` launcher. |
| `.github/workflows/ci.yml` | CI — builds and tests headless on Node.js 24 for every push/PR to `main` or `2026-review`. |
| `.github/dependabot.yml` | Dependabot configuration for the npm ecosystem. |

### Resolved Issues

| Issue | Description | PR |
|---|---|---|
| [#14](https://github.com/J-MaFf/PersonalWebsite/issues/14) | esbuild RCE (GHSA-gv7w-rqvm-qjhr, esbuild < 0.28.1) | [#15](https://github.com/J-MaFf/PersonalWebsite/pull/15) |
| [#16](https://github.com/J-MaFf/PersonalWebsite/issues/16) | Angular 21 production build broken by stale scaffold config (TS pin, tsconfig, NgModule) | [#17](https://github.com/J-MaFf/PersonalWebsite/pull/17) |
| [#18](https://github.com/J-MaFf/PersonalWebsite/issues/18) | 14 Dependabot alerts across transitive dev dependencies | [#19](https://github.com/J-MaFf/PersonalWebsite/pull/19) |
| [#20](https://github.com/J-MaFf/PersonalWebsite/issues/20) | `ng test` could not run (no browser) + stale test scaffold | [#21](https://github.com/J-MaFf/PersonalWebsite/pull/21) |
| [#22](https://github.com/J-MaFf/PersonalWebsite/issues/22) | Migrate unit tests off the legacy karma builder | [#24](https://github.com/J-MaFf/PersonalWebsite/pull/24) |
| [#23](https://github.com/J-MaFf/PersonalWebsite/issues/23) | Bump zone.js off the stale `~0.13.0` pin | [#25](https://github.com/J-MaFf/PersonalWebsite/pull/25) |
| [#54](https://github.com/J-MaFf/PersonalWebsite/issues/54) | Upgrade Angular 21 → 22 (unblocks TypeScript 6.0) | _this PR_ |

### Open Issues

None tracked. See Natural Next Steps for deferred follow-up work (no issue filed yet).

## Natural Next Steps

- **Migrate to the application builder** (`ng update @angular/cli --name use-application-builder`) — moves `build`/`serve` off the deprecated webpack builder to `@angular/build:application` (esbuild/Vite). Clears the `http-proxy-middleware` / `webpack-dev-server` audit findings and lets the `webpack-dev-server` and `@babel/core` `overrides` pins be dropped.
- **Resolve the `piscina` RCE** — pin `piscina@^5.2.0` via `overrides` (it comes from `@angular/build`, used regardless of builder).
- **Remove unused `@angular/animations`** — present as a dependency but imported nowhere, and deprecated in v22.
- **Migrate `platformBrowserDynamic`** — `src/main.ts` uses the deprecated `@angular/platform-browser-dynamic`; switch to `@angular/platform-browser`.
- **(Optional) Karma → Vitest** (`ng update @angular/cli --name migrate-karma-to-vitest`) for a faster browserless unit-test loop. The current headless Karma setup works and was intentionally kept.
- Replace the placeholder `AppComponent` content and add real routes (with specs) as pages are built.

## Prerequisites to Run

- **Node.js ≥ 22.22.3** (24.x recommended; CI runs 24) and npm 10+/11+. Angular 22's CLI refuses older Node.
- Install dependencies: `npm install` (or `npm ci`).
- Develop: `npm start` (serves at `http://localhost:4200`).
- Build: `npm run build`.
- Test (headless): `npx ng test --watch=false`. Chromium is provided by the `puppeteer` devDependency and downloaded into the Puppeteer cache on `npm install`; no system Chrome is required. On a server running as root or in a container, the `ChromeHeadlessNoSandbox` launcher in `karma.conf.js` supplies the required `--no-sandbox` flag.
