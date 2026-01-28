// @ts-check
import { defineConfig } from 'astro/config';
import { paraglideVitePlugin } from "@inlang/paraglide-js";
import node from "@astrojs/node";
import tailwindcss from "@tailwindcss/vite";


// https://astro.build/config
export default defineConfig({
    integrations: [],
    vite: {
        plugins: [
            // i18n labels
            paraglideVitePlugin({
                project: "./project.inlang",
                outdir: "./src/paraglide-i18n",
                emitTsDeclarations: true
            }), 
            tailwindcss()]
    },
    output: 'server',
    adapter: node({
        mode: "standalone"
    })
});