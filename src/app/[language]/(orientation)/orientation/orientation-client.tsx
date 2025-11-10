"use client";

import {
	Globe02Icon,
	Home09Icon,
	SearchList02Icon,
	Share02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FilterOption } from "~/app/actions/filter-options";
import Icon01 from "~/components/icons/shapes/icon-01";
import Icon02 from "~/components/icons/shapes/icon-02";
import Icon03 from "~/components/icons/shapes/icon-03";
import Icon04 from "~/components/icons/shapes/icon-04";
import Icon05 from "~/components/icons/shapes/icon-05";
import Icon06 from "~/components/icons/shapes/icon-06";
import Icon07 from "~/components/icons/shapes/icon-07";
import Icon08 from "~/components/icons/shapes/icon-08";
import Icon09 from "~/components/icons/shapes/icon-09";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { Icon } from "~/components/shared/icon";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { i18n } from "~/i18n/config";
import { buildLocaleHref, parseLocalePath } from "~/lib/locale-path";
import { cn } from "~/lib/utils";
import type { Onboarding } from "~/sanity/sanity.types";
import { useOrientationStore } from "~/stores/orientation";

function getSafePath(path?: string) {
	try {
		if (!path) return "/";
		if (/^https?:\/\//i.test(path)) {
			return new URL(path).pathname || "/";
		}
		const cleaned = (path.split("#")[0] || "/").split("?")[0] || "/";
		const safePath = cleaned.startsWith("/") ? cleaned || "/" : "/";

		// Validate that the path is a known route in our application
		const validRoutes = [
			"/",
			"/search",
			"/patterns",
			"/tags",
			"/faq",
			"/glossary",
		];
		const validRoutePrefixes = ["/pattern/", "/tag/", "/search"];

		// Check if it's an exact match or starts with a valid prefix
		if (
			validRoutes.includes(safePath) ||
			validRoutePrefixes.some((prefix) => safePath.startsWith(prefix))
		) {
			return safePath;
		}

		// If not a valid route, return home
		return "/";
	} catch {
		return "/";
	}
}

