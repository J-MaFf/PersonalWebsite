# Project Status

## What This Is

PersonalWebsite is an Angular 21 single-page application (originally scaffolded with Angular CLI 16 and since upgraded). It uses the NgModule-based app structure (`AppModule`, `AppRoutingModule`) with a single `AppComponent`, builds via the esbuild-based Angular application builder, and is unit-tested with Karma + Jasmine running headless Chromium.

## Current State — 2026-06-15

**Health: clean.** `main` builds and tests green, there are no open issues or PRs, and there are 0 open Dependabot alerts / 0 `npm audit` vulnerabilities. The repo installs with a plain `npm install` (no `--legacy-peer-deps` required).

### Components

| File / Area | Description |
|---|---|
| `src/app/app.module.ts` | Root NgModule — declares `AppComponent`, imports `BrowserModule` + `AppRoutingModule`. |
| `src/app/app-routing.module.ts` | Router configuration (currently an empty route table). |
| `src/app/app.component.*` | Root component (`app-root`): TypeScript, template, styles, and spec. Non-standalone (`standalone: false`). |
| `angular.json` | Build target `@angular-devkit/build-angular:browser`; test target `@angular/build:karma`. |
| `karma.conf.js` | Headless test config — resolves `CHROME_BIN` from Puppeteer's bundled Chromium and defines the `ChromeHeadlessNoSandbox` launcher. |
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

### Open Issues

None.

## Natural Next Steps

- Replace the placeholder `AppComponent` template/styles with the actual site content.
- Add real routes to `app-routing.module.ts` as pages are built, with matching specs.
- Consider the experimental `@angular/build:unit-test` (Vitest) runner if a faster, browserless unit-test loop becomes desirable (the current Karma setup works headlessly and was intentionally kept).
- Add CI (GitHub Actions) to run `ng build` + `ng test --watch=false` on every PR.

## Prerequisites to Run

- **Node.js 22.x** and npm 10.x.
- Install dependencies: `npm install`.
- Develop: `npm start` (serves at `http://localhost:4200`).
- Build: `npm run build`.
- Test (headless): `npx ng test --watch=false`. Chromium is provided by the `puppeteer` devDependency and downloaded into the Puppeteer cache on `npm install`; no system Chrome is required. On a server running as root or in a container, the `ChromeHeadlessNoSandbox` launcher in `karma.conf.js` supplies the required `--no-sandbox` flag.
