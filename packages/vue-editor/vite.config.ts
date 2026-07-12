import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tailwindcss(), vue(), dts({ tsconfigPath: "./tsconfig.json" })],
	test: {
		environment: "happy-dom",
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "KivEditor",
			fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
			formats: ["es"],
		},
		rollupOptions: {
			external: [
				"vue",
				"@kiv/engine",
				"@kiv/nodes",
				"@kiv/nodes-interactive",
				"@kiv/vue",
			],
			output: {
				globals: { vue: "Vue" },
			},
		},
	},
});
