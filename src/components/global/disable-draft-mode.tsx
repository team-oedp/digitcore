"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { disableDraftMode } from "~/app/actions";

export function DisableDraftMode() {
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	if (
		typeof window !== "undefined" &&
		(window !== window.parent || !!window.opener)
	) {
		return null;
	}

	const disable = () =>
		startTransition(async () => {
			await disableDraftMode();
			router.refresh();
		});

	return (
		<div className="fixed top-4 right-4 z-50 rounded border border-yellow-400 bg-yellow-100 px-3 py-2 text-yellow-800">
			{pending ? (
				"Disabling draft mode..."
			) : (
				<button type="button" onClick={disable} className="underline">
					Disable draft mode
				</button>
			)}
		</div>
	);
}
