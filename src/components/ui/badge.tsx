import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-md px-2 py-0.5 font-normal text-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
	{
		variants: {
			variant: {
				default:
					"border border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"border border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"border border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
				outline:
					"border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
				/* DIGITCORE badge styles */
				audience:
					"inset-ring inset-ring-blue-700/10 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:inset-ring-blue-500/20 dark:bg-blue-950/30 dark:text-blue-400 dark:hover:bg-blue-950/50",
				theme:
					"inset-ring inset-ring-orange-700/10 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:inset-ring-orange-500/20 dark:bg-orange-950/30 dark:text-orange-400 dark:hover:bg-orange-950/50",
				tag: "inset-ring inset-ring-purple-700/10 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:inset-ring-purple-500/20 dark:bg-purple-950/30 dark:text-purple-400 dark:hover:bg-purple-950/50",
				resource:
					"inset-ring inset-ring-pink-700/10 bg-pink-50 text-pink-700 hover:bg-pink-100 dark:inset-ring-pink-500/20 dark:bg-pink-950/30 dark:text-pink-400 dark:hover:bg-pink-950/50",
				solution:
					"inset-ring inset-ring-fuchsia-600/20 bg-fuchsia-50 text-fuchsia-800 hover:bg-fuchsia-100 dark:inset-ring-fuchsia-600/20 dark:bg-fuchsia-950/30 dark:text-fuchsia-400 dark:hover:bg-fuchsia-950/50",
				pattern:
					"inset-ring inset-ring-neutral-600/20 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:inset-ring-neutral-500/30 dark:bg-neutral-950/30 dark:text-neutral-400 dark:hover:bg-neutral-950/50",
				page: "inset-ring inset-ring-gray-500/10 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:inset-ring-gray-500/20 dark:bg-gray-950/30 dark:text-gray-400 dark:hover:bg-gray-950/50",
			},
			size: {
				default: "h-6 py-1 text-[12px] md:text-[14px]",
				sm: "h-5 py-0.5 text-[10px] md:text-[12px]",
				lg: "h-7 py-1.5 text-[14px] md:text-[16px]",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Badge({
	className,
	variant,
	size,
	asChild = false,
	icon,
	children,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & {
		asChild?: boolean;
		icon?: React.ReactNode;
	}) {
	const Comp = asChild ? Slot : "span";

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		>
			{asChild ? (
				children
			) : (
				<>
					{icon && <span className="flex-shrink-0">{icon}</span>}
					{children}
				</>
			)}
		</Comp>
	);
}

export { Badge, badgeVariants };
