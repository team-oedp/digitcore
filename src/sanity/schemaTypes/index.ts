import type { SchemaTypeDefinition } from "sanity";

import { audienceType } from "./audienceType";
import { blockContentType } from "./blockContentType";
import { pageType } from "./pageType";
import { patternType } from "./patternType";
import { resourceType } from "./resourceType";
import { solutionType } from "./solutionType";
import { tagType } from "./tagType";
import { themeType } from "./themeType";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [
		blockContentType,
		tagType,
		patternType,
		audienceType,
		themeType,
		resourceType,
		solutionType,
		pageType,
	],
};
