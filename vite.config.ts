import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // Make the tiptap CLI generated `@` folder available via `@/...` imports
      { find: "@", replacement: resolve(__dirname, "@") },
    ],
  },
});
