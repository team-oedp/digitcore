import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {tagType} from './tagType'
import {patternType} from './patternType'
import {audienceType} from './audienceType'
import {themeType} from './themeType'
import {solutionType} from './solutionType'
import {resourceType} from './resourceType'

export const schema: { types: SchemaTypeDefinition[] } = {
types: [blockContentType, tagType, patternType, audienceType, themeType, resourceType, solutionType],}
