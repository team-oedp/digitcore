"use client";

import { Reorder } from "motion/react";
import { useMemo, useState } from "react";
import {
	CarrierBagItem,
	type CarrierBagItemData,
} from "~/components/global/carrier-bag/carrier-bag-item";
import { PageHeader } from "~/components/shared/pattern-header";
import { Button } from "~/components/ui/button";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectGroup,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "~/components/ui/multiselect";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Toggle } from "~/components/ui/toggle";
import type { Pattern } from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";

// Stable helpers and narrow types for dereferenced or reference values
type Reference = { _ref: string };
type WithId = { _id: string };
type WithTitle = { title?: string | null };
type RefOrDoc = Reference | (WithId & Partial<WithTitle>);

function getId(x?: RefOrDoc): string | undefined {
	if (!x) return undefined;
	return "_id" in x ? x._id : x._ref;
}

function getTitle(x?: RefOrDoc): string | undefined {
	if (!x) return undefined;
	return "title" in x && x.title ? x.title : undefined;
}

type SlugStringOrObject = string | { current?: string };
type PatternWithFlexibleSlug = { slug?: SlugStringOrObject };
type PatternWithFlexibleRefs = Pattern & {
	tags?: RefOrDoc[];
	audiences?: RefOrDoc[];
	theme?: RefOrDoc;
} & PatternWithFlexibleSlug;

function getSlugString(p: PatternWithFlexibleSlug): string | undefined {
	const s = p.slug;
	if (!s) return undefined;
	return typeof s === "string" ? s : s.current;
}

