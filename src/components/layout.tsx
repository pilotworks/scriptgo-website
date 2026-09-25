import React, { useState } from 'react';

import { ThemeToggle } from './theme-toggle';

export interface NavItem {
  path: string;
  title: string;
  subItems?: { hash: string; title: string }[];
}

export const navItems: NavItem[] = [
  {
    path: '/',
    title: 'Overview',
    subItems: [
      { hash: '#benchmarks', title: 'Benchmarks' },
      { hash: '#why-scriptgo', title: 'Why ScriptGo?' },
      { hash: '#try-it-out', title: 'Try It Out' },
    ],
  },
  {
    path: '/getting-started/',
    title: 'Getting Started',
    subItems: [
      { hash: '#installation', title: 'Installation' },
      { hash: '#first-native-binary', title: 'First native binary' },
    ],
  },
  {
    path: '/how-it-works/',
    title: 'How It Works',
    subItems: [
      { hash: '#compilation-pipeline', title: 'Compilation pipeline' },
      { hash: '#typescript-go-frontend', title: 'TypeScript-Go frontend' },
      { hash: '#middle-end-ssa-optimizer', title: 'Middle-end SSA optimizer' },
      { hash: '#memory--runtime-model', title: 'Memory & runtime model' },
    ],
  },
  {
    path: '/compatibility/',
    title: 'Compatibility Matrix',
    subItems: [
      { hash: '#433-corpus-tests', title: '433 Corpus tests' },
      { hash: '#compilation-tiers', title: 'Compilation tiers' },
      { hash: '#diagnostic-codes-sgxxxx', title: 'Diagnostic codes (SGxxxx)' },
    ],
  },
  {
    path: '/coverage-reports/',
    title: 'Coverage Reports',
    subItems: [
      { hash: '#whole-program-audit', title: 'Whole-program audit' },
      { hash: '#cli-commands--flags', title: 'CLI commands & flags' },
      { hash: '#json-schema-format', title: 'JSON schema format' },
      { hash: '#cicd-quality-gates', title: 'CI/CD quality gates' },
    ],
  },
  {
    path: '/npm-dependencies/',
    title: 'npm Dependencies',
    subItems: [
      { hash: '#zero-copy-package-manager', title: 'Zero-copy package manager' },
      { hash: '#supply-chain-safety', title: 'Supply-chain safety' },
    ],
  },
  {
    path: '/stdlib/',
    title: 'Standard Library & Web APIs',
    subItems: [
      { hash: '#the-4-tier-model', title: 'The 4-tier model' },
      { hash: '#100-parity-node-modules', title: '100% Parity Node modules' },
      { hash: '#web-standards-wintercg', title: 'Web standards (WinterCG)' },
      { hash: '#whatwg-fetch-and-formdata', title: 'Fetch & FormData' },
      { hash: '#whatwg-urlpattern', title: 'URLPattern' },
    ],
  },
  {
    path: '/ffi/',
    title: 'Foreign Function Interface (FFI)',
    subItems: [
      { hash: '#direct-c-linkage', title: 'Direct C linkage' },
      { hash: '#version-locked-manifests', title: 'Version-locked manifests' },
    ],
  },
  {
    path: '/limitations/',
    title: 'Limitations',
    subItems: [
      { hash: '#aot-design-rationale', title: 'AOT design rationale' },
      { hash: '#type-system-fences', title: 'Type system fences' },
      { hash: '#restricted-dynamic-features', title: 'Restricted dynamic features' },
      { hash: '#deliberate-semantic-divergences', title: 'Semantic divergences' },
      { hash: '#wasi-sandbox-fences', title: 'WASI sandbox fences' },
    ],
  },
  {
    path: '/cross-compilation/',
    title: 'Cross-Compilation',
    subItems: [
      { hash: '#webassembly-wasi', title: 'WebAssembly (WASI)' },
      { hash: '#zig-cc-multi-target', title: 'Zig CC multi-target' },
    ],
  },
  {
    path: '/cli-reference/',
    title: 'CLI Reference',
    subItems: [
      { hash: '#command-overview', title: 'Command overview' },
      { hash: '#direct-execution--scg-alias', title: 'Direct execution & scg alias' },
      { hash: '#scriptgo-build', title: 'scriptgo build' },
      { hash: '#scriptgo-run', title: 'scriptgo run' },
      { hash: '#scriptgo-add', title: 'scriptgo add' },
      { hash: '#scriptgo-check', title: 'scriptgo check' },
      { hash: '#scriptgo-emit', title: 'scriptgo emit' },
      { hash: '#scriptgo-coverage', title: 'scriptgo coverage' },
      { hash: '#package-manager-commands', title: 'Package manager commands' },
      { hash: '#global-flags--env', title: 'Global flags & env' },
    ],
  },
];

