import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/supabase-auth': {
        target: 'https://rdnhbreuusnfvwmrecor.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-auth/, ''),
        secure: true,
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
