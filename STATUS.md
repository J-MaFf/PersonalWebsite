# Project Status

## What This Is

PersonalWebsite is an Angular 22 single-page application (originally scaffolded with Angular CLI 16 and since upgraded). It uses the NgModule-based app structure (`AppModule`, `AppRoutingModule`) with a single `AppComponent`. The entire toolchain now runs on the modern esbuild/Vite-based `@angular/build` builders — `build` on `@angular/build:application`, `serve` on `@angular/build:dev-server`, and unit tests on `@angular/build:karma` (Karma + Jasmine, headless Chromium). The legacy `@angular-devkit/build-angular` webpack builder has been removed.

## Current State — 2026-06-20

**Health: green.** `npm ci` resolves cleanly (no `--legacy-peer-deps`), `ng build` succeeds on the application builder (no deprecation notice), and `ng test` passes 8/8 headless. The project is on **Angular 22.0.x** and **TypeScript 6.0.x**, running on **Node.js 24.x**.

**`npm audit` reports 0 vulnerabilities.** Migrating off the webpack builder removed the entire `webpack-dev-server` → `http-proxy-middleware` chain and shrank the dependency tree from ~970 to ~550 packages; the remaining `piscina` RCE is patched via an `overrides` pin to `^5.2.0`. The `esbuild` and `@babel/core` pins remain load-bearing (their parents pin exact vulnerable versions — `@angular/build`/`compiler-cli` pin `@babel/core` to 7.29.0); the now-dead `webpack-dev-server` and `uuid` pins were dropped.

### Components

| File / Area | Description |
|---|---|
| `src/app/app.module.ts` | Root NgModule — declares `AppComponent`, imports `BrowserModule` + `AppRoutingModule`. |
| `src/app/app-routing.module.ts` | Router configuration (currently an empty route table). |
| `src/app/app.component.*` | Root component (`app-root`): TypeScript, template, styles, and spec. Non-standalone (`standalone: false`); `changeDetection: ChangeDetectionStrategy.Eager` (set by the v22 migration to preserve pre-v22 behavior). |
| `src/main.ts` | Bootstraps `AppModule` via `platformBrowser()` from `@angular/platform-browser` (migrated off the deprecated `platformBrowserDynamic`). |
| `angular.json` | All targets on `@angular/build` — `build` → `:application`, `serve` → `:dev-server`, `test` → `:karma` (esbuild/Vite). |
| `tsconfig.json` | TS 6.0 compatible — dropped `baseUrl`/`downlevelIteration`; `esModuleInterop` added by the application-builder migration. |
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
| [#54](https://github.com/J-MaFf/PersonalWebsite/issues/54) | Upgrade Angular 21 → 22 (unblocks TypeScript 6.0) | [#55](https://github.com/J-MaFf/PersonalWebsite/pull/55) |
| [#46](https://github.com/J-MaFf/PersonalWebsite/issues/46) | Security: vite / webpack-dev-server / @babel/core Dependabot alerts | [#55](https://github.com/J-MaFf/PersonalWebsite/pull/55) |
| [#56](https://github.com/J-MaFf/PersonalWebsite/issues/56) | Post-Angular-22 cleanup: application builder + clear deprecations | _this PR_ |

### Open Issues

None tracked. See Natural Next Steps for deferred follow-up work (no issue filed yet).

## Natural Next Steps

- **(Optional) Karma → Vitest** (`ng update @angular/cli --name migrate-karma-to-vitest`) for a faster browserless unit-test loop. This also sheds the last deprecated transitive deps (`inflight`/`glob`/`rimraf`), which now come only from Karma. The current headless Karma setup works and was intentionally kept.
- **Trim `app.component.css`** — at 2.8 kB it exceeds the 2 kB component-style budget, producing a non-blocking build **warning**. Either trim the styles or raise the `anyComponentStyle` budget in `angular.json`.
- Replace the placeholder `AppComponent` content and add real routes (with specs) as pages are built.

## Prerequisites to Run

- **Node.js ≥ 22.22.3** (24.x recommended; CI runs 24) and npm 10+/11+. Angular 22's CLI refuses older Node.
- Install dependencies: `npm install` (or `npm ci`).
- Develop: `npm start` (serves at `http://localhost:4200`).
- Build: `npm run build`.
- Test (headless): `npx ng test --watch=false`. Chromium is provided by the `puppeteer` devDependency and downloaded into the Puppeteer cache on `npm install`; no system Chrome is required. On a server running as root or in a container, the `ChromeHeadlessNoSandbox` launcher in `karma.conf.js` supplies the required `--no-sandbox` flag.
