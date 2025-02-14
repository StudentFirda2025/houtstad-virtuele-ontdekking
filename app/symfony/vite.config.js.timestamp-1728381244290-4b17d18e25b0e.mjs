// vite.config.js
import { defineConfig } from "file:///var/www/project/node_modules/vite/dist/node/index.js";
import symfonyPlugin from "file:///var/www/project/node_modules/vite-plugin-symfony/dist/index.js";
var vite_config_default = defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    // strictPort: true, // if you want Vite to fail if the port is already in use
    // cors: {
    //     origin: 'http://localhost', // or the specific origin of your Laravel app
    //     credentials: true,
    // },
    hmr: {
      host: "localhost"
    }
  },
  plugins: [
    symfonyPlugin({
      refresh: true
    })
  ],
  build: {
    rollupOptions: {
      input: {
        app: "./assets/app.js"
      }
    },
    watch: "./vite.config.js"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvdmFyL3d3dy9wcm9qZWN0L3N5bWZvbnlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi92YXIvd3d3L3Byb2plY3Qvc3ltZm9ueS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vdmFyL3d3dy9wcm9qZWN0L3N5bWZvbnkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHN5bWZvbnlQbHVnaW4gZnJvbSBcInZpdGUtcGx1Z2luLXN5bWZvbnlcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgaG9zdDogJzAuMC4wLjAnLFxuICAgICAgICBwb3J0OiA1MTczLFxuICAgICAgICAvLyBzdHJpY3RQb3J0OiB0cnVlLCAvLyBpZiB5b3Ugd2FudCBWaXRlIHRvIGZhaWwgaWYgdGhlIHBvcnQgaXMgYWxyZWFkeSBpbiB1c2VcbiAgICAgICAgLy8gY29yczoge1xuICAgICAgICAvLyAgICAgb3JpZ2luOiAnaHR0cDovL2xvY2FsaG9zdCcsIC8vIG9yIHRoZSBzcGVjaWZpYyBvcmlnaW4gb2YgeW91ciBMYXJhdmVsIGFwcFxuICAgICAgICAvLyAgICAgY3JlZGVudGlhbHM6IHRydWUsXG4gICAgICAgIC8vIH0sXG4gICAgICAgIGhtcjoge1xuICAgICAgICAgICAgaG9zdDogJ2xvY2FsaG9zdCcsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIHN5bWZvbnlQbHVnaW4oe1xuICAgICAgICAgICAgcmVmcmVzaDogdHJ1ZVxuICAgICAgICB9KSxcbiAgICBdLFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgICAgICAgYXBwOiBcIi4vYXNzZXRzL2FwcC5qc1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB3YXRjaDogXCIuL3ZpdGUuY29uZmlnLmpzXCJcbiAgICB9LFxufSk7ICAgICBcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFAsU0FBUyxvQkFBb0I7QUFDdlIsT0FBTyxtQkFBbUI7QUFFMUIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsUUFBUTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1OLEtBQUs7QUFBQSxNQUNELE1BQU07QUFBQSxJQUNWO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsY0FBYztBQUFBLE1BQ1YsU0FBUztBQUFBLElBQ2IsQ0FBQztBQUFBLEVBQ0w7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILGVBQWU7QUFBQSxNQUNYLE9BQU87QUFBQSxRQUNILEtBQUs7QUFBQSxNQUNUO0FBQUEsSUFDSjtBQUFBLElBQ0EsT0FBTztBQUFBLEVBQ1g7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
