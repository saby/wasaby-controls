type TAllCollectionsTypes =
    | 'List'
    | 'Grid'
    | 'Tree'
    | 'TreeGrid'
    | 'Tile'
    | 'TreeTile'
    | 'AdaptiveTile'
    | 'Columns'
    | 'ExpandedCompositeTree';

type TSupportedCollectionsTypesInNewScheme = Extract<
    TAllCollectionsTypes,
    'TreeGrid' | 'Tree' | 'Grid' | 'List' | 'Columns'
>;

export type { TSupportedCollectionsTypesInNewScheme as TCollectionType };
