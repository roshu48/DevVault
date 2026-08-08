import { defineConfig } from "vite";

export default defineConfig({

    build: {

        outDir: "wwwroot/js/formatter",

        emptyOutDir: false,

        lib: {

            entry: "src/formatter/java-formatter.js",

            formats: ["es"],

            fileName: "java-formatter"
        },

        rollupOptions: {

            external: []
        }
    }
});