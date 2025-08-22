import { defineConfig } from "cypress";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
		supportFile: "cypress/support/e2e.{js,ts}",
		video: false,
		screenshotOnRunFailure: false,
	},
	component: {
		devServer: {
			framework: "next",
			bundler: "webpack",
		},
	},
});
