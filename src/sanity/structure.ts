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
			S.listItem()
				.title("Carrier Bag")
				.child(S.document().schemaType("carrierBag").documentId("carrierBag"))
				.icon(BasketIcon),
			S.listItem()
				.title("Orientation")
				.child(S.document().schemaType("onboarding").documentId("onboarding"))
				.icon(PresentationIcon),
			S.listItem()
				.title("Header")
				.child(S.document().schemaType("header").documentId("header"))
				.icon(StackCompactIcon),
			S.listItem()
				.title("Footer")
				.child(S.document().schemaType("footer").documentId("footer"))
				.icon(StackCompactIcon),
			S.listItem()
				.title("Site Settings")
				.child(
					S.document().schemaType("siteSettings").documentId("siteSettings"),
				)
				.icon(CogIcon),
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
					].includes(item.getId() ?? ""),
			),
		]);
