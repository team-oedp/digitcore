"use client";

import { Link02Icon, Search02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Icon } from "~/components/global/icon";

const heroImage1 =
	"http://localhost:3845/assets/7ed4677b62d314739282582970ffc2151fe29d17.png";
const heroImage2 =
	"http://localhost:3845/assets/32e85c03c386393ce821b623d8720d8b4383dffa.png";
const heroImage3 =
	"http://localhost:3845/assets/209efa532a3df32c6c672cafaf2d5d3003b20759.png";

export default function OnboardingPage() {
	const [currentSlide, setCurrentSlide] = useState(1);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const searchParams = useSearchParams();
	const patternSlug = (searchParams.get("pattern") ?? undefined) as
		| string
		| undefined;

	const goToSlide2 = () => {
		setIsTransitioning(true);
		setTimeout(() => {
			setCurrentSlide(2);
			setIsTransitioning(false);
		}, 300);
	};

	const goToSlide1 = () => {
		setIsTransitioning(true);
		setTimeout(() => {
			setCurrentSlide(1);
			setIsTransitioning(false);
		}, 300);
	};

	const goToSlide3 = () => {
		setIsTransitioning(true);
		setTimeout(() => {
			setCurrentSlide(3);
			setIsTransitioning(false);
		}, 300);
	};

	return (
		<div className="relative flex min-h-screen bg-white">
			{/* Skip button */}
			<div className="absolute top-8 right-8 z-10">
				<Link
					href="/"
					className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-600 text-sm uppercase transition-colors hover:bg-gray-50"
				>
					Skip
				</Link>
			</div>

			{/* Slide container with fade transition */}
			<div
				className={`w-full transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
			>
				{currentSlide === 1 && (
					<Slide1 patternSlug={patternSlug} goToSlide2={goToSlide2} />
				)}
				{currentSlide === 2 && (
					<Slide2 goToSlide1={goToSlide1} goToSlide3={goToSlide3} />
				)}
				{currentSlide === 3 && <Slide3 goToSlide2={goToSlide2} />}
			</div>
		</div>
	);
}

function Slide1({
	patternSlug,
	goToSlide2,
}: {
	patternSlug: string | undefined;
	goToSlide2: () => void;
}) {
	return (
		<div className="flex min-h-screen">
			{/* Left side - Text content */}
			<div className="flex w-11/24 flex-col justify-center px-8 py-8">
				{/* Breadcrumb */}
				<div className="mb-8 text-gray-500 text-sm">
					Introduction → Audiences → Interests
				</div>

				{/* Main content */}
				<div className="space-y-8">
					<h1 className="font-light text-3xl text-gray-600 leading-relaxed">
						Welcome to the Digital Toolkit for Collaborative Environmental
						Research, or, DIGITCORE!
					</h1>

					<div className="space-y-6 font-light text-3xl text-gray-600 leading-relaxed">
						<p>
							DIGITCORE outlines challenges, problems, and phenomena experienced
							or observed by community organizations, researchers, and open
							source technologists working on collaborative environmental
							research. This toolkit is designed to help you make decisions
							about tools, modes of interaction, research design, and process.
						</p>

						<p>
							You're seeing this message because you have clicked a link to a
							pattern in the Digitcore toolkit library.
						</p>
					</div>

					{/* Action buttons */}
					<div className="space-y-4">
						<button
							type="button"
							onClick={goToSlide2}
							className="flex w-full items-center justify-between rounded-lg border-2 border-gray-800 border-dashed bg-white px-3 py-3 text-left text-2xl text-gray-600 uppercase transition-colors hover:bg-gray-50"
						>
							<span>Tell me more about The digitcore library</span>
							<Icon
								icon={Search02Icon}
								size={24}
								color="#525252"
								strokeWidth={1.5}
							/>
						</button>

						<div>
							<p className="mb-2 text-gray-600 text-sm">
								Or, go directly to the pattern:
							</p>
							<Link
								href={
									patternSlug
										? `/pattern/${patternSlug}`
										: "/pattern/enhancing-frontline-communities-agency"
								}
								className="flex w-full items-center justify-between rounded-lg border-2 border-gray-800 border-dashed bg-white px-3 py-3 text-left text-2xl text-gray-600 uppercase transition-colors hover:bg-gray-50"
							>
								<span>
									{patternSlug
										? patternSlug.replace(/-/g, " ")
										: "Enhancing frontline communities' agency"}
								</span>
								<Icon
									icon={Link02Icon}
									size={24}
									color="#525252"
									strokeWidth={1.5}
								/>
							</Link>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-16 text-gray-600 text-sm">
					All rights reserved. Open Environmental Data Project © 2025.
				</div>
			</div>

			{/* Right side - Image */}
			<div className="w-13/24 p-4">
				<div
					className="h-full w-full rounded-lg bg-center bg-cover"
					style={{ backgroundImage: `url('${heroImage1}')` }}
				/>
			</div>
		</div>
	);
}

function Slide2({
	goToSlide1,
	goToSlide3,
}: { goToSlide1: () => void; goToSlide3: () => void }) {
	const [selectedAudiences, setSelectedAudiences] = useState<string[]>([]);

	const toggleAudience = (audience: string) => {
		setSelectedAudiences((prev) =>
			prev.includes(audience)
				? prev.filter((a) => a !== audience)
				: [...prev, audience],
		);
	};

	return (
		<div className="flex min-h-screen">
			{/* Left side - Text content */}
			<div className="flex w-11/24 flex-col justify-center px-8 py-8">
				{/* Breadcrumb */}
				<div className="mb-8 text-gray-500 text-sm">
					Introduction → Audiences → Interests
				</div>

				{/* Main content */}
				<div className="space-y-8">
					<h1 className="font-light text-3xl text-gray-600 leading-relaxed">
						To start exploring, please select which audience groups are most
						relevant to you, and which themes you're most interested in.
					</h1>

					<div className="space-y-6 font-light text-3xl text-gray-600 leading-relaxed">
						<p>
							The Digitcore project seeks to ground open infrastructure
							development in the practice-based work of organizers and their
							collaborators—
						</p>

						{/* Audience buttons embedded in the text flow */}
						<div className="space-y-2">
							<div className="flex flex-wrap items-center gap-2">
								<button
									type="button"
									onClick={() => toggleAudience("RESEARCHERS")}
									className={`rounded-lg border-2 px-3 py-2 text-2xl uppercase transition-colors ${
										selectedAudiences.includes("RESEARCHERS")
											? "border-[#a6bcbf] bg-[#637e85] text-white"
											: "border-gray-800 border-dashed bg-white text-gray-600 hover:bg-gray-50"
									}`}
								>
									RESEARCHERS
								</button>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<button
									type="button"
									onClick={() => toggleAudience("COMMUNITY ORGANIZATIONS")}
									className={`rounded-lg border-2 px-3 py-2 text-2xl uppercase transition-colors ${
										selectedAudiences.includes("COMMUNITY ORGANIZATIONS")
											? "border-[#a6bcbf] bg-[#637e85] text-white"
											: "border-gray-800 border-dashed bg-white text-gray-600 hover:bg-gray-50"
									}`}
								>
									COMMUNITY ORGANIZATIONS
								</button>
								<button
									type="button"
									onClick={() => toggleAudience("FUNDERS")}
									className={`rounded-lg border-2 px-3 py-2 text-2xl uppercase transition-colors ${
										selectedAudiences.includes("FUNDERS")
											? "border-[#a6bcbf] bg-[#637e85] text-white"
											: "border-gray-800 border-dashed bg-white text-gray-600 hover:bg-gray-50"
									}`}
								>
									FUNDERS
								</button>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<button
									type="button"
									onClick={() => toggleAudience("OPEN SOURCE DEVELOPERS")}
									className={`rounded-lg border-2 px-3 py-2 text-2xl uppercase transition-colors ${
										selectedAudiences.includes("OPEN SOURCE DEVELOPERS")
											? "border-[#a6bcbf] bg-[#637e85] text-white"
											: "border-gray-800 border-dashed bg-white text-gray-600 hover:bg-gray-50"
									}`}
								>
									OPEN SOURCE DEVELOPERS
								</button>
								<span>and</span>
								<button
									type="button"
									onClick={() => toggleAudience("OTHERS")}
									className={`rounded-lg border-2 px-3 py-2 text-2xl uppercase transition-colors ${
										selectedAudiences.includes("OTHERS")
											? "border-[#a6bcbf] bg-[#637e85] text-white"
											: "border-gray-800 border-dashed bg-white text-gray-600 hover:bg-gray-50"
									}`}
								>
									OTHERS
								</button>
								<span>.</span>
							</div>
						</div>
					</div>

					{/* Action buttons */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<span
								className={`font-light text-3xl text-gray-600 transition-opacity ${
									selectedAudiences.length > 0 ? "opacity-0" : "opacity-100"
								}`}
							>
								Select your
							</span>
							<button
								type="button"
								onClick={selectedAudiences.length > 0 ? goToSlide3 : undefined}
								className="rounded-lg border-2 border-gray-800 border-dashed bg-white px-3 py-2 text-2xl text-gray-600 uppercase transition-colors hover:bg-gray-50"
							>
								{selectedAudiences.length > 0 ? "NEXT" : "AUDIENCE TYPE"}
							</button>
							<span
								className={`font-light text-3xl text-gray-600 transition-opacity ${
									selectedAudiences.length > 0 ? "opacity-0" : "opacity-100"
								}`}
							>
								to continue.
							</span>
						</div>

						<div className="flex items-center gap-2">
							<span className="font-light text-3xl text-gray-600">Or, go</span>
							<button
								type="button"
								onClick={goToSlide1}
								className="rounded-lg border-2 border-gray-800 border-dashed bg-white px-3 py-2 text-2xl text-gray-600 uppercase transition-colors hover:bg-gray-50"
							>
								BACK
							</button>
							<span className="font-light text-3xl text-gray-600">
								to the previous step.
							</span>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-16 text-gray-600 text-sm">
					All rights reserved. Open Environmental Data Project © 2025.
				</div>
			</div>

			{/* Right side - Image */}
			<div className="w-13/24 p-4">
				<div
					className="h-full w-full rounded-lg bg-center bg-cover"
					style={{ backgroundImage: `url('${heroImage2}')` }}
				/>
			</div>
		</div>
	);
}

function Slide3({ goToSlide2 }: { goToSlide2: () => void }) {
	const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

	const themes = [
		"ENSURING BENEFIT TO FRONTLINE COMMUNITIES",
		"PRACTICING OPENNESS",
		"DATA ≠ INFORMATION",
		"ACADEMIC CULTURE AND NORMS",
		"SITUATIONAL COLLABORATION PRACTICES",
	];

	const toggleTheme = (theme: string) => {
		setSelectedThemes((prev) =>
			prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme],
		);
	};

	return (
		<div className="flex min-h-screen">
			{/* Left side - Text content */}
			<div className="flex w-11/24 flex-col justify-center px-8 py-8">
				{/* Breadcrumb */}
				<div className="mb-8 text-gray-500 text-sm">
					Introduction → Audiences → Interests
				</div>

				{/* Main content */}
				<div className="space-y-8">
					<h1 className="font-light text-3xl text-gray-600 leading-relaxed">
						Help us tailor your experience of this library to your needs.
					</h1>

					<h2 className="font-light text-3xl text-gray-600 leading-relaxed">
						What interests you?
					</h2>

					{/* Theme buttons */}
					<div className="space-y-4">
						{themes.map((theme) => (
							<button
								type="button"
								key={theme}
								onClick={() => toggleTheme(theme)}
								className={`block w-full rounded-lg border-2 px-3 py-3 text-left text-2xl uppercase transition-colors ${
									selectedThemes.includes(theme)
										? "border-[#a6bcbf] bg-[#637e85] text-white"
										: "border-gray-800 border-dashed bg-white text-gray-600 hover:bg-gray-50"
								}`}
							>
								{theme}
							</button>
						))}
					</div>

					{/* Action buttons */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<span className="font-light text-3xl text-gray-600">
								Select a
							</span>
							<button
								type="button"
								className="rounded-lg border-2 border-gray-800 border-dashed bg-white px-3 py-2 text-2xl text-gray-600 uppercase transition-colors hover:bg-gray-50"
							>
								THEME
							</button>
							<span className="font-light text-3xl text-gray-600">
								that interests you to continue.
							</span>
						</div>

						<div className="flex items-center gap-2">
							<span className="font-light text-3xl text-gray-600">Or, go</span>
							<button
								type="button"
								onClick={goToSlide2}
								className="rounded-lg border-2 border-gray-800 border-dashed bg-white px-3 py-2 text-2xl text-gray-600 uppercase transition-colors hover:bg-gray-50"
							>
								BACK
							</button>
							<span className="font-light text-3xl text-gray-600">
								to the previous step.
							</span>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="mt-16 text-gray-600 text-sm">
					All rights reserved. Open Environmental Data Project © 2025.
				</div>
			</div>

			{/* Right side - Image */}
			<div className="w-13/24 p-4">
				<div
					className="h-full w-full rounded-lg bg-center bg-cover"
					style={{ backgroundImage: `url('${heroImage3}')` }}
				/>
			</div>
		</div>
	);
}
