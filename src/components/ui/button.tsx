import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
	"inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md font-normal text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-neutral-200 text-neutral-800 hover:bg-neutral-200/90",
				destructive:
					"bg-red-800 text-white hover:bg-red-700 focus-visible:ring-red-50 dark:bg-red-900 dark:focus-visible:ring-red-100 dark:hover:bg-red-900/90",
				outline:
					"border border-primary bg-background hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
				secondary:
					"bg-neutral-200 text-secondary-foreground hover:bg-secondary",
				ghost:
					"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
				link: "text-muted-foreground hover:text-foreground",
				pattern:
					"border border-green-600/20 bg-green-50 font-medium text-green-700 capitalize hover:bg-green-100 dark:border-green-500/30 dark:bg-green-950/30 dark:text-green-400 dark:hover:bg-green-950/50",
				solution:
					"border border-purple-700/10 bg-purple-50 font-medium text-purple-700 capitalize hover:bg-purple-100 dark:border-purple-500/20 dark:bg-purple-950/30 dark:text-purple-400 dark:hover:bg-purple-950/50",
				resource:
					"border border-pink-700/10 bg-pink-50 font-medium text-pink-700 capitalize hover:bg-pink-100 dark:border-pink-500/20 dark:bg-pink-950/30 dark:text-pink-400 dark:hover:bg-pink-950/50",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 gap-1.5 rounded-lg px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
				icon: "size-9",
				inline: "h-fit px-0 py-0",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
