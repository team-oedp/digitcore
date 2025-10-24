import type { SchemaTypeDefinition } from "sanity";

import { audienceType } from "./documents/audienceType";
import { faqCategoryType } from "./documents/faqCategoryType";
import { faqType } from "./documents/faqType";
import { glossaryType } from "./documents/glossaryType";
import { iconType } from "./documents/iconType";
import { pageType } from "./documents/pageType";
import { patternType } from "./documents/patternType";
import { resourceType } from "./documents/resourceType";
import { solutionType } from "./documents/solutionType";
import { suggestionType } from "./documents/suggestionType";
import { tagType } from "./documents/tagType";
import { themeType } from "./documents/themeType";
import { blockContentType } from "./objects/blockContentType";
import { contentListType } from "./objects/contentListType";
import { contentType } from "./objects/contentType";
import { linkType } from "./objects/linkType";
import { carrierBagType } from "./singletons/carrierBagType";
import { footerType } from "./singletons/footerType";
import { onboardingType } from "./singletons/onboardingType";
import { siteSettingsType } from "./singletons/siteSettingsType";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		linkType,
		blockContentType,
		contentType,
		contentListType,
		tagType,
		patternType,
		audienceType,
		themeType,
		resourceType,
		solutionType,
		suggestionType,
		pageType,
		glossaryType,
		faqType,
		carrierBagType,
		onboardingType,
		siteSettingsType,
		footerType,
		iconType,
		faqCategoryType,
	],
};
