import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "~/lib/utils";

const badgeVariants = cva(
	"inline-flex w-fit shrink-0 items-center justify-start gap-1 overflow-hidden whitespace-nowrap rounded-md border px-2 py-1 font-normal text-sm transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
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

				// Site-specific badge variants wired to CSS custom properties
				audience:
					"border-[var(--audience-badge-border)] bg-[var(--audience-badge-background)] text-[var(--audience-badge-text)]",
				theme:
					"border-[var(--theme-badge-border)] bg-[var(--theme-badge-background)] text-[var(--theme-badge-text)]",
				tag: "border-[var(--tag-badge-border)] bg-[var(--tag-badge-background)] text-[var(--tag-badge-text)]",
				resource:
					"border-[var(--resource-badge-border)] bg-[var(--resource-badge-background)] text-[var(--resource-badge-text)]",
				solution:
					"border-[var(--solution-badge-border)] bg-[var(--solution-badge-background)] text-[var(--solution-badge-text)]",
				pattern:
					"border-[var(--pattern-badge-border)] bg-[var(--pattern-badge-background)] text-[var(--pattern-badge-text)]",
				page: "border-[var(--page-badge-border)] bg-[var(--page-badge-background)] text-[var(--page-badge-text)]",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant,
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
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		>
			{icon && <span className="flex-shrink-0">{icon}</span>}
			{children}
		</Comp>
	);
}

export { Badge, badgeVariants };
