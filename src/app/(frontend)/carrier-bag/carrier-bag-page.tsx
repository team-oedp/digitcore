"use client";

import {
	AiIdeaIcon,
	Book02Icon,
	Chatting01Icon,
	CleaningBucketIcon,
	Directions01Icon,
	Download05Icon,
	FileDownloadIcon,
	Link05Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CustomPortableText } from "~/components/global/portable-text";
import { PDFPreviewModal } from "~/components/pdf/pdf-preview-modal";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "~/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
} from "~/components/ui/sidebar";
import { useCarrierBagDocument } from "~/hooks/use-pattern-content";
import { client } from "~/sanity/lib/client";
import { PATTERNS_BY_SLUGS_QUERY } from "~/sanity/lib/queries";
import type { CarrierBag } from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { CarrierBagContent } from "./carrier-bag-content";

const uiData = {
	nav: [
		{ label: "Guide", icon: Directions01Icon },
		{ label: "Remove All", icon: CleaningBucketIcon },
		{ label: "Download List As JSON", icon: Download05Icon },
		{ label: "Export Patterns As PDF", icon: FileDownloadIcon },
		{ label: "Generate Link", icon: Link05Icon },
		{ label: "Share To Socials", icon: Chatting01Icon },
	],
	context: {
		text: "Ursula Le Guin's carrier bag theory of fiction suggests that stories are like carrier bags, designed to hold a variety of experiences and ideas. Instead of focusing solely on traditional narratives of conflict and heroism, Le Guin emphasizes the importance of inclusivity and the diverse elements that make up human experience. She argues that fiction should reflect the complexity of life, serving as a container for the multitude of voices and perspectives that shape our understanding of the world.",
	},
};

function CloseCarrierBagButton() {
	const router = useRouter();

	return (
		<Button
			variant="secondary"
			onClick={() => {
				const ref = document.referrer;
				if (ref) {
					try {
						const referrerUrl = new URL(ref);
						if (referrerUrl.origin === window.location.origin) {
							router.back();
							return;
						}
					} catch (err) {}
				}
				router.push("/");
			}}
		>
			<span className="text-xs uppercase">Close carrier bag</span>
		</Button>
	);
}

