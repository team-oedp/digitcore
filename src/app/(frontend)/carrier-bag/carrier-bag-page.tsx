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
import { useRouter } from "next/navigation";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "~/components/ui/card";
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
import { CarrierBagContent } from "./carrier-bag-content";

const data = {
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
			variant="outline"
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

export function CarrierBagPage() {
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
								{data.nav.map((item) => (
									<SidebarMenuItem key={item.label}>
										<SidebarMenuButton
											asChild
											isActive={item.label === "Messages & media"}
										>
											<div className="flex items-center gap-2">
												<Icon icon={item.icon} />
												<span className="capitalize">{item.label}</span>
											</div>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
							<SidebarGroupLabel>Context</SidebarGroupLabel>
							<Card className="gap-2 py-4 shadow-none">
								<CardHeader className="px-4">
									<Icon icon={AiIdeaIcon} />
								</CardHeader>
								<CardContent className="px-4">
									<p className="text-xs">{data.context.text}</p>
								</CardContent>
								<CardFooter className="m-0 flex justify-start px-4 pt-2">
									<Button variant="link" size="inline">
										<Icon icon={Book02Icon} />
										<span className="text-xs uppercase">Read more</span>
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
