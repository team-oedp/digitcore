import { Link02Icon, Search02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "~/components/global/icon";

const heroImage =
	"http://localhost:3845/assets/7ed4677b62d314739282582970ffc2151fe29d17.png";

type OnboardingPageProps = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export default function OnboardingPage({ searchParams }: OnboardingPageProps) {
	const patternSlug = searchParams.pattern as string | undefined;

	return (
		<div className="flex min-h-screen bg-white">
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
					style={{ backgroundImage: `url('${heroImage}')` }}
				>
					{" "}
					{/* Skip button */}
					<div className="absolute top-8 right-8">
						<Link
							href="/"
							className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-600 text-sm uppercase transition-colors hover:bg-gray-50"
						>
							Skip
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
