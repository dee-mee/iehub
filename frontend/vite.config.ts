import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// When running inside Docker the backend is reachable via the service name.
// Outside Docker (plain `npm run dev`) it lives on localhost:8000.
const BACKEND_PROXY_TARGET =
  process.env.BACKEND_URL ?? 'http://localhost:8000'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      // All /api/* and /media/* calls are forwarded to the Django backend.
      // The browser always talks to the Vite dev server on :5173 — no
      // cross-origin issues and no need to hard-code the backend port.
      '/api': {
        target: BACKEND_PROXY_TARGET,
        changeOrigin: true,
      },
      '/media': {
        target: BACKEND_PROXY_TARGET,
        changeOrigin: true,
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
