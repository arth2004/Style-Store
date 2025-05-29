import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import flowbiteReact from "flowbite-react/plugin/vite";

// import flowbitePlugin from "flowbite/plugin";
export default defineConfig({
  plugins: [tailwindcss(), react(), flowbiteReact()],
  server: {
    proxy: {
      // "/api/": "http://localhost:5000",
      // "/uploads/": "http://localhost:5000",
    },
  },
});
