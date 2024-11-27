/**
 * Тип всех коллекций платформенных списков.
 */
export type TAllCollectionsTypes =
    | 'List'
    | 'Grid'
    | 'Tree'
    | 'TreeGrid'
    | 'SearchTreeGrid'
    | 'Tile'
    | 'TreeTile'
    | 'SearchTreeTile'
    | 'AdaptiveTile'
    | 'Columns'
    | 'ExpandedCompositeTree';

/**
 * Тип коллекции, доступной для создания в слайсе.
 */
type TSupportedCollectionsTypesInNewScheme = Exclude<
    TAllCollectionsTypes,
    'ExpandedCompositeTree' | 'SearchTreeGrid' | 'SearchTreeTile'
>;
export type { TSupportedCollectionsTypesInNewScheme as TCollectionType };
