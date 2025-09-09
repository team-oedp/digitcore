describe("Onboarding with Zustand", () => {
	before(() => {
		// Warm up dev server compilation to avoid initial timeouts
		cy.visit("/");
	});

	beforeEach(() => {
		// Clear localStorage to reset Zustand store
		cy.clearLocalStorage("onboarding-state");
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
		cy.visit("/explore", { failOnStatusCode: false, timeout: 60000 });
		cy.location("pathname", { timeout: 30000 }).should("eq", "/onboarding");
	});

	it("passes through when onboarding is completed", () => {
		// Set completed state in localStorage (updated to include hasHydrated)
		const storeState = {
			state: {
				hasHydrated: true,
				hasSeenOnboarding: true,
				hasCompletedOnboarding: true,
				hasSkippedOnboarding: false,
				completedAt: new Date().toISOString(),
				selectedAudienceIds: [],
				selectedThemeIds: [],
			},
			version: 0,
		};
		cy.window().then((win) => {
			win.localStorage.setItem("onboarding-state", JSON.stringify(storeState));
		});
		cy.visit("/explore", { timeout: 60000 });
		cy.location("pathname", { timeout: 30000 }).should("eq", "/explore");
	});

	it("passes through when onboarding is skipped (within 24 hours)", () => {
		// Set skipped state in localStorage (updated to include hasHydrated)
		const storeState = {
			state: {
				hasHydrated: true,
				hasSeenOnboarding: true,
				hasCompletedOnboarding: false,
				hasSkippedOnboarding: true,
				skippedAt: new Date().toISOString(),
				selectedAudienceIds: [],
				selectedThemeIds: [],
			},
			version: 0,
		};
		cy.window().then((win) => {
			win.localStorage.setItem("onboarding-state", JSON.stringify(storeState));
		});
		cy.visit("/patterns", { timeout: 60000 });
		cy.location("pathname", { timeout: 30000 }).should("eq", "/patterns");
	});

	it("redirects when skip has expired (>24 hours)", () => {
		// Set expired skip state (25 hours ago)
		const expiredTime = new Date(
			Date.now() - 25 * 60 * 60 * 1000,
		).toISOString();
		const storeState = {
			state: {
				hasHydrated: true,
				hasSeenOnboarding: true,
				hasCompletedOnboarding: false,
				hasSkippedOnboarding: true,
				skippedAt: expiredTime,
				selectedAudienceIds: [],
				selectedThemeIds: [],
			},
			version: 0,
		};
		cy.window().then((win) => {
			win.localStorage.setItem("onboarding-state", JSON.stringify(storeState));
		});
		cy.visit("/explore", { failOnStatusCode: false, timeout: 60000 });
		cy.location("pathname", { timeout: 30000 }).should("eq", "/onboarding");
	});

	it("preserves pattern slug and query params", () => {
		cy.visit("/pattern/foo?bar=baz", {
			failOnStatusCode: false,
			timeout: 60000,
		});
		cy.location("pathname", { timeout: 30000 }).should("eq", "/onboarding");
		cy.location("search").should("contain", "pattern=foo");
		cy.location("search").should(
			"contain",
			"returnTo=%2Fpattern%2Ffoo%3Fbar%3Dbaz",
		);
	});

	it("does not redirect when already on /onboarding", () => {
		cy.visit("/onboarding", { timeout: 60000 });
		cy.location("pathname", { timeout: 30000 }).should("eq", "/onboarding");
	});

	it("skip button sets skipped state", () => {
		cy.visit("/onboarding", { timeout: 60000 });
		cy.contains("Skip onboarding", { timeout: 30000 }).click();
		// Should navigate away from onboarding
		cy.location("pathname", { timeout: 30000 }).should("not.eq", "/onboarding");
		// Check localStorage contains skipped state
		cy.window().then((win) => {
			const stored = win.localStorage.getItem("onboarding-state");
			expect(stored).to.not.be.null;
			const state = JSON.parse(stored as string);
			expect(state.state.hasSkippedOnboarding).to.be.true;
		});
	});
});
