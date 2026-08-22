import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Honor the PORT assigned by the Claude Code managed preview (autoPort).
    // Falls back to Vite's default when PORT is unset (e.g. `npm run dev`).
    port: process.env.PORT ? Number(process.env.PORT) : undefined,
  },
  // No manualChunks: MapSection is lazily imported, so the bundler already
  // splits Leaflet and the map code into an async chunk on that boundary —
  // manual vendor chunks were pulling shared modules back into the eager load.
})
