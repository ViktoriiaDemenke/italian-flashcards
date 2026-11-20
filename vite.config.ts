import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5281,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "react";
            return "vendor";
          }
          const deck = id.match(/[\\/]src[\\/]data[\\/]([^\\/]+?)(?:\.json|\.ts)$/);
          if (!deck) return undefined;
          const name = deck[1];
          if (/^b2/i.test(name)) return "deck-b2";
          if (/^b1/i.test(name)) return "deck-b1";
          if (/^a2/i.test(name)) return "deck-a2";
          return "deck-core";
        },
      },
    },
  },
});
