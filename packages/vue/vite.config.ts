import { resolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [vue(), dts({ tsconfigPath: "./tsconfig.json" })],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "KivVue",
			fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
			formats: ["es"],
		},
		rollupOptions: {
			external: ["vue", "@kiv/engine", "@kiv/nodes"],
			output: {
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});
