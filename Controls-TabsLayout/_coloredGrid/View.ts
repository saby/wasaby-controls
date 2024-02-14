/**
 * @kaizen_zone 0e107c1a-ee17-427f-b2a9-c869f977e22d
 */
import { Control, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-TabsLayout/_coloredGrid/Wrapper');
import {
    IColoredTabsGridOptions,
    ITabsOptions,
    ITabOptions,
} from 'Controls-TabsLayout/_coloredGrid/ColoredTabsGrid';

export { IColoredTabsGridOptions, ITabsOptions, ITabOptions };

/**
 * @typedef {Object} ITabOptions
 * @description Опции для шаблона цветной вкладки.
 * @property {String} style Стиль {@link https://wi.sbis.ru/docs/js/Controls/interface/IFontColorStyle/options/fontColorStyle/ цвета} вкладки.
 * @property {Types/source:SbisService | Types/source:Memory} [source] Источник данных.
 * Возвращает {@link Types/collection:RecordSet RecordSet} формата {@link ITabsSourceResult ITabsSourceResult}.
 * @property {Object} [templateOptions] Опции, передаваемые в разметку для контентной области вкладки.
 */

/**
 * Табличная обертка над {@link https://wi.sbis.ru/docs/js/TabsLayout/colored/View Controls-TabsLayout/colored:View}
 * @remark
 * Предназначена для упрощения взаимодействия с Controls-TabsLayout/colored:View в раскладках списка и его окружения:
 * 1. {@link https://wi.sbis.ru/docs/js/Layout/browsers/Browser/ Layout/browsers/Browser}.
 * 2. {@link https://wi.sbis.ru/docs/js/Layout/Selector/Browser/ Layout/Selector/Browser}.
 *
 *
 * @class Controls-TabsLayout/_coloredGrid/View
 * @extends UI/Base:Control
 * @control
 * @public
 * @demo Controls-TabsLayout-demo/colored/GridView/Index
 */

/**
 * @event Controls-TabsLayout/_coloredGrid/View#listSelectedKeysChanged Происходит при изменении выбранных записей.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} keys Набор ключей выбранных элементов всех вкладок.
 */

/**
 * @event Controls-TabsLayout/_coloredGrid/View#excludedKeysChanged Происходит при изменении исключенных из выбора записей.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} keys Набор ключей выбранных элементов всех вкладок.
 */

/**
 * @event Controls-TabsLayout/_coloredGrid/View#itemsLinksChanged Происходит когда экземпляр данных получен из источника
 * и подготовлен к дальнейшей обработке контролом.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Types/collection:RecordSet>} items Набор ссылок на экземпляры данных списков вкладок.
 * @example
 * В качестве примера используем функцию для сохранения ссылки на items,
 * чтобы иметь возможность изменять данные в дальнейшем.
 * <pre class="brush:html">
 *     <TabsLayout.coloredGrid:View on:itemsLinksChanged="_itemsLinksChangedHandler()" />
 * </pre>
 * <pre class="brush:js">
 *     _itemsLinksChangedHandler = function(event, items) {
 *         this._itemsLinks = items;
 *     }
 * </pre>
 * <pre class="brush:js">
 *     _updateItemField = function(itemId, field, value) {
 *         this._itemsLinks.forEach((rs) => {
 *             const rec = rs.getRecordById(itemId);
 *             if (rec) {
 *                 rec.set(field, value);
 *             }
 *         });
 *     }
 * </pre>
 */

/**
 * @event Controls-TabsLayout/_coloredGrid/View#tabSelectedKeyChanged Происходит при изменении текущей развернутой вкладки.
 * @param {UICommon/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} tabSelectedKey Ключ текущей развернутой вкладки.
 */

export default class View extends Control<IColoredTabsGridOptions> {
    protected _template: TemplateFunction = template;
}
