/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
export interface IExpandedItemsOptions {
    expandedItems?: (number | string)[];
}

/**
 * Интерфейс для контролов с возможностью отображения развернутых узлов.
 * @public
 */

/*
 * Interface for components with switchable state of extensibility.
 * @public
 * @author Авраменко А.С.
 */
export default interface IExpandedItems {
    readonly '[Controls/_toggle/interface/IExpandable]': boolean;
}

/**
 * @name Controls/_interface/IExpandedItems#expandedItems
 * @cfg {Array.<String>|undefined} Идентификаторы развернутых узлов в {@link Controls/treeGrid:View дереве с колонками}.
 * @default undefined
 * @remark
 * Чтобы развернуть все элементы списка, параметр expandedItems должен быть задан как массив, содержащий один элемент — "null". В этом случае предполагается, что все данные будут загружены сразу.
 * Настройка не работает, если источник данных задан через {@link Types/source:Memory}.
 * @see expandByItemClick
 * @see expanderVisibility
 * @see collapsedItems
 */

/*
 * @name Controls/_interface/IExpandedItems#expandedItems
 * @cfg {{Array.<String>}|undefined} Array of identifiers of expanded items.
 * <b>Note:</b>
 * To expand all items, this option must be set as array containing one element “null”.
 * In this case, it is assumed that all data will be loaded initially.
 * @notice Without binding this option will be static. Use binding to allow expanding/collapsing nodes.
 * @example
 * <pre>
 *      <Controls.treeGrid:View
 *           bind:expandedItems="_expandedItems">
 *      </Controls.treeGrid:View>
 *  </pre>
 *  @see collapsedItems
 */

/**
 * @event expandedItemsChanged Происходит при изменении набора развернутых узлов.
 * @name Controls/_interface/IExpandedItems#expandedItemsChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} expandedItems Идентификаторы развернутых узлов.
 * @see collapsedItemsChanged
 */
