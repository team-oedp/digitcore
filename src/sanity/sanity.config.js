import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./schemaTypes/index.ts";
import { structure } from "./structure.ts";

export default defineConfig({
	name: "default",
	title: "Digitcore",

	projectId: "q0v6uag1",
	dataset: "production",

	plugins: [
		structureTool({
			structure,
		}),
		visionTool(),
	],

	schema,
});
