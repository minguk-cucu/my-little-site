import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // Keep the existing origin so browser-local routine records remain available.
  server: { host: '127.0.0.1', port: 3000, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
