# ScriptGo Website

Official documentation and interactive WebAssembly playground for [ScriptGo](https://github.com/pilotworks/scriptgo) — an ahead-of-time compiler compiling TypeScript to native machine code via LLVM.

🌐 **Live Site:** [scriptgo.pilotworks.dev](https://scriptgo.pilotworks.dev)

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Tooling:** Vite 8, Vite Node
- **Content:** MDX (`@mdx-js/rollup`, `remark-gfm`, `rehype-slug`)
- **Editor & Playground:** CodeMirror 6, `@bjorn3/browser_wasi_shim` (WASI)
- **Code Quality:** ESLint 10 (flat config), Prettier
- **Output:** Static Site Generation (SSG) with client-side hydration

---

## Getting Started

### Prerequisites

- Node.js >= 22
- pnpm >= 10

### Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the documentation locally.

### Production Build & SSG

```bash
pnpm build
```

This compiles client bundles via Vite and pre-renders all Markdown docs into static HTML pages in `dist/`.

To preview the production output:

```bash
pnpm preview
```

---

## Code Quality

```bash
# Linting
pnpm lint          # Run ESLint
pnpm lint:fix      # Automatically fix lints & sort/clean imports

# Formatting
pnpm format:check  # Check formatting with Prettier
pnpm format        # Reformat files
```

---

## Project Structure

```text
├── .github/workflows/     # GitHub Actions deployment to Pages
├── public/                # Static assets, favicon, CNAME
├── scripts/
│   └── generate-pages.tsx # SSG generator script
├── src/
│   ├── components/        # React components (kebab-case)
│   ├── docs/              # Documentation source files (.md / .mdx)
│   ├── playground/        # Interactive WASI runner & CodeMirror editor
│   ├── app.tsx            # Main client application & TOC scroll spy
│   ├── main.tsx           # Client entrypoint
│   └── style.css          # Core CSS variables, typography, responsive layout
└── vite.config.ts         # Vite & MDX plugin configuration
```

---

## Deployment

Pushes to the `main` branch trigger `.github/workflows/deploy.yml`, which verifies formatting, lints, builds static pages, and deploys directly to GitHub Pages at `scriptgo.pilotworks.dev`.