function friendlyLabelFromPath(path?: string) {
	try {
		const safe = path ?? "/";
		const isAbsolute = /^https?:\/\//i.test(safe);
		const pathname = isAbsolute
			? new URL(safe).pathname
			: (safe.split("#")[0] || "/").split("?")[0] || "/";
		const { normalizedPath } = parseLocalePath(pathname);

		if (normalizedPath === "/") return "DIGITCORE Home Page";
		const segments = normalizedPath.split("/").filter(Boolean);
		if (segments[0] === "pattern" && segments[1]) return "Pattern Page";
		if (segments[0] === "patterns") return "Patterns Page";
		if (segments[0] === "search") return "Search Page";
		if (segments[0] === "tags") return "Tags Page";
		if (segments[0] === "faq") return "FAQ Page";
		if (segments[0] === "glossary") return "Glossary Page";
		const last = segments[segments.length - 1] || "";
		return last
			.replace(/[-_]+/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.split(" ")
			.map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
			.join(" ");
	} catch {
		return "DIGITCORE Toolkit";
	}
}

function DashedBorder({
	strokeWidth = 1.5,
}: {
	strokeWidth?: number | string;
}) {
	return (
		<svg
			aria-hidden="true"
			width="100%"
			height="100%"
			className="pointer-events-none absolute inset-0 h-full w-full text-neutral-400 dark:text-neutral-600"
			fill="none"
		>
			<rect
				x="0"
				y="0"
				width="100%"
				height="100%"
				rx="8"
				ry="8"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				strokeDasharray="4 4"
			/>
		</svg>
	);
}

function ActionButton({
	href,
	onClick,
	children,
	dashed = true,
	preserveSize = false,
	asButton = false,
}: {
	href?: string;
	onClick?: () => void;
	children: React.ReactNode;
	dashed?: boolean;
	preserveSize?: boolean;
	asButton?: boolean;
}) {
	const baseClass = preserveSize
		? "relative overflow-hidden inline-flex items-center rounded-lg border-2 border-transparent bg-primary-foreground px-3 py-2 text-left text-foreground text-sm uppercase font-light transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 lg:text-lg"
		: "relative overflow-hidden inline-flex items-center rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 text-left text-foreground text-xs uppercase font-light transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 lg:px-3 lg:py-2 lg:text-lg";

	// Use Link component when href is provided and we're not forcing button behavior
	if (href && !asButton) {
		return (
			<Link href={href} className={baseClass} onClick={onClick}>
				<span className="relative z-10 inline-flex items-center gap-2">
					{children}
				</span>
				{dashed ? <DashedBorder /> : null}
			</Link>
		);
	}

	// Always render as button when asButton is true or no href is provided
	return (
		<button type="button" onClick={onClick} className={baseClass}>
			<span className="relative z-10 inline-flex items-center gap-2">
				{children}
			</span>
			{dashed ? <DashedBorder /> : null}
		</button>
	);
}

export function OrientationClient({
	onboarding,
	patternTitle,
	returnToPath,
	pageTitle,
	audienceOptions,
	themeOptions,
}: {
	onboarding?: Onboarding;
	patternTitle?: string;
	returnToPath?: string;
	pageTitle?: string;
	audienceOptions: FilterOption[];
	themeOptions: FilterOption[];
}) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const initialStep = (() => {
		const value = Number(searchParams?.get("step") ?? "1");
		return value >= 1 && value <= 3 ? value : 1;
	})();

	const [currentSlide, setCurrentSlide] = useState<1 | 2 | 3>(
		initialStep as 1 | 2 | 3,
	);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const patternSlug = (searchParams?.get("pattern") ?? undefined) as
		| string
		| undefined;

	// Mark onboarding as seen unless the user arrived via the header override flag
	const headerOverride = searchParams?.get("via") === "header";
	const setSeen = useOrientationStore((s) => s.setSeen);
	const setSkipped = useOrientationStore((s) => s.setSkipped);

	useEffect(() => {
		if (!headerOverride) {
			setSeen(true);
		}
	}, [headerOverride, setSeen]);

	const goToSlide = (n: 1 | 2 | 3) => {
		setIsTransitioning(true);
		setTimeout(() => {
			setCurrentSlide(n);
			setIsTransitioning(false);
		}, 300);

		const params = new URLSearchParams(searchParams?.toString());
		params.set("step", String(n));
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const goToSlide1 = () => goToSlide(1);
	const goToSlide2 = () => goToSlide(2);
	const goToSlide3 = () => goToSlide(3);

	const pathname = usePathname();
	const { language: currentLanguage } = useMemo(
		() => parseLocalePath(pathname),
		[pathname],
	);

	const orientationSearchSuffix = useMemo(() => {
		if (!searchParams) {
			return "";
		}

		const params = new URLSearchParams(searchParams.toString());
		const orientationParams = ["step", "pattern", "returnTo", "via"];

		const filteredParams = new URLSearchParams();
		for (const key of orientationParams) {
			const value = params.get(key);
			if (value) {
				filteredParams.set(key, value);
			}
		}

		const query = filteredParams.toString();
		return query ? `?${query}` : "";
	}, [searchParams]);

	const languageOptions = useMemo(
		() =>
			i18n.languages.map((language) => ({
				code: language.id,
				label: language.title,
			})),
		[],
	);

	return (
		<div className="m-2 rounded-md bg-neutral-200 dark:bg-neutral-800">
			<div className="relative h-[calc(100vh-1rem)] overflow-clip rounded-md bg-primary-foreground p-2 dark:bg-neutral-900">
				<div className="absolute top-4 right-4 z-10">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type="button"
								className={cn(
									"group relative flex h-7 items-center rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear hover:bg-neutral-200 dark:hover:bg-neutral-800",
								)}
								suppressHydrationWarning
							>
								<span
									className={cn(
										"flex items-center gap-0.5 text-neutral-600 text-sm transition-colors group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100",
									)}
								>
									<HugeiconsIcon
										icon={Globe02Icon}
										size={14}
										color="currentColor"
										strokeWidth={1.5}
									/>
								</span>
								<span className="sr-only">Select language</span>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-32">
							{languageOptions.map((languageOption) => {
								const isActive = languageOption.code === currentLanguage;
								const href = buildLocaleHref(
									languageOption.code,
									`/orientation${orientationSearchSuffix}`,
								);

								return (
									<DropdownMenuItem
										key={languageOption.code}
										asChild
										className="p-0"
									>
										<Link
											href={href}
											className={cn(
												"flex w-full items-center gap-3 px-3 py-2 text-sm outline-none transition-colors",
												isActive
													? "font-medium text-foreground"
													: "text-muted-foreground hover:text-foreground",
											)}
											aria-label={`Switch to ${languageOption.label}`}
											prefetch={true}
										>
											<span
												className={cn(
													"min-w-[24px] font-medium text-xs",
													isActive
														? "text-foreground"
														: "text-muted-foreground",
												)}
											>
												{languageOption.code.toUpperCase()}
											</span>
											<span
												className={cn(
													"text-sm",
													isActive
														? "font-medium text-foreground"
														: "text-muted-foreground",
												)}
											>
												{languageOption.label}
											</span>
											<span className="sr-only">{languageOption.label}</span>
										</Link>
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div
					className={cn(
						"h-full w-full transition-opacity duration-300",
						isTransitioning ? "opacity-0" : "opacity-100",
					)}
				>
					{currentSlide === 1 && (
						<Slide1
							onboarding={onboarding}
							patternSlug={patternSlug}
							patternTitle={patternTitle}
							returnToPath={returnToPath}
							pageTitle={pageTitle}
							goToSlide2={goToSlide2}
							onNavigateSlide={goToSlide}
							language={currentLanguage}
						/>
					)}
					{currentSlide === 2 && (
						<Slide2
							goToSlide1={goToSlide1}
							goToSlide3={goToSlide3}
							onNavigateSlide={goToSlide}
							audienceOptions={audienceOptions}
							onboarding={onboarding}
							language={currentLanguage}
						/>
					)}
					{currentSlide === 3 && (
						<Slide3
							goToSlide2={goToSlide2}
							onNavigateSlide={goToSlide}
							themeOptions={themeOptions}
							onboarding={onboarding}
							language={currentLanguage}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

function OrientationBreadcrumb({
	currentSlide,
	onNavigateSlide,
	breadcrumbs,
	language,
}: {
	currentSlide: 1 | 2 | 3;
	onNavigateSlide?: (n: 1 | 2 | 3) => void;
	breadcrumbs?: {
		slide1?: string;
		slide2?: string;
		slide3?: string;
	};
	language?: string;
}) {
	const getBreadcrumbLabel = (
		slide: "slide1" | "slide2" | "slide3",
	): string => {
		if (breadcrumbs?.[slide]) {
			return breadcrumbs[slide];
		}

		if (language === "es") {
			const spanishFallbacks = {
				slide1: "Introducción",
				slide2: "Audiencias",
				slide3: "Intereses",
			};
			return spanishFallbacks[slide];
		}

		return "";
	};

	return (
		<Breadcrumb className="mb-8">
			<BreadcrumbList>
				<BreadcrumbItem>
					{currentSlide === 1 ? (
						<BreadcrumbPage>{getBreadcrumbLabel("slide1")}</BreadcrumbPage>
					) : onNavigateSlide ? (
						<BreadcrumbLink asChild>
							<button type="button" onClick={() => onNavigateSlide(1)}>
								{getBreadcrumbLabel("slide1")}
							</button>
						</BreadcrumbLink>
					) : (
						<BreadcrumbLink href="#">
							{getBreadcrumbLabel("slide1")}
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					{currentSlide === 2 ? (
						<BreadcrumbPage>{getBreadcrumbLabel("slide2")}</BreadcrumbPage>
					) : onNavigateSlide ? (
						<BreadcrumbLink asChild>
							<button type="button" onClick={() => onNavigateSlide(2)}>
								{getBreadcrumbLabel("slide2")}
							</button>
						</BreadcrumbLink>
					) : (
						<BreadcrumbLink href="#">
							{getBreadcrumbLabel("slide2")}
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					{currentSlide === 3 ? (
						<BreadcrumbPage>{getBreadcrumbLabel("slide3")}</BreadcrumbPage>
					) : onNavigateSlide ? (
						<BreadcrumbLink asChild>
							<button type="button" onClick={() => onNavigateSlide(3)}>
								{getBreadcrumbLabel("slide3")}
							</button>
						</BreadcrumbLink>
					) : (
						<BreadcrumbLink href="#">
							{getBreadcrumbLabel("slide3")}
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

function Slide({
	currentSlide,
	children,
	asset,
	onNavigateSlide,
	breadcrumbs,
	footerText,
	onboarding,
	language,
}: {
	currentSlide: 1 | 2 | 3;
	children: React.ReactNode;
	asset?: React.ReactNode;
	onNavigateSlide?: (n: 1 | 2 | 3) => void;
	breadcrumbs?: {
		slide1?: string;
		slide2?: string;
		slide3?: string;
	};
	footerText?: string;
	onboarding?: Onboarding;
	language?: string;
}) {
	const router = useRouter();
	const setSkipped = useOrientationStore((s) => s.setSkipped);
	return (
		<div className="flex h-full flex-col lg:flex-row">
			<div className="flex w-full flex-col justify-start px-3 py-3 pb-6 lg:w-1/2 lg:py-4 lg:pr-4 lg:pb-4 lg:pl-4">
				<OrientationBreadcrumb
					currentSlide={currentSlide}
					onNavigateSlide={onNavigateSlide}
					breadcrumbs={breadcrumbs}
					language={language}
				/>
				<div className="min-h-0 flex-1">{children}</div>
				<footer className="hidden pt-4 text-left text-body-muted lg:block lg:pt-8">
					{footerText || "Open Environmental Data Project"}
				</footer>
			</div>
			<div className="relative w-full flex-1 rounded-md bg-icon/20 p-2 lg:h-full lg:w-1/2 lg:flex-none lg:pl-2 dark:bg-icon/10">
				{asset || (
					<div className="h-full w-full rounded-md bg-icon/60 dark:bg-icon/30" />
				)}
			</div>
		</div>
	);
}

function Slide1({
	patternSlug,
	patternTitle,
	returnToPath,
	pageTitle,
	goToSlide2,
	onboarding,
	onNavigateSlide,
	language: languageProp,
}: {
	patternSlug: string | undefined;
	patternTitle?: string;
	returnToPath?: string;
	pageTitle?: string;
	goToSlide2: () => void;
	onboarding?: Onboarding;
	onNavigateSlide?: (n: 1 | 2 | 3) => void;
	language?: string;
}) {
	const setSkipped = useOrientationStore((s) => s.setSkipped);
	const previousRoute = useOrientationStore((s) => s.previousRoute);
	const router = useRouter();
	const pathname = usePathname();
	const { language: languageFromPath } = useMemo(
		() => parseLocalePath(pathname),
		[pathname],
	);
	const language = languageProp ?? languageFromPath;

	// Use tracked route as fallback if returnToPath is not provided
	const effectiveReturnToPath = returnToPath || previousRoute;

	const handleSkip = () => {
		setSkipped(true);

		// If there's an effective returnToPath, go back in history; otherwise go to home
		if (effectiveReturnToPath) {
			router.back();
		} else {
			// No returnTo means user came from home page, redirect to home
			router.push(buildLocaleHref(language, "/"));
		}
	};

	const toTitleCase = (s: string) =>
		s
			.split("-")
			.join(" ")
			.split(" ")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(" ");

	const asset = (
		<div className="flex h-full w-full items-center justify-center rounded-md p-2 lg:p-8">
			{/* Mobile icons */}
			<div className="relative lg:hidden">
				<Icon01
					className="absolute inset-0 max-h-full max-w-full animate-[spin_130s_linear_infinite] fill-icon/10 text-icon/30 dark:fill-icon/5 dark:text-icon/15"
					width={180}
					height={180}
				/>
				<Icon04
					className="absolute inset-0 max-h-full max-w-full animate-[spin_110s_linear_infinite_reverse] fill-icon/15 text-icon/40 dark:fill-icon/7 dark:text-icon/20"
					width={180}
					height={180}
				/>
				<Icon07
					className="relative max-h-full max-w-full animate-[spin_150s_linear_infinite] fill-icon/20 text-icon/50 dark:fill-icon/10 dark:text-icon/25"
					width={180}
					height={180}
				/>
			</div>
			{/* Desktop icons */}
			<div className="relative hidden lg:block">
				<Icon01
					className="absolute inset-0 max-h-full max-w-full animate-[spin_130s_linear_infinite] fill-icon/10 text-icon/30 dark:fill-icon/5 dark:text-icon/15"
					width={440}
					height={440}
					strokeWidth={1}
				/>
				<Icon04
					className="absolute inset-0 max-h-full max-w-full animate-[spin_110s_linear_infinite_reverse] fill-icon/15 text-icon/40 dark:fill-icon/7 dark:text-icon/20"
					width={440}
					height={440}
					strokeWidth={1}
				/>
				<Icon07
					className="relative max-h-full max-w-full animate-[spin_150s_linear_infinite] fill-icon/20 text-icon/50 dark:fill-icon/10 dark:text-icon/25"
					width={440}
					height={440}
					strokeWidth={1}
				/>
			</div>
		</div>
	);

	return (
		<Slide
			currentSlide={1}
			onNavigateSlide={onNavigateSlide}
			asset={asset}
			breadcrumbs={onboarding?.breadcrumbs}
			footerText={onboarding?.footerText}
			onboarding={onboarding}
			language={language}
		>
			<div className="space-y-4 lg:space-y-8">
				{onboarding?.slide1?.title && (
					<h1 className="text-section-heading">{onboarding.slide1.title}</h1>
				)}

				{onboarding?.slide1?.body && (
					<CustomPortableText
						value={onboarding.slide1.body as PortableTextBlock[]}
						className="font-light text-body"
					/>
				)}

				<div className="space-y-4">
					<ActionButton onClick={goToSlide2}>
						<span>
							{onboarding?.slide1?.primaryCtaLabel ||
								"Tell me about the DIGITCORE toolkit"}
						</span>
						<Icon
							icon={SearchList02Icon}
							size={20}
							mobileSize={16}
							className="text-neutral-600 dark:text-neutral-400"
							strokeWidth={1.5}
						/>
					</ActionButton>

					<div>
						<p className="mb-2 font-light text-body">
							{effectiveReturnToPath && !patternSlug
								? onboarding?.slide1?.returnToCtaText || "Or return to"
								: onboarding?.slide1?.secondaryCtaText ||
									"Or skip orientation, go directly to:"}
						</p>
						{patternSlug ? (
							<ActionButton
								onClick={() => {
									setSkipped(true);
									router.push(
										buildLocaleHref(language, `/pattern/${patternSlug}`),
									);
								}}
								asButton={true}
							>
								<span>{patternTitle || toTitleCase(patternSlug)}</span>
								<Icon
									icon={Share02Icon}
									size={20}
									mobileSize={14}
									className="text-neutral-600 dark:text-neutral-400"
									strokeWidth={1.5}
								/>
							</ActionButton>
						) : effectiveReturnToPath ? (
							<ActionButton onClick={handleSkip} asButton={true}>
								<span>
									{pageTitle ||
										friendlyLabelFromPath(
											decodeURIComponent(effectiveReturnToPath),
										)}
								</span>
							</ActionButton>
						) : (
							<ActionButton onClick={handleSkip} asButton={true}>
								<span>
									{onboarding?.slide1?.homePageButtonLabel ||
										friendlyLabelFromPath("/")}
								</span>
								<Icon
									icon={Home09Icon}
									size={20}
									mobileSize={14}
									className="text-neutral-600 dark:text-neutral-400"
									strokeWidth={1.5}
								/>
							</ActionButton>
						)}
					</div>
				</div>
			</div>
		</Slide>
	);
}

function Slide2({
	goToSlide1,
	goToSlide3,
	onNavigateSlide,
	audienceOptions,
	onboarding,
	language: languageProp,
}: {
	goToSlide1: () => void;
	goToSlide3: () => void;
	onNavigateSlide?: (n: 1 | 2 | 3) => void;
	audienceOptions: FilterOption[];
	onboarding?: Onboarding;
	language?: string;
}) {
	const pathname = usePathname();
	const { language: languageFromPath } = useMemo(
		() => parseLocalePath(pathname),
		[pathname],
	);
	const language = languageProp ?? languageFromPath;
	const selectedAudienceIds = useOrientationStore((s) => s.selectedAudienceIds);
	const setSelectedAudiences = useOrientationStore(
		(s) => s.setSelectedAudiences,
	);

	const toggleAudience = (audienceId: string) => {
		setSelectedAudiences(
			selectedAudienceIds.includes(audienceId)
				? selectedAudienceIds.filter((a) => a !== audienceId)
				: [...selectedAudienceIds, audienceId],
		);
	};

	const asset = (
		<div className="flex h-full w-full items-center justify-center rounded-md bg-transparent p-2 lg:p-8">
			{/* Mobile icons */}
			<div className="relative lg:hidden">
				<Icon02
					className="absolute inset-0 max-h-full max-w-full animate-[spin_140s_linear_infinite] fill-icon/10 text-icon/30 dark:fill-icon/5 dark:text-icon/15"
					width={180}
					height={180}
				/>
				<Icon05
					className="absolute inset-0 max-h-full max-w-full animate-[spin_120s_linear_infinite_reverse] fill-icon/15 text-icon/40 dark:fill-icon/7 dark:text-icon/20"
					width={180}
					height={180}
				/>
				<Icon08
					className="relative max-h-full max-w-full animate-[spin_160s_linear_infinite] fill-icon/20 text-icon/50 dark:fill-icon/10 dark:text-icon/25"
					width={180}
					height={180}
				/>
			</div>
			{/* Desktop icons */}
			<div className="relative hidden lg:block">
				<Icon02
					className="absolute inset-0 max-h-full max-w-full animate-[spin_140s_linear_infinite] fill-icon/10 text-icon/30 dark:fill-icon/5 dark:text-icon/15"
					width={440}
					height={440}
					strokeWidth={1}
				/>
				<Icon05
					className="absolute inset-0 max-h-full max-w-full animate-[spin_120s_linear_infinite_reverse] fill-icon/15 text-icon/40 dark:fill-icon/7 dark:text-icon/20"
					width={440}
					height={440}
					strokeWidth={1}
				/>
				<Icon08
					className="relative max-h-full max-w-full animate-[spin_160s_linear_infinite] fill-icon/20 text-icon/50 dark:fill-icon/10 dark:text-icon/25"
					width={440}
					height={440}
					strokeWidth={1}
				/>
			</div>
		</div>
	);

	return (
		<Slide
			currentSlide={2}
			onNavigateSlide={onNavigateSlide}
			asset={asset}
			breadcrumbs={onboarding?.breadcrumbs}
			footerText={onboarding?.footerText}
			onboarding={onboarding}
			language={language}
		>
			<div className="space-y-6">
				{onboarding?.slide2?.title && (
					<h1 className="text-section-heading">{onboarding.slide2.title}</h1>
				)}

				{onboarding?.slide2?.body && (
					<CustomPortableText
						value={onboarding.slide2.body as PortableTextBlock[]}
						className="font-light text-body"
					/>
				)}

				<div className="space-y-4">
					{/* Audience buttons embedded in the text flow */}
					<div className="flex flex-wrap items-center gap-2">
						{audienceOptions.map((opt, _idx) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => toggleAudience(opt.value)}
								className={cn(
									"relative overflow-hidden rounded-lg border-2 border-transparent px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors lg:px-3 lg:py-2 lg:text-lg",
									selectedAudienceIds.includes(opt.value)
										? "bg-neutral-300 dark:bg-neutral-600"
										: "bg-primary-foreground hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700",
								)}
							>
								{opt.label}
								<DashedBorder />
							</button>
						))}
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex items-center gap-2">
						{selectedAudienceIds.length === 0 ? (
							<>
								<span className="text-body-large">Select your</span>
								<span className="relative cursor-default select-none overflow-hidden rounded-lg border-2 border-transparent bg-neutral-300 px-2 py-1.5 font-light text-foreground text-xs uppercase lg:px-3 lg:py-2 lg:text-lg dark:bg-neutral-600">
									AUDIENCE TYPE
									<DashedBorder />
								</span>
								<span className="text-body-large">to continue.</span>
							</>
						) : (
							<>
								<span className="text-body-large capitalize">Click</span>
								<button
									type="button"
									onClick={goToSlide3}
									className="relative overflow-hidden rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors hover:bg-neutral-200 lg:px-3 lg:py-2 lg:text-lg dark:bg-neutral-800 dark:hover:bg-neutral-700"
								>
									{onboarding?.slide2?.nextButtonLabel ||
										(language === "es" ? "SIGUIENTE" : "NEXT")}
									<DashedBorder />
								</button>
								<span className="text-body-large">to continue.</span>
							</>
						)}
					</div>

					<div className="flex items-center gap-2">
						<span className="text-body-large">Or, go</span>
						<button
							type="button"
							onClick={goToSlide1}
							className="relative overflow-hidden rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors hover:bg-neutral-200 lg:px-3 lg:py-2 lg:text-lg dark:bg-neutral-800 dark:hover:bg-neutral-700"
						>
							{onboarding?.backLabel || "BACK"}
							<DashedBorder />
						</button>
						<span className="text-body-large">to the previous step.</span>
					</div>
				</div>
			</div>
		</Slide>
	);
}

function Slide3({
	goToSlide2,
	onNavigateSlide,
	themeOptions,
	onboarding,
	language: languageProp,
}: {
	goToSlide2: () => void;
	onNavigateSlide?: (n: 1 | 2 | 3) => void;
	themeOptions: FilterOption[];
	onboarding?: Onboarding;
	language?: string;
}) {
	const selectedThemeIds = useOrientationStore((s) => s.selectedThemeIds);
	const selectedAudienceIds = useOrientationStore((s) => s.selectedAudienceIds);
	const setSelectedThemes = useOrientationStore((s) => s.setSelectedThemes);
	const setCompleted = useOrientationStore((s) => s.setCompleted);
	const pathname = usePathname();
	const { language: languageFromPath } = useMemo(
		() => parseLocalePath(pathname),
		[pathname],
	);
	const language = languageProp ?? languageFromPath;

	const toggleTheme = (themeId: string) => {
		setSelectedThemes(
			selectedThemeIds.includes(themeId)
				? selectedThemeIds.filter((t) => t !== themeId)
				: [...selectedThemeIds, themeId],
		);
	};

	const asset = (
		<div className="flex h-full w-full items-center justify-center rounded-md bg-transparent p-2 lg:p-8">
			{/* Mobile icons */}
			<div className="relative lg:hidden">
				<Icon03
					className="absolute inset-0 max-h-full max-w-full animate-[spin_135s_linear_infinite] fill-icon/10 text-icon/30 dark:fill-icon/5 dark:text-icon/15"
					width={180}
					height={180}
				/>
				<Icon06
					className="absolute inset-0 max-h-full max-w-full animate-[spin_115s_linear_infinite_reverse] fill-icon/15 text-icon/40 dark:fill-icon/7 dark:text-icon/20"
					width={180}
					height={180}
				/>
				<Icon09
					className="relative max-h-full max-w-full animate-[spin_155s_linear_infinite] fill-icon/20 text-icon/50 dark:fill-icon/10 dark:text-icon/25"
					width={180}
					height={180}
				/>
			</div>
			{/* Desktop icons */}
			<div className="relative hidden lg:block">
				<Icon03
					className="absolute inset-0 max-h-full max-w-full animate-[spin_135s_linear_infinite] fill-icon/10 text-icon/30 dark:fill-icon/5 dark:text-icon/15"
					width={440}
					height={440}
					strokeWidth={1}
				/>
				<Icon06
					className="absolute inset-0 max-h-full max-w-full animate-[spin_115s_linear_infinite_reverse] fill-icon/15 text-icon/40 dark:fill-icon/7 dark:text-icon/20"
					width={440}
					height={440}
					strokeWidth={1}
				/>
				<Icon09
					className="relative max-h-full max-w-full animate-[spin_155s_linear_infinite] fill-icon/20 text-icon/50 dark:fill-icon/10 dark:text-icon/25"
					width={440}
					height={440}
					strokeWidth={1}
				/>
			</div>
		</div>
	);

	return (
		<Slide
			currentSlide={3}
			onNavigateSlide={onNavigateSlide}
			asset={asset}
			breadcrumbs={onboarding?.breadcrumbs}
			footerText={onboarding?.footerText}
			onboarding={onboarding}
			language={language}
		>
			<div className="space-y-4 lg:space-y-8">
				{onboarding?.slide3?.title && (
					<h1 className="text-section-heading">{onboarding.slide3.title}</h1>
				)}

				{onboarding?.slide3?.body && (
					<CustomPortableText
						value={onboarding.slide3.body as PortableTextBlock[]}
						className="text-body"
					/>
				)}

				{/* Theme buttons embedded in the text flow */}
				<div className="flex flex-wrap items-center gap-2">
					{themeOptions.map((opt) => (
						<button
							type="button"
							key={opt.value}
							onClick={() => toggleTheme(opt.value)}
							className={cn(
								"relative overflow-hidden rounded-lg border-2 border-transparent px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors lg:px-3 lg:py-2 lg:text-lg",
								selectedThemeIds.includes(opt.value)
									? "bg-neutral-300 dark:bg-neutral-600"
									: "bg-primary-foreground hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700",
							)}
						>
							{opt.label}
							<DashedBorder />
						</button>
					))}
				</div>

				<div className="space-y-4">
					<div className="flex items-center gap-2">
						{selectedThemeIds.length === 0 ? (
							<>
								<span className="text-body-large">Select</span>
								<span className="relative cursor-default select-none overflow-hidden rounded-lg border-2 border-transparent bg-neutral-300 px-2 py-1.5 font-light text-foreground text-xs uppercase lg:px-3 lg:py-2 lg:text-lg dark:bg-neutral-600">
									Themes
									<DashedBorder />
								</span>
								<span className="text-body-large">
									that interest you to continue.
								</span>
							</>
						) : (
							<>
								<span className="text-body-large capitalize">click</span>
								<Link
									href={buildLocaleHref(language, "/search")}
									onClick={() => {
										setCompleted(true);
										// User completed the full onboarding
										// The store will persist this state
									}}
									className="relative overflow-hidden rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors hover:bg-neutral-200 lg:px-3 lg:py-2 lg:text-lg dark:bg-neutral-800 dark:hover:bg-neutral-700"
								>
									{onboarding?.slide3?.finishButtonLabel ||
										(language === "es" ? "TERMINAR" : "FINISH")}
									<DashedBorder />
								</Link>
								<span className="text-body-large">
									to continue to the toolkit.
								</span>
							</>
						)}
					</div>

					<div className="flex items-center gap-2">
						<span className="text-body-large">Or, go</span>
						<button
							type="button"
							onClick={goToSlide2}
							className="relative overflow-hidden rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors hover:bg-neutral-200 lg:px-3 lg:py-2 lg:text-lg dark:bg-neutral-800 dark:hover:bg-neutral-700"
						>
							{onboarding?.backLabel || "BACK"}
							<DashedBorder />
						</button>
						<span className="text-body-large">to the previous step.</span>
					</div>
				</div>
			</div>
		</Slide>
	);
}
