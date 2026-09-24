import React, { useCallback, useEffect, useState } from 'react';

import { Layout } from './components/layout';
import { mdxComponents } from './components/mdx-components';
import CliReferenceDoc from './docs/cli-reference.md';
import CompatibilityDoc from './docs/compatibility.md';
import CoverageReportsDoc from './docs/coverage-reports.md';
import CrossCompilationDoc from './docs/cross-compilation.md';
import FfiDoc from './docs/ffi.md';
import GettingStartedDoc from './docs/getting-started.md';
import HowItWorksDoc from './docs/how-it-works.md';
import LimitationsDoc from './docs/limitations.md';
import NpmDependenciesDoc from './docs/npm-dependencies.md';
import OverviewDoc from './docs/overview.md';
import StdlibDoc from './docs/stdlib.md';

interface RouteDefinition {
  path: string;
  title: string;
  component: React.ComponentType<{ components?: Record<string, React.ComponentType<any>> }>;
}

const routes: RouteDefinition[] = [
  { path: '/', title: 'ScriptGo — TypeScript Native Compiler', component: OverviewDoc },
  { path: '/getting-started/', title: 'Getting Started — ScriptGo', component: GettingStartedDoc },
  { path: '/how-it-works/', title: 'How It Works — ScriptGo', component: HowItWorksDoc },
  {
    path: '/compatibility/',
    title: 'Compatibility Matrix — ScriptGo',
    component: CompatibilityDoc,
  },
  {
    path: '/coverage-reports/',
    title: 'Coverage Reports — ScriptGo',
    component: CoverageReportsDoc,
  },
  {
    path: '/npm-dependencies/',
    title: 'npm Dependencies — ScriptGo',
    component: NpmDependenciesDoc,
  },
  { path: '/stdlib/', title: 'Standard Library & Web APIs — ScriptGo', component: StdlibDoc },
  { path: '/ffi/', title: 'Foreign Function Interface (FFI) — ScriptGo', component: FfiDoc },
  { path: '/limitations/', title: 'Limitations — ScriptGo', component: LimitationsDoc },
  {
    path: '/cross-compilation/',
    title: 'Cross-Compilation — ScriptGo',
    component: CrossCompilationDoc,
  },
  { path: '/cli-reference/', title: 'CLI Reference — ScriptGo', component: CliReferenceDoc },
];

function normalizePath(p: string): string {
  if (!p || p === '/') return '/';
  let res = p;
  if (!res.startsWith('/')) res = '/' + res;
  if (!res.endsWith('/')) res = res + '/';
  return res;
}

export interface AppProps {
  initialPath?: string;
}

export const App: React.FC<AppProps> = ({ initialPath }) => {
  const [pathname, setPathname] = useState(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return normalizePath(initialPath || '/');
  });

  const [hash, setHash] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash;
    }
    return '';
  });

  const scrollToHash = useCallback((targetHash: string) => {
    if (!targetHash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }
    const id = targetHash.replace(/^#/, '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const navigate = useCallback(
    (url: string, pushHistory = true) => {
      try {
        const u = new URL(url, window.location.origin);
        const nextPath = normalizePath(u.pathname);
        const nextHash = u.hash;

        setPathname(nextPath);
        setHash(nextHash);

        if (pushHistory) {
          window.history.pushState(null, '', url);
        }

        const match = routes.find((r) => normalizePath(r.path) === nextPath);
        if (match) {
          document.title = match.title;
        }

        if (nextHash) {
          setTimeout(() => scrollToHash(nextHash), 30);
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      } catch {
        window.location.href = url;
      }
    },
    [scrollToHash]
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.className = 'index';
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPathname(normalizePath(window.location.pathname));
      setHash(window.location.hash);
      if (window.location.hash) {
        setTimeout(() => scrollToHash(window.location.hash), 30);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [scrollToHash]);

  useEffect(() => {
    // Initial scroll on load
    if (window.location.hash) {
      setTimeout(() => scrollToHash(window.location.hash), 50);
    }
  }, [scrollToHash]);

  // Scroll spy to highlight only the section currently in view
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const targets = Array.from(document.querySelectorAll<HTMLElement>('h2[id], figure[id]'));
        if (targets.length === 0) return;

        const scrollPos = window.scrollY + 120;
        let activeId = '';
        for (const el of targets) {
          if (el.offsetTop <= scrollPos) {
            activeId = el.id;
          } else {
            break;
          }
        }

        if (activeId) {
          const nextHash = `#${activeId}`;
          setHash((prev) => (prev === nextHash ? prev : nextHash));
        } else if (window.scrollY < 80) {
          setHash('');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Intercept global internal link clicks inside markdown content
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return;
      }

      e.preventDefault();
      navigate(href);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [navigate]);

  const activeRoute = routes.find((r) => normalizePath(r.path) === pathname) || routes[0];
  const Component = activeRoute.component;

  return (
    <Layout currentPath={pathname} currentHash={hash} onNavigate={navigate}>
      <Component components={mdxComponents} />
    </Layout>
  );
};
