"use client";

import { useEffect } from "react";

export default function TestErrorPage() {
	useEffect(() => {
		throw new Error("This is a test error to preview the error page");
	}, []);

	return <div>Loading...</div>;
}
