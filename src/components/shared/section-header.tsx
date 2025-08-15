type SectionHeaderProps = {
	heading: string;
};

export function SectionHeader({ heading }: SectionHeaderProps) {
	return <h2 className="text-section-heading">{heading}</h2>;
}
