import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // port: 5000,
    proxy: {
      "/api": {
        target:  "http://localhost:8173",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // changeOrigin: true,  },
      // "/products": {
      //   target: "http://localhost:8173/products",
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      //   changeOrigin: true,  
      // },

      //   changeOrigin: true,
    },
  },
});
