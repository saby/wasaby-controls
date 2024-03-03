/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TExpanderIconSize, TExpanderIconStyle } from 'Controls/interface';

export default interface IItemTemplateOptions {
    expanderIconSize?: TExpanderIconSize;
    expanderIconStyle?: TExpanderIconStyle;
}

/**
 * Базовый Шаблон элемента дерева.
 * @class Controls/_tree/interface/ItemTemplate
 * @implements Controls/list:IBaseItemTemplate
 * @public
 */

/**
 * @name Controls/_tree/interface/ItemTemplate#expanderSize
 * @cfg {Controls/_baseTree/interface/ITree/TOffset.typedef} Размер области, который отведён под иконку узла или скрытого узла.
 * @default s
 * @remark
 * Опции expanderSize на контроле и {@link Controls/treeGrid:ItemTemplate#expanderSize expanderSize на шаблоне элемента} не являются взаимоисключающими.
 * Опция expanderSize на контроле определяет размер области, отведённой под иконку узла или скрытого узла для всего списка, включая автоматическую конфигурацию {@link nodeFooterTemplate шаблона подвалов узлов}.
 * Опция {@link Controls/treeGrid:ItemTemplate#expanderSize expanderSize на шаблоне элемента} приоритетнее, чем expanderSize на контроле.
 * В случае, если для разных элементов дерева заданы разные значения опции, то для корректного выравнивания подвалов узлов необходимо продублировать опцию на {@link nodeFooterTemplate шаблоне подвалов узлов}.
 * Размер области xs рекомендуется задавать только вместе с иконкой разворота {@link Controls/_tree/interface/ItemTemplate#expanderIconSize размера} 2xs
 * @see expanderIcon
 * @see expanderIconSize
 * @see expanderVisibility
 */

/**
 * @name Controls/_tree/interface/ItemTemplate#expanderIcon
 * @cfg {String|undefined} Стиль отображения иконки для всех узлов и скрытых узлов дерева.
 * @variant none Иконки всех узлов и скрытых узлов не отображаются.
 * @variant node Иконки всех узлов и скрытых узлов отображаются как иконки узлов.
 * @variant hiddenNode Иконки всех узлов и скрытых узлов отображаются как иконки скрытых узлов.
 * @variant emptyNode Иконки всех узлов отображаются как иконки пустых узлов.
 * @default undefined
 * @remark
 * Когда в опции задано undefined, используются иконки узлов и скрытых узлов.
 * Опции expanderIcon на контроле и {@link Controls/treeGrid:ItemTemplate#expanderIcon expanderIcon на шаблоне элемента} не являются взаимоисключающими.
 * Опции expanderIcon на контроле определяет стиль отображения иконки для узла и скрытого узла для всего списка, включая автоматическую конфигурацию {@link nodeFooterTemplate шаблона подвалов узлов}.
 * Опция {@link Controls/treeGrid:ItemTemplate#expanderIcon expanderIcon на шаблоне элемента} приоритетнее, чем expanderIcon на контроле.
 * В случае, если для разных элементов дерева заданы разные значения опции, то для корректного выравнивания подвалов узлов необходимо продублировать опцию на {@link nodeFooterTemplate шаблоне подвалов узлов}.
 * @see expanderSize
 * @see expanderVisibility
 */

/**
 * @name Controls/_tree/interface/ItemTemplate#expanderIconSize
 * @cfg {Controls/_interface/IExpandedItems/TExpanderIconSize.typedef} Размер иконки разворота узла дерева
 * @default default
 * @see expanderSize
 */

/**
 * @name Controls/_tree/interface/ItemTemplate#expanderIconStyle
 * @cfg {Controls/_interface/IExpandedItems/TExpanderIconStyle.typedef} Стиль цвета иконки разворота узла дерева
 * @default default
 */

/**
 * @name Controls/_tree/interface/ItemTemplate#withoutExpanderPadding
 * @cfg {Boolean} Убирает отступ под иконку разворота узла.
 * @default false
 */
