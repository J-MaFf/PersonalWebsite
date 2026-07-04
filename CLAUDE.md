# PersonalWebsite — Repo-Specific Rules

Inherits global rules from `/Scripts/CLAUDE.md`. Rules here override or extend globals.

---

## Build & Test

```bash
npm ci          # install (Node 24 in CI)
npm start       # dev server (ng serve)
npm run build   # production build → dist/personal-website
npm test        # unit tests — Vitest, browserless (Node + jsdom), no Chrome needed
```

- Tests run via `@angular/build:unit-test` with the Vitest runner (migrated from Karma in #60). Specs use `vitest/globals` types.
- CI (`.github/workflows/ci.yml`) runs install → build → test on every push/PR to `main`; `deploy.yml` publishes to GitHub Pages on merge to `main`.

## Architecture Overview

Single-page Angular 22 (TypeScript 6) personal website. Application code lives in `src/app/` (standalone `AppComponent`), built with the `@angular/build` application builder and deployed to GitHub Pages.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:6cd5cc61 -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for task tracking in this repo — prefer it over ephemeral `TodoWrite`/`TaskCreate` for multi-step or cross-session work. A **GitHub Issue stays the shippable unit** (branch → PR → `Fixes #N`); beads are the execution layer underneath.
- Run `bd prime` for the full command reference.
- Use `bd remember` for **repo-scoped** knowledge that should travel with this repo. Cross-repo / user-level context still lives in the global Claude memory system — `bd remember` does **not** replace it.

**Architecture in one line:** issues live in a local Dolt DB; sync uses `refs/dolt/data` on your git remote; `.beads/issues.jsonl` is a passive export. See https://github.com/gastownhall/beads/blob/main/docs/SYNC_CONCEPTS.md for details and anti-patterns.

## Session Completion

> **Reconciled with the `git-policies` skill.** Beads guards durability/sync; git-policies governs what lands on `main`. These steps make work durable **without** auto-merging.

When ending a work session:

1. **File follow-ups** — beads for sub-tasks; a GitHub issue for anything shippable.
2. **Run quality gates** (if code changed) — tests, linters, build.
3. **Update bead status** — close finished beads, update in-progress ones.
4. **Make work durable (do NOT merge to `main`):**
   ```bash
   git add <files> && git commit -S -m "..."   # signed, per git-policies
   git push -u origin <feature-branch>          # push the FEATURE branch, never main
   bd dolt push                                 # sync beads state (refs/dolt/data)
   ```
5. **Open / update the PR** — `Fixes #N`, `--assignee J-MaFf`, label; self-review the diff.
6. **Stop at the gate** — merging to `main` is **human-approved via PR**. Never auto-merge.

See the `git-policies` skill for the full issue → branch → PR → squash-merge workflow.
<!-- END BEADS INTEGRATION -->
