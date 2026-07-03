import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [vue(), dts({ tsconfigPath: "./tsconfig.json" })],
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "KivEditor",
			fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
			formats: ["es"],
		},
		rollupOptions: {
			external: ["vue", "@kiv/engine", "@kiv/nodes", "@kiv/vue"],
			output: {
				globals: { vue: "Vue" },
			},
		},
	},
});
