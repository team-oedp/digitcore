import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('pattern').title('Patterns'),
      S.documentTypeListItem('tag').title('Tags'),
      S.documentTypeListItem('audience').title('Audiences'),
      S.documentTypeListItem('theme').title('Themes'),
      S.documentTypeListItem('solution').title('Solutions'),
      S.documentTypeListItem('resource').title('Resources'),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('glossary').title('Glossary'),
      S.documentTypeListItem('faq').title('FAQ'),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['pattern', 'tag', 'audience', 'theme', 'resource', 'solution', 'page', 'glossary', 'faq'].includes(item.getId()!),
      ),
    ])
