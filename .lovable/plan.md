## Goal
Add a polished `README.md` and an MIT `LICENSE` file at the project root, suitable for the public GitHub repository.

## Files to create / update

### 1. `README.md` (replace existing)
The current README is just 3 short paragraphs. Expand it into a proper GitHub-ready README with these sections:

- **Title + tagline** — "Triglav's Oracle — a three-headed Wikipedia rabbit hole"
- **Live demo** — link to https://triglav-wisdom-trails.lovable.app
- **Screenshot placeholder** — `![Triglav's Oracle](./public/screenshot.png)` (note in plan: user can drop one in later)
- **The concept** — short explanation of the three heads:
  - Svarog's Forge — celestial / creation / beauty
  - Perun's Strike — direct / grounded / mainstream
  - Veles' Depths — shadowy / sideways / occult
- **How it works** — describes the Wikipedia API calls (MediaWiki `action=query&list=search` + REST `page/summary`), keyword-skewing per path, no backend, no storage, fully client-side
- **Tech stack** — Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Getting started** — clone, `bun install` (or `npm install`), `bun dev`
- **Scripts** — `dev`, `build`, `preview`, `test`
- **Project structure** — short tree of `src/components`, `src/lib/wikipedia.ts`, `src/pages`
- **Credits** — built with Lovable, inspired by Slavic mythology
- **License** — MIT, link to `LICENSE`

### 2. `LICENSE` (new)
Standard MIT License text, year `2026`, copyright holder placeholder — see Open Question below.

## Open question
What name should appear on the MIT copyright line? Options:
- Your GitHub username / real name
- "Triglav's Oracle contributors"
- Leave as a placeholder `<YOUR NAME>` for you to fill in

If you don't specify, I'll use `Triglav's Oracle contributors`.
