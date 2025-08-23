import { ChartRelationshipIcon, Tag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	BadgeGroup,
	BadgeGroupContainer,
} from "~/components/shared/badge-group";
import { Badge } from "~/components/ui/badge";
import type { Audience, Tag, Theme } from "~/sanity/sanity.types";
import { ClickableBadge } from "./clickable-badge";

type PatternConnectionsProps = {
	audiences?: Audience[];
	tags?: Tag[];
	theme?: Theme;
};

export function PatternConnections({
	audiences,
	tags,
	theme,
}: PatternConnectionsProps) {
	// Only render if there are any connections
	if (!audiences?.length && !tags?.length && !theme) {
		return null;
	}

	return (
		<BadgeGroupContainer className="pt-6 md:pt-8">
			{/* Theme Row */}
			{theme && (
				<BadgeGroup>
					<ClickableBadge
						type="theme"
						id={theme._id}
						title={theme.title || undefined}
					>
						<Badge variant="theme" className="cursor-pointer">
							<span className="flex h-[16px] items-center justify-center rounded border border-orange-200 px-1 py-0 text-[10px] tracking-[-0.14px] md:h-[18px] md:px-1.5 md:text-[12px]">
								Theme
							</span>
							<span className="text-nowrap">{theme.title}</span>
						</Badge>
					</ClickableBadge>
				</BadgeGroup>
			)}

			{/* Audiences Row */}
			{audiences && audiences.length > 0 && (
				<BadgeGroup>
					{audiences.map((audience) => (
						<ClickableBadge
							key={audience._id}
							type="audience"
							id={audience._id}
							title={audience.title || undefined}
						>
							<Badge
								variant="audience"
								className="cursor-pointer transition-colors duration-200 hover:bg-blue-150"
								icon={
									<HugeiconsIcon
										icon={ChartRelationshipIcon}
										size={12}
										color="currentColor"
										strokeWidth={1.5}
										className="md:h-[14px] md:w-[14px]"
									/>
								}
							>
								<span className="text-nowrap">{audience.title}</span>
							</Badge>
						</ClickableBadge>
					))}
				</BadgeGroup>
			)}

			{/* Tags Row */}
			{tags && tags.length > 0 && (
				<BadgeGroup>
					{tags.map((tag) => (
						<ClickableBadge
							key={tag._id}
							type="tag"
							id={tag._id}
							title={tag.title || undefined}
						>
							<Badge
								variant="tag"
								className="cursor-pointer capitalize transition-colors duration-200 hover:bg-violet-150"
								icon={
									<HugeiconsIcon
										icon={Tag01Icon}
										size={12}
										color="currentColor"
										strokeWidth={1.5}
										className="md:h-[14px] md:w-[14px]"
									/>
								}
							>
								<span className="text-nowrap">{tag.title}</span>
							</Badge>
						</ClickableBadge>
					))}
				</BadgeGroup>
			)}
		</BadgeGroupContainer>
	);
}
