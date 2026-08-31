import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Honor the PORT assigned by the Claude Code managed preview (autoPort).
    // Falls back to Vite's default when PORT is unset (e.g. `npm run dev`).
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
    // Mirror the `/ingest` PostHog rewrites from vercel.json so dev and prod
    // take the same code path — a broken proxy shows up locally instead of
    // only in production, where it looks like "no visitors".
    proxy: {
      '/ingest/static': {
        target: 'https://us-assets.i.posthog.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ingest/, ''),
      },
      '/ingest': {
        target: 'https://us.i.posthog.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/ingest/, ''),
      },
    },
  },
  // No manualChunks: MapSection is lazily imported, so the bundler already
  // splits Leaflet and the map code into an async chunk on that boundary —
  // manual vendor chunks were pulling shared modules back into the eager load.
})
