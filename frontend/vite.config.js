import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
 server: {
    host: true,    // 👈 Yeh add karein — network accessible
    port: 5173,
  },});