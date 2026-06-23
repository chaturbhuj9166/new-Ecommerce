import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // NOTE: No dev proxy here on purpose.
    // All API calls use an absolute baseURL (axiosConfig.js -> http://localhost:5000),
    // so a proxy is unnecessary. A proxy on prefixes like "/admin" and "/product"
    // would hijack the client-side routes (/admin/login, /product/:slug) and send
    // them to the backend, which 404s instead of letting React Router render them.
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
})
