import { expandCollapse } from '../types';
import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls-DataEnv/interface';

/**
 * Конструктор действия для установки состояния разворота узлов.
 * @function
 * @param {TKey[]} expandedItems Раскрытые узлы
 * @param {TKey[]} collapsedItems Свернутые узлы
 * @return expandCollapse.TSetExpandCollapsedItemsAction
 * @remark Последовательный вызов атомарных setExpandedItems и setCollapsedItems приведет к двум обновлениям модели раскрытых узлов, парный экшен - только к одному.
 * @see expandCollapse.TSetExpandCollapsedItemsAction
 */
export const setExpandCollapsedItems = (
    expandedItems: TKey[],
    collapsedItems: TKey[]
): expandCollapse.TSetExpandCollapsedItemsAction => ({
    type: 'setExpandCollapsedItems',
    payload: {
        expandedItems,
        collapsedItems,
    },
});

/**
 * Конструктор действия для установки состояния развернутых узлов.
 * @function
 * @param {TKey[]} expandedItems Раскрытые узлы
 * @param {Boolean} updateExpansionModel Определяет будет ли модель раскрытых узлов пересчитана
 * @return expandCollapse.TSetExpandedItemsAction
 * @remark Атомарный экшен установки состояния развернутых узлов. Каждое обновление состояния по умолчанию приводит к обновлению модели раскрытых узлов. Если необходимо обновить пару, лучше использовать setExpandCollapsedItems
 * @see expandCollapse.TSetExpandCollapsedItemsAction
 */
export const setExpandedItems = (
    expandedItems: TKey[],
    updateExpansionModel: boolean = true
): expandCollapse.TSetExpandedItemsAction => ({
    type: 'setExpandedItems',
    payload: {
        expandedItems,
        updateExpansionModel,
    },
});

/**
 * Конструктор действия для установки состояния свернутых узлов.
 * @function
 * @param {TKey[]} collapsedItems Свернутые узлы
 * @param {Boolean} updateExpansionModel Определяет будет ли модель раскрытых узлов пересчитана
 * @return expandCollapse.TSetCollapsedItemsAction
 * @remark Атомарный экшен установки состояния свернутых узлов. Каждое обновление состояния по умолчанию приводит к обновлению модели раскрытых узлов. Если необходимо обновить пару, лучше использовать setExpandCollapsedItems
 * @see expandCollapse.TSetExpandCollapsedItemsAction
 */
export const setCollapsedItems = (
    collapsedItems: TKey[],
    updateExpansionModel: boolean = true
): expandCollapse.TSetCollapsedItemsAction => ({
    type: 'setCollapsedItems',
    payload: {
        collapsedItems,
        updateExpansionModel,
    },
});

/**
 * Конструктор действия для комплексного обновления развернутости узлов.
 * @function
 * @param {IListState} prevState Предыдущее состояние
 * @param {IListState} nextState Новое состояние
 * @return expandCollapse.TComplexUpdateExpandCollapseAction
 */
export const complexUpdateExpandCollapse = (
    prevState: IListState,
    nextState: IListState
): expandCollapse.TComplexUpdateExpandCollapseAction => ({
    type: 'complexUpdateExpandCollapse',
    payload: {
        prevState,
        nextState,
    },
});
