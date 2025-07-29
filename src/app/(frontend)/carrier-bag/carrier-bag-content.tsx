"use client";

import Link from "next/link";
import type { CarrierBagItem } from "~/components/global/carrier-bag/carrier-bag-item";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { useHydration } from "~/hooks/use-hydration";
import { useCarrierBagStore } from "~/stores/carrier-bag";

interface PatternCardProps {
	item: CarrierBagItem;
	onRemove: (patternId: string) => void;
}

function PatternCard({ item, onRemove }: PatternCardProps) {
	const { pattern, dateAdded } = item;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div>
						<CardTitle className="capitalize">
							<Link
								href={`/pattern/${pattern.slug?.current || ""}`}
								className="hover:underline"
							>
								{pattern.title}
							</Link>
						</CardTitle>
						<CardDescription>
							Added {new Date(dateAdded).toLocaleDateString()}
						</CardDescription>
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onRemove(pattern._id)}
					>
						Remove
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{pattern.tags && pattern.tags.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{pattern.tags.slice(0, 3).map((tag) => (
								<span
									key={tag._key || tag._ref}
									className="rounded bg-gray-200 px-2 py-1 text-xs"
								>
									{"title" in tag ? tag.title : tag._ref || "Untitled Tag"}
								</span>
							))}
							{pattern.tags && pattern.tags.length > 3 && (
								<span className="text-muted-foreground text-xs">
									+{pattern.tags.length - 3} more
								</span>
							)}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export function CarrierBagContent() {
	const hydrated = useHydration();
	const { items, removePattern } = useCarrierBagStore();

	if (!hydrated) {
		return (
			<Card aria-live="polite" className="text-center">
				<CardHeader>
					<CardTitle>Loading your carrier bag...</CardTitle>
					<CardDescription>
						Your saved patterns will appear here once loaded.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	if (items.length === 0) {
		return (
			<Card aria-live="polite" className="text-center">
				<CardHeader>
					<CardTitle>No patterns saved yet</CardTitle>
					<CardDescription>
						Browse patterns and select "Save to carrier bag" to build your
						collection.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button variant="link" asChild>
						<Link href="/tags">Browse patterns</Link>
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<p className="text-muted-foreground">
					{items.length} pattern{items.length !== 1 ? "s" : ""} in your bag
				</p>
				<Button variant="outline" size="sm" asChild>
					<Link href="/tags">Browse more patterns</Link>
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{items.map((item: CarrierBagItem) => (
					<PatternCard
						key={item.pattern._id}
						item={item}
						onRemove={removePattern}
					/>
				))}
			</div>
		</div>
	);
}
