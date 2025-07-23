import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Digitcore')
    .items([
      S.documentTypeListItem('pattern').title('Patterns'),
      S.documentTypeListItem('tag').title('Tags'),
      S.documentTypeListItem('audience').title('Audiences'),
      S.documentTypeListItem('theme').title('Themes'),
      S.documentTypeListItem('solution').title('Solutions'),
      S.documentTypeListItem('resource').title('Resources'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['pattern', 'tag', 'audience', 'theme', 'resource', 'solution'].includes(item.getId()!),
      ),
    ])
