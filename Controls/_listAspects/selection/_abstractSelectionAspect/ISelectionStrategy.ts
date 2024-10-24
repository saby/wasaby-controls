import type { CrudEntityKey } from 'Types/source';
import type { IAbstractSelectionState, TSelectionModel } from './IAbstractSelectionState';
import type { CollectionItem } from 'Controls/display';

export interface ISelectionStrategy<TSelectionState extends IAbstractSelectionState> {
    /**
     * Выбирает элементы с переданными ключам
     */
    select(state: TSelectionState, key: CrudEntityKey, searchMode?: boolean): TSelectionState;

    /**
     * Снимает выбор с элементов с переданными ключам
     */
    unselect(state: TSelectionState, key: CrudEntityKey, searchMode?: boolean): TSelectionState;

    selectAll(state: TSelectionState, limit?: number): TSelectionState;

    unselectAll(state: TSelectionState, filter?: object): TSelectionState;

    toggleAll(
        state: TSelectionState,
        hasMoreData?: boolean,
        rootChanged?: boolean
    ): TSelectionState;

    selectRange(state: TSelectionState, items: CollectionItem[]): TSelectionState;

    isAllSelected(
        state: TSelectionState,
        hasMoreData: boolean,
        itemsCount: number,
        limit: number,
        byEveryItem?: boolean,
        rootKey?: CrudEntityKey
    ): boolean;

    /**
     * Возвращает состояние элементов для модели
     */
    getSelectionModel(
        state: TSelectionState,
        limit?: number,
        searchMode?: boolean
    ): TSelectionModel;
}
