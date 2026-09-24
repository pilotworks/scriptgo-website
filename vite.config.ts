import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { resolve } from 'path';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { defineConfig, Plugin } from 'vite';

function devPrerenderPlugin(): Plugin {
  return {
    name: 'dev-prerender',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        // Skip Vite internal files, source files, static assets, and api calls
        if (
          url.startsWith('/@') ||
          url.startsWith('/src') ||
          url.startsWith('/node_modules') ||
          url.includes('.')
        ) {
          return next();
        }

        const accept = req.headers.accept || '';
        if (accept.includes('text/html')) {
          try {
            const template = fs.readFileSync(resolve(import.meta.dirname, 'index.html'), 'utf-8');
            const transformed = await server.transformIndexHtml(url, template);
            const { renderToString } = await server.ssrLoadModule('react-dom/server');
            const { App } = await server.ssrLoadModule('./src/app.tsx');
            const bodyHtml = renderToString(React.createElement(App, { initialPath: url }));
            const html = transformed
              .replace(/<body class=".*?"/, `<body class="index"`)
              .replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${bodyHtml}</div>`);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(html);
            return;
          } catch (e) {
            console.error('SSR Dev prerender error:', e);
            return next();
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    devPrerenderPlugin(),
    {
      enforce: 'pre',
      ...mdx({
        format: 'mdx',
        mdxExtensions: ['.md', '.mdx'],
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      }),
    },
    react({
      include: /\.(jsx|js|mdx|md|tsx|ts)$/,
    }),
  ],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
      },
    },
  },
});
