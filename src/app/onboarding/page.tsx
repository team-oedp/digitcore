// Replace the existing client-side page with a server component that lazily renders the interactive client version.

import { Suspense } from "react";
import OnboardingClient from "./onboarding-client";

export default function OnboardingPage() {
	return (
		<Suspense fallback={null}>
			<OnboardingClient />
		</Suspense>
	);
}
