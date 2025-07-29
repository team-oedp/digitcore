import type { Metadata } from "next";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { GlossaryScroll } from "./glossary-scroll";

export const metadata: Metadata = {
	title: "Glossary | DIGITCORE Toolkit",
	description:
		"Searchable reference for key terms and concepts used in the toolkit.",
};

const GLOSSARY_DATA = [
	{
		id: "api",
		letter: "A",
		term: "API (Application Programming Interface)",
		definition:
			"A set of protocols and tools that allows different software applications to communicate with each other, enabling data sharing and functionality integration in environmental research platforms.",
	},
	{
		id: "biodiversity",
		letter: "B",
		term: "Biodiversity",
		definition:
			"The variety of life on Earth at all levels, from genes to species to ecosystems, often measured and monitored through collaborative environmental research initiatives.",
	},
	{
		id: "carbon-footprint",
		letter: "C",
		term: "Carbon Footprint",
		definition:
			"The total amount of greenhouse gases produced directly and indirectly by human activities, measured in carbon dioxide equivalents.",
	},
	{
		id: "citizen-science",
		letter: "C",
		term: "Citizen Science",
		definition:
			"Scientific research conducted by members of the general public, often in collaboration with professional scientists, to gather environmental data and contribute to research outcomes.",
	},
	{
		id: "data-governance",
		letter: "D",
		term: "Data Governance",
		definition:
			"The framework of policies, procedures, and principles that ensure community data sovereignty, ethical research practices, and responsible data management in environmental research.",
	},
	{
		id: "data-sovereignty",
		letter: "D",
		term: "Data Sovereignty",
		definition:
			"The right of communities to control the collection, ownership, and application of their own data, ensuring that data use aligns with community values and self-determination.",
	},
	{
		id: "environmental-justice",
		letter: "E",
		term: "Environmental Justice",
		definition:
			"The fair treatment and meaningful involvement of all people in environmental decision-making, ensuring that no group bears a disproportionate burden of environmental harm.",
	},
	{
		id: "frontline-communities",
		letter: "F",
		term: "Frontline Communities",
		definition:
			"Communities that experience the 'first and worst' impacts of environmental degradation, pollution, and climate change, often including low-income communities and communities of color.",
	},
	{
		id: "geospatial-data",
		letter: "G",
		term: "Geospatial Data",
		definition:
			"Information that describes the geographic location and characteristics of features on Earth's surface, essential for environmental monitoring and analysis.",
	},
	{
		id: "infrastructure",
		letter: "I",
		term: "Infrastructure",
		definition:
			"The basic physical and organizational structures needed for the operation of a society or enterprise, including digital infrastructure for environmental research collaboration.",
	},
	{
		id: "machine-learning",
		letter: "M",
		term: "Machine Learning",
		definition:
			"A subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed, increasingly used in environmental data analysis.",
	},
	{
		id: "open-data",
		letter: "O",
		term: "Open Data",
		definition:
			"Data that is freely available for anyone to use, modify, and share without copyright or patent restrictions, promoting transparency in environmental research.",
	},
	{
		id: "open-infrastructure",
		letter: "O",
		term: "Open Infrastructure",
		definition:
			"Digital infrastructure elements including hardware, software, data, and platforms that are intentionally made freely available for everyone's use without copyright or payment expectations.",
	},
	{
		id: "participatory-research",
		letter: "P",
		term: "Participatory Research",
		definition:
			"Research approaches that actively involve community members as co-researchers rather than just subjects, ensuring community needs and knowledge inform the research process.",
	},
	{
		id: "pattern",
		letter: "P",
		term: "Pattern",
		definition:
			"A recurring solution or approach to common challenges in collaborative environmental research that has been tested and proven effective across different communities and contexts.",
	},
	{
		id: "quality-assurance",
		letter: "Q",
		term: "Quality Assurance",
		definition:
			"Systematic processes to ensure that environmental data and research meet established standards for accuracy, reliability, and validity.",
	},
	{
		id: "remote-sensing",
		letter: "R",
		term: "Remote Sensing",
		definition:
			"The acquisition of information about Earth's surface without direct contact, typically through satellite or aerial imagery, used extensively in environmental monitoring.",
	},
	{
		id: "sustainability",
		letter: "S",
		term: "Sustainability",
		definition:
			"Meeting the needs of the present without compromising the ability of future generations to meet their own needs, often the goal of environmental research initiatives.",
	},
	{
		id: "theme",
		letter: "T",
		term: "Theme",
		definition:
			"Fundamental conceptual areas that organize environmental research topics and community concerns, providing structure for collaborative research frameworks.",
	},
	{
		id: "urban-heat-island",
		letter: "U",
		term: "Urban Heat Island",
		definition:
			"A phenomenon where urban areas experience higher temperatures than surrounding rural areas due to human activities and built environment characteristics.",
	},
	{
		id: "visualization",
		letter: "V",
		term: "Visualization",
		definition:
			"The graphical representation of data and information to make complex environmental data more accessible and understandable to diverse audiences.",
	},
	{
		id: "watershed",
		letter: "W",
		term: "Watershed",
		definition:
			"An area of land that drains all the streams and rainfall to a common outlet, serving as a natural unit for environmental management and research.",
	},
] as const;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Grouped terms keyed by their starting letter; not every letter is present.
type Term = (typeof GLOSSARY_DATA)[number];
type TermsByLetter = Partial<Record<string, Term[]>>;

interface GlossaryPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GlossaryPage({
	searchParams,
}: GlossaryPageProps) {
	const resolvedSearchParams = await searchParams;

	// Group terms by letter
	const termsByLetter = GLOSSARY_DATA.reduce<TermsByLetter>((acc, term) => {
		const group = acc[term.letter] ?? [];
		group.push(term);
		acc[term.letter] = group;
		return acc;
	}, {});

	return (
		<div className="relative flex h-screen flex-col">
			<GlossaryScroll searchParams={resolvedSearchParams} />

			{/* Letter Navigation Sidebar - Fixed positioning */}
			<LetterNavigation
				itemsByLetter={termsByLetter}
				contentId="glossary-content"
			/>

			{/* Fixed Header Content */}
			<div className="flex-shrink-0 space-y-8 p-5 lg:pl-20">
				{/* Header */}
				<section className="max-w-4xl">
					<h1 className="font-light text-4xl text-neutral-500 leading-tight">
						Glossary
					</h1>
				</section>

				{/* Introduction */}
				<section className="max-w-4xl">
					<p className="text-base text-neutral-500 leading-relaxed">
						Building equitable open digital infrastructure requires a shared
						understanding of key concepts that bridge technology, environmental
						justice, and{" "}
						<a href="/values" className="underline">
							community collaboration
						</a>
						. This glossary defines essential terms from the DIGITCORE Toolkit,
						helping researchers, developers, community organizations, and
						advocates navigate the complex landscape of participatory science
						and open infrastructure development.
					</p>
				</section>

				{/* Current Letter Indicator */}
				<CurrentLetterIndicator
					availableLetters={Object.keys(termsByLetter)}
					contentId="glossary-content"
				/>
			</div>

			{/* Scrollable Content - Terms only */}
			<div
				id="glossary-content"
				className="scrollbar-hide flex-1 space-y-16 overflow-y-auto p-5 lg:pl-20"
			>
				{/* Terms by Letter */}
				{ALPHABET.map((letter) => {
					const terms = termsByLetter[letter];
					if (!terms || terms.length === 0) return null;

					return (
						<section
							key={letter}
							className="max-w-4xl space-y-4"
							id={`letter-${letter}`}
						>
							<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
								{letter}
							</h2>

							<Accordion type="single" collapsible className="w-full">
								{terms.map((term) => (
									<AccordionItem
										key={term.id}
										value={term.id}
										className="border-zinc-300 border-b border-dashed last:border-b"
										id={term.id}
									>
										<AccordionTrigger
											showPlusMinus
											className="items-center justify-between py-4 text-left font-normal text-neutral-500 text-xl hover:no-underline"
										>
											<span className="text-left">{term.term}</span>
										</AccordionTrigger>
										<AccordionContent className="pt-2 pb-4 text-base text-neutral-500 leading-relaxed">
											{term.definition}
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</section>
					);
				})}
			</div>
		</div>
	);
}
