import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
	api: {
		projectId: "q0v6uag1",
		dataset: "production",
	},
	/**
	 * Enable auto-updates for studios.
	 * Learn more at https://www.sanity.io/docs/cli#auto-updates
	 */
	autoUpdates: true,
});
