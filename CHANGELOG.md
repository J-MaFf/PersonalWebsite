# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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
