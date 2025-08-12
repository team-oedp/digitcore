import type React from "react";

export default function Icon24(props: React.ComponentPropsWithoutRef<"svg">) {
	return (
		<svg
			width="200"
			height="200"
			viewBox="0 0 200 200"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-label="Digitcore"
			role="img"
			{...props}
		>
			<path
				d="M160.129 132.286C111.077 161.899 66.966 161.973 46.1753 157.916C37.8546 120.741 32.5589 78.8314 35.2585 56.0948C78.3191 35.8764 132.94 39.4842 151.253 42.7385C174.743 71.5569 162.569 113.989 160.129 132.286Z"
				stroke="currentColor"
				strokeWidth="1"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
