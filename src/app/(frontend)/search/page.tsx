import type { Metadata } from "next";
import { PageHeader } from "~/components/global/page-header";
import { PageWrapper } from "~/components/global/page-wrapper";
import { SearchInterface } from "~/components/pages/search/search-interface";
import { SearchResults } from "~/components/pages/search/search-results";
import { SearchResultsHeader } from "~/components/pages/search/search-results-header";
import { Separator } from "~/components/ui/separator";

export const metadata: Metadata = {
	title: "Search | DIGITCORE Toolkit",
	description: "Search patterns, tags, glossary terms, and resources.",
};

export default function SearchPage() {
	return (
		<PageWrapper>
			<div className="space-y-12">
				<PageHeader
					description={
						"Search the entire contents of the toolkit to discover new open environmental research to share and incorporate into your own work."
					}
				/>
				<div className="space-y-6">
					<SearchInterface />
					<SearchResultsHeader 
						resultCount={5} 
						searchQuery="maintenance" 
					/>
					<Separator />
					<SearchResults />
				</div>
			</div>
		</PageWrapper>
	);
}
