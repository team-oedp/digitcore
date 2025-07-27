import type { Metadata } from "next";
import { PageHeader } from "~/components/global/page-header";
import { PageWrapper } from "~/components/global/page-wrapper";
import { SearchInterface } from "~/components/pages/search/search-interface";

export const metadata: Metadata = {
	title: "Search | DIGITCORE Toolkit",
	description: "Search patterns, tags, glossary terms, and resources.",
};

export default function SearchPage() {
	return (
		<PageWrapper>
			<div className="space-y-12">
				<PageHeader />
				<SearchInterface />
			</div>
		</PageWrapper>
	);
}
