"use client";

import {
	Chatting01Icon,
	CleaningBucketIcon,
	Download05Icon,
	FileDownloadIcon,
	Link05Icon,
	MoreHorizontalCircle01Icon,
	Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { PortableTextBlock } from "next-sanity";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { BlueskyIcon } from "~/components/icons/logos/bluesky-icon";
import { InstagramIcon } from "~/components/icons/logos/instagram-icon";
import { LinkedInIcon } from "~/components/icons/logos/linkedin-icon";
import { PDFPreviewModal } from "~/components/pdf/pdf-preview-modal";
import { CopyButton } from "~/components/shared/copy-button";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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
import {
	type CarrierBagDocumentData,
	useCarrierBagDocument,
} from "~/hooks/use-pattern-content";
import { client } from "~/sanity/lib/client";
import { PATTERNS_BY_SLUGS_QUERY } from "~/sanity/lib/queries";
import type { CarrierBag, Pattern } from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { CarrierBagContent } from "./carrier-bag-content";

const uiData = {
	nav: [
		{ label: "Export Patterns As PDF", icon: FileDownloadIcon },
		{ label: "Generate Link", icon: Link05Icon },
		{ label: "Share To Socials", icon: Chatting01Icon },
		{ label: "Download List As JSON", icon: Download05Icon },
		{ label: "Remove All", icon: CleaningBucketIcon },
	],
	context: {
		text: "Ursula Le Guin's carrier bag theory of fiction suggests that stories are like carrier bags, designed to hold a variety of experiences and ideas. Instead of focusing solely on traditional narratives of conflict and heroism, Le Guin emphasizes the importance of inclusivity and the diverse elements that make up human experience. She argues that fiction should reflect the complexity of life, serving as a container for the multitude of voices and perspectives that shape our understanding of the world.",
	},
};

function SidebarContentComponent(props: {
	data?: CarrierBag;
	documentData: CarrierBagDocumentData;
	itemsCount: number;
	shareOpen: boolean;
	setShareOpen: (open: boolean) => void;
	shareUrl: string;
	handleNavClick: (label: string) => void;
}) {
	const {
		data,
		documentData,
		itemsCount,
		shareOpen,
		setShareOpen,
		shareUrl,
		handleNavClick,
	} = props;
	return (
		<>
			<SidebarContent className="flex h-full flex-col">
				<SidebarGroup className="flex h-full flex-col">
					<SidebarGroupContent className="flex flex-col">
						<div>
							<SidebarGroupLabel>Utilities</SidebarGroupLabel>
							<SidebarMenu>
								{uiData.nav.map((item) => (
									<SidebarMenuItem key={item.label}>
										{item.label === "Export Patterns As PDF" ? (
											<PDFPreviewModal
												documentData={documentData}
												disabled={itemsCount === 0}
											>
												<SidebarMenuButton asChild>
													<button
														type="button"
														className="w-full"
														disabled={itemsCount === 0}
													>
														<div className="flex items-center gap-2">
															<Icon icon={item.icon} />
															<span className="text-sm capitalize">
																{item.label}
															</span>
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
															disabled={itemsCount === 0}
														>
															<div className="flex items-center gap-2">
																<Icon icon={item.icon} />
																<span className="text-sm capitalize">
																	{item.label}
																</span>
															</div>
														</button>
													</SidebarMenuButton>
												</PopoverTrigger>
												<PopoverContent className="w-80 p-4">
													<div className="space-y-4">
														<p className="mb-6 text-primary text-sm">
															Share this carrier bag
														</p>
														<input
															readOnly
															value={shareUrl}
															className="w-full rounded-md border border-border bg-muted px-2 py-1 text-base"
														/>
														<div className="grid grid-cols-3 gap-2">
															<Button
																variant="secondary"
																size="sm"
																onClick={() =>
																	window.open(
																		`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
																		"_blank",
																	)
																}
																className="flex items-center justify-center p-2"
															>
																<LinkedInIcon />
															</Button>
															<Button
																variant="secondary"
																size="sm"
																onClick={() =>
																	window.open(
																		`https://bsky.app/intent/compose?text=${encodeURIComponent(`Check out this carrier bag: ${shareUrl}`)}`,
																		"_blank",
																	)
																}
																className="flex items-center justify-center p-2"
															>
																<BlueskyIcon />
															</Button>
															<Button
																variant="secondary"
																size="sm"
																onClick={() => {
																	// Instagram doesn't have a direct web share URL, so copy to clipboard
																	navigator.clipboard
																		.writeText(shareUrl)
																		.then(() => {
																			alert(
																				"Link copied! You can now paste it in your Instagram story or bio.",
																			);
																		});
																}}
																className="flex items-center justify-center p-2"
															>
																<InstagramIcon />
															</Button>
														</div>
													</div>
												</PopoverContent>
											</Popover>
										) : item.label === "Generate Link" ? (
											<SidebarMenuButton asChild>
												<CopyButton
													className="w-full"
													value={shareUrl}
													disabled={itemsCount === 0}
													copiedChildren={
														<div className="flex items-start justify-start gap-2">
															<Icon icon={Tick02Icon} />
															<span className="w-fit text-sm capitalize">
																Link Copied
															</span>
														</div>
													}
												>
													<div className="flex items-center gap-2">
														<Icon icon={item.icon} />
														<span className="text-sm capitalize">
															{item.label}
														</span>
													</div>
												</CopyButton>
											</SidebarMenuButton>
										) : (
											<SidebarMenuButton asChild>
												<button
													type="button"
													className="w-full"
													onClick={() => handleNavClick(item.label)}
													disabled={itemsCount === 0}
												>
													<div className="flex items-center gap-2">
														<Icon icon={item.icon} />
														<span className="text-sm capitalize">
															{item.label}
														</span>
													</div>
												</button>
											</SidebarMenuButton>
										)}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</div>
						<div className="mt-6">
							<SidebarGroupLabel>Context</SidebarGroupLabel>
							<Card className="gap-2 py-4 shadow-none">
								<CardContent className="px-4">
									{data?.information && data.information.length > 0 ? (
										<CustomPortableText
											className="my-0 text-minor"
											value={data.information as PortableTextBlock[]}
										/>
									) : (
										<p className="text-xs">{uiData.context.text}</p>
									)}
								</CardContent>
							</Card>
						</div>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="mt-auto flex flex-col items-start">
				<CloseCarrierBagButton />
			</SidebarFooter>
		</>
	);
}

function CloseCarrierBagButton() {
	const router = useRouter();

	return (
		<Button
			variant="ghost"
			onClick={() => {
				const ref = document.referrer;
				if (ref) {
					try {
						const referrerUrl = new URL(ref);
						if (referrerUrl.origin === window.location.origin) {
							router.back();
							return;
						}
					} catch (_err) {}
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
	const _router = useRouter();

	const [shareOpen, setShareOpen] = useState(false);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
					addPattern(p as unknown as Pattern);
				}
				const cleanUrl = `${window.location.origin}/carrier-bag`;
				window.history.replaceState({}, "", cleanUrl);
			} catch (_err) {
				// TODO: catch errors
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
			case "Remove All":
				clearBag();
				break;
			case "Download List As JSON":
				handleDownloadJson();
				break;
			case "Export Patterns As PDF":
				break;
			case "Generate Link":
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
			{/* Desktop Sidebar */}
			<Sidebar
				collapsible="none"
				className="hidden h-full min-h-0 flex-col overflow-hidden rounded-md bg-primary-foreground md:flex"
			>
				<SidebarContentComponent
					data={data}
					documentData={documentData}
					itemsCount={items.length}
					shareOpen={shareOpen}
					setShareOpen={setShareOpen}
					shareUrl={shareUrl}
					handleNavClick={handleNavClick}
				/>
			</Sidebar>

			{/* Carrier Bag Content with mobile trigger */}
			<CarrierBagContent
				mobileTrigger={
					<div className="md:hidden">
						<Popover
							open={mobileSidebarOpen}
							onOpenChange={setMobileSidebarOpen}
						>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									aria-label="Open utilities menu"
								>
									<Icon icon={MoreHorizontalCircle01Icon} size={24} />
								</Button>
							</PopoverTrigger>
							<PopoverContent
								className="mx-4 h-[80vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto p-0"
								align="end"
								sideOffset={5}
							>
								<div className="flex h-full flex-col bg-primary-foreground">
									<SidebarProvider>
										<Sidebar
											collapsible="none"
											className="flex h-full min-h-0 flex-col"
										>
											<SidebarContentComponent
												data={data}
												documentData={documentData}
												itemsCount={items.length}
												shareOpen={shareOpen}
												setShareOpen={setShareOpen}
												shareUrl={shareUrl}
												handleNavClick={handleNavClick}
											/>
										</Sidebar>
									</SidebarProvider>
								</div>
							</PopoverContent>
						</Popover>
					</div>
				}
			/>
		</SidebarProvider>
	);
}
