"use client";

import { Sparkles } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/components/ui/hover-card";
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
	const hasPreferences = audiencePreferences.length > 0 || themePreferences.length > 0;

	// Don't render if no preferences exist
	if (!hasPreferences) {
		return null;
	}

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

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<div className="flex items-center gap-2">
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
				</div>
			</HoverCardTrigger>
			<HoverCardContent className="w-80">
				<div className="space-y-2">
					<h4 className="text-sm font-semibold">Enhance Results</h4>
					<p className="text-sm text-muted-foreground">
						{generateHoverText()}
					</p>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}