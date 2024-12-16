import { IStickyPopupOptions } from 'Controls/_popup/interface/ISticky';

/**
 * Базовый интерфейс настройки попапа для выпадающих списков.
 *
 * @public
 */
export default interface IBasePopupDropdown {
    readonly '[Controls/_dropdown/interface/IGrouped]': boolean;
}

export interface IBasePopupDropdownOptions {
    menuBackgroundStyle?: string;
    menuHoverBackgroundStyle?: string;
    menuPopupOptions?: IStickyPopupOptions;
    popupClassName?: string;
    menuBorderStyle?: string;
    menuHoverBorderStyle?: string;
    menuBorderSize?: string;
    menuBorderRadius?: string;
}
/**
 * @typedef {String} backgroundStyle
 * @variant primary
 * @variant secondary
 * @variant danger
 * @variant warning
 * @variant info
 * @variant unaccented
 */

/**
 * @typedef {String} menuBorderSize
 * @variant default
 * @variant m
 */

/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#menuBackgroundStyle
 * @cfg {backgroundStyle} Цвет фона меню.
 * @demo Controls-demo/dropdown_new/Button/MenuPopupBackground/Index
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#menuFooterBackgroundStyle
 * @cfg {backgroundStyle} Цвет фона подвала меню.
 * @demo Controls-demo/dropdown_new/Button/FooterBackgroundStyle/Index
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#menuHoverBackgroundStyle
 * @cfg {backgroundStyle} Цвет фона пункта меню при наведении.
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#menuBorderStyle
 * @cfg {Controls/display/TBorderStyle.typedef} Цвет обводки меню.
 * @demo Controls-demo/dropdown_new/Button/MenuPopupBackground/Index
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#menuHoverBorderStyle
 * @cfg {Controls/display/TBorderStyle.typedef} Цвет обводки меню при наведении.
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#menuBorderSize
 * @cfg {menuBorderSize} Толщина обводки меню.
 * default - толщина обводки по умолчанию.
 * m - жирная обводка.
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#menuPopupOptions
 * @cfg {Controls/popup:IStickyOpener} Опции для окна выпадающего списка
 * @example
 * Открываем окно выпадающего списка влево. По умолчанию окно открывается вправо.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button
 *    source="{{_source}}"
 *    displayProperty="title"
 *    keyProperty="id"
 *    menuPopupOptions="{{_menuPopupOptions}}"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * import sourceLib from "Types/source"
 *
 * _beforeMount() {
 *     this._source = new sourceLib.Memory({
 *         keyProperty: 'id',
 *         data: [
 *             {id: 1, title: 'Name'},
 *             {id: 2, title: 'Date of change'}
 *         ]
 *     });
 *     this._menuPopupOptions = {
 *         direction: {
 *             horizontal: 'left',
 *             vertical: 'bottom'
 *         }
 *     }
 * }
 * </pre>
 * @example
 * Добавляем крестик закрытия для окна.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button
 *    source="{{_source}}"
 *    displayProperty="title"
 *    keyProperty="id"
 *    menuPopupOptions="{{_menuPopupOptions}}"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * import sourceLib from "Types/source"
 *
 * _beforeMount() {
 *     this._source = new sourceLib.Memory({
 *         keyProperty: 'id',
 *         data: [
 *             {id: 1, title: 'Name'},
 *             {id: 2, title: 'Date of change'}
 *         ]
 *     });
 *     this._menuPopupOptions = {
 *         templateOptions: {
 *             closeButtonVisibility: false
 *         }
 *     }
 * }
 * </pre>
 */

/**
 * @typedef {String} BorderRadius
 * @variant 3xs
 * @variant 2xs
 * @variant xs
 * @variant s
 * @variant m
 * @variant l
 * @variant xl
 * @variant 2xl
 * @variant 3xl
 */
/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#menuBorderRadius
 * @cfg {BorderRadius} Закругление обводки контрола меню.
 */

/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#menuDraggable
 * @cfg {Boolean} Определяет, может ли меню перемещаться с помощью {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ d'n'd}.
 * @demo Controls-demo/dropdown_new/Button/DragNDrop/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button menuDraggable="{{true}}"/>
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IBasePopupDropdown#popupClassName
 * @cfg {String} Класс, который навешивается на всплывающее окно.
 * При использовании этой опции, платформенные классы для выравнивания меню относительно вызывающего элемента навешиваться не будут.
 * @example
 * Для всплывающего окна задается сдвиг вверх на 5px.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button popupClassName="MyMenu_popupClassName" />
 * </pre>
 * <pre class="brush: css">
 * .MyMenu_popupClassName {
 *    margin-top: -5px;
 * }
 * </pre>
 */
