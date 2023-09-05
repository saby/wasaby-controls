/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import { IControlOptions } from 'UI/Base';
import {
    ISourceOptions,
    ITooltipOptions,
    ISearchOptions,
    IItemsOptions,
    ISearchValue,
} from 'Controls/interface';
import { IStickyPopupOptions } from 'Controls/popup';
import { IMenuPopupOptions } from 'Controls/menu';
import { ICrudPlus } from 'Types/source';
import { Record } from 'Types/entity';
import { RecordSet } from 'Types/collection';
export type TKey = string | number | null;

export interface IDropdownSourceOptions {
    source?: ICrudPlus;
}

export interface IBaseDropdownOptions
    extends IControlOptions,
        ISourceOptions,
        IMenuPopupOptions,
        IStickyPopupOptions,
        ITooltipOptions,
        ISearchOptions,
        ISearchValue,
        IItemsOptions<Record> {
    items?: RecordSet;
    dropdownClassName?: string;
    historyId?: string;
    popupClassName?: string;
    keyProperty: string;
    emptyText?: string;
    displayProperty: string;
    closeMenuOnOutsideClick: boolean;
    menuBackgroundStyle: string;
    menuHoverBackgroundStyle: string;
    menuPopupOptions?: IStickyPopupOptions;
}

/**
 * Базовый интерфейс для выпадающих списков.
 *
 * @public
 */
