import type { CrudEntityKey } from 'Types/source';
import type { Model } from 'Types/entity';

/**
 * Карта добавленных записей.
 */
export type TAddItemsMap = Map<CrudEntityKey | undefined, Model>;

/**
 * Карта замененных записей.
 */
export type TReplaceItemsMap = Map<CrudEntityKey, Model>;
