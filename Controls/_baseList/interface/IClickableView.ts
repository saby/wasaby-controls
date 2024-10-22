/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
/**
 * Интерфейс для списков, которые поддерживают событие клика по элементу.
 * @interface Controls/_list/interface/IClickableView
 * @public
 */

/*
 * Interface for lists.
 * @interface Controls/_list/interface/IClickableView
 * @public
 * @author Авраменко А.С.
 */

/**
 * @event itemClick Происходит при клике на элемент списка.
 * @name Controls/_list/interface/IClickableView#itemClick
 * @param {UI/Events:SyntheticEvent} event Объект события.
 * @param {Types/entity:Record} item Элемент, по которому кликнули.
 * @param {Vdom/Vdom:SyntheticEvent<MouseEvent | null>} nativeEvent Объект нативного события браузера.
 * @param {Number} columnIndex Индекс колонки, по которой кликнули. Параметр актуален только для {@link Controls/grid:View} и {@link Controls/treeGrid:View}.
 */

/*
 * @event Occurs when a mouse button is pressed over a list item.
 * @name Controls/_list/interface/IClickableView#itemClick
 * @param {UI/Events:SyntheticEvent} event Event object.
 * @param {Types/entity:Record} item Item that the mouse button was pressed over.
 * @param {Vdom/Vdom:SyntheticEvent<MouseEvent | null>} nativeEvent Native event object.
 * @remark
 * From the itemClick event this event differs in the following:
 * 1. It works when you click on any mouse button (left, right, middle);
 * 2. It works when the button is down (itemClick fires after it is released).
 */