interface LayoutProps {
  currentPath: string;
  currentHash: string;
  onNavigate: (url: string) => void;
  children: React.ReactNode;
}

const headingAliases: Record<string, string> = {
  '#install': '#installation',
  '#quick-build': '#first-native-binary',
  '#pipeline': '#compilation-pipeline',
  '#overview': '#command-overview',
  '#build': '#scriptgo-build',
  '#run': '#scriptgo-run',
  '#add': '#scriptgo-add',
  '#scg': '#direct-execution--scg-alias',
  '#check': '#scriptgo-check',
  '#emit': '#scriptgo-emit',
  '#coverage': '#scriptgo-coverage',
  '#corpus-tests': '#433-corpus-tests',
  '#394-corpus-tests': '#433-corpus-tests',
};

function normalizeHash(h: string): string {
  if (!h) return '';
  return headingAliases[h] || h;
}

export const Layout: React.FC<LayoutProps> = ({
  currentPath,
  currentHash,
  onNavigate,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const normalize = (p: string) => {
    if (!p || p === '/') return '/';
    let res = p;
    if (!res.startsWith('/')) res = '/' + res;
    if (!res.endsWith('/')) res = res + '/';
    return res;
  };

  const normCurrent = normalize(currentPath);
  const activeHash = normalizeHash(currentHash);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(href);
  };

  return (
    <>
      {/* Mobile Bar */}
      <div id="mobile-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 256 256"
            fill="currentColor"
            style={{ color: 'var(--fg-on)' }}
          >
            <path d="M39 52.6586L116.48 8.68331C118.39 7.58055 120.557 7 122.762 7C124.968 7 127.135 7.58055 129.045 8.68331L207.572 53.7056C210.501 55.3957 212.922 57.8428 214.58 60.7903C216.238 63.7378 217.072 67.0771 216.995 70.4581V132.233C217.072 135.614 216.238 138.953 214.58 141.901C212.922 144.848 210.501 147.295 207.572 148.985L129.672 194.036C125.672 196.349 120.668 193.463 120.668 188.842V148.985L176.161 116.527C177.445 115.786 178.51 114.717 179.246 113.429C179.982 112.141 180.362 110.681 180.349 109.198V88.2576C180.362 86.7746 179.982 85.3146 179.246 84.0268C178.51 82.7391 177.445 81.6699 176.161 80.9284L126.951 52.6586C125.677 51.9234 124.233 51.5364 122.762 51.5364C121.292 51.5364 119.848 51.9234 118.574 52.6586L86.1164 71.5051C84.6838 72.3322 83.0589 72.7676 81.4047 72.7676C79.7506 72.7676 78.1256 72.3322 76.6931 71.5051L39 52.6586Z" />
            <path d="M39.0001 126.998C39.0706 124.862 39.6845 122.78 40.7837 120.948C41.883 119.116 43.4313 117.595 45.2823 116.527L120.668 72.5521V119.355C120.668 121.494 119.53 123.47 117.681 124.544L88.2105 141.656C86.3595 142.723 84.8112 144.245 83.712 146.077C82.6127 147.909 81.9988 149.991 81.9283 152.126L81.9282 219.535C81.9282 221.665 80.7982 223.636 78.9593 224.713L39 248.104L39.0001 126.998Z" />
          </svg>
          <strong>ScriptGo</strong>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <ThemeToggle />
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              color: 'inherit',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Left Sidebar Navigation */}
      <nav className={mobileMenuOpen ? 'mobile-open' : ''}>
        <div id="menu">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <a
              href="/"
              onClick={(e) => handleLinkClick(e, '/')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 256 256"
                fill="currentColor"
                style={{ flexShrink: 0, color: 'var(--fg-on)' }}
              >
                <path d="M39 52.6586L116.48 8.68331C118.39 7.58055 120.557 7 122.762 7C124.968 7 127.135 7.58055 129.045 8.68331L207.572 53.7056C210.501 55.3957 212.922 57.8428 214.58 60.7903C216.238 63.7378 217.072 67.0771 216.995 70.4581V132.233C217.072 135.614 216.238 138.953 214.58 141.901C212.922 144.848 210.501 147.295 207.572 148.985L129.672 194.036C125.672 196.349 120.668 193.463 120.668 188.842V148.985L176.161 116.527C177.445 115.786 178.51 114.717 179.246 113.429C179.982 112.141 180.362 110.681 180.349 109.198V88.2576C180.362 86.7746 179.982 85.3146 179.246 84.0268C178.51 82.7391 177.445 81.6699 176.161 80.9284L126.951 52.6586C125.677 51.9234 124.233 51.5364 122.762 51.5364C121.292 51.5364 119.848 51.9234 118.574 52.6586L86.1164 71.5051C84.6838 72.3322 83.0589 72.7676 81.4047 72.7676C79.7506 72.7676 78.1256 72.3322 76.6931 71.5051L39 52.6586Z" />
                <path d="M39.0001 126.998C39.0706 124.862 39.6845 122.78 40.7837 120.948C41.883 119.116 43.4313 117.595 45.2823 116.527L120.668 72.5521V119.355C120.668 121.494 119.53 123.47 117.681 124.544L88.2105 141.656C86.3595 142.723 84.8112 144.245 83.712 146.077C82.6127 147.909 81.9988 149.991 81.9283 152.126L81.9282 219.535C81.9282 221.665 80.7982 223.636 78.9593 224.713L39 248.104L39.0001 126.998Z" />
              </svg>
              <div>
                <strong
                  style={{
                    fontSize: '18px',
                    color: 'var(--fg-on)',
                    display: 'block',
                    lineHeight: 1.1,
                  }}
                >
                  ScriptGo
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--fg)', fontStyle: 'italic' }}>
                  v0.1.0-alpha.7
                </span>
              </div>
            </a>
          </div>

          <ul>
            {navItems.map((item) => {
              const isPageActive = normCurrent === normalize(item.path);
              return (
                <li key={item.path} className={isPageActive ? 'current' : ''}>
                  <a href={item.path} onClick={(e) => handleLinkClick(e, item.path)}>
                    {item.title}
                  </a>
                  {item.subItems && item.subItems.length > 0 && (
                    <ul className="h2">
                      {item.subItems.map((sub) => {
                        const fullHref = `${item.path}${sub.hash}`;
                        const isSubActive = isPageActive && activeHash === sub.hash;
                        return (
                          <li key={sub.hash} className={isSubActive ? 'current' : ''}>
                            <a href={fullHref} onClick={(e) => handleLinkClick(e, fullHref)}>
                              {sub.title}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div id="icons">
            <a
              href="https://github.com/pilotworks/scriptgo"
              aria-label="View on GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 25 25"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  strokeWidth="0"
                  d="M13 5a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.42 7.42 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0021 13a8 8 0 00-8-8z"
                />
              </svg>
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="app-main">
        {children}

        <footer
          style={{
            marginTop: '60px',
            paddingTop: '20px',
            borderTop: '1px solid var(--td)',
            fontSize: '13px',
            color: 'var(--fg)',
            fontStyle: 'italic',
          }}
        >
          ScriptGo is an open-source project licensed under MIT. Source code and releases available
          on{' '}
          <a
            href="https://github.com/pilotworks/scriptgo"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </footer>
      </main>
    </>
  );
};
