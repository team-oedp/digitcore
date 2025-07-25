import { BasketIcon, PresentationIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
	S.list()
		.title("Content")
		.items([
			S.documentTypeListItem("pattern").title("Patterns"),
			S.documentTypeListItem("tag").title("Tags"),
			S.documentTypeListItem("audience").title("Audiences"),
			S.documentTypeListItem("theme").title("Themes"),
			S.documentTypeListItem("solution").title("Solutions"),
			S.documentTypeListItem("resource").title("Resources"),
			S.divider(),
			S.documentTypeListItem("page").title("Pages"),
			S.documentTypeListItem("glossary").title("Glossary"),
			S.documentTypeListItem("faq").title("FAQ"),
			S.listItem()
				.title("Carrier Bag")
				.child(S.document().schemaType("carrierBag").documentId("carrierBag"))
				.icon(BasketIcon),
			S.listItem()
				.title("Onboarding")
				.child(S.document().schemaType("onboarding").documentId("onboarding"))
				.icon(PresentationIcon),
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
						"carrierBag",
						"onboarding",
					].includes(item.getId() ?? ""),
			),
		]);
