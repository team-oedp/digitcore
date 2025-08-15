type SectionHeaderProps = {
	children: React.ReactNode;
};

export function SectionHeader({ children }: SectionHeaderProps) {
	return <h2 className="text-section-heading">{children}</h2>;
}
