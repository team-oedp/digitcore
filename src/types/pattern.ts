import type { PortableTextBlock } from "@portabletext/types";

export interface ExternalLink {
	label: string;
	url: string;
}

export interface Tag {
	_id: string;
	title: string;
}

export interface Audience {
	_id: string;
	title: string;
	description: PortableTextBlock[];
}

export interface Theme {
	_id: string;
	title: string;
	description: PortableTextBlock[];
}

export interface Solution {
	_id: string;
	title: string;
	description: PortableTextBlock[];
	audiences: Audience[];
}

export interface Resource {
	_id: string;
	title: string;
	description: PortableTextBlock[];
	solution: Solution[];
	externalLinks: string[];
}

export interface Pattern {
	_id: string;
	title: string;
	slug: { current: string };
	description: PortableTextBlock[];
	tags: Tag[];
	audiences: Audience[];
	themes: Theme[];
	solutions: Solution[];
	resources: Resource[];
	externalLinks: ExternalLink[];
	publishedAt: string;
}

export interface CarrierBagItem {
	pattern: Pattern;
	dateAdded: string;
	notes?: string;
}
