import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import the undestructure plugin (properly this time! )
import { undestructurePlugin } from "babel-plugin-solid-undestructure"


// https://vitejs.dev/config/'
export default defineConfig(async () => ({
  plugins: [solidPlugin(
   {
    babel: {
      plugins: [undestructurePlugin("vanilla-js")]
    } 
   }
  )],
      

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  build:
  {
    // 4. tauri expects the output to be in `dist` and not `build`
    outDir: "dist",
    rollupOptions:
    {
      input:
      {
        index: "index.html",
        messenger: "src/messenger.html",
      }
    }
  }
}));
