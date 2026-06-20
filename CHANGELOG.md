# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Upgraded Angular 21 → 22 across all `@angular/*` packages, `@angular-devkit/build-angular`, and `@angular/build` (`^22`), via `ng update`; adopted **TypeScript 6.0** (`~6.0.3`), superseding the standalone Dependabot bump (#53). Applied the v22 migration schematics: `ChangeDetectionStrategy.Eager` on `AppComponent` and suppressed `nullishCoalescingNotNullable`/`optionalChainNotNullable` extended diagnostics ([#54](https://github.com/J-MaFf/PersonalWebsite/issues/54)).
- Bumped CI (`.github/workflows/ci.yml`) and the local toolchain to **Node.js 24** to satisfy Angular 22's minimum-Node requirement (`^22.22.3 || ^24.15.0 || >=26.0.0`).
- Removed the `baseUrl` (no `paths` mapping) and `downlevelIteration` (no-op at the ES2022 target) compiler options from `tsconfig.json` — both are deprecated and error under TypeScript 6.0.

### Removed
- Dropped the now-redundant `vite`, `ws`, `engine.io`, and `socket.io-adapter` `overrides` pins — Angular 22 resolves each to a safe version naturally (verified: `npm audit` count unchanged). Kept the `esbuild`, `uuid`, `webpack-dev-server`, and `@babel/core` pins, which still patch transitive advisories.

### Added
- Set GitHub repository description and homepage URL via `gh repo edit` (description: "Personal portfolio website built with Angular 21, deployed to GitHub Pages"; homepage: https://j-maff.github.io/PersonalWebsite/).
- Added `.github/workflows/deploy.yml` — GitHub Pages deploy pipeline that builds with `--base-href /PersonalWebsite/` and publishes `dist/personal-website/browser` via `peaceiris/actions-gh-pages` on every push to `main` (TODO comments guide custom-domain and base-href changes).
- Added GitHub Actions CI workflow (`.github/workflows/ci.yml`) that runs `ng build` and `ng test --watch=false` on every push and PR targeting `main` or `2026-review`.
- Replaced the default Angular CLI scaffold template in `app.component.html` with a clean personal website structure: sticky header/nav, hero section, About, Projects grid, Contact, and footer. Styles moved to `app.component.css`; added `currentYear` property to the component; updated specs to cover the new sections.
- `STATUS.md` and `CHANGELOG.md` to track project state and history ([#27](https://github.com/J-MaFf/PersonalWebsite/pull/27)).

### Fixed
- Fixed invalid `dependabot.yml` `package-ecosystem` value from empty string to `"npm"` so Dependabot version updates actually run.


### Changed
- Migrated the unit-test target from the legacy `@angular-devkit/build-angular:karma` builder to `@angular/build:karma` (esbuild-based); added `@angular/build` as an explicit devDependency ([#24](https://github.com/J-MaFf/PersonalWebsite/pull/24)).

### Fixed
- Repaired the Angular 21 production build broken by stale scaffold config — TypeScript pin, `tsconfig` module resolution, and the non-standalone `AppComponent` ([#17](https://github.com/J-MaFf/PersonalWebsite/pull/17)).
- Made `ng test` runnable on a headless/no-GUI server using Puppeteer's bundled Chromium and a `ChromeHeadlessNoSandbox` launcher; fixed the stale default-scaffold render assertion and modernized `RouterTestingModule` → `provideRouter` ([#21](https://github.com/J-MaFf/PersonalWebsite/pull/21)).
- Bumped `zone.js` from `~0.13.0` to `~0.15.0` to match the Angular 21 peer range, removing the last ERESOLVE conflict so `npm install` no longer needs `--legacy-peer-deps` ([#25](https://github.com/J-MaFf/PersonalWebsite/pull/25)).

### Security
- Forced `esbuild` to `0.28.1` to resolve the development-server request vulnerability (GHSA-gv7w-rqvm-qjhr) ([#15](https://github.com/J-MaFf/PersonalWebsite/pull/15)).
- Resolved the remaining transitive Dependabot alerts (`uuid`, `webpack-dev-server`, and others) via `overrides`, bringing the repo to 0 open alerts and 0 `npm audit` vulnerabilities ([#19](https://github.com/J-MaFf/PersonalWebsite/pull/19)).

[Unreleased]: https://github.com/J-MaFf/PersonalWebsite/commits/main
