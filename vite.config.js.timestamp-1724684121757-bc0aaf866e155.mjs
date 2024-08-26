// vite.config.js
import { defineConfig } from "file:///C:/Users/chamberlainmatthewl/Desktop/code/crim-tauri/node_modules/vite/dist/node/index.js";
import solidPlugin from "file:///C:/Users/chamberlainmatthewl/Desktop/code/crim-tauri/node_modules/vite-plugin-solid/dist/esm/index.mjs";
import publicPath from "file:///C:/Users/chamberlainmatthewl/Desktop/code/crim-tauri/node_modules/vite-plugin-public-path/exports/import.mjs";
import { undestructurePlugin } from "file:///C:/Users/chamberlainmatthewl/Desktop/code/crim-tauri/node_modules/babel-plugin-solid-undestructure/src/index.cjs";
var vite_config_default = defineConfig(async () => ({
  plugins: [
    solidPlugin({
      babel: {
        plugins: [undestructurePlugin("vanilla-js")]
      }
    })
  ],
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
      ignored: ["**/src-tauri/**"]
    }
  },
  build: {
    // 4. tauri expects the output to be in `dist` and not `build`
    outDir: "dist",
    target: "esnext",
    rollupOptions: {
      external: /{{.*/,
      input: {
        index: "index.html",
        messenger: "src/messenger.html"
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxjaGFtYmVybGFpbm1hdHRoZXdsXFxcXERlc2t0b3BcXFxcY29kZVxcXFxjcmltLXRhdXJpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxjaGFtYmVybGFpbm1hdHRoZXdsXFxcXERlc2t0b3BcXFxcY29kZVxcXFxjcmltLXRhdXJpXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9jaGFtYmVybGFpbm1hdHRoZXdsL0Rlc2t0b3AvY29kZS9jcmltLXRhdXJpL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHNvbGlkUGx1Z2luIGZyb20gXCJ2aXRlLXBsdWdpbi1zb2xpZFwiO1xyXG5pbXBvcnQgcHVibGljUGF0aCBmcm9tIFwidml0ZS1wbHVnaW4tcHVibGljLXBhdGhcIjtcclxuLy8gaW1wb3J0IHRoZSB1bmRlc3RydWN0dXJlIHBsdWdpbiAocHJvcGVybHkgdGhpcyB0aW1lISApXHJcbmltcG9ydCB7IHVuZGVzdHJ1Y3R1cmVQbHVnaW4gfSBmcm9tIFwiYmFiZWwtcGx1Z2luLXNvbGlkLXVuZGVzdHJ1Y3R1cmVcIlxyXG5cclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvJ1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoYXN5bmMgKCkgPT4gKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgc29saWRQbHVnaW4oe1xyXG4gICAgYmFiZWw6IHtcclxuICAgICAgcGx1Z2luczogW3VuZGVzdHJ1Y3R1cmVQbHVnaW4oXCJ2YW5pbGxhLWpzXCIpXVxyXG4gICAgfSBcclxuICAgfSksXHJcbiAgXSxcclxuICAgICAgXHJcblxyXG4gIC8vIFZpdGUgb3B0aW9ucyB0YWlsb3JlZCBmb3IgVGF1cmkgZGV2ZWxvcG1lbnQgYW5kIG9ubHkgYXBwbGllZCBpbiBgdGF1cmkgZGV2YCBvciBgdGF1cmkgYnVpbGRgXHJcbiAgLy9cclxuICAvLyAxLiBwcmV2ZW50IHZpdGUgZnJvbSBvYnNjdXJpbmcgcnVzdCBlcnJvcnNcclxuICBjbGVhclNjcmVlbjogZmFsc2UsXHJcbiAgLy8gMi4gdGF1cmkgZXhwZWN0cyBhIGZpeGVkIHBvcnQsIGZhaWwgaWYgdGhhdCBwb3J0IGlzIG5vdCBhdmFpbGFibGVcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDE0MjAsXHJcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgd2F0Y2g6IHtcclxuICAgICAgLy8gMy4gdGVsbCB2aXRlIHRvIGlnbm9yZSB3YXRjaGluZyBgc3JjLXRhdXJpYFxyXG4gICAgICBpZ25vcmVkOiBbXCIqKi9zcmMtdGF1cmkvKipcIl0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgYnVpbGQ6XHJcbiAge1xyXG4gICAgLy8gNC4gdGF1cmkgZXhwZWN0cyB0aGUgb3V0cHV0IHRvIGJlIGluIGBkaXN0YCBhbmQgbm90IGBidWlsZGBcclxuICAgIG91dERpcjogXCJkaXN0XCIsXHJcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgcm9sbHVwT3B0aW9uczpcclxuICAgIHtcclxuICAgICAgZXh0ZXJuYWw6IC97ey4qLyxcclxuICAgICAgaW5wdXQ6XHJcbiAgICAgIHtcclxuICAgICAgICBpbmRleDogXCJpbmRleC5odG1sXCIsXHJcbiAgICAgICAgbWVzc2VuZ2VyOiBcInNyYy9tZXNzZW5nZXIuaHRtbFwiLFxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG4gIH1cclxufSkpO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBWLFNBQVMsb0JBQW9CO0FBQ3ZYLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sZ0JBQWdCO0FBRXZCLFNBQVMsMkJBQTJCO0FBSXBDLElBQU8sc0JBQVEsYUFBYSxhQUFhO0FBQUEsRUFDdkMsU0FBUztBQUFBLElBQ1QsWUFBWTtBQUFBLE1BQ1YsT0FBTztBQUFBLFFBQ0wsU0FBUyxDQUFDLG9CQUFvQixZQUFZLENBQUM7QUFBQSxNQUM3QztBQUFBLElBQ0QsQ0FBQztBQUFBLEVBQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1BLGFBQWE7QUFBQTtBQUFBLEVBRWIsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLElBQ1osT0FBTztBQUFBO0FBQUEsTUFFTCxTQUFTLENBQUMsaUJBQWlCO0FBQUEsSUFDN0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUNBO0FBQUE7QUFBQSxJQUVFLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLGVBQ0E7QUFBQSxNQUNFLFVBQVU7QUFBQSxNQUNWLE9BQ0E7QUFBQSxRQUNFLE9BQU87QUFBQSxRQUNQLFdBQVc7QUFBQSxNQUNiO0FBQUEsSUFFRjtBQUFBLEVBQ0Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
