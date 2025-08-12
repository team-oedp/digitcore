import { Card, Flex, Stack, Text } from "@sanity/ui";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import type { ObjectInputProps } from "sanity";

type CodeValue = {
	code?: string;
	language?: string;
	filename?: string;
} & { [key: string]: unknown };

export function SvgCodeInput(props: ObjectInputProps<CodeValue>) {
	const { renderDefault, value } = props;
	const code = (value as { code?: string } | undefined)?.code || "";
	const sanitized = code ? DOMPurify.sanitize(code) : "";

	return (
		<Stack space={3}>
			{renderDefault(props)}
			<Card padding={3} tone="transparent" border>
				<Stack space={2}>
					<Text size={1} muted>
						SVG Preview
					</Text>
					<Card padding={2} style={{ backgroundColor: "#fff" }}>
						<Flex
							style={{ height: 200, maxWidth: "100%" }}
							align="center"
							justify="center"
						>
							{sanitized ? parse(sanitized) : null}
						</Flex>
					</Card>
				</Stack>
			</Card>
		</Stack>
	);
}
