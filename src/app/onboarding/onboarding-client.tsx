"use client";

import { SearchList02Icon, Share02Icon } from "@hugeicons/core-free-icons";
import type { PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { FilterOption } from "~/app/actions/filter-options";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import Icon01 from "~/components/icons/shapes/icon-01";
import Icon02 from "~/components/icons/shapes/icon-02";
import Icon03 from "~/components/icons/shapes/icon-03";
import Icon04 from "~/components/icons/shapes/icon-04";
import Icon05 from "~/components/icons/shapes/icon-05";
import Icon06 from "~/components/icons/shapes/icon-06";
import Icon07 from "~/components/icons/shapes/icon-07";
import Icon08 from "~/components/icons/shapes/icon-08";
import Icon09 from "~/components/icons/shapes/icon-09";
import { Icon } from "~/components/shared/icon";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { cn } from "~/lib/utils";
import type { Onboarding } from "~/sanity/sanity.types";
import {
	OnboardingStoreProvider,
	useOnboardingStore,
} from "~/stores/onboarding";

function getSafePath(path?: string) {
	try {
		if (!path) return "/";
		if (/^https?:\/\//i.test(path)) {
			return new URL(path).pathname || "/";
		}
		const cleaned = (path.split("#")[0] || "/").split("?")[0] || "/";
		return cleaned.startsWith("/") ? cleaned || "/" : "/";
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

		if (pathname === "/") return "DIGITCORE Home Page";
		const segments = pathname.split("/").filter(Boolean);
		if (segments[0] === "pattern" && segments[1]) return "Pattern Page";
		if (segments[0] === "patterns") return "Patterns Page";
		if (segments[0] === "search") return "Explore Page";
		if (segments[0] === "explore") return "Explore Page";
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
}: { strokeWidth?: number | string }) {
	return (
		<svg
			aria-hidden="true"
			width="100%"
			height="100%"
			className="pointer-events-none absolute inset-0 h-full w-full text-neutral-600"
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
}: {
	href?: string;
	onClick?: () => void;
	children: React.ReactNode;
	dashed?: boolean;
	preserveSize?: boolean;
}) {
	const baseClass = preserveSize
		? "relative overflow-hidden inline-flex items-center rounded-lg border-2 border-transparent bg-primary-foreground px-3 py-2 text-left text-foreground text-sm uppercase font-light transition-colors hover:bg-neutral-100 md:text-lg"
		: "relative overflow-hidden inline-flex items-center rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 text-left text-foreground text-xs uppercase font-light transition-colors hover:bg-neutral-100 md:px-3 md:py-2 md:text-lg";

	if (href) {
		return (
			<Link href={href} className={baseClass} onClick={onClick}>
				<span className="relative z-10 inline-flex items-center gap-2">
					{children}
				</span>
				{dashed ? <DashedBorder /> : null}
			</Link>
		);
	}

	return (
		<button type="button" onClick={onClick} className={baseClass}>
			<span className="relative z-10 inline-flex items-center gap-2">
				{children}
			</span>
			{dashed ? <DashedBorder /> : null}
		</button>
	);
}

export function OnboardingClient({
	onboarding,
	patternTitle,
	returnToPath,
	audienceOptions,
	themeOptions,
}: {
	onboarding?: Onboarding;
	patternTitle?: string;
	returnToPath?: string;
	audienceOptions: FilterOption[];
	themeOptions: FilterOption[];
}) {
	// Provide store context locally for onboarding flow
	return (
		<OnboardingStoreProvider>
			<OnboardingInner
				onboarding={onboarding}
				patternTitle={patternTitle}
				returnToPath={returnToPath}
				audienceOptions={audienceOptions}
				themeOptions={themeOptions}
			/>
		</OnboardingStoreProvider>
	);
}

function OnboardingInner({
	onboarding,
	patternTitle,
	returnToPath,
	audienceOptions,
	themeOptions,
}: {
	onboarding?: Onboarding;
	patternTitle?: string;
	returnToPath?: string;
	audienceOptions: FilterOption[];
	themeOptions: FilterOption[];
}) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const initialStep = (() => {
		const value = Number(searchParams.get("step") ?? "1");
		return value >= 1 && value <= 3 ? value : 1;
	})();

	const [currentSlide, setCurrentSlide] = useState<1 | 2 | 3>(
		initialStep as 1 | 2 | 3,
	);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const patternSlug = (searchParams.get("pattern") ?? undefined) as
		| string
		| undefined;

	// Mark onboarding as seen unless the user arrived via the header override flag
	const headerOverride = searchParams.get("via") === "header";
	const setSeen = useOnboardingStore((s) => s.setSeen);
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

		const params = new URLSearchParams(searchParams.toString());
		params.set("step", String(n));
		router.replace(`?${params.toString()}`, { scroll: false });
	};

	const goToSlide1 = () => goToSlide(1);
	const goToSlide2 = () => goToSlide(2);
	const goToSlide3 = () => goToSlide(3);

	return (
		<div className="m-2 rounded-md bg-neutral-200">
			<div className="relative h-[calc(100vh-1rem)] overflow-clip rounded-md bg-primary-foreground p-2">
				{/* Desktop skip button - top right */}
				<div className="absolute top-4 right-4 z-10 hidden md:block">
					<ActionButton
						href="/"
						dashed={false}
						preserveSize={true}
						onClick={() => {
							try {
								document.cookie =
									"onboarding_completed=1; path=/; max-age=31536000";
							} catch {}
						}}
					>
						<span className="text-xs">
							{onboarding?.skipLabel || "Skip onboarding"}
						</span>
					</ActionButton>
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
							goToSlide2={goToSlide2}
							onNavigateSlide={goToSlide}
						/>
					)}
					{currentSlide === 2 && (
						<Slide2
							goToSlide1={goToSlide1}
							goToSlide3={goToSlide3}
							onNavigateSlide={goToSlide}
							audienceOptions={audienceOptions}
							onboarding={onboarding}
						/>
					)}
					{currentSlide === 3 && (
						<Slide3
							goToSlide2={goToSlide2}
							onNavigateSlide={goToSlide}
							themeOptions={themeOptions}
							onboarding={onboarding}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

function OnboardingBreadcrumb({
	currentSlide,
	onNavigateSlide,
	breadcrumbs,
}: {
	currentSlide: 1 | 2 | 3;
	onNavigateSlide?: (n: 1 | 2 | 3) => void;
	breadcrumbs?: {
		slide1?: string;
		slide2?: string;
		slide3?: string;
	};
}) {
	return (
		<Breadcrumb className="mb-8">
			<BreadcrumbList>
				<BreadcrumbItem>
					{currentSlide === 1 ? (
						<BreadcrumbPage>
							{breadcrumbs?.slide1 || "Introduction"}
						</BreadcrumbPage>
					) : onNavigateSlide ? (
						<BreadcrumbLink asChild>
							<button type="button" onClick={() => onNavigateSlide(1)}>
								{breadcrumbs?.slide1 || "Introduction"}
							</button>
						</BreadcrumbLink>
					) : (
						<BreadcrumbLink href="#">
							{breadcrumbs?.slide1 || "Introduction"}
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					{currentSlide === 2 ? (
						<BreadcrumbPage>
							{breadcrumbs?.slide2 || "Audiences"}
						</BreadcrumbPage>
					) : onNavigateSlide ? (
						<BreadcrumbLink asChild>
							<button type="button" onClick={() => onNavigateSlide(2)}>
								{breadcrumbs?.slide2 || "Audiences"}
							</button>
						</BreadcrumbLink>
					) : (
						<BreadcrumbLink href="#">
							{breadcrumbs?.slide2 || "Audiences"}
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					{currentSlide === 3 ? (
						<BreadcrumbPage>
							{breadcrumbs?.slide3 || "Interests"}
						</BreadcrumbPage>
					) : onNavigateSlide ? (
						<BreadcrumbLink asChild>
							<button type="button" onClick={() => onNavigateSlide(3)}>
								{breadcrumbs?.slide3 || "Interests"}
							</button>
						</BreadcrumbLink>
					) : (
						<BreadcrumbLink href="#">
							{breadcrumbs?.slide3 || "Interests"}
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
}) {
	return (
		<div className="flex h-full flex-col md:flex-row">
			<div className="flex w-full flex-col justify-start px-3 py-3 md:w-1/2 md:py-4 md:pr-4 md:pl-4">
				<OnboardingBreadcrumb
					currentSlide={currentSlide}
					onNavigateSlide={onNavigateSlide}
					breadcrumbs={breadcrumbs}
				/>
				<div className="min-h-0 flex-1">{children}</div>
				<footer className="hidden pt-4 text-left text-foreground text-sm md:block md:pt-8">
					{footerText || "Open Environmental Data Project"}
				</footer>
			</div>
			<div className="relative w-full flex-1 rounded-md bg-icon/20 p-2 md:h-full md:w-1/2 md:flex-none md:pl-2">
				{asset || <div className="h-full w-full rounded-md bg-icon/60" />}

				{/* Mobile skip button - bottom right of icon container */}
				<div className="absolute right-2 bottom-2 z-20 md:hidden">
					<ActionButton
						href="/"
						dashed={false}
						preserveSize={true}
						onClick={() => {
							try {
								document.cookie =
									"onboarding_completed=1; path=/; max-age=31536000";
							} catch {}
						}}
					>
						<span className="text-xs">
							{onboarding?.skipLabel || "Skip onboarding"}
						</span>
					</ActionButton>
				</div>
			</div>
		</div>
	);
}

function Slide1({
	patternSlug,
	patternTitle,
	returnToPath,
	goToSlide2,
	onboarding,
	onNavigateSlide,
}: {
	patternSlug: string | undefined;
	patternTitle?: string;
	returnToPath?: string;
	goToSlide2: () => void;
	onboarding?: Onboarding;
	onNavigateSlide?: (n: 1 | 2 | 3) => void;
}) {
	const toTitleCase = (s: string) =>
		s
			.split("-")
			.join(" ")
			.split(" ")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
			.join(" ");

	const asset = (
		<div className="flex h-full w-full items-center justify-center rounded-md bg-transparent p-2 md:p-8">
			{/* Mobile icons */}
			<div className="relative md:hidden">
				<Icon01
					className="absolute inset-0 max-h-full max-w-full animate-[spin_130s_linear_infinite] fill-icon/10 text-icon/30"
					width={120}
					height={120}
				/>
				<Icon04
					className="absolute inset-0 max-h-full max-w-full animate-[spin_110s_linear_infinite_reverse] fill-icon/15 text-icon/40"
					width={120}
					height={120}
				/>
				<Icon07
					className="relative max-h-full max-w-full animate-[spin_150s_linear_infinite] fill-icon/20 text-icon/50"
					width={120}
					height={120}
				/>
			</div>
			{/* Desktop icons */}
			<div className="relative hidden md:block">
				<Icon01
					className="absolute inset-0 max-h-full max-w-full animate-[spin_130s_linear_infinite] fill-icon/10 text-icon/30"
					width={600}
					height={600}
				/>
				<Icon04
					className="absolute inset-0 max-h-full max-w-full animate-[spin_110s_linear_infinite_reverse] fill-icon/15 text-icon/40"
					width={600}
					height={600}
				/>
				<Icon07
					className="relative max-h-full max-w-full animate-[spin_150s_linear_infinite] fill-icon/20 text-icon/50"
					width={600}
					height={600}
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
		>
			<div className="space-y-4 md:space-y-8">
				{onboarding?.slide1?.title && (
					<h1 className="font-light text-foreground text-xl leading-relaxed md:text-2xl">
						{onboarding.slide1.title}
					</h1>
				)}

				{onboarding?.slide1?.body && (
					<CustomPortableText
						value={onboarding.slide1.body as PortableTextBlock[]}
						className="space-y-4 font-light text-foreground text-sm leading-relaxed md:space-y-6 md:text-lg"
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
							color="#525252"
							strokeWidth={1.5}
						/>
					</ActionButton>

					<div>
						<p className="mb-2 font-light text-foreground text-sm leading-relaxed md:text-lg">
							{onboarding?.slide1?.secondaryCtaText || "Or, go directly to:"}
						</p>
						{patternSlug ? (
							<ActionButton
								href={`/pattern/${patternSlug}`}
								onClick={() => {
									try {
										document.cookie =
											"onboarding_completed=1; path=/; max-age=31536000";
									} catch {}
								}}
							>
								<span>{patternTitle || toTitleCase(patternSlug)}</span>
								<Icon
									icon={Share02Icon}
									size={20}
									color="#525252"
									strokeWidth={1.5}
								/>
							</ActionButton>
						) : (
							<ActionButton
								href={getSafePath(returnToPath)}
								onClick={() => {
									try {
										document.cookie =
											"onboarding_completed=1; path=/; max-age=31536000";
									} catch {}
								}}
							>
								<span>{friendlyLabelFromPath(getSafePath(returnToPath))}</span>
								<Icon
									icon={Share02Icon}
									size={20}
									color="#525252"
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
}: {
	goToSlide1: () => void;
	goToSlide3: () => void;
	onNavigateSlide?: (n: 1 | 2 | 3) => void;
	audienceOptions: FilterOption[];
	onboarding?: Onboarding;
}) {
	const selectedAudienceIds = useOnboardingStore((s) => s.selectedAudienceIds);
	const setSelectedAudiences = useOnboardingStore(
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
		<div className="flex h-full w-full items-center justify-center rounded-md bg-transparent p-2 md:p-8">
			{/* Mobile icons */}
			<div className="relative md:hidden">
				<Icon02
					className="absolute inset-0 max-h-full max-w-full animate-[spin_140s_linear_infinite] fill-icon/10 text-icon/30"
					width={120}
					height={120}
				/>
				<Icon05
					className="absolute inset-0 max-h-full max-w-full animate-[spin_120s_linear_infinite_reverse] fill-icon/15 text-icon/40"
					width={120}
					height={120}
				/>
				<Icon08
					className="relative max-h-full max-w-full animate-[spin_160s_linear_infinite] fill-icon/20 text-icon/50"
					width={120}
					height={120}
				/>
			</div>
			{/* Desktop icons */}
			<div className="relative hidden md:block">
				<Icon02
					className="absolute inset-0 max-h-full max-w-full animate-[spin_140s_linear_infinite] fill-icon/10 text-icon/30"
					width={600}
					height={600}
				/>
				<Icon05
					className="absolute inset-0 max-h-full max-w-full animate-[spin_120s_linear_infinite_reverse] fill-icon/15 text-icon/40"
					width={600}
					height={600}
				/>
				<Icon08
					className="relative max-h-full max-w-full animate-[spin_160s_linear_infinite] fill-icon/20 text-icon/50"
					width={600}
					height={600}
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
		>
			<div className="space-y-6">
				{onboarding?.slide2?.title && (
					<h1 className="font-light text-foreground text-xl leading-relaxed md:text-2xl">
						{onboarding.slide2.title}
					</h1>
				)}

				{onboarding?.slide2?.body && (
					<CustomPortableText
						value={onboarding.slide2.body as PortableTextBlock[]}
						className="space-y-4 font-light text-foreground text-sm leading-relaxed md:text-lg"
					/>
				)}

				<div className="space-y-4 font-light text-base text-foreground leading-relaxed md:text-lg">
					{/* Audience buttons embedded in the text flow */}
					<div className="flex flex-wrap items-center gap-2">
						{audienceOptions.map((opt, idx) => (
							<button
								key={opt.value}
								type="button"
								onClick={() => toggleAudience(opt.value)}
								className={cn(
									"relative overflow-hidden rounded-lg border-2 border-transparent px-2 py-1.5 text-foreground text-xs uppercase transition-colors md:px-3 md:py-2 md:text-lg",
									selectedAudienceIds.includes(opt.value)
										? "bg-neutral-300"
										: "bg-primary-foreground hover:bg-neutral-100",
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
								<span className="font-light text-foreground text-lg md:text-xl">
									Select your
								</span>
								<span className="relative cursor-default select-none overflow-hidden rounded-lg border-2 border-transparent bg-neutral-300 px-2 py-1.5 font-light text-foreground text-xs uppercase md:px-3 md:py-2 md:text-base">
									AUDIENCE TYPE
									<DashedBorder />
								</span>
								<span className="font-light text-foreground text-lg md:text-xl">
									to continue.
								</span>
							</>
						) : (
							<>
								<span className="font-light text-foreground text-lg capitalize md:text-xl">
									Click
								</span>
								<button
									type="button"
									onClick={goToSlide3}
									className="relative overflow-hidden rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors hover:bg-neutral-100 md:px-3 md:py-2 md:text-lg"
								>
									NEXT
									<DashedBorder />
								</button>
								<span className="font-light text-foreground text-lg md:text-xl">
									to continue.
								</span>
							</>
						)}
					</div>

					<div className="flex items-center gap-2">
						<span className="font-light text-foreground text-lg md:text-xl">
							Or, go
						</span>
						<button
							type="button"
							onClick={goToSlide1}
							className="relative overflow-hidden rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors hover:bg-neutral-100 md:px-3 md:py-2 md:text-lg"
						>
							{onboarding?.backLabel || "BACK"}
							<DashedBorder />
						</button>
						<span className="font-light text-foreground text-lg md:text-xl">
							to the previous step.
						</span>
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
}: {
	goToSlide2: () => void;
	onNavigateSlide?: (n: 1 | 2 | 3) => void;
	themeOptions: FilterOption[];
	onboarding?: Onboarding;
}) {
	const selectedThemeIds = useOnboardingStore((s) => s.selectedThemeIds);
	const selectedAudienceIds = useOnboardingStore((s) => s.selectedAudienceIds);
	const setSelectedThemes = useOnboardingStore((s) => s.setSelectedThemes);
	const setCompleted = useOnboardingStore((s) => s.setCompleted);

	const toggleTheme = (themeId: string) => {
		setSelectedThemes(
			selectedThemeIds.includes(themeId)
				? selectedThemeIds.filter((t) => t !== themeId)
				: [...selectedThemeIds, themeId],
		);
	};

	const asset = (
		<div className="flex h-full w-full items-center justify-center rounded-md bg-transparent p-2 md:p-8">
			{/* Mobile icons */}
			<div className="relative md:hidden">
				<Icon03
					className="absolute inset-0 max-h-full max-w-full animate-[spin_135s_linear_infinite] fill-icon/10 text-icon/30"
					width={120}
					height={120}
				/>
				<Icon06
					className="absolute inset-0 max-h-full max-w-full animate-[spin_115s_linear_infinite_reverse] fill-icon/15 text-icon/40"
					width={120}
					height={120}
				/>
				<Icon09
					className="relative max-h-full max-w-full animate-[spin_155s_linear_infinite] fill-icon/20 text-icon/50"
					width={120}
					height={120}
				/>
			</div>
			{/* Desktop icons */}
			<div className="relative hidden md:block">
				<Icon03
					className="absolute inset-0 max-h-full max-w-full animate-[spin_135s_linear_infinite] fill-icon/10 text-icon/30"
					width={600}
					height={600}
				/>
				<Icon06
					className="absolute inset-0 max-h-full max-w-full animate-[spin_115s_linear_infinite_reverse] fill-icon/15 text-icon/40"
					width={600}
					height={600}
				/>
				<Icon09
					className="relative max-h-full max-w-full animate-[spin_155s_linear_infinite] fill-icon/20 text-icon/50"
					width={600}
					height={600}
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
		>
			<div className="space-y-4 md:space-y-8">
				{onboarding?.slide3?.title && (
					<h1 className="font-light text-foreground text-xl leading-relaxed md:text-2xl">
						{onboarding.slide3.title}
					</h1>
				)}

				{onboarding?.slide3?.body && (
					<CustomPortableText
						value={onboarding.slide3.body as PortableTextBlock[]}
						className="space-y-4 font-light text-base text-foreground leading-relaxed md:text-lg"
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
								"relative overflow-hidden rounded-lg border-2 border-transparent px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors md:px-3 md:py-2 md:text-lg",
								selectedThemeIds.includes(opt.value)
									? "bg-neutral-300"
									: "bg-primary-foreground hover:bg-neutral-100",
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
								<span className="font-light text-foreground text-lg md:text-xl">
									Select a
								</span>
								<span className="relative cursor-default select-none overflow-hidden rounded-lg border-2 border-transparent bg-neutral-300 px-3 py-2 font-light text-base text-foreground uppercase">
									THEME
									<DashedBorder />
								</span>
								<span className="font-light text-foreground text-lg md:text-xl">
									that interests you to continue.
								</span>
							</>
						) : (
							<>
								<span className="font-light text-foreground text-lg capitalize md:text-xl">
									click
								</span>
								<Link
									href={`/explore?themes=${encodeURIComponent(
										selectedThemeIds.join(","),
									)}${
										selectedAudienceIds.length
											? `&audiences=${encodeURIComponent(
													selectedAudienceIds.join(","),
												)}`
											: ""
									}`}
									onClick={() => {
										setCompleted(true);
										try {
											document.cookie =
												"onboarding_completed=1; path=/; max-age=31536000";
										} catch {}
									}}
									className="relative overflow-hidden rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors hover:bg-neutral-100 md:px-3 md:py-2 md:text-lg"
								>
									FINISH
									<DashedBorder />
								</Link>
								<span className="font-light text-foreground text-lg md:text-xl">
									to continue to the toolkit.
								</span>
							</>
						)}
					</div>

					<div className="flex items-center gap-2">
						<span className="font-light text-foreground text-lg md:text-xl">
							Or, go
						</span>
						<button
							type="button"
							onClick={goToSlide2}
							className="relative overflow-hidden rounded-lg border-2 border-transparent bg-primary-foreground px-2 py-1.5 font-light text-foreground text-xs uppercase transition-colors hover:bg-neutral-100 md:px-3 md:py-2 md:text-lg"
						>
							{onboarding?.backLabel || "BACK"}
							<DashedBorder />
						</button>
						<span className="font-light text-foreground text-lg md:text-xl">
							to the previous step.
						</span>
					</div>
				</div>
			</div>
		</Slide>
	);
}
