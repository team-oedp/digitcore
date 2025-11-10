"use client";

import { Sparkles } from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { Toggle } from "~/components/ui/toggle";
import type { Language } from "~/i18n/config";
import type { SEARCH_CONFIG_QUERYResult } from "~/sanity/sanity.types";

type EnhanceToggleProps = {
	enabled: boolean;
	onToggle: (enabled: boolean) => void;
	hasCompletedOnboarding?: boolean;
	audiencePreferences?: string[];
	themePreferences?: string[];
	language?: Language;
	searchData?: SEARCH_CONFIG_QUERYResult;
};

export function EnhanceToggle({
	enabled,
	onToggle,
	hasCompletedOnboarding = false,
	audiencePreferences = [],
	themePreferences = [],
	language = "en",
	searchData,
}: EnhanceToggleProps) {
	const hasPreferences =
		hasCompletedOnboarding &&
		(audiencePreferences.length > 0 || themePreferences.length > 0);

	const isSpanish = language === "es";

	const enhanceLabel =
		searchData?.enhanceLabel ?? (isSpanish ? "Mejorar" : "Enhance");
	const enhanceResultsTitle =
		searchData?.enhanceResultsTitle ??
		(isSpanish ? "Mejorar Resultados" : "Enhance Results");

	const generateHoverText = () => {
		const parts: string[] = [];

		const audienceLabel =
			searchData?.audiencePreferencesLabel ??
			(isSpanish ? "preferencias de audiencia" : "audience preferences");
		const themeLabel =
			searchData?.themePreferencesLabel ??
			(isSpanish ? "preferencias de temas" : "theme preferences");
		const conjunction =
			searchData?.preferencesConjunction ?? (isSpanish ? " y " : " and ");

		if (audiencePreferences.length > 0) {
			parts.push(`${audienceLabel} (${audiencePreferences.join(", ")})`);
		}

		if (themePreferences.length > 0) {
			parts.push(`${themeLabel} (${themePreferences.join(", ")})`);
		}

		const preferencesText = parts.join(conjunction);

		const descriptionTemplate =
			searchData?.enhanceHoverDescription ??
			(isSpanish
				? "Los resultados que coincidan con sus {preferencesText} serán priorizados."
				: "Results that match your {preferencesText} will be prioritized.");

		return descriptionTemplate.replace("{preferencesText}", preferencesText);
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
