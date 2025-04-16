import { SUPPORTED_COLLECTION_TYPES } from '../constants/CollectionType';

/**
 * Тип коллекции, доступной для создания в слайсе.
 */
type TSupportedCollectionsTypesInNewScheme = (typeof SUPPORTED_COLLECTION_TYPES)[number];

export type { TSupportedCollectionsTypesInNewScheme as TCollectionType };
