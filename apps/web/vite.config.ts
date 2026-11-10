import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// BASE_PATH is injected by the GitHub Pages workflow:
//   - "/"            for a user site   (nchimunya97.github.io)
//   - "/<repo>/"     for a project site (nchimunya97.github.io/<repo>)
const base = process.env.BASE_PATH?.replace(/\/*$/, "/") || "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: {
    target: "es2022",
    sourcemap: false,
  },
});
