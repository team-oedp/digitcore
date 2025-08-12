"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";

type ButtonProps = React.ComponentProps<typeof Button>;

type CopyButtonProps = {
	value: string;
	onCopied?: () => void;
	/**
	 * Milliseconds to show the copied state
	 * @default 2000
	 */
	duration?: number;
	/**
	 * Children to render when idle (not copied)
	 */
	children: React.ReactNode;
	/**
	 * Children to render when copied
	 */
	copiedChildren: React.ReactNode;
} & Omit<ButtonProps, "onClick" | "children">;

export function CopyButton({
	value,
	onCopied,
	duration = 2000,
	children,
	copiedChildren,
	...buttonProps
}: CopyButtonProps) {
	const [hasCopied, setHasCopied] = React.useState(false);
	const timeoutRef = React.useRef<number | null>(null);

	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		};
	}, []);

	return (
		<Button
			type="button"
			onClick={() => {
				setHasCopied(true);
				navigator.clipboard.writeText(value).catch(() => {});
				if (onCopied) onCopied();
				if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
				timeoutRef.current = window.setTimeout(
					() => setHasCopied(false),
					duration,
				);
			}}
			{...buttonProps}
		>
			{hasCopied ? copiedChildren : children}
		</Button>
	);
}
