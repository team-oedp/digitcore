import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./env";
import { schema } from "./schemaTypes/index";
import { structure } from "./structure";

export default defineConfig({
	title: "DIGITCORE",
	projectId,
	dataset,
	plugins: [
		structureTool({
			structure,
		}),
		visionTool(),
		// @ts-expect-error - Dual Sanity setup type conflict, see CLAUDE.md
		codeInput(),
	],
	schema,
});
