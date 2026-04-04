import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/product": "http://localhost:5000",
      "/user": "http://localhost:5000",
      "/admin": "http://localhost:5000",
      "/cart": "http://localhost:5000",
      "/check": "http://localhost:5000",
      "/coupon": "http://localhost:5000",
      "/category": "http://localhost:5000",
      "/chat": "http://localhost:5000",
      "/api": "http://localhost:5000",
      "/uploads": "http://localhost:5000",
    },
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
})
