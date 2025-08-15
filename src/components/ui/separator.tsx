"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import type * as React from "react";

import { cn } from "~/lib/utils";

function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
	return (
		<SeparatorPrimitive.Root
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			className={cn(
				"shrink-0 border-neutral-300 border-t border-dashed data-[orientation=horizontal]:h-0 data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-0 data-[orientation=vertical]:border-t-0 data-[orientation=vertical]:border-l",
				className,
			)}
			{...props}
		/>
	);
}

export { Separator };
