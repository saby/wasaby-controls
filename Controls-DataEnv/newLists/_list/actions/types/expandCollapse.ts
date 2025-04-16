import type { TKey } from 'Controls-DataEnv/interface';
import type { TAbstractListActions } from 'Controls-DataEnv/abstractList';
import type { TAbstractAction } from 'Controls-DataEnv/dispatcher';
import type { CrudEntityKey } from 'Types/source';

//# region Экспорты для публичных типов.
export type TExpandAction = TAbstractListActions.expandCollapse.TExpandAction;
export type TCollapseAction = TAbstractListActions.expandCollapse.TCollapseAction;
export type TResetExpansionAction = TAbstractListActions.expandCollapse.TResetExpansionAction;
export type TSetExpansionModelAction = TAbstractListActions.expandCollapse.TSetExpansionModelAction;
//# endregion Экспорты для публичных типов.

/**
 * Тип действия для установки состояния разворота узлов.
 * В отличие от последовательного вызова setExpandedItems и setCollapsedItems, где обновление модели происходит на каждый экшен,
 * в парном экшене обновление модели происходит единожды.
 */
export type TSetExpandCollapsedItemsAction = TAbstractAction<
    'setExpandCollapsedItems',
    {
        expandedItems: TKey[];
        collapsedItems: TKey[];
    }
>;
/**
 * Тип действия для установки состояния развернутых узлов.
 * @remark Каждое обновление состояния по умолчанию приводит к обновлению модели раскрытых узлов, поэтому для обновления пары лучше использовать setExpandCollapsedItems
 * @see TSetExpandCollapsedItemsAction
 */
export type TSetExpandedItemsAction = TAbstractAction<
    'setExpandedItems',
    {
        expandedItems: TKey[];
    }
>;
/**
 * Тип действия для установки состояния свернутых узлов.
 * @remark Каждое обновление состояния по умолчанию приводит к обновлению модели раскрытых узлов, поэтому для обновления пары лучше использовать setExpandCollapsedItems
 * @see TSetExpandCollapsedItemsAction
 */
export type TSetCollapsedItemsAction = TAbstractAction<
    'setCollapsedItems',
    {
        collapsedItems: TKey[];
    }
>;

/**
 * Тип действия для обновления модели раскрытых узлов.
 */
export type TUpdateExpansionModelAction = TAbstractAction<'updateExpansionModel', {}>;

/**
 * Тип действия для разворота родительского узла.
 */
export type TExpandParentAction = TAbstractAction<
    'expandParent',
    {
        key: CrudEntityKey;
        markItem?: boolean;
    }
>;

/**
 * Тип действий функционала "Разворот и сворачивание узлов", доступные в WEB списке.
 * @see https://online.sbis.ru/area/4dc07e22-16bc-4793-9b70-c6819cf515fb Зона Kaizen
 */
export type TAnyExpandCollapseAction =
    | TAbstractListActions.expandCollapse.TAnyExpandCollapseAction
    | TSetExpandCollapsedItemsAction
    | TUpdateExpansionModelAction
    | TSetExpandedItemsAction
    | TSetCollapsedItemsAction
    | TExpandParentAction;
