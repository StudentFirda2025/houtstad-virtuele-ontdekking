// vite.config.js
import { defineConfig } from "file:///var/www/project/symfony/node_modules/vite/dist/node/index.js";
import symfonyPlugin from "file:///var/www/project/symfony/node_modules/vite-plugin-symfony/dist/index.js";
var vite_config_default = defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    // strictPort: true, // if you want Vite to fail if the port is already in use
    // cors: {
    //     origin: 'http://localhost/', // or the specific origin of your Laravel app
    //     credentials: true,
    // },
    hmr: {
      host: "localhost"
    }
  },
  build: {
    rollupOptions: {
      input: {
        app: "./assets/app.ts",
        overview: "./assets/overview/main.ts",
        login: "./assets/login/main.ts"
      }
    },
    watch: "./vite.config.js"
  },
  plugins: [
    symfonyPlugin({
      // viteDevServerHostname: "localhost"
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvdmFyL3d3dy9wcm9qZWN0L3N5bWZvbnlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi92YXIvd3d3L3Byb2plY3Qvc3ltZm9ueS92aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vdmFyL3d3dy9wcm9qZWN0L3N5bWZvbnkvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHN5bWZvbnlQbHVnaW4gZnJvbSBcInZpdGUtcGx1Z2luLXN5bWZvbnlcIjtcbi8vIGltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgc2VydmVyOiB7XG4gICAgICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgICAgICBwb3J0OiA1MTczLFxuICAgICAgICAvLyBzdHJpY3RQb3J0OiB0cnVlLCAvLyBpZiB5b3Ugd2FudCBWaXRlIHRvIGZhaWwgaWYgdGhlIHBvcnQgaXMgYWxyZWFkeSBpbiB1c2VcbiAgICAgICAgLy8gY29yczoge1xuICAgICAgICAvLyAgICAgb3JpZ2luOiAnaHR0cDovL2xvY2FsaG9zdC8nLCAvLyBvciB0aGUgc3BlY2lmaWMgb3JpZ2luIG9mIHlvdXIgTGFyYXZlbCBhcHBcbiAgICAgICAgLy8gICAgIGNyZWRlbnRpYWxzOiB0cnVlLFxuICAgICAgICAvLyB9LFxuICAgICAgICBobXI6IHtcbiAgICAgICAgICAgIGhvc3Q6IFwibG9jYWxob3N0XCIsXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICBpbnB1dDoge1xuICAgICAgICAgICAgICAgIGFwcDogXCIuL2Fzc2V0cy9hcHAudHNcIixcbiAgICAgICAgICAgICAgICBvdmVydmlldzogXCIuL2Fzc2V0cy9vdmVydmlldy9tYWluLnRzXCIsXG4gICAgICAgICAgICAgICAgbG9naW46IFwiLi9hc3NldHMvbG9naW4vbWFpbi50c1wiXG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB3YXRjaDogXCIuL3ZpdGUuY29uZmlnLmpzXCJcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgc3ltZm9ueVBsdWdpbih7XG4gICAgICAgICAgICAvLyB2aXRlRGV2U2VydmVySG9zdG5hbWU6IFwibG9jYWxob3N0XCJcbiAgICAgICAgfSksXG4gICAgXSxcbn0pOyAgIFxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEwUCxTQUFTLG9CQUFvQjtBQUN2UixPQUFPLG1CQUFtQjtBQUkxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixRQUFRO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTU4sS0FBSztBQUFBLE1BQ0QsTUFBTTtBQUFBLElBQ1Y7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSCxlQUFlO0FBQUEsTUFDWCxPQUFPO0FBQUEsUUFDSCxLQUFLO0FBQUEsUUFDTCxVQUFVO0FBQUEsUUFDVixPQUFPO0FBQUEsTUFDWDtBQUFBLElBQ0o7QUFBQSxJQUNBLE9BQU87QUFBQSxFQUNYO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxjQUFjO0FBQUE7QUFBQSxJQUVkLENBQUM7QUFBQSxFQUNMO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