export default interface IBaseDropdown {
    readonly '[Controls/_dropdown/interface/IBaseDropdown]': boolean;
    openMenu(popupOptions?: IStickyPopupOptions): void;
    closeMenu(): void;
    reload(): void;
}

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#sourceController
 * @cfg {Controls/dataSource:NewSourceController} Экземпляр контроллера источника для получения записей меню
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#searchPlaceholder
 * @cfg {String} Текст, который отображается в пустом поле поиска.
 * @demo Controls-demo/dropdown_new/Search/SearchPlaceholder/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button searchPlaceholder="search placeholder" />
 * </pre>
 * @see searchParam
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#searchValue
 * @cfg {String} Текст, который отображается в пустом поле поиска.
 * @demo Controls-demo/dropdown_new/Search/SearchPlaceholder/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button searchPlaceholder="search placeholder" />
 * </pre>
 * @see searchParam
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuViewMode
 * @cfg {String} Режим отображения меню.
 * @variant search Поиск.
 * @variant list Плоский список.
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#maxHistoryVisibleItems
 * @cfg {String} Максимальное количество записей, которые будут отображены в меню с историей. Остальные записи скрываются под кнопку сворачивания.
 * @default 10
 * @demo Controls-demo/dropdown_new/Button/MaxHistoryVisibleItems/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button maxHistoryVisibleItems="{{5}}" />
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuDraggable
 * @cfg {Boolean} Определяет, может ли меню перемещаться с помощью {@link /doc/platform/developmentapl/interface-development/controls/drag-n-drop/ d'n'd}.
 * @demo Controls-demo/dropdown_new/Button/DragNDrop/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button menuDraggable="{{true}}"/>
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#historyId
 * @cfg {String} Уникальный идентификатор для сохранения истории выбора записей.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/input-elements/dropdown-menu/item-config/#history здесь}.
 * @demo Controls-demo/dropdown_new/Button/HistoryId/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector historyId="myHistoryId"/>
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
 * @name Controls/_dropdown/interface/IBaseDropdown#menuBorderRadius
 * @cfg {BorderRadius} Закругление обводки контрола меню.
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#dropdownClassName
 * @cfg {String} Класс, который навешивается на выпадающий список.
 * @demo Controls-demo/dropdown_new/Button/DropdownClassName/Index
 * @example
 * Меню со скроллом.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button
 *    keyProperty="id"
 *    icon="icon-Check"
 *    iconSize="s"
 *    dropdownClassName="demo_menu"
 *    source="{{_source}}" />
 * </pre>
 * CSS:
 * <pre class="brush: css">
 * .demo_menu {
 *    max-height: 250px;
 * }
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * this._source = new Memory({
 *     data: [
 *         { id: 1, title: 'Task in development' },
 *         { id: 2, title: 'Error in development' },
 *         { id: 3, title: 'Application' },
 *         { id: 4, title: 'Assignment' },
 *         { id: 5, title: 'Approval' },
 *         { id: 6, title: 'Working out' },
 *         { id: 7, title: 'Assignment for accounting' },
 *         { id: 8, title: 'Assignment for delivery' },
 *         { id: 9, title: 'Assignment for logisticians' }
 *     ],
 *     keyProperty: 'id'
 * });
 * </pre>
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#popupClassName
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

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuPopupOptions
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
 * @name Controls/_dropdown/interface/IBaseDropdown#closeMenuOnOutsideClick
 * @cfg {Boolean} Определяет возможность закрытия меню по клику вне.
 * @default true
 */

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
 * @name Controls/_dropdown/interface/IBaseDropdown#menuBackgroundStyle
 * @cfg {backgroundStyle} Цвет фона меню.
 * @demo Controls-demo/dropdown_new/Button/MenuPopupBackground/Index
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuHoverBackgroundStyle
 * @cfg {backgroundStyle} Цвет фона пункта меню при наведении.
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuBorderStyle
 * @cfg {Controls/display/TBorderStyle.typedef} Цвет обводки меню.
 * @demo Controls-demo/dropdown_new/Button/MenuPopupBackground/Index
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuHoverBorderStyle
 * @cfg {Controls/display/TBorderStyle.typedef} Цвет обводки меню при наведении.
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuBorderSize
 * @cfg {menuBorderSize} Толщина обводки меню.
 * default - толщина обводки по умолчанию.
 * m - жирная обводка.
 * @default default
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#items
 * @cfg {RecordSet.<Controls/_dropdown/interface/IBaseDropdown/Item.typedef>} Определяет набор записей по которым строится контрол. Если в меню всего один пункт, клик по кнопке вызовет событие menuItemActivate с идентификатором (id) этого пункта и меню не откроется.
 * @default undefined
 * @remark
 * Запись может иметь следующие {@link Controls/_dropdown/interface/IBaseDropdown/Item.typedef свойства}.
 * @example
 * Записи будут отображены из рекордсета _items.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector bind:selectedKeys="_selectedKeys"
 *                             keyProperty="key"
 *                             displayProperty="title"
 *                             items="{{_items}}" />
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * import {RecordSet} from 'Types/collection';
 *
 * protected _selectedKeys: string[] = ['2'];
 * protected _items: RecordSet = new RecordSet({
 *    keyProperty: 'key',
 *    rawData: [
 *       {key: '1', icon: 'icon-EmptyMessage', iconStyle: 'info', title: 'Message'},
 *       {key: '2', icon: 'icon-TFTask', title: 'Task'},
 *       {key: '3', title: 'Report'},
 *       {key: '4', title: 'News', readOnly: true}
 *    ]
 * })
 * </pre>
 */

/**
 * @event Controls/_dropdown/interface/IBaseDropdown#rightTemplateClick Происходит при клике на шаблон rightTemplate.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} eventObject Выбранный элемент, содержащий rightTemplate.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button on:rightTemplateClick="_rightTemplateClick()"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * _rightTemplateClick(event, item) {
 *    this._processRightTemplateClick(item)
 * },
 * </pre>
 */

/**
 * @event Controls/_dropdown/interface/IBaseDropdown#dropDownOpen Происходит при открытии выпадающего списка.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button on:dropDownOpen="_dropDownOpen()" on:dropDownClose="_dropDownClose()"/>
 * <div>dropDownOpened: {{_dropDownOpened}}</div>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * _dropDownOpen() {
 *    this._dropDownOpened = true;
 * },
 * _dropDownClose() {
 *    this._dropDownOpened = false;
 * }
 * </pre>
 */

/**
 * @event Controls/_dropdown/interface/IBaseDropdown#dropDownClose Происходит при закрытии выпадающего списка.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button on:dropDownOpen="_dropDownOpen()" on:dropDownClose="_dropDownClose()"/>
 * <div>dropDownOpened: {{_dropDownOpened}}</div>
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * _dropDownOpen() {
 *    this._dropDownOpened = true;
 * },
 * _dropDownClose() {
 *    this._dropDownOpened = false;
 * }
 * </pre>
 */

