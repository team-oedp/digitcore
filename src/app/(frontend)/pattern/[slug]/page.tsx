import type { Metadata } from "next";
import { PageHeader } from "~/components/global/page-header";
import { PageWrapper } from "~/components/global/page-wrapper";
import { PatternConnections } from "~/components/pages/pattern/pattern-connections";
import { Solutions } from "~/components/pages/pattern/solutions";
import { Resources } from "~/components/pages/pattern/resources";

export type PatternPageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({
	params,
}: PatternPageProps): Promise<Metadata> {
	const { slug } = await params;
	const readable = slug.replace(/-/g, " ");
	return {
		title: `${readable} | Pattern | DIGITCORE Toolkit`,
		description: `Learn how the ${readable} pattern can support community-centered projects.`,
	};
}

export default async function PatternPage({ params }: PatternPageProps) {
	const { slug } = await params;
	const readable = slug.replace(/-/g, " ");
	return (
		<PageWrapper>
			<div className="space-y-12">
				<PageHeader
					slug={slug}
					description={
						"Agency emerges when frontline communities lead or co-lead in decision-making. When researchers or technology developers set goals without community input, they risk overlooking local knowledge and undermining self-determination. For example, analysis of monitoring or sensor data without input from or discussion with communities risks the sharing of incomplete knowledge that can demotivate further collaboration or intervention as analytical assumptions might not reflect the communities' lived experience. Achieving this level of input from communities may demand forms of communication that go beyond typical research or technology development activities, such as participating in community organizing activities, storytelling, or simply one-on-one or in-person conversations."
					}
				/>
				<PatternConnections />
				<Solutions />
				<Resources />
			</div>
		</PageWrapper>
	);
}
