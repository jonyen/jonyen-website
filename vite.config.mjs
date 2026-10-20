import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { transformWithOxc, version as viteVersion } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

// Vite 8 (rolldown/oxc) only enables JSX for .jsx/.tsx files by default.
// This project uses JSX in plain .js files, so transform them as JSX first.
const transformJsxInJs = () => ({
  name: 'transform-jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!/\.js$/.test(id)) return null;
    return transformWithOxc(code, id, {
      lang: 'jsx',
      jsx: { runtime: 'automatic' },
    });
  },
});

// GitHub Pages has no SPA fallback: a direct visit to /travel would get the
// 404 page with a 404 status. Copy the app shell to <route>/index.html for each
// client-side route in src/App.js, so those URLs load the app with a 200.
const SPA_ROUTES = ['travel', 'portfolio'];
const spaRoutePages = () => ({
  name: 'spa-route-pages',
  apply: 'build',
  writeBundle({ dir }) {
    for (const route of SPA_ROUTES) {
      mkdirSync(join(dir, route), { recursive: true });
      copyFileSync(join(dir, 'index.html'), join(dir, route, 'index.html'));
    }
  },
});

export default defineConfig({
  plugins: [react(), transformJsxInJs(), spaRoutePages()],
  define: {
    __BUILD_TOOL__: JSON.stringify(`vite@${viteVersion}`),
  },
  base: '/',
  build: {
    outDir: 'build',
  },
  server: {
    port: 3000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    css: false,
  },
});