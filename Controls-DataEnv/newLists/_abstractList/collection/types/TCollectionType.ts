/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
type TAllCollectionsTypes =
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

type TSupportedCollectionsTypesInNewScheme = Exclude<
    TAllCollectionsTypes,
    'ExpandedCompositeTree' | 'SearchTreeGrid' | 'SearchTreeTile'
>;
export type { TSupportedCollectionsTypesInNewScheme as TCollectionType };
