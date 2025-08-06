import Content from "./footer-content";

export default function Footer() {
	return (
		<footer
			className="relative h-[384px] bg-background"
			style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
		>
			<div className="-top-[100vh] relative h-[calc(100vh+384px)]">
				<div className="sticky top-[calc(100vh-384px)] h-[384px]">
					<Content />
				</div>
			</div>
		</footer>
	);
}