export function CarrierBagPage({ data }: { data?: CarrierBag }) {
	const items = useCarrierBagStore((state) => state.items);
	const clearBag = useCarrierBagStore((state) => state.clearBag);
	const addPattern = useCarrierBagStore((state) => state.addPattern);
	const documentData = useCarrierBagDocument(items);
	const router = useRouter();

	const [shareOpen, setShareOpen] = useState(false);

	const bagSlugs = useMemo(() => {
		return items
			.map((i) =>
				typeof i.pattern.slug === "string"
					? i.pattern.slug
					: i.pattern.slug?.current,
			)
			.filter(Boolean) as string[];
	}, [items]);

	const shareUrl = useMemo(() => {
		if (typeof window === "undefined") return "";
		const url = new URL(`${window.location.origin}/carrier-bag`);
		if (bagSlugs.length > 0) {
			url.searchParams.set("slugs", bagSlugs.join(","));
		}
		url.searchParams.set("mode", "replace");
		return url.toString();
	}, [bagSlugs]);

	useEffect(() => {
		const { search } = window.location;
		if (!search) return;
		const params = new URLSearchParams(search);
		const slugsParam = params.get("slugs");
		if (!slugsParam) return;
		const mode = params.get("mode");
		const slugs = slugsParam
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
		if (slugs.length === 0) return;
		(async () => {
			try {
				const patterns = await client.fetch(PATTERNS_BY_SLUGS_QUERY, { slugs });
				if (mode === "replace") {
					clearBag();
				}
				for (const p of patterns) {
					addPattern(p);
				}
				const cleanUrl = `${window.location.origin}/carrier-bag`;
				window.history.replaceState({}, "", cleanUrl);
			} catch (err) {
				// swallow
			}
		})();
	}, [addPattern, clearBag]);

	const handleDownloadJson = () => {
		const payload = {
			generatedAt: new Date().toISOString(),
			count: items.length,
			patterns: items.map((i) => ({
				id: i.pattern._id,
				title: i.pattern.title,
				slug:
					typeof i.pattern.slug === "string"
						? i.pattern.slug
						: i.pattern.slug?.current,
				notes: i.notes,
				dateAdded: i.dateAdded,
			})),
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], {
			type: "application/json",
		});
		const href = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = href;
		a.download = "carrier-bag.json";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(href);
	};

	const handleNavClick = (label: string) => {
		switch (label) {
			case "Guide":
				router.push("/");
				break;
			case "Remove All":
				clearBag();
				break;
			case "Download List As JSON":
				handleDownloadJson();
				break;
			case "Export Patterns As PDF":
				// handled by PDFPreviewModal wrapper trigger
				break;
			case "Generate Link":
				navigator.clipboard.writeText(shareUrl).catch(() => {});
				break;
			case "Share To Socials":
				setShareOpen((o) => !o);
				break;
		}
	};

	return (
		<SidebarProvider
			className="flex h-full min-h-0 w-full gap-2 bg-neutral-200"
			style={
				{
					"--sidebar-width": "24rem",
				} as React.CSSProperties
			}
			defaultOpen={true}
		>
			<Sidebar
				collapsible="none"
				className="hidden h-full min-h-0 flex-col overflow-hidden rounded-md bg-primary-foreground md:flex"
			>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>Utilities</SidebarGroupLabel>
							<SidebarMenu>
								{uiData.nav.map((item) => (
									<SidebarMenuItem key={item.label}>
										{item.label === "Export Patterns As PDF" ? (
											<PDFPreviewModal
												documentData={documentData}
												disabled={items.length === 0}
											>
												<SidebarMenuButton asChild>
													<button
														type="button"
														className="w-full"
														disabled={items.length === 0}
													>
														<div className="flex items-center gap-2">
															<Icon icon={item.icon} />
															<span className="capitalize">{item.label}</span>
														</div>
													</button>
												</SidebarMenuButton>
											</PDFPreviewModal>
										) : item.label === "Share To Socials" ? (
											<Popover open={shareOpen} onOpenChange={setShareOpen}>
												<PopoverTrigger asChild>
													<SidebarMenuButton asChild>
														<button
															type="button"
															className="w-full"
															disabled={items.length === 0}
														>
															<div className="flex items-center gap-2">
																<Icon icon={item.icon} />
																<span className="capitalize">{item.label}</span>
															</div>
														</button>
													</SidebarMenuButton>
												</PopoverTrigger>
												<PopoverContent className="w-80">
													<div className="space-y-2">
														<p className="font-medium text-sm">
															Share this carrier bag
														</p>
														<input
															readOnly
															value={shareUrl}
															className="w-full rounded border bg-muted px-2 py-1 text-xs"
														/>
														<div className="grid grid-cols-3 gap-2">
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	window.open(
																		`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
																		"_blank",
																	)
																}
															>
																Facebook
															</Button>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	window.open(
																		`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
																		"_blank",
																	)
																}
															>
																LinkedIn
															</Button>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	window.open(
																		`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
																		"_blank",
																	)
																}
															>
																X
															</Button>
														</div>
													</div>
												</PopoverContent>
											</Popover>
										) : (
											<SidebarMenuButton asChild>
												<button
													type="button"
													className="w-full"
													onClick={() => handleNavClick(item.label)}
													disabled={
														item.label !== "Guide" && items.length === 0
													}
												>
													<div className="flex items-center gap-2">
														<Icon icon={item.icon} />
														<span className="capitalize">{item.label}</span>
													</div>
												</button>
											</SidebarMenuButton>
										)}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
							<SidebarGroupLabel>Context</SidebarGroupLabel>
							<Card className="gap-2 py-4 shadow-none">
								<CardHeader className="px-4">
									<Icon icon={AiIdeaIcon} />
								</CardHeader>
								<CardContent className="px-4">
									{data?.information && data.information.length > 0 ? (
										<CustomPortableText
											className="text-xs"
											value={data.information as unknown as never}
										/>
									) : (
										<p className="text-xs">{uiData.context.text}</p>
									)}
								</CardContent>
								<CardFooter className="m-0 flex justify-start px-4 pt-2">
									<Button variant="link" size="inline" asChild>
										<Link href="/">
											<Icon icon={Book02Icon} />
											<span className="text-xs uppercase">Read more</span>
										</Link>
									</Button>
								</CardFooter>
							</Card>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter className="mt-auto flex flex-col items-start">
					<CloseCarrierBagButton />
				</SidebarFooter>
			</Sidebar>
			<CarrierBagContent />
		</SidebarProvider>
	);
}
