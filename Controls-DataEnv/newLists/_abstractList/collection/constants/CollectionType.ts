/**
 * Список поддерживаемых коллекций платформенных списков
 * */
export const SUPPORTED_COLLECTION_TYPES = [
    'List',
    'Grid',
    'Tree',
    'TreeGrid',
    'SearchTreeGrid',
    'Tile',
    'TreeTile',
    'SearchTreeTile',
    'AdaptiveTile',
    'Columns',
] as const;

/**
 * Список неподдерживаемых коллекций платформенных списков
 * */
export const EXCLUDED_COLLECTION_TYPES = ['ExpandedCompositeTree'] as const;

/**
 * Список всех коллекций платформенных списков
 * */
export const ALL_COLLECTION_TYPES = [
    ...SUPPORTED_COLLECTION_TYPES,
    ...EXCLUDED_COLLECTION_TYPES,
] as const;
