/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */

import { TIconSize, TIconStyle } from 'Controls/interface';

export interface IExpandedItemsOptions {
    expandedItems?: (number | string | null)[];
    collapsedItems?: (number | string)[];
}

/**
 * Интерфейс для контролов с возможностью отображения развернутых узлов.
 * @public
 */
export default interface IExpandedItems {
    readonly '[Controls/_toggle/interface/IExpandable]': boolean;
}

/**
 * @typedef {String} Controls/_interface/IExpandedItems/TExpanderIconSize
 * @description Тип значений для настройки размеров иконки разворота узла
 * @variant 2xs Малые иконки разворота узла
 * @variant default Размера иконок по умолчанию
 */
export type TExpanderIconSize = Extract<TIconSize, '2xs' | 'default'>;

/**
 * @typedef {String} Controls/_interface/IExpandedItems/TExpanderIconStyle
 * @description Тип значений для настройки стиля цвета иконки разворота узла
 * @variant unaccented Неакцентный цвет иконки разворота узла
 * @variant default Цвет иконки разворота узла по умолчанию
 */
export type TExpanderIconStyle = Extract<TIconStyle, 'unaccented' | 'default'>;

/**
 * Режим отображения отступа вместо иконки разворота.
 * @typedef {String} Controls/_interface/IExpandedItems/TExpanderPaddingVisibility
 * @variant visible Всегда отображает отступ, независимо от наличия иконок разворота во всем списке
 * @variant hidden Никогда не отображаем отступ
 * @variant hasExpander Отображаем отступ, если хоть у одного узла отображается экспандер
 */
export type TExpanderPaddingVisibility = 'visible' | 'hidden' | 'hasExpander';

/**
 * @name Controls/_interface/IExpandedItems#expandedItems
 * @cfg {Array.<String>|undefined} Идентификаторы развернутых узлов.
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
