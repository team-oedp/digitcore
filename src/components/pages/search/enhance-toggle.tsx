"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Toggle } from "~/components/ui/toggle";

type EnhanceToggleProps = {
	enabled: boolean;
	onToggle: (enabled: boolean) => void;
	audiencePreferences?: string[];
	themePreferences?: string[];
};

export function EnhanceToggle({
	enabled,
	onToggle,
	audiencePreferences = [],
	themePreferences = [],
}: EnhanceToggleProps) {
	const hasPreferences =
		audiencePreferences.length > 0 || themePreferences.length > 0;

	const generateHoverText = () => {
		const parts: string[] = [];

		if (audiencePreferences.length > 0) {
			parts.push(`audience preferences (${audiencePreferences.join(", ")})`);
		}

		if (themePreferences.length > 0) {
			parts.push(`theme preferences (${themePreferences.join(", ")})`);
		}

		const preferencesText = parts.join(" and ");
		return `Results that match your ${preferencesText} will be prioritized.`;
	};

	// If user has preferences, show the enhance toggle
	if (hasPreferences) {
		return (
			<div className="inline-flex py-2">
				<HoverCard>
					<HoverCardTrigger asChild>
						<Toggle
							pressed={enabled}
							onPressedChange={onToggle}
							variant="outline"
							size="sm"
							className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<Sparkles className="h-3 w-3" />
							<span className="text-xs">Enhance</span>
						</Toggle>
					</HoverCardTrigger>
					<HoverCardContent
						className="w-80"
						align="start"
						collisionPadding={16}
					>
						<div className="space-y-2">
							<h4 className="font-normal text-sm">Enhance Results</h4>
							<p className="text-muted-foreground text-sm">
								{generateHoverText()}
							</p>
						</div>
					</HoverCardContent>
				</HoverCard>
			</div>
		);
	}

	// If user has no preferences, show nothing (message appears elsewhere)
	return null;
}
