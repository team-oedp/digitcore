import type { SchemaTypeDefinition } from "sanity";

import { audienceType } from "./documents/audienceType";
import { faqType } from "./documents/faqType";
import { glossaryType } from "./documents/glossaryType";
import { pageType } from "./documents/pageType";
import { patternType } from "./documents/patternType";
import { resourceType } from "./documents/resourceType";
import { solutionType } from "./documents/solutionType";
import { tagType } from "./documents/tagType";
import { themeType } from "./documents/themeType";
import { blockContentType } from "./objects/blockContentType";
import { contentType } from "./objects/contentType";
import { linkType } from "./objects/linkType";
import { carrierBagType } from "./singletons/carrierBagType";
import { onboardingType } from "./singletons/onboardingType";
import { siteSettingsType } from "./singletons/siteSettingsType";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		linkType,
		blockContentType,
		contentType,
		tagType,
		patternType,
		audienceType,
		themeType,
		resourceType,
		solutionType,
		pageType,
		glossaryType,
		faqType,
		carrierBagType,
		onboardingType,
		siteSettingsType,
	],
};
