import type { SchemaTypeDefinition } from "sanity";

import {blockContentType} from './blockContentType'
import {tagType} from './tagType'
import {patternType} from './patternType'
import {audienceType} from './audienceType'
import {themeType} from './themeType'
import {solutionType} from './solutionType'
import {resourceType} from './resourceType'
import {pageType} from './pageType'
import {glossaryType} from './glossaryType'
import {faqType} from './faqType'
import {carrierBagType} from './carrierBagType'
import {onboardingType} from './onboardingType'
import {siteSettingsType} from './siteSettingsType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, tagType, patternType, audienceType, themeType, resourceType, solutionType, pageType, glossaryType, faqType, carrierBagType, onboardingType, siteSettingsType],
}
