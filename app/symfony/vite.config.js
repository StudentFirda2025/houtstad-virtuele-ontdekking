import { defineConfig } from "vite";
import symfonyPlugin from "vite-plugin-symfony";
// import path from 'path';


export default defineConfig({
    server: {
        host: "0.0.0.0", // "0.0.0.0"
        port: 5173,
        // strictPort: true, // if you want Vite to fail if the port is already in use
        // cors: {
        //     origin: 'http://localhost/', // or the specific origin of your Laravel app
        //     credentials: true,
        // },
        hmr: {
            host: "localhost",
        },
    },
    build: {
        rollupOptions: {
            input: {
                app: "./assets/app.ts",
                overview: "./assets/overview/main.ts",
                login: "./assets/login/main.ts",
                mediacms: "./assets/mediacms/main.ts",
                florisTestCorner: "./assets/floristestcorner/infoPuntTestPage.ts",
                cms: "./assets/infopuntcms/main.ts",
                userPage: "./assets/user-page/main.ts"
            },
        },
        watch: "./vite.config.js" // <-- https://rollupjs.org/configuration-options/#watch
    },
    plugins: [
        symfonyPlugin({
            // viteDevServerHostname: "localhost"
        }),
    ],
});   
