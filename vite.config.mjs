import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { transformWithOxc, version as viteVersion } from 'vite';

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

export default defineConfig({
  plugins: [react(), transformJsxInJs()],
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