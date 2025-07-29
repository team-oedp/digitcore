import { Minus, Plus } from "lucide-react";
import type { Metadata } from "next";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";

export const metadata: Metadata = {
	title: "FAQ | DIGITCORE Toolkit",
	description:
		"Frequently asked questions about the DIGITCORE Toolkit for Collaborative Environmental Research.",
};

const THEMES_FAQS = [
	{
		id: "theme-1",
		question: "What does 'theme' mean in this toolkit?",
		answer:
			"A theme in our toolkit represents fundamental conceptual areas that organize environmental research topics and community concerns. Themes help structure how different environmental issues, research methodologies, and community experiences are categorized and understood within the collaborative research framework.",
	},
	{
		id: "theme-2",
		question: "How are themes organized and kept relevant?",
		answer:
			"Themes are continuously curated through community input and research validation. We employ participatory methods where community members, researchers, and advocates collaboratively identify emerging themes, assess their relevance, and ensure they reflect current environmental challenges and community priorities.",
	},
	{
		id: "theme-3",
		question: "Why are themes important in this toolkit?",
		answer:
			"Themes provide essential organizational structure that enables effective knowledge sharing and collaborative research. They help bridge different perspectives, facilitate cross-community learning, and ensure that research efforts are aligned with community-identified priorities and environmental justice principles.",
	},
	{
		id: "theme-4",
		question: "How do different groups help identify and organize themes?",
		answer:
			"Various groups, including community organizations, academic institutions, and advocacy groups, play a crucial role in identifying and organizing themes. Community organizations often gather input from local residents to highlight pressing issues and common interests. Academic institutions contribute through research and analysis, providing frameworks for understanding complex themes. Advocacy groups help synthesize these insights, ensuring that diverse voices are represented and that themes are organized in a way that promotes effective action and awareness.",
	},
	{
		id: "theme-5",
		question: "How do different communities understand these themes?",
		answer:
			"Different communities bring unique cultural, geographic, and experiential perspectives to understanding themes. Our toolkit recognizes that the same environmental issue may be understood and prioritized differently across communities, and we work to ensure that these diverse interpretations are captured and respected in our thematic organization.",
	},
	{
		id: "theme-6",
		question: "How is community data sorted into themes in this toolkit?",
		answer:
			"Community data is sorted into themes through collaborative analysis involving both community members and researchers. We use participatory data analysis methods that respect community knowledge systems while applying research frameworks to identify patterns, connections, and thematic categories that emerge from the data itself.",
	},
] as const;

const PATTERNS_FAQS = [
	{
		id: "pattern-1",
		question: "What is a pattern and what is its role?",
		answer:
			"A pattern represents a recurring solution or approach to common challenges in collaborative environmental research. Patterns capture tested methods, frameworks, and strategies that have proven effective across different communities and contexts, serving as reusable templates for similar situations.",
	},
	{
		id: "pattern-2",
		question: "How do patterns structure in this toolkit?",
		answer:
			"Patterns in our toolkit are structured with clear documentation of the problem they address, the solution they provide, the context in which they work best, and examples of successful implementation. This structure enables communities to easily adapt and apply patterns to their specific environmental research needs.",
	},
	{
		id: "pattern-3",
		question: "Why the pattern as an organising method?",
		answer:
			"Patterns serve as an organizing method because they capture both practical solutions and the underlying principles that make them work. This approach enables knowledge transfer between communities while respecting local contexts and allowing for adaptation based on specific needs and circumstances.",
	},
	{
		id: "pattern-4",
		question: "What defines a pattern and its operation?",
		answer:
			"A pattern is defined by its ability to solve a recurring problem in a specific context. Its operation involves clear documentation of implementation steps, expected outcomes, potential variations, and guidance for adaptation. Each pattern operates as both a practical tool and a learning resource for collaborative environmental research.",
	},
	{
		id: "pattern-5",
		question: "What is the significance of patterns for users?",
		answer:
			"For users, patterns provide tested pathways to address environmental research challenges without starting from scratch. They offer confidence through proven approaches while maintaining flexibility for local adaptation, ultimately accelerating effective community-led environmental research and action.",
	},
	{
		id: "pattern-6",
		question: "Data Governance",
		answer:
			"Data governance in our toolkit encompasses the policies, procedures, and principles that ensure community data sovereignty and ethical research practices. This includes frameworks for community consent, data ownership, access controls, and ensuring that data use aligns with community values and self-determination.",
	},
] as const;

export default function FAQPage() {
	return (
		<div className="space-y-16 p-5">
			{/* Header */}
			<section className="max-w-4xl space-y-8">
				<h1 className="font-light text-4xl text-neutral-500 leading-tight">
					Frequently Asked Questions
				</h1>
			</section>

			{/* Introduction */}
			<section className="max-w-4xl space-y-4">
				<p className="text-2xl text-neutral-500 leading-snug">
					Welcome to our FAQ page. Here, we aim to clarify important concepts
					that connect technology, environmental justice, and community
					collaboration in the context of using the Digital Toolkit for
					Collaborative Environmental Research. This glossary serves as a
					helpful resource for researchers, developers, community organizations,
					and advocates, guiding you through the intricate world of
					participatory science and the development of open infrastructure.
				</p>
			</section>

			{/* Themes Section */}
			<section className="max-w-4xl space-y-4">
				<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
					Themes
				</h2>

				<Accordion
					type="single"
					collapsible
					defaultValue="theme-4"
					className="w-full"
				>
					{THEMES_FAQS.map((faq) => (
						<AccordionItem
							key={faq.id}
							value={faq.id}
							className="border-zinc-300 border-b border-dashed last:border-b"
						>
							<AccordionTrigger
								showPlusMinus
								className="items-center justify-between py-4 text-left font-normal text-neutral-500 text-xl hover:no-underline"
							>
								<span className="text-left">{faq.question}</span>
							</AccordionTrigger>
							<AccordionContent className="pt-2 pb-4 text-base text-neutral-500 leading-relaxed">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>

			{/* Patterns Section */}
			<section className="max-w-4xl space-y-4">
				<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
					Patterns
				</h2>

				<Accordion type="single" collapsible className="w-full">
					{PATTERNS_FAQS.map((faq) => (
						<AccordionItem
							key={faq.id}
							value={faq.id}
							className="border-zinc-300 border-b border-dashed last:border-b"
						>
							<AccordionTrigger
								showPlusMinus
								className="items-center justify-between py-4 text-left font-normal text-neutral-500 text-xl hover:no-underline"
							>
								<span className="text-left">{faq.question}</span>
							</AccordionTrigger>
							<AccordionContent className="pt-2 pb-4 text-base text-neutral-500 leading-relaxed">
								{faq.answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</section>
		</div>
	);
}
