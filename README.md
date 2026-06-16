# PersonalWebsite

A personal portfolio/website built with [Angular](https://angular.dev) (v21).

> **Work in progress.** The homepage structure is in place; personal content (bio, projects, contact) is marked with `<!-- TODO: ... -->` comments and needs to be filled in.

---

## Tech stack

| Area | Tool |
|---|---|
| Framework | Angular 21 (NgModule, non-standalone) |
| Build | Angular CLI / esbuild (`@angular-devkit/build-angular`) |
| Tests | Karma + Jasmine + headless Chromium (via Puppeteer) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) |
| Hosting | GitHub Pages (`.github/workflows/deploy.yml`) |

---

## Getting started

### Prerequisites

- **Node.js 22.x** and npm 10.x

### Install

```bash
npm install
```

### Develop

```bash
npm start
```

Opens `http://localhost:4200/`. The app reloads automatically on file changes.

### Build

```bash
npm run build
```

Output is written to `dist/personal-website/`.

For a GitHub Pages build (sets the correct `base-href`):

```bash
npm run build -- --base-href /PersonalWebsite/
```

### Test

```bash
npm test -- --watch=false --browsers=ChromeHeadlessNoSandbox
```

Chromium is bundled by the `puppeteer` devDependency — no system Chrome required.
On Linux without a sandbox (e.g. a Docker container or GitHub Actions),
the `ChromeHeadlessNoSandbox` launcher in `karma.conf.js` adds `--no-sandbox` automatically.

---

## CI / CD

| Workflow | File | Trigger |
|---|---|---|
| Build & Test | `.github/workflows/ci.yml` | Push / PR to `main` or `2026-review` |
| Deploy to GitHub Pages | `.github/workflows/deploy.yml` | Push to `main` |

To activate GitHub Pages: **Settings → Pages → Source → "Deploy from a branch" → `gh-pages`**.

---

## Customising content

All placeholder copy in `src/app/app.component.html` is marked with `<!-- TODO: ... -->` comments.
Replace them with your real name, bio, projects, and contact links.
The colour theme lives in CSS custom properties at the top of `src/app/app.component.css`.

---

## Project structure

```
src/
  app/
    app.component.html    # Homepage template (hero, about, projects, contact)
    app.component.css     # Scoped styles with CSS custom properties
    app.component.ts      # Root component
    app.component.spec.ts # Unit tests
    app.module.ts         # Root NgModule
    app-routing.module.ts # Router configuration
  index.html
  main.ts
  styles.css              # Global styles
.github/
  workflows/
    ci.yml                # Build + test on every push/PR
    deploy.yml            # Deploy to GitHub Pages on push to main
  dependabot.yml          # Weekly npm dependency updates
```
