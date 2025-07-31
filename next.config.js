/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { withBotId } from "botid/next/config";
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	experimental: {
		viewTransition: true,
		browserDebugInfoInTerminal: true,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default withBotId(config);
