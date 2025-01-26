import type { IListState } from '../../interface/IListState';
import type { items } from '../types';
import type { RecordSet } from 'Types/collection';
import type { CrudEntityKey } from 'Types/source';
import type { TKey } from 'Controls-DataEnv/interface';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import aCreator from './_actionCreator';

/**
 * Конструктор действия, для установки маркера при замене всех записей.
 * @param items
 * @param prevStateMarkedKey Состояние маркера до удаления записей
 */
export const onAllItemsReplaced = (
    items: RecordSet,
    prevStateMarkedKey?: TKey
): items.TOnAllItemsReplacedAction =>
    aCreator('onAllItemsReplaced', {
        items,
        prevStateMarkedKey,
    });

/**
 * Конструктор действия, для установки маркера при удалении записей.
 */
export const onItemsRemoved = (
    index: number,
    keys: CrudEntityKey[],
    actionArray: TAbstractListActions.items.TAnyItemsAction[],
    prevStateMarkedKey?: TKey
): items.TOnItemsRemovedAction => ({
    type: 'onItemsRemoved',
    payload: {
        index,
        keys,
        actionArray,
        prevStateMarkedKey,
    },
});

/**
 * Конструктор действия, для установки маркера при добавлении записей.
 */
export const onItemsAdded = (
    actionArray: TAbstractListActions.items.TAnyItemsAction[],
    prevStateMarkedKey?: TKey
): items.TOnItemsAddedAction => ({
    type: 'onItemsAdded',
    payload: {
        actionArray,
        prevStateMarkedKey,
    },
});

/**
 * Конструктор действия, для комплексного обновления записей.
 * @param prevState Предыдущее состояние
 * @param nextState Новое состояние
 */
export const complexUpdateItems = (
    prevState: IListState,
    nextState: IListState
): items.TComplexUpdateItemsAction =>
    aCreator('complexUpdateItems', {
        prevState,
        nextState,
    });
