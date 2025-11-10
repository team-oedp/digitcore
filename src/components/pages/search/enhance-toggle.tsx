"use client";

import { Sparkles } from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Toggle } from "~/components/ui/toggle";
import type { Language } from "~/i18n/config";

type EnhanceToggleProps = {
	enabled: boolean;
	onToggle: (enabled: boolean) => void;
	hasCompletedOnboarding?: boolean;
	audiencePreferences?: string[];
	themePreferences?: string[];
	language?: Language;
};

export function EnhanceToggle({
	enabled,
	onToggle,
	hasCompletedOnboarding = false,
	audiencePreferences = [],
	themePreferences = [],
	language = "en",
}: EnhanceToggleProps) {
	const hasPreferences =
		hasCompletedOnboarding &&
		(audiencePreferences.length > 0 || themePreferences.length > 0);

	const isSpanish = language === "es";

	const enhanceLabel = isSpanish ? "Mejorar" : "Enhance";
	const enhanceResultsTitle = isSpanish
		? "Mejorar Resultados"
		: "Enhance Results";

	const generateHoverText = () => {
		const parts: string[] = [];

		if (audiencePreferences.length > 0) {
			if (isSpanish) {
				parts.push(
					`preferencias de audiencia (${audiencePreferences.join(", ")})`,
				);
			} else {
				parts.push(`audience preferences (${audiencePreferences.join(", ")})`);
			}
		}

		if (themePreferences.length > 0) {
			if (isSpanish) {
				parts.push(`preferencias de temas (${themePreferences.join(", ")})`);
			} else {
				parts.push(`theme preferences (${themePreferences.join(", ")})`);
			}
		}

		const preferencesText = parts.join(isSpanish ? " y " : " and ");
		return isSpanish
			? `Los resultados que coincidan con sus ${preferencesText} serán priorizados.`
			: `Results that match your ${preferencesText} will be prioritized.`;
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
							className="font-normal text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
						>
							<Sparkles className="h-3 w-3" />
							<span className="text-xs">{enhanceLabel}</span>
						</Toggle>
					</HoverCardTrigger>
					<HoverCardContent
						className="w-80"
						align="start"
						collisionPadding={16}
					>
						<div className="space-y-2">
							<h4 className="font-normal text-sm">{enhanceResultsTitle}</h4>
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
