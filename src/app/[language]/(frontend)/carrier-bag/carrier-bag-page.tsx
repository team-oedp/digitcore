"use client";

import {
	Chatting01Icon,
	Delete02Icon,
	Download05Icon,
	FileDownloadIcon,
	Link05Icon,
	MoreHorizontalCircle01Icon,
	Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { PortableTextBlock } from "next-sanity";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BlueskyIcon } from "~/components/icons/logos/bluesky-icon";
import { InstagramIcon } from "~/components/icons/logos/instagram-icon";
import { LinkedInIcon } from "~/components/icons/logos/linkedin-icon";
import { PDFPreviewModal } from "~/components/pdf/pdf-preview-modal";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { CopyButton } from "~/components/shared/buttons/copy-button";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
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
	SidebarGroupAction,
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
import type {
	CARRIER_BAG_QUERYResult,
	PATTERNS_BY_SLUGS_QUERYResult,
} from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { CarrierBagContent } from "./carrier-bag-content";

type NavItem = {
	label: string;
	icon: typeof FileDownloadIcon;
	key: string;
};

function getNavItems(data?: CARRIER_BAG_QUERYResult): NavItem[] {
	return [
		{
			label: data?.exportPdfButtonLabel || "Export Patterns As PDF",
			icon: FileDownloadIcon,
			key: "exportPdf",
		},
		{
			label: data?.generateLinkButtonLabel || "Generate Link",
			icon: Link05Icon,
			key: "generateLink",
		},
		{
			label: data?.shareToSocialsButtonLabel || "Share To Socials",
			icon: Chatting01Icon,
			key: "shareToSocials",
		},
		{
			label: data?.downloadJsonButtonLabel || "Download List As JSON",
			icon: Download05Icon,
			key: "downloadJson",
		},
		{
			label: data?.removeAllButtonLabel || "Remove All",
			icon: Delete02Icon,
			key: "removeAll",
		},
	];
}

function SidebarContentComponent(props: {
	data?: CARRIER_BAG_QUERYResult;
	documentData: CarrierBagDocumentData;
	itemsCount: number;
	shareOpen: boolean;
	setShareOpen: (open: boolean) => void;
	shareUrl: string;
	handleNavClick: (key: string) => void;
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
	const navItems = getNavItems(data);
	const utilitiesLabel = data?.utilitiesGroupLabel || "Utilities";
	const applicationLabel = data?.applicationSectionLabel || "Application";

	return (
		<>
			<SidebarContent className="flex h-full flex-col justify-start gap-4 bg-container-background">
				<SidebarGroup className="flex flex-col">
					<SidebarGroupContent className="flex flex-col">
						<div>
							<SidebarGroupLabel>{utilitiesLabel}</SidebarGroupLabel>
							<SidebarMenu>
								{navItems.map((item) => (
									<SidebarMenuItem key={item.key}>
										{item.key === "exportPdf" ? (
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
										) : item.key === "shareToSocials" ? (
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
												<PopoverContent className="w-80 bg-popover p-4">
													<div className="space-y-4">
														<p className="mb-6 text-popover-foreground text-sm">
															Share this carrier bag
														</p>
														<input
															readOnly
															value={shareUrl}
															className="w-full rounded-md border border-border bg-background px-2 py-1 text-base text-foreground"
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
										) : item.key === "generateLink" ? (
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
													onClick={() => handleNavClick(item.key)}
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
					</SidebarGroupContent>
				</SidebarGroup>
				{data?.information && (
					<SidebarGroup>
						<SidebarGroupLabel>{applicationLabel}</SidebarGroupLabel>
						<SidebarGroupAction>
							<span className="sr-only">About</span>
						</SidebarGroupAction>
						<SidebarGroupContent>
							<CustomPortableText
								value={data.information as PortableTextBlock[]}
								className="px-1 text-muted-foreground"
							/>
						</SidebarGroupContent>
					</SidebarGroup>
				)}
			</SidebarContent>
			<SidebarFooter className="mt-auto flex flex-col items-start bg-container-background">
				<CloseCarrierBagButton label={data?.closeCarrierBagButtonLabel} />
			</SidebarFooter>
		</>
	);
}

function CloseCarrierBagButton({
	label,
}: {
	label?: string | null;
}) {
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
			<span className="text-xs uppercase">{label || "Close carrier bag"}</span>
		</Button>
	);
}

export function CarrierBagPage({ data }: { data?: CARRIER_BAG_QUERYResult }) {
	const items = useCarrierBagStore((state) => state.items);
	const clearBag = useCarrierBagStore((state) => state.clearBag);
	const addPattern = useCarrierBagStore((state) => state.addPattern);
	const documentData = useCarrierBagDocument(items);

	const [shareOpen, setShareOpen] = useState(false);
	const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

	const bagSlugs = useMemo(() => {
		return items.map((i) => i.pattern.slug).filter(Boolean) as string[];
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
			const cleanUrl = `${window.location.origin}/carrier-bag`;
			try {
				const patterns = await client.fetch<PATTERNS_BY_SLUGS_QUERYResult>(
					PATTERNS_BY_SLUGS_QUERY,
					{ slugs },
				);
				// Preserve incoming slug order when adding
				const patternsBySlug = new Map(patterns.map((p) => [p.slug ?? "", p]));
				const ordered = slugs
					.map((slug) => patternsBySlug.get(slug))
					.filter(Boolean) as PATTERNS_BY_SLUGS_QUERYResult;
				if (mode === "replace") {
					clearBag();
				}
				for (const p of ordered) {
					addPattern(p);
				}
				window.history.replaceState({}, "", cleanUrl);
			} catch (error) {
				console.error("Failed to load carrier bag from URL", error);
				window.history.replaceState({}, "", cleanUrl);
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
				slug: i.pattern.slug,
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

	const handleNavClick = (key: string) => {
		switch (key) {
			case "removeAll":
				clearBag();
				break;
			case "downloadJson":
				handleDownloadJson();
				break;
			case "exportPdf":
				break;
			case "generateLink":
				break;
			case "shareToSocials":
				setShareOpen((o) => !o);
				break;
		}
	};

	return (
		<SidebarProvider
			className="flex h-full min-h-0 w-full gap-2 bg-page-background"
			style={
				{
					"--sidebar-width": "24rem",
				} as React.CSSProperties
			}
			defaultOpen={true}
		>
			<Sidebar
				collapsible="none"
				className="hidden h-full min-h-0 flex-col overflow-hidden rounded-md md:flex"
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

			{/* Carrier Bag Content with mobile trigger (hidden on desktop) */}
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
								<div className="flex h-full flex-col">
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
				emptyStateMessage={data?.emptyStateMessage}
				carrierBagData={data}
			/>
		</SidebarProvider>
	);
}
