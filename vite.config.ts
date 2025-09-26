import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // Listen on all interfaces so the dev server is reachable from localhost and other LAN hosts
    host: true,
    port: 8080,
    // HMR websocket options — ensure the client connects to the right host/protocol/port
    hmr: {
      // leave host as 'localhost' for browser connections from the same machine;
      // if you access the app from other devices in the LAN set this to your machine IP (e.g. '192.168.1.100')
      host: 'localhost',
      protocol: 'ws',
      port: 8080,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