export function CarrierBagContent() {
	const items = useCarrierBagStore((state) => state.items);
	const removePattern = useCarrierBagStore((state) => state.removePattern);
	const setItems = useCarrierBagStore((state) => state.setItems);

	// UI state
	const [sortBy, setSortBy] = useState<"az" | "za">("az");
	const [groupByTheme, setGroupByTheme] = useState<boolean>(false);
	const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
	const [selectedAudienceIds, setSelectedAudienceIds] = useState<string[]>([]);
	// When the user drags, we switch to manual order (ignore sort/filter/group)
	const [manualOrderActive, setManualOrderActive] = useState<boolean>(false);

	const availableTags = useMemo(() => {
		const map = new Map<string, { id: string; title: string }>();
		for (const item of items) {
			const pattern = item.pattern as PatternWithFlexibleRefs;
			const tags: RefOrDoc[] = pattern.tags ?? [];
			for (const tag of tags) {
				const id = getId(tag);
				const title = getTitle(tag);
				if (!id || !title) continue;
				if (!map.has(id)) map.set(id, { id, title });
			}
		}
		return [...map.values()].sort((a, b) => a.title.localeCompare(b.title));
	}, [items]);

	const availableAudiences = useMemo(() => {
		const map = new Map<string, { id: string; title: string }>();
		for (const item of items) {
			const pattern = item.pattern as PatternWithFlexibleRefs;
			const audiences: RefOrDoc[] = pattern.audiences ?? [];
			for (const audience of audiences) {
				const id = getId(audience);
				const title = getTitle(audience);
				if (!id || !title) continue;
				if (!map.has(id)) map.set(id, { id, title });
			}
		}
		return [...map.values()].sort((a, b) => a.title.localeCompare(b.title));
	}, [items]);

	// Derived list after filtering and sorting
	const processed = useMemo(() => {
		if (manualOrderActive) {
			return { groups: null, flat: items };
		}
		const filtered = items.filter((item) => {
			const p = item.pattern as PatternWithFlexibleRefs;
			// Tags filter
			if (selectedTagIds.length > 0) {
				const tagIds = (p.tags ?? [])
					.map((t) => getId(t))
					.filter((id): id is string => Boolean(id));
				if (!tagIds.some((id) => selectedTagIds.includes(id))) return false;
			}
			// Audiences filter
			if (selectedAudienceIds.length > 0) {
				const audIds = (p.audiences ?? [])
					.map((a) => getId(a))
					.filter((id): id is string => Boolean(id));
				if (!audIds.some((id) => selectedAudienceIds.includes(id)))
					return false;
			}
			return true;
		});

		const sorted = [...filtered].sort((a, b) => {
			const at = (a.pattern.title ?? "").toString();
			const bt = (b.pattern.title ?? "").toString();
			return sortBy === "az" ? at.localeCompare(bt) : bt.localeCompare(at);
		});

		if (!groupByTheme) return { groups: null, flat: sorted };

		// Group by theme title
		const groupsMap = new Map<string, typeof sorted>();
		for (const item of sorted) {
			const pattern = item.pattern as PatternWithFlexibleRefs;
			const title = getTitle(pattern.theme) ?? "Other";
			const arr = groupsMap.get(title) ?? [];
			arr.push(item);
			groupsMap.set(title, arr);
		}
		const groups = [...groupsMap.entries()]
			.sort((a, b) => a[0].localeCompare(b[0]))
			.map(([title, groupItems]) => ({ title, items: groupItems }));
		return { groups, flat: [] };
	}, [
		items,
		selectedTagIds,
		selectedAudienceIds,
		sortBy,
		groupByTheme,
		manualOrderActive,
	]);

	const handleRemoveItem = (patternId: string) => {
		removePattern(patternId);
	};

	const handleExpandItem = (slug: string) => {
		// Navigate to pattern page
		window.location.href = `/pattern/${slug}`;
	};

	const clearAll = () => {
		setSelectedTagIds([]);
		setSelectedAudienceIds([]);
		setGroupByTheme(false);
		setSortBy("az");
		setManualOrderActive(false);
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

				{/* Sort by */}
				<Select
					value={sortBy}
					onValueChange={(v) => {
						if (v === "az" || v === "za") setSortBy(v);
					}}
				>
					<SelectTrigger aria-label="Sort by">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="az">Title (A–Z)</SelectItem>
						<SelectItem value="za">Title (Z–A)</SelectItem>
					</SelectContent>
				</Select>

				{/* Group by theme */}
				<Toggle
					variant="outline"
					pressed={groupByTheme}
					onPressedChange={setGroupByTheme}
					aria-label="Group by theme"
					className="px-3 font-normal"
				>
					Group by theme
				</Toggle>

				{/* Tags multi-select */}
				<MultiSelect values={selectedTagIds} onValuesChange={setSelectedTagIds}>
					<MultiSelectTrigger aria-label="Filter by tags">
						<MultiSelectValue placeholder="Filter by tags" />
					</MultiSelectTrigger>
					<MultiSelectContent
						search={{ placeholder: "Search tags...", emptyMessage: "No tags" }}
					>
						<MultiSelectGroup heading="Tags">
							{availableTags.map((t) => (
								<MultiSelectItem key={t.id} value={t.id}>
									{t.title}
								</MultiSelectItem>
							))}
						</MultiSelectGroup>
					</MultiSelectContent>
				</MultiSelect>

				{/* Audiences multi-select */}
				<MultiSelect
					values={selectedAudienceIds}
					onValuesChange={setSelectedAudienceIds}
				>
					<MultiSelectTrigger aria-label="Filter by audiences">
						<MultiSelectValue placeholder="Filter by audiences" />
					</MultiSelectTrigger>
					<MultiSelectContent
						search={{
							placeholder: "Search audiences...",
							emptyMessage: "No audiences",
						}}
					>
						<MultiSelectGroup heading="Audiences">
							{availableAudiences.map((a) => (
								<MultiSelectItem key={a.id} value={a.id}>
									{a.title}
								</MultiSelectItem>
							))}
						</MultiSelectGroup>
					</MultiSelectContent>
				</MultiSelect>

				<Button
					variant="ghost"
					className="text-muted-foreground text-sm hover:text-foreground"
					onClick={clearAll}
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
				) : processed.groups ? (
					processed.groups.map(({ title, items: groupItems }) => (
						<div key={title} className="mt-2">
							<h4 className="mb-1 font-normal text-muted-foreground text-sm">
								{title}
							</h4>
							{groupItems.map((item) => {
								type RefTheme = { _ref: string };
								type PopulatedTheme = { title?: string | null };
								type PatternMaybePopulatedTheme = Pattern & {
									theme?: RefTheme | PopulatedTheme;
								};

								const pattern = item.pattern as PatternMaybePopulatedTheme;
								const themeTitle =
									pattern.theme && "title" in pattern.theme
										? pattern.theme.title || undefined
										: undefined;

								const itemData: CarrierBagItemData = {
									id: pattern._id,
									title: pattern.title || "Untitled Pattern",
									subtitle: themeTitle,
								};
								return (
									<CarrierBagItem
										key={pattern._id}
										item={itemData}
										onRemove={() => handleRemoveItem(pattern._id)}
										onExpand={() =>
											handleExpandItem(getSlugString(pattern) || "")
										}
									/>
								);
							})}
						</div>
					))
				) : (
					<Reorder.Group
						axis="y"
						values={items}
						onReorder={(newOrder) => setItems(newOrder)}
						layoutScroll
						as="div"
						style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
						onPointerDown={() => {
							if (!manualOrderActive) setManualOrderActive(true);
							setSelectedTagIds([]);
							setSelectedAudienceIds([]);
							setGroupByTheme(false);
						}}
					>
						{processed.flat.map((item) => {
							type RefTheme = { _ref: string };
							type PopulatedTheme = { title?: string | null };
							type PatternMaybePopulatedTheme = Pattern & {
								theme?: RefTheme | PopulatedTheme;
							};

							const pattern = item.pattern as PatternMaybePopulatedTheme;
							const themeTitle =
								pattern.theme && "title" in pattern.theme
									? pattern.theme.title || undefined
									: undefined;

							const itemData: CarrierBagItemData = {
								id: pattern._id,
								title: pattern.title || "Untitled Pattern",
								subtitle: themeTitle,
							};
							return (
								<Reorder.Item
									as="div"
									key={pattern._id}
									value={item}
									style={{ position: "relative" }}
								>
									<CarrierBagItem
										key={pattern._id}
										item={itemData}
										onRemove={() => handleRemoveItem(pattern._id)}
										onExpand={() =>
											handleExpandItem(getSlugString(pattern) || "")
										}
									/>
								</Reorder.Item>
							);
						})}
					</Reorder.Group>
				)}
			</div>
		</div>
	);
}
