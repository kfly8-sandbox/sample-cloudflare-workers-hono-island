import path from "path"
import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react"
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        style: "./src/style.css",
        client: "./src/client.tsx",
      },
      output: {
        dir: "./dist",
        assetFileNames: "static/[name].[ext]",
        entryFileNames: "static/[name].js",
      },
    },
    copyPublicDir: true,
    minify: true,
  }
})
