import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // 👇 Base pública (ruta donde se servirá en producción)
  base: "/MigraAPP/",

  // 🔧 Plugins de Vite
  plugins: [
    react(),
    // Solo usar componentTagger en desarrollo
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  // ⚙️ Configuración del servidor de desarrollo
  server: {
    host: true, // Escucha todas las interfaces (0.0.0.0)
    port: 8080,
    hmr: {
      host: "localhost", // Cambiar si accedes desde otra máquina
      protocol: "ws",
      port: 8080,
    },
  },

  // 🧭 Alias para imports limpios
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
