import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-start gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 font-normal transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"border-transparent bg-destructive text-white focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/90",
				outline:
					"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

				// Specific badge variants
				audience:
					"border-blue-200 bg-blue-100 text-blue-800 hover:border-blue-400",
				theme:
					"border-orange-200 bg-orange-100 text-orange-800 hover:border-orange-300",
				tag: "border-violet-200 bg-violet-100 text-violet-800 hover:border-violet-300",
				resource:
					"border-[var(--resource-badge-border)] bg-[var(--resource-badge-background)] text-[var(--resource-badge-text)] hover:border-[var(--resource-badge-border-dark)]",
				solution:
					"border-[var(--solution-badge-border)] bg-[var(--solution-badge-background)] text-[var(--solution-badge-text)] hover:border-[var(--solution-badge-border-dark)]",
				pattern:
					"border-[var(--pattern-badge-border)] bg-[var(--pattern-badge-background)] text-[var(--pattern-badge-text)] hover:border-[var(--pattern-badge-border-dark)]",
				page: "border-[var(--page-badge-border)] bg-[var(--page-badge-background)] text-[var(--page-badge-text)] hover:border-[var(--page-badge-border-dark)]",
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
			{icon && <span className="flex-shrink-0">{icon}</span>}
			{children}
		</Comp>
	);
}

export { Badge, badgeVariants };
