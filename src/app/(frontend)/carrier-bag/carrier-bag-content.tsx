"use client";

import {
	CarrierBagItem,
	type CarrierBagItemData,
} from "~/components/global/carrier-bag/carrier-bag-item";
import { PageHeader } from "~/components/shared/page-header";
import { Button } from "~/components/ui/button";
import { useCarrierBagStore } from "~/stores/carrier-bag";

export function CarrierBagContent() {
	const items = useCarrierBagStore((state) => state.items);
	const removePattern = useCarrierBagStore((state) => state.removePattern);

	const handleRemoveItem = (patternId: string) => {
		removePattern(patternId);
	};

	const handleExpandItem = (slug: string) => {
		// Navigate to pattern page
		window.location.href = `/pattern/${slug}`;
	};

	return (
		<div className="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden rounded-md bg-primary-foreground px-4">
			<div className="sticky top-0 z-10 bg-primary-foreground pt-6 pb-2">
				<div className="flex items-start justify-between gap-6">
					<div className="flex-1">
						<PageHeader
							title="Carrier Bag"
							description={`${items.length} saved items`}
							withIndent={false}
						/>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<h3 className="font-normal text-foreground text-sm">Filters</h3>
				<Button
					variant="ghost"
					size="sm"
					className="text-muted-foreground text-sm hover:text-foreground"
				>
					Add filter
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="text-muted-foreground text-sm hover:text-foreground"
				>
					Clear all
				</Button>
			</div>

			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
				{items.length === 0 ? (
					<div className="flex flex-col items-start justify-center py-8 text-left">
						<p className="font-normal text-muted-foreground text-sm">
							There are no patterns in your carrier bag. Start by saving one
							from the toolkit.
						</p>
					</div>
				) : (
					items.map((item) => {
						const itemData: CarrierBagItemData = {
							id: item.pattern._id,
							title: item.pattern.title || "Untitled Pattern",
						};
						return (
							<CarrierBagItem
								key={item.pattern._id}
								item={itemData}
								onRemove={() => handleRemoveItem(item.pattern._id)}
								onExpand={() =>
									handleExpandItem(item.pattern.slug?.current || "")
								}
							/>
						);
					})
				)}
			</div>
		</div>
	);
}
