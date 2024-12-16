import { expandCollapse } from '../types';
import type { IListState } from '../../interface/IListState';
import type { TKey } from 'Controls-DataEnv/interface';
import aCreator from './_actionCreator';

/**
 * Конструктор действия для установки состояния разворота узлов.
 * @function
 * @param {TKey[]} expandedItems Раскрытые узлы
 * @param {TKey[]} collapsedItems Свернутые узлы
 * @return expandCollapse.TSetExpandCollapsedItemsAction
 * @remark Последовательный вызов атомарных setExpandedItems и setCollapsedItems приведет к двум обновлениям модели раскрытых узлов, парный экшен - только к одному.
 */
export const setExpandCollapsedItems = (
    expandedItems: TKey[],
    collapsedItems: TKey[]
): expandCollapse.TSetExpandCollapsedItemsAction =>
    aCreator('setExpandCollapsedItems', {
        expandedItems,
        collapsedItems,
    });

/**
 * Конструктор действия для установки состояния развернутых узлов.
 * @function
 * @param {TKey[]} expandedItems Раскрытые узлы
 * @param {Boolean} updateExpansionModel Определяет будет ли модель раскрытых узлов пересчитана
 * @return expandCollapse.TSetExpandedItemsAction
 * @remark Атомарный экшен установки состояния развернутых узлов. Каждое обновление состояния по умолчанию приводит к обновлению модели раскрытых узлов. Если необходимо обновить пару, лучше использовать setExpandCollapsedItems
 */
export const setExpandedItems = (
    expandedItems: TKey[],
    updateExpansionModel: boolean = true
): expandCollapse.TSetExpandedItemsAction =>
    aCreator('setExpandedItems', {
        expandedItems,
        updateExpansionModel,
    });

/**
 * Конструктор действия для установки состояния свернутых узлов.
 * @function
 * @param {TKey[]} collapsedItems Свернутые узлы
 * @param {Boolean} updateExpansionModel Определяет будет ли модель раскрытых узлов пересчитана
 * @return expandCollapse.TSetCollapsedItemsAction
 * @remark Атомарный экшен установки состояния свернутых узлов. Каждое обновление состояния по умолчанию приводит к обновлению модели раскрытых узлов. Если необходимо обновить пару, лучше использовать setExpandCollapsedItems
 */
export const setCollapsedItems = (
    collapsedItems: TKey[],
    updateExpansionModel: boolean = true
): expandCollapse.TSetCollapsedItemsAction =>
    aCreator('setCollapsedItems', {
        collapsedItems,
        updateExpansionModel,
    });

/**
 * Конструктор действия для обновления модели раскрытых узлов.
 * @function
 * @return expandCollapse.TUpdateExpansionModelAction
 */
export const updateExpansionModel = (): expandCollapse.TUpdateExpansionModelAction =>
    aCreator('updateExpansionModel');

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
): expandCollapse.TComplexUpdateExpandCollapseAction =>
    aCreator('complexUpdateExpandCollapse', {
        prevState,
        nextState,
    });
