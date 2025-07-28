"use client";

import { SearchResultItem } from "./search-result-item";

type Audience = {
	id: string;
	name: string;
};

type SearchResult = {
	id: string;
	title: string;
	source: string;
	category: string;
	audiences: Audience[];
	tags?: string[];
	theme?: string;
	url?: string;
	type: "solution" | "pattern";
	description: string;
};

type SearchResultsProps = {
	results?: SearchResult[];
};

const mockResults: SearchResult[] = [
	{
		id: "9D1A438D-2750-4A75-90F1-9421F901C1C0",
		title: "Explore financially sustainable models",
		source: "PATTERN",
		category: "Open tools need ongoing maintenance",
		audiences: [
			{
				id: "79750DD5-566C-4E21-A722-F917F691251C",
				name: "Open source technologists",
			},
			{ id: "7445C1BE-8E22-4D9C-9510-0ACFC13B9BB5", name: "Researchers" },
		],
		url: "#",
		type: "solution",
		description:
			"Open source tools require ongoing resources for maintenance, updates, and support. Communities' agency is respected when they are able to lead or co-lead in decision-making. When researchers or technology developers set goals without community input, they risk overlooking local knowledge and undermining self-determination.",
	},
	{
		id: "7C4CCF6C-B2FA-49C6-A663-CF1AF7058194",
		title: "Develop a plan for sharing and supporting existing tools",
		source: "PATTERN",
		category: "Open tools need ongoing maintenance",
		audiences: [
			{
				id: "79750DD5-566C-4E21-A722-F917F691251C",
				name: "Open source technologists",
			},
			{ id: "7445C1BE-8E22-4D9C-9510-0ACFC13B9BB5", name: "Researchers" },
		],
		url: "#",
		type: "solution",
		description:
			"Successful open tools require structured approaches to sharing knowledge and providing ongoing support. This includes documentation, community building, and sustainable funding models that ensure long-term viability and accessibility for all users.",
	},
	{
		id: "DB502B10-3A13-41E1-B3CC-23D5848193D0",
		title: "Embrace modularity and layered design",
		source: "PATTERN",
		category: "Balancing Scale and Specificity",
		audiences: [
			{
				id: "79750DD5-566C-4E21-A722-F917F691251C",
				name: "Open source technologists",
			},
			{ id: "7445C1BE-8E22-4D9C-9510-0ACFC13B9BB5", name: "Researchers" },
		],
		url: "#",
		type: "solution",
		description:
			"Modular design allows systems to scale effectively while maintaining specificity for different use cases. By creating layered architectures, tools can serve diverse communities without overwhelming users with unnecessary complexity or features they don't need.",
	},
	{
		id: "1B00DD11-B044-4966-9B73-AD48618F978F",
		title: "Embrace modularity and layered design",
		source: "PATTERN",
		category: "Balancing Scale and Specificity",
		audiences: [
			{
				id: "79750DD5-566C-4E21-A722-F917F691251C",
				name: "Open source technologists",
			},
			{ id: "7445C1BE-8E22-4D9C-9510-0ACFC13B9BB5", name: "Researchers" },
		],
		url: "#",
		type: "solution",
		description:
			"Modular design allows systems to scale effectively while maintaining specificity for different use cases. By creating layered architectures, tools can serve diverse communities without overwhelming users with unnecessary complexity or features they don't need.",
	},
	{
		id: "9EACB96A-FF0E-431C-B744-98466891B055",
		title: "Embrace modularity and layered design",
		source: "PATTERN",
		category: "Balancing Scale and Specificity",
		audiences: [
			{
				id: "79750DD5-566C-4E21-A722-F917F691251C",
				name: "Open source technologists",
			},
			{ id: "7445C1BE-8E22-4D9C-9510-0ACFC13B9BB5", name: "Researchers" },
		],
		url: "#",
		type: "solution",
		description:
			"Modular design allows systems to scale effectively while maintaining specificity for different use cases. By creating layered architectures, tools can serve diverse communities without overwhelming users with unnecessary complexity or features they don't need.",
	},
];

export function SearchResults({ results = mockResults }: SearchResultsProps) {
	if (!results || results.length === 0) {
		return (
			<div className="py-12 text-center text-zinc-500">
				No search results found. Try adjusting your search terms or filters.
			</div>
		);
	}

	return (
		<div className="w-full">
			{results.map((result) => (
				<SearchResultItem
					key={result.id}
					title={result.title}
					source={result.source}
					category={result.category}
					audiences={result.audiences}
					url={result.url}
					description={result.description}
				/>
			))}
		</div>
	);
}
