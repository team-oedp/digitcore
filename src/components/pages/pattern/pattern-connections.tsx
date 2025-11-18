import { ChartRelationshipIcon, Tag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	BadgeGroup,
	BadgeGroupContainer,
} from "~/components/shared/badge-group";
import { ThemeMiniBadge } from "~/components/shared/theme-mini-badge";
import { Badge } from "~/components/ui/badge";
import type {
	Audience,
	PATTERN_UTILITIES_QUERYResult,
	Tag,
	Theme,
} from "~/sanity/sanity.types";
import { ClickableBadge } from "./clickable-badge";

type PatternConnectionsProps = {
	audiences?: Audience[];
	tags?: Tag[];
	theme?: Theme;
	patternUtilities?: PATTERN_UTILITIES_QUERYResult | null;
};

export function PatternConnections({
	audiences,
	tags,
	theme,
	patternUtilities,
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
					<Badge variant="theme" className="cursor-pointer" asChild>
						<ClickableBadge
							type="theme"
							id={theme._id}
							title={theme.title || undefined}
							icon={
								<ThemeMiniBadge label={patternUtilities?.themeMiniBadgeLabel} />
							}
						>
							<span className="text-nowrap">{theme.title}</span>
						</ClickableBadge>
					</Badge>
				</BadgeGroup>
			)}

			{/* Audiences Row */}
			{audiences && audiences.length > 0 && (
				<BadgeGroup>
					{audiences.map((audience) => (
						<Badge
							key={audience._id}
							variant="audience"
							className="cursor-pointer"
							asChild
						>
							<ClickableBadge
								type="audience"
								id={audience._id}
								title={audience.title || undefined}
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
							</ClickableBadge>
						</Badge>
					))}
				</BadgeGroup>
			)}

			{/* Tags Row */}
			{tags && tags.length > 0 && (
				<BadgeGroup>
					{tags.map((tag) => (
						<Badge
							key={tag._id}
							variant="tag"
							className="cursor-pointer capitalize"
							asChild
						>
							<ClickableBadge
								type="tag"
								id={tag._id}
								icon={
									<HugeiconsIcon
										icon={Tag01Icon}
										size={12}
										color="currentColor"
										strokeWidth={1.5}
										className="md:h-[14px] md:w-[14px]"
									/>
								}
								title={tag.title || undefined}
							>
								<span className="text-nowrap">{tag.title}</span>
							</ClickableBadge>
						</Badge>
					))}
				</BadgeGroup>
			)}
		</BadgeGroupContainer>
	);
}
