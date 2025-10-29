import { defineCliConfig } from "sanity/cli";

// Use environment variables directly with fallbacks for CLI
// This prevents errors when environment variables are not yet set
export default defineCliConfig({
	api: {
		projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "q0v6uag1",
		dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
	},
	studioHost: "digitcore",
	deployment: { autoUpdates: true },
});
