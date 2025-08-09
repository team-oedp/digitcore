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
		{ name: "Guide", icon: Directions01Icon },
		{ name: "Remove All", icon: CleaningBucketIcon },
		{ name: "Download List as JSON", icon: Download05Icon },
		{ name: "Export Patterns As PDF", icon: FileDownloadIcon },
		{ name: "Generate Link", icon: Link05Icon },
		{ name: "Share To Socials", icon: Chatting01Icon },
	],
	context: {
		text: "Ursula Le Guin's carrier bag theory of fiction suggests that stories are like carrier bags, designed to hold a variety of experiences and ideas. Instead of focusing solely on traditional narratives of conflict and heroism, Le Guin emphasizes the importance of inclusivity and the diverse elements that make up human experience. She argues that fiction should reflect the complexity of life, serving as a container for the multitude of voices and perspectives that shape our understanding of the world.",
	},
};

export function CarrierBagPage() {
	return (
		<SidebarProvider
			className="flex w-full"
			style={
				{
					"--sidebar-width": "24rem",
				} as React.CSSProperties
			}
			defaultOpen={true}
		>
			<Sidebar
				collapsible="none"
				className="hidden flex-col border border-black bg-primary-foreground md:flex"
			>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarGroupLabel>Utilities</SidebarGroupLabel>
							<SidebarMenu>
								{data.nav.map((item) => (
									<SidebarMenuItem key={item.name}>
										<SidebarMenuButton
											asChild
											isActive={item.name === "Messages & media"}
										>
											<div className="flex items-center gap-2">
												<Icon icon={item.icon} />
												<span>{item.name}</span>
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
					<Button variant="outline">
						<span className="text-xs uppercase">Close carrier bag</span>
					</Button>
				</SidebarFooter>
			</Sidebar>
			<CarrierBagContent />
		</SidebarProvider>
	);
}
