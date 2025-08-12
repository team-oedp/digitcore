"use client";

import { useEffect, useState } from "react";
import { MobileHoldingPage } from "./mobile-holding-page";

// Tablet breakpoint (768px) - anything below this will show the holding page
const TABLET_BREAKPOINT = 768;

type ResponsiveWrapperProps = {
	children: React.ReactNode;
};

export function ResponsiveWrapper({ children }: ResponsiveWrapperProps) {
	const [isTabletOrBelow, setIsTabletOrBelow] = useState<boolean | undefined>(
		undefined,
	);

	useEffect(() => {
		// Check if screen is tablet size or smaller
		const checkScreenSize = () => {
			setIsTabletOrBelow(window.innerWidth < TABLET_BREAKPOINT);
		};

		// Initial check
		checkScreenSize();

		// Set up media query listener
		const mediaQuery = window.matchMedia(
			`(max-width: ${TABLET_BREAKPOINT - 1}px)`,
		);

		const handleChange = (e: MediaQueryListEvent) => {
			setIsTabletOrBelow(e.matches);
		};

		// Modern browsers
		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener("change", handleChange);
		} else {
			// Fallback for environments without addEventListener support
			mediaQuery.onchange = handleChange;
		}

		// Also listen to resize events as a fallback
		window.addEventListener("resize", checkScreenSize);

		// Cleanup
		return () => {
			if (mediaQuery.removeEventListener) {
				mediaQuery.removeEventListener("change", handleChange);
			} else {
				mediaQuery.onchange = null;
			}
			window.removeEventListener("resize", checkScreenSize);
		};
	}, []);

	// Avoid hydration mismatch by not rendering until we know the screen size
	if (isTabletOrBelow === undefined) {
		return null;
	}

	// Show holding page for tablet and mobile devices
	if (isTabletOrBelow) {
		return <MobileHoldingPage />;
	}

	// Show regular content for desktop
	return <>{children}</>;
}
