type SectionHeadingProps = {
	heading: string;
};

export function SectionHeading({ heading }: SectionHeadingProps) {
	return <h2 className="text-section-heading">{heading}</h2>;
}