/**
 * Открывает выпадающий список.
 * @function Controls/_dropdown/interface/IBaseDropdown#openMenu
 * @param {Object} popupOptions Конфигурация прилипающего блока {@link /docs/js/Controls/popup/IStickyOpener/typedefs/PopupOptions/ popupOptions}
 * @param {String} key Идентификатор элемента, для которого необходимо открыть подменю.
 * @param {String} subMenuPopupOptions Конфигурация прилипающего блока {@link /docs/js/Controls/popup/IStickyOpener/typedefs/PopupOptions/ popupOptions},
 * будет применена только к меню открытому от родителя с ключом key.
 * Подменю может быть открыто только в случае, если предыдущий уровень уже открыт.
 * @demo Controls-demo/dropdown_new/Button/OpenFromCode/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <AnyControl on:showMenu="_showMenu()">
 *    ...
 * </AnyControl>
 * <Controls.dropDown:Button name="dropDownButton">
 *    ...
 * </Controls.dropDown:Button>
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * _showMenu(): void {
 *    this._children.dropDownButton.openMenu({
 *        templateOptions: {
 *            borderStyle: 'danger'
 *        }
 *    }, 'task_key');
 * }
 * </pre>
 */

/**
 * Закрывает выпадающий список.
 * @function Controls/_dropdown/interface/IBaseDropdown#closeMenu
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <AnyControl on:closeMenu="_closeMenu()">
 *    ...
 * </AnyControl>
 * <Controls.dropDown:Button name="dropDownButton">
 *    ...
 * </Controls.dropDown:Button>
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 *    _closeMenu(): void {
 *       this._children.dropDownButton.closeMenu();
 *    }
 * </pre>
 */

/**
 * Перезагружает данные выпадающего списка.
 * @function Controls/_dropdown/interface/IBaseDropdown#reload
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <AnyControl on:itemsChanged="_reload()">
 *    ...
 * </AnyControl>
 * <Controls.dropDown:Button name="dropDownButton">
 *    ...
 * </Controls.dropDown:Button>
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * _reload(): void {
 *    this._children.dropDownButton.reload();
 * }
 * </pre>
 */

/**
 * @typedef {Object} Controls/_dropdown/interface/IBaseDropdown/Item
 * @property {Object} [itemTemplateOptions] Опции, которые будут переданы в шаблон пункта.
 * @property {Boolean} [readOnly] Определяет, может ли пользователь изменить значение контрола. {@link UICore/Base:Control#readOnly См. подробнее}
 * @property {String} [iconStyle] Определяет цвет иконки элемента.{@link Controls/interface:IIconStyle#iconStyle См. подробнее}
 * @property {String} [icon] Определяет иконку элемента. {@link Controls/interface:IIcon#icon См. подробнее}
 * @property {String} [title] Определяет текст элемента.
 * @property {String} [tooltip] Определяет текст всплывающей подсказки, появляющейся при наведении на элемент, если он отличается от title.
 * @property {String} [pinned] Определяет является ли пункт закрепленным.
 * @property {Boolean} [doNotSaveToHistory] Используется для меню с историей, определяет можно ли пункт запинить или добавить в историю.
 * Пункт будет отображен на той же позиции, на которой он находится в загруженном рекордсете. В меню с множественным выбором клик по такому пункту сбрасывает выделение.
 * @property {IMenuPopupOptions} [menuOptions] Опции, которые будут переданы в подменю, открытое для текущего элемента.
 *
 */

/**
 * @typedef {Object} Controls/_dropdown/interface/IBaseDropdown/SourceCfg
 * @property {Controls/_dropdown/interface/IBaseDropdown/Item.typedef} [item] Формат исходной записи.
 */

/*
 * @typedef {Object} Controls/_dropdown/interface/IBaseDropdown/SourceCfg
 * @property {Controls/_dropdown/interface/IBaseDropdown/Item.typedef} [item] Format of source record.
 */
