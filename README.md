# PersonalWebsite

A personal portfolio/website built with [Angular](https://angular.dev) (v22).

> **Work in progress.** The homepage structure is in place; personal content (bio, projects, contact) is marked with `<!-- TODO: ... -->` comments and needs to be filled in.

---

## Tech stack

| Area | Tool |
|---|---|
| Framework | Angular 22 (NgModule, non-standalone) |
| Build | Angular CLI / esbuild (`@angular/build:application`) |
| Tests | Vitest (browserless, jsdom) via `@angular/build:unit-test` |
| CI | GitHub Actions (`.github/workflows/ci.yml`) |
| Hosting | GitHub Pages at the apex custom domain [jmaff.dev](https://jmaff.dev/) (`.github/workflows/deploy.yml`) |

---

## Getting started

### Prerequisites

- **Node.js ≥ 22.22.3** (24.x recommended; CI runs 24) and npm 10+/11+

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

The site is served at the apex custom domain **<https://jmaff.dev/>**, so the GitHub Pages
build uses the root `base-href`:

```bash
npm run build -- --base-href /
```

The `src/CNAME` file (registered in `angular.json` assets) is copied into the build output
on every deploy, so the custom domain survives `keep_files: false` on each publish.

### Test

```bash
npm test -- --watch=false
```

Tests run on **Vitest** in a Node.js + jsdom environment — no browser, Chromium, or
Puppeteer required. The `@angular/build:unit-test` builder provides the DOM via the
`jsdom` devDependency, so the suite runs the same way locally, in containers, and in CI.

---

## CI / CD

| Workflow | File | Trigger |
|---|---|---|
| Build & Test | `.github/workflows/ci.yml` | Push / PR to `main` or `2026-review` |
| Deploy to GitHub Pages | `.github/workflows/deploy.yml` | Push to `main` |

To activate GitHub Pages: **Settings → Pages → Source → "Deploy from a branch" → `gh-pages`**,
then set the custom domain to `jmaff.dev` and enable **Enforce HTTPS** once the certificate
provisions (`.dev` is HSTS-preloaded, so HTTPS is mandatory).

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
