import {
	BasketIcon,
	CogIcon,
	FeedbackIcon,
	PresentationIcon,
	SparklesIcon,
	StackCompactIcon,
} from "@sanity/icons";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import type { StructureResolver } from "sanity/structure";

const SINGLETONS = [
	{
		id: "carrierBag",
		_type: "carrierBag",
		title: "Carrier Bag",
		icon: BasketIcon,
	},
	{
		id: "onboarding",
		_type: "onboarding",
		title: "Orientation",
		icon: PresentationIcon,
	},
	{ id: "header", _type: "header", title: "Header", icon: StackCompactIcon },
	{ id: "footer", _type: "footer", title: "Footer", icon: StackCompactIcon },
	{
		id: "siteSettings",
		_type: "siteSettings",
		title: "Site Settings",
		icon: CogIcon,
	},
];
const LANGUAGES = [
	{ id: "en", title: "English" },
	{ id: "es", title: "Spanish" },
];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
	S.list()
		.title("Content")
		.items([
			S.documentTypeListItem("pattern").title("Patterns"),
			S.documentTypeListItem("tag").title("Tags"),
			S.documentTypeListItem("audience").title("Audiences"),
			S.documentTypeListItem("theme").title("Themes"),
			S.documentTypeListItem("solution").title("Solutions"),
			S.documentTypeListItem("resource").title("Resources"),
			S.documentTypeListItem("icon").title("Icons").icon(SparklesIcon),
			S.divider(),
			S.documentTypeListItem("page").title("Pages"),
			S.documentTypeListItem("glossary").title("Glossary"),
			orderableDocumentListDeskItem({
				type: "faq",
				title: "FAQ (Orderable)",
				icon: FeedbackIcon,
				S,
				context,
			}),
			S.documentTypeListItem("faqCategory").title("FAQ Categories (Optional)"),
			S.documentTypeListItem("suggestion").title("Suggestions"),
			// SINGLETONS
			...SINGLETONS.map((singleton) =>
				S.listItem()
					.title(singleton.title)
					.id(singleton.id)
					.icon(singleton.icon)
					.child(
						S.list()
							.title(singleton.title)
							.id(singleton.id)
							.items(
								LANGUAGES.map((language) =>
									S.documentListItem()
										.schemaType(singleton._type)
										.id(`${singleton.id}-${language.id}`)
										.title(
											`${singleton.title} (${language.id.toLocaleUpperCase()})`,
										),
								),
							)
							.canHandleIntent(
								(intentName, params) =>
									intentName === "edit" && params.id.startsWith(singleton.id),
							),
					),
			),
			// S.listItem()
			// 	.title("Carrier Bag")
			// 	.child(S.document().schemaType("carrierBag").documentId("carrierBag"))
			// 	.icon(BasketIcon),
			// S.listItem()
			// 	.title("Orientation")
			// 	.child(S.document().schemaType("onboarding").documentId("onboarding"))
			// 	.icon(PresentationIcon),
			// S.listItem()
			// 	.title("Header")
			// 	.child(S.document().schemaType("header").documentId("header"))
			// 	.icon(StackCompactIcon),
			// S.listItem()
			// 	.title("Footer")
			// 	.child(S.document().schemaType("footer").documentId("footer"))
			// 	.icon(StackCompactIcon),
			// S.listItem()
			// 	.title("Site Settings")
			// 	.child(
			// 		S.document().schemaType("siteSettings").documentId("siteSettings"),
			// 	)
			// 	.icon(CogIcon),
			...S.documentTypeListItems().filter(
				(item) =>
					item.getId() &&
					![
						"pattern",
						"tag",
						"audience",
						"theme",
						"resource",
						"solution",
						"page",
						"glossary",
						"faq",
						"faqCategory",
						"carrierBag",
						"onboarding",
						"siteSettings",
						"footer",
						"header",
						"icon",
						"suggestion",
						"translation.metadata",
					].includes(item.getId() ?? ""),
			),
		]);
