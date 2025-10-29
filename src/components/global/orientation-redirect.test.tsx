import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OrientationRedirect } from "./orientation-redirect";

type OrientationStateMock = {
	hasHydrated: boolean;
	hasSeenOrientation: boolean;
	hasCompletedOrientation: boolean;
	hasSkippedOrientation: boolean;
	shouldShowOrientation: () => boolean;
	checkAndResetExpiredSkip: () => boolean;
};

const pushMock = vi.fn();

let mockPathname = "/en";
let mockSearchParams = new URLSearchParams();
let mockOrientationState: OrientationStateMock;

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: pushMock,
	}),
	usePathname: () => mockPathname,
	useSearchParams: () => mockSearchParams,
}));

vi.mock("~/stores/orientation", () => ({
	useOrientationStore: <T,>(selector?: (state: OrientationStateMock) => T) => {
		const snapshot = { ...mockOrientationState };
		return selector ? selector(snapshot) : (snapshot as T);
	},
}));

describe("OrientationRedirect", () => {
	beforeEach(() => {
		pushMock.mockClear();
		mockPathname = "/en";
		mockSearchParams = new URLSearchParams();
		mockOrientationState = {
			hasHydrated: true,
			hasSeenOrientation: false,
			hasCompletedOrientation: false,
			hasSkippedOrientation: false,
			shouldShowOrientation: () => false,
			checkAndResetExpiredSkip: () => false,
		};
	});

	it("redirects first-time visitors to the orientation flow", async () => {
		mockOrientationState.shouldShowOrientation = () => true;

		render(<OrientationRedirect />);

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith(
				expect.stringMatching(
					/^http:\/\/localhost(?::3000)?\/en\/orientation$/,
				),
			);
		});
	});

	it("does not redirect when the visitor has already seen the orientation", async () => {
		mockOrientationState.hasSeenOrientation = true;
		mockOrientationState.shouldShowOrientation = () => false;

		render(<OrientationRedirect />);

		await waitFor(() => {
			expect(pushMock).not.toHaveBeenCalled();
		});
	});

	it("does not redirect when the visitor has completed the orientation", async () => {
		mockOrientationState.hasCompletedOrientation = true;

		render(<OrientationRedirect />);

		await waitFor(() => {
			expect(pushMock).not.toHaveBeenCalled();
		});
	});
});
