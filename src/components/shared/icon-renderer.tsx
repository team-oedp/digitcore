
import parse, {
	Element,
	domToReact,
	type DOMNode,
	type HTMLReactParserOptions,
} from "html-react-parser";

type IconRendererProps = {
	svg: string;
	color?: string;
	strokeWidth?: number;
	size?: number;
	className?: string;
	label?: string;
};

/**
 * Recursively cleans fill/stroke attributes from SVG elements
 * and replaces them with "currentColor" so they can be styled via CSS.
 */
function cleanSvgAttributes(node: Element): Element {
	const cleanedAttribs = { ...node.attribs };

	// Replace fill/stroke if they are not already currentColor or none
	if (
		cleanedAttribs.fill &&
		cleanedAttribs.fill !== "currentColor" &&
		cleanedAttribs.fill !== "none"
	) {
		cleanedAttribs.fill = "currentColor";
	}
	if (
		cleanedAttribs.stroke &&
		cleanedAttribs.stroke !== "currentColor" &&
		cleanedAttribs.stroke !== "none"
	) {
		cleanedAttribs.stroke = "currentColor";
	}

	// Recursively clean children
	const cleanedChildren = node.children.map((child) => {
		if (child instanceof Element) {
			return cleanSvgAttributes(child);
		}
		return child;
	});

	return new Element(node.name, cleanedAttribs, cleanedChildren);
}

export function IconRenderer({
	svg,
	color = "currentColor",
	strokeWidth = 2,
	size = 24,
	className,
	label,
}: IconRendererProps) {
	// Remove empty <title> and <desc> elements to avoid a11y errors
	const sanitizedSvg = svg
		.replace(/<title\b[^>]*>\s*<\/title>/gi, "")
		.replace(/<desc\b[^>]*>\s*<\/desc>/gi, "")
		.replace(/<title\b[^>]*\/\s*>/gi, "")
		.replace(/<desc\b[^>]*\/\s*>/gi, "");

	const options: HTMLReactParserOptions = {
		replace: (domNode: DOMNode) => {
			if (domNode instanceof Element && domNode.name === "svg") {
				// Clean all fill/stroke attributes recursively
				const cleanedSvg = cleanSvgAttributes(domNode);

				// Remove width/height from original so we can override
				const { width, height, ...restAttribs } = cleanedSvg.attribs;

				return (
					<svg
						{...restAttribs}
						width={size}
						height={size}
						strokeWidth={strokeWidth}
						style={{ color }}
						className={className}
						role="img"
						aria-label={label}
						aria-hidden={label ? undefined : true}
						focusable="false"
					>
						{label ? <title>{label}</title> : null}
						{domToReact(cleanedSvg.children as unknown as DOMNode[], options)}
					</svg>
				);
			}
			return undefined;
		},
	};

	return <>{parse(sanitizedSvg, options)}</>;
}
