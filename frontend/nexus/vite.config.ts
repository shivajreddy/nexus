import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "@assets": path.resolve(__dirname, "./src/assets"),
            "@images": path.resolve(__dirname, "./src/assets/images"),
            "@components": path.resolve(__dirname, "./src/components"),
            "@templates": path.resolve(__dirname, "./src/templates"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@context": path.resolve(__dirname, "./src/context"),
            "@redux": path.resolve(__dirname, "./src/redux"),
            "@hooks": path.resolve(__dirname, "./src/hooks"),
            "@server": path.resolve(__dirname, "./src/server"),
        },
    },
    server: {
        watch: {usePolling: true},
        host: true,
        strictPort: true,
        port: 3000,
    },
});

// build: {
//     sourcemap: true
// }
