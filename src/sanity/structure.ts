import {
	AsteriskIcon,
	BasketIcon,
	BookIcon,
	BulbOutlineIcon,
	CogIcon,
	DesktopIcon,
	DocumentTextIcon,
	FeedbackIcon,
	InsertAboveIcon,
	InsertBelowIcon,
	PresentationIcon,
	SearchIcon,
	SparklesIcon,
	TagIcon,
	TranslateIcon,
	UserIcon,
	WrenchIcon,
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
	{ id: "search", _type: "search", title: "Search", icon: SearchIcon },
	{ id: "header", _type: "header", title: "Header", icon: InsertBelowIcon },
	{ id: "footer", _type: "footer", title: "Footer", icon: InsertAboveIcon },
	{
		id: "siteSettings",
		_type: "siteSettings",
		title: "Site Settings",
		icon: CogIcon,
	},
	{
		id: "patternUtilities",
		_type: "patternUtilities",
		title: "Pattern Utilities",
		icon: WrenchIcon,
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
			S.listItem()
				.title("Patterns")
				.id("pattern")
				.icon(DocumentTextIcon)
				.child(
					S.list()
						.title("Patterns")
						.items(
							LANGUAGES.map((language) =>
								S.listItem()
									.title(language.title)
									.id(`pattern-${language.id}`)
									.icon(TranslateIcon)
									.child(
										S.documentList()
											.title(`${language.title} Patterns`)
											.schemaType("pattern")
											.filter('_type == "pattern" && language == $language')
											.params({ language: language.id }),
									),
							),
						),
				),
			S.listItem()
				.title("Tags")
				.id("tag")
				.icon(TagIcon)
				.child(
					S.list()
						.title("Tags")
						.items(
							LANGUAGES.map((language) =>
								S.listItem()
									.title(language.title)
									.id(`tag-${language.id}`)
									.icon(TranslateIcon)
									.child(
										S.documentList()
											.title(`${language.title} Tags`)
											.schemaType("tag")
											.filter('_type == "tag" && language == $language')
											.params({ language: language.id }),
									),
							),
						),
				),
			S.listItem()
				.title("Audiences")
				.id("audience")
				.icon(UserIcon)
				.child(
					S.list()
						.title("Audiences")
						.items(
							LANGUAGES.map((language) =>
								S.listItem()
									.title(language.title)
									.id(`audience-${language.id}`)
									.icon(TranslateIcon)
									.child(
										S.documentList()
											.title(`${language.title} Audiences`)
											.schemaType("audience")
											.filter('_type == "audience" && language == $language')
											.params({ language: language.id }),
									),
							),
						),
				),
			S.listItem()
				.title("Themes")
				.id("theme")
				.icon(AsteriskIcon)
				.child(
					S.list()
						.title("Themes")
						.items(
							LANGUAGES.map((language) =>
								S.listItem()
									.title(language.title)
									.id(`theme-${language.id}`)
									.icon(TranslateIcon)
									.child(
										S.documentList()
											.title(`${language.title} Themes`)
											.schemaType("theme")
											.filter('_type == "theme" && language == $language')
											.params({ language: language.id }),
									),
							),
						),
				),
			S.listItem()
				.title("Solutions")
				.id("solution")
				.icon(BulbOutlineIcon)
				.child(
					S.list()
						.title("Solutions")
						.items(
							LANGUAGES.map((language) =>
								S.listItem()
									.title(language.title)
									.id(`solution-${language.id}`)
									.icon(TranslateIcon)
									.child(
										S.documentList()
											.title(`${language.title} Solutions`)
											.schemaType("solution")
											.filter('_type == "solution" && language == $language')
											.params({ language: language.id }),
									),
							),
						),
				),
			S.listItem()
				.title("Resources")
				.id("resource")
				.icon(WrenchIcon)
				.child(
					S.list()
						.title("Resources")
						.items(
							LANGUAGES.map((language) =>
								S.listItem()
									.title(language.title)
									.id(`resource-${language.id}`)
									.icon(TranslateIcon)
									.child(
										S.documentList()
											.title(`${language.title} Resources`)
											.schemaType("resource")
											.filter('_type == "resource" && language == $language')
											.params({ language: language.id }),
									),
							),
						),
				),
			S.documentTypeListItem("icon").title("Icons").icon(SparklesIcon),
			S.divider(),
			S.listItem()
				.title("Pages")
				.id("page")
				.icon(DesktopIcon)
				.child(
					S.list()
						.title("Pages")
						.items(
							LANGUAGES.map((language) =>
								S.listItem()
									.title(language.title)
									.id(`page-${language.id}`)
									.icon(TranslateIcon)
									.child(
										S.documentList()
											.title(`${language.title} Pages`)
											.schemaType("page")
											.filter('_type == "page" && language == $language')
											.params({ language: language.id }),
									),
							),
						),
				),
			S.listItem()
				.title("Glossary")
				.id("glossary")
				.icon(BookIcon)
				.child(
					S.list()
						.title("Glossary")
						.items(
							LANGUAGES.map((language) =>
								S.listItem()
									.title(language.title)
									.id(`glossary-${language.id}`)
									.icon(TranslateIcon)
									.child(
										S.documentList()
											.title(`${language.title} Glossary Entries`)
											.schemaType("glossary")
											.filter('_type == "glossary" && language == $language')
											.params({ language: language.id }),
									),
							),
						),
				),
			S.listItem()
				.title("FAQ (Orderable)")
				.id("faq")
				.icon(FeedbackIcon)
				.child(
					S.list()
						.title("FAQ (Orderable)")
						.items(
							LANGUAGES.map((language) =>
								orderableDocumentListDeskItem({
									type: "faq",
									id: `faq-${language.id}`,
									title: language.title,
									icon: TranslateIcon,
									filter: "language == $language",
									params: { language: language.id },
									S,
									context,
								}),
							),
						),
				),
			S.listItem()
				.title("FAQ Categories (Optional)")
				.id("faqCategory")
				.icon(TagIcon)
				.child(
					S.list()
						.title("FAQ Categories (Optional)")
						.items(
							LANGUAGES.map((language) =>
								S.listItem()
									.title(language.title)
									.id(`faqCategory-${language.id}`)
									.icon(TranslateIcon)
									.child(
										S.documentList()
											.title(`${language.title} FAQ Categories`)
											.schemaType("faqCategory")
											.filter('_type == "faqCategory" && language == $language')
											.params({ language: language.id }),
									),
							),
						),
				),
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
			...S.documentTypeListItems().filter((item) => {
				const id = item.getId() ?? "";
				const excludedTypes = [
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
					"search",
					"siteSettings",
					"footer",
					"header",
					"patternUtilities",
					"icon",
					"suggestion",
					"translation.metadata",
					"aiContext",
				];
				return id && !excludedTypes.includes(id);
			}),
		]);
