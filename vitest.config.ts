import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths() as PluginOption, react() as PluginOption],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			reporter: ["text", "html"],
		},
	},
});
