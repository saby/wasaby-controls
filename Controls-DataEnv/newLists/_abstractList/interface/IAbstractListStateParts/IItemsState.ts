import type { RecordSet } from 'Types/collection';
import type { IHasMoreStorage } from 'Controls/baseTreeDisplay';
import type { Model } from 'Types/entity';

/**
 * Тип изменения RecordSet'a.
 * @private
 */
export enum ChangeAction {
    ACTION_ADD = 'a',
    ACTION_REMOVE = 'rm',
    ACTION_CHANGE = 'ch',
    ACTION_REPLACE = 'rp',
    ACTION_MOVE = 'm',
    ACTION_RESET = 'rs',
}

/**
 * Источник изменений RecordSet'a: снаруже или извне.
 * @private
 */
export type TListChangeSource = 'INTERNAL' | 'EXTERNAL';

/**
 * Изменения(сырые) RecordSet'a.
 * @private
 */
export type TItemsChange = {
    action: ChangeAction;
    newItems: Model[];
    newItemsIndex: number;
    removedItems: Model[];
    removedItemsIndex: number;
    reason?: string;
    changedPropertyItems?: object;
    changeSource?: TListChangeSource;
};

/**
 * Интерфейс состояния для работы с записями в списке с любым типом интерактора(web/mobile).
 */
export interface IItemsState {
    /**
     * Данные списка.
     */
    items?: RecordSet;

    /**
     * Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
     *
     * @remark Например, идентификатор может быть первичным ключом записи в базе данных.
     * Если keyProperty не задан, то значение будет взято из source.
     */
    keyProperty: string;

    /**
     * @private
     */
    hasMoreStorage: IHasMoreStorage;

    /**
     * Метаданные
     * @private
     */
    metaData?: unknown;
}
