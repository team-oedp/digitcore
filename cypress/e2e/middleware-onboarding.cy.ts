describe("Onboarding middleware", () => {
	before(() => {
		// Warm up dev server compilation to avoid initial timeouts
		cy.visit("/");
	});

	// Handle known React/Next.js performance measurement errors
	Cypress.on("uncaught:exception", (err) => {
		// Ignore performance measurement errors that occur with 404 pages
		if (err.message.includes("Failed to execute 'measure' on 'Performance'")) {
			return false;
		}
		// Let other errors fail the test
		return true;
	});
	it("redirects first-time visitor to /onboarding", () => {
		cy.clearCookies();
		cy.visit("/explore", { failOnStatusCode: false });
		cy.location("pathname", { timeout: 120000 }).should("eq", "/onboarding");
	});

	it("passes through when onboarding cookie is present", () => {
		cy.setCookie("onboarding_completed", "1");
		cy.visit("/explore");
		cy.location("pathname").should("eq", "/explore");
	});

	it("preserves pattern slug and query params", () => {
		cy.clearCookies();
		cy.visit("/pattern/foo?bar=baz", { failOnStatusCode: false });
		cy.location("pathname", { timeout: 120000 }).should("eq", "/onboarding");
		cy.location("search").should("contain", "pattern=foo");
		cy.location("search").should(
			"contain",
			"returnTo=%2Fpattern%2Ffoo%3Fbar%3Dbaz",
		);
	});

	it("does not redirect when already on /onboarding", () => {
		cy.clearCookies();
		cy.visit("/onboarding");
		cy.location("pathname").should("eq", "/onboarding");
	});
});
