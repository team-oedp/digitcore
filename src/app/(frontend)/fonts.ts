import localFont from "next/font/local";

export const sans = localFont({
	src: [
		{
			path: "../../../public/fonts/UntitledSans/UntitledSans-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../../public/fonts/UntitledSans/UntitledSans-RegularItalic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../../../public/fonts/UntitledSans/UntitledSans-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../../public/fonts/UntitledSans/UntitledSans-MediumItalic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "../../../public/fonts/UntitledSans/UntitledSans-Bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../../public/fonts/UntitledSans/UntitledSans-BoldItalic.woff2",
			weight: "700",
			style: "italic",
		},
	],
	display: "swap",
	variable: "--font-sans",
});
