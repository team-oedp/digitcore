import type { SchemaTypeDefinition } from "sanity";

import { audienceType } from "./audienceType";
import { blockContentType } from "./blockContentType";
import { carrierBagType } from "./carrierBagType";
import { externalLinkType } from "./externalLinkType";
import { faqType } from "./faqType";
import { glossaryType } from "./glossaryType";
import { onboardingType } from "./onboardingType";
import { pageType } from "./pageType";
import { patternType } from "./patternType";
import { resourceType } from "./resourceType";
import { siteSettingsType } from "./siteSettingsType";
import { solutionType } from "./solutionType";
import { tagType } from "./tagType";
import { themeType } from "./themeType";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		blockContentType,
		externalLinkType,
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
