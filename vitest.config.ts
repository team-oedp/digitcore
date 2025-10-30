import { dirname, resolve as pathResolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SRC_DIR = pathResolve(__dirname, "src");
const ICONS_DIR = pathResolve(SRC_DIR, "components/icons");

export default defineConfig({
	plugins: [tsconfigPaths() as PluginOption, react() as PluginOption],
	resolve: {
		alias: {
			"~": SRC_DIR,
			"@icons": ICONS_DIR,
		},
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			reporter: ["text", "html"],
		},
	},
});
