import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderToString } from 'react-dom/server';

import { App } from '../src/app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

interface PageRoute {
  slug: string;
  path: string;
  title: string;
  description: string;
}

const pages: PageRoute[] = [
  {
    slug: '',
    path: '/',
    title: 'ScriptGo — TypeScript Native Compiler',
    description:
      'Ahead-Of-Time compiler compiling TypeScript directly to native binaries with Microsoft TypeScript-Go frontend.',
  },
  {
    slug: 'getting-started',
    path: '/getting-started/',
    title: 'Getting Started — ScriptGo',
    description:
      'Get started with ScriptGo in under 60 seconds. Installation, toolchain prerequisites, and compiling your first native binary.',
  },
  {
    slug: 'how-it-works',
    path: '/how-it-works/',
    title: 'How It Works — ScriptGo',
    description:
      'Learn about the Microsoft TypeScript-Go frontend, Typed IR middle-end SSA optimizer, and LLVM code generator in ScriptGo.',
  },
  {
    slug: 'compatibility',
    path: '/compatibility/',
    title: 'Compatibility Matrix — ScriptGo',
    description:
      '394 Corpus tests, 100% core subset parity, compilation tiers, and exhaustive SGxxxx diagnostic catalog.',
  },
  {
    slug: 'coverage-reports',
    path: '/coverage-reports/',
    title: 'Coverage Reports — ScriptGo',
    description:
      'Whole-program static/dynamic compatibility inspection, CLI reference, JSON schema, and CI/CD quality gates.',
  },
  {
    slug: 'npm-dependencies',
    path: '/npm-dependencies/',
    title: 'npm Dependencies — ScriptGo',
    description:
      'Zero-copy, lockfile-deterministic package manager compatible with the npm registry.',
  },
  {
    slug: 'stdlib',
    path: '/stdlib/',
    title: 'Standard Library & Web APIs — ScriptGo',
    description:
      'Supported Node.js core modules (node:fs, node:path, node:crypto) and WHATWG Web APIs.',
  },
  {
    slug: 'ffi',
    path: '/ffi/',
    title: 'Foreign Function Interface (FFI) — ScriptGo',
    description:
      'Call native C and system libraries with zero wrapper overhead via declare function and *.ffi.json.',
  },
  {
    slug: 'limitations',
    path: '/limitations/',
    title: 'Limitations — ScriptGo',
    description:
      'Deliberate static restrictions, AOT design rationale, type system fences, and semantic divergences.',
  },
  {
    slug: 'cross-compilation',
    path: '/cross-compilation/',
    title: 'Cross-Compilation — ScriptGo',
    description:
      'Compile to WebAssembly (WASI) or cross-compile to Linux, macOS, and Windows with Zig CC.',
  },
  {
    slug: 'cli-reference',
    path: '/cli-reference/',
    title: 'CLI Reference — ScriptGo',
    description:
      'Complete reference for ScriptGo CLI commands, flags, examples, and environment variables.',
  },
];

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Use built dist/index.html if available, fallback to root index.html
const templateFile = fs.existsSync(path.join(distDir, 'index.html'))
  ? path.join(distDir, 'index.html')
  : path.join(rootDir, 'index.html');

const templateHtml = fs.readFileSync(templateFile, 'utf8');

for (const page of pages) {
  const bodyHtml = renderToString(<App initialPath={page.path} />);

  const pageHtml = templateHtml
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${page.title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
      `<meta name="description" content="${page.description}" />`
    )
    .replace(/<body class=".*?"/, `<body class="index"`)
    .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${bodyHtml}</div>`);

  let targetDir = distDir;
  if (page.slug) {
    targetDir = path.join(distDir, page.slug);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  }

  const targetPath = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetPath, pageHtml, 'utf8');
  console.log(`Generated React SSG: ${targetPath.replace(rootDir, '')}`);
}

console.log('All React static pages generated successfully in dist/.');

const distSsrDir = path.resolve(rootDir, 'dist-ssr');
if (fs.existsSync(distSsrDir)) {
  fs.rmSync(distSsrDir, { recursive: true, force: true });
}
