import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite root = project root (knowledge/), so regulations/ lives inside the root
// and can be bundled at build time via import.meta.glob('/regulations/*.json').
export default defineConfig({
  plugins: [react()],
  server: {
    // Honor the PORT env (e.g. preview harness assigns one); fall back to 5173.
    port: Number(process.env.PORT) || 5173,
    fs: {
      // Allow Vite to read the regulations/ data dir at the project root.
      allow: ['.'],
    },
  },
})
