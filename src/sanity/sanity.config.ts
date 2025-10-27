import { assist } from "@sanity/assist";
import {
	DeleteTranslationAction,
	documentInternationalization,
} from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { type ConfigContext, type Template, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./env";
import { schema } from "./schemaTypes/index";
import { structure } from "./structure";

export default defineConfig({
	title: "DIGITCORE",
	projectId,
	dataset,
	plugins: [
		assist({
			translate: {
				document: {
					// Specify the field containing the language for the document
					languageField: "language",
				},
			},
		}),
		structureTool({
			structure,
		}),
		visionTool(),
		documentInternationalization({
			supportedLanguages: [
				{ id: "es", title: "Spanish" },
				{ id: "en", title: "English" },
			],
			languageField: "language",
			schemaTypes: [
				"pattern",
				"audience",
				"solution",
				"resource",
				"faq",
				"faqCategory",
				"tag",
				"theme",
				"glossary",
				"page",
				"onboarding",
				"header",
				"footer",
				"carrierBag",
				"siteSettings",
			],
		}),
	],
	schema,
	document: {
		actions: (prev, { schemaType }) => {
			// Add to the same schema types you use for internationalization
			if (["page"].includes(schemaType)) {
				// You might also like to filter out the built-in "delete" action
				return [...prev, DeleteTranslationAction];
			}

			return prev;
		},
	},
	templates: (prev: Template[], context: ConfigContext): Template[] =>
		prev.filter((template) => !["pattern", "page"].includes(template.id)),
});
