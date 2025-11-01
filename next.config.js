/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	experimental: {
		globalNotFound: true,
		viewTransition: true,
		browserDebugInfoInTerminal: true,
		turbopackFileSystemCacheForDev: true,
	},
	reactCompiler: true,
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default config;
