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
import { RecordSet } from 'Types/collection';
import { IVirtualScrollConfig } from 'Controls/baseList';
export type TKey = string | number | null;

export interface IDropdownSourceOptions {
    source?: ICrudPlus;
}

export interface IBaseDropdownOptions
    extends IControlOptions,
        ISourceOptions,
        IMenuPopupOptions,
        Omit<IStickyPopupOptions, 'adaptiveOptions' | 'stickyPosition'>,
        ITooltipOptions,
        ISearchOptions,
        ISearchValue,
        IItemsOptions {
    items?: RecordSet;
    dropdownClassName?: string;
    historyId?: string;
    keyProperty: string;
    emptyText?: string;
    displayProperty: string;
    closeMenuOnOutsideClick?: boolean;
    menuVirtualScrollConfig: IVirtualScrollConfig;
    buildByItems?: boolean;
    menuPopupComponent?: string;
    onDropDownOpen?: () => void;
    onDeactivated?: () => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
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
 * @name Controls/_dropdown/interface/IBaseDropdown#menuPopupComponent
 * @cfg {String} Путь к компоненту, который будет открыт в стики окне по клику на вызывающий элемент.
 * @default Controls/menu:Popup
 * @variant Controls/menu:Popup стандартная раскладка окна меню;
 * @variant Controls-Layout/selectorSticky:Template справочник с проваливанием, можно настроить хлебные крошками, строку поиска и фильтры.
 * Для настройки фильтра и хлебных крошек используйте опцию {@link Controls/_dropdown/interface/IBasePopupDropdown#menuPopupOptions menuPopupOptions}.
 * @demo Controls-demo/dropdown_new/Button/MenuMode/Index
 * @see Controls/_dropdown/interface/IBasePopupDropdown#menuPopupOptions
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuBreadCrumbsVisibility
 * @cfg {String} Задает видимость хлебных крошек. Если хлебные крошки скрыты, выводится кнопка назад в шапке меню.
 * Работает только тогда, когда в качестве {@link menuPopupComponent} задан справочник.
 * @default 'hidden'
 * @variant 'hidden' хлебные крошки скрыты;
 * @variant 'visible' хлебные крошки отображаются над списком, в шапке кнопка назад не выводится.
 * @demo Controls-demo/dropdown_new/Button/MenuMode/MenuBreadCrumbsVisibility/Index
 * @see menuPopupComponent
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
 * @cfg {String} Задаёт значение, по которому производится поисковой запрос.
 * @demo Controls-demo/dropdown_new/Search/SearchParam/EmptyTemplate/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Button searchValue="search value" />
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
 * @name Controls/_dropdown/interface/IBaseDropdown#closeMenuOnOutsideClick
 * @cfg {Boolean} Определяет возможность закрытия меню по клику вне.
 * @default true
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
 * @typedef IMenuMode
 * @variant selector Меню отображается в виде списка с проваливанием.
 * @variant menu Обычный вид меню.
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuMode
 * @cfg {IMenuMode} Определяет вид отображения меню.
 * @default menu
 * @remark Значение selector рекомендуется использовать для меню с большим количеством пунктов и/или глубокой иерархией
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector bind:selectedKeys="_selectedKeys"
 *                             keyProperty="key"
 *                             displayProperty="title"
 *                             items="{{_items}}"
 *                             menuMode="selector"/>
 * </pre>
 * @demo Controls-demo/dropdown_new/Button/MenuMode/Index
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#buildByItems
 * @cfg {boolean} Определяет, может ли контрол построиться по опции {@link items}
 * @remark По умолчанию, если контролу передать опцию items, то он по ней строиться не будет,
 * и вызовет запрос к источнику для получения записей.
 * @default false
 * @see items
 * @see selectedItems
 */

/**
 * @name Controls/_dropdown/interface/IBaseDropdown#menuVirtualScrollConfig
 * @cfg {Controls/_listsCommonLogic/scrollController/interface/IVirtualScroll/IVirtualScrollConfig} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/performance-optimization/virtual-scroll/ виртуального скролла}.
 * @remark
 * Виртуальный скролл работает только при включенной {@link Controls/menu:IMenuBase#navigation навигации} в виде {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/visual-mode/infinite-scrolling/ бесконечной прокрутки}.
 * @example
 * В следующем примере показана конфигурация виртуального скролла: в свойстве pageSize задан размер виртуальной страницы.
 * Также задана конфигурация навигации в опции navigation.
 * <pre class="brush: html; highlight: [4,5]">
 * <!-- TSX -->
 * import { Button } from 'Controls/dropdown';
 * import * as React from 'react';
 *
 * const VIRTUAL_SCROLL_CONFIG = {
 *     pageSize = 100,
 * };
 * ...
 *
 * <Button
 *     source={source}
 *     navigation={navigation}
 *     virtualScrollConfig={VIRTUAL_SCROLL_CONFIG}
 *     ... />
 * </pre>
 * @see navigation
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
 * @event Controls/_dropdown/interface/IBaseDropdown#searchValueChanged Происходит при изменении значения строки поиска в меню.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} value Значение строки поиска.
 * @demo Controls-demo/dropdown_new/Search/SearchParam/EmptyTemplate/Index
 * @example
 * <pre class="brush: js;">
 * <!-- TSX -->
 * import {Button} from 'Controls/dropdown';
 *
 * const searchValueChanged = React.useCallback((value) => {
 *     setSearchValue(value);
 *  }, []);
 *
 * <Button onSearchValueChanged={searchValueChanged}
 *         ...
 * />
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
 * @property {String} [subMenuTemplate] Шаблон подменю, которое откроется у этого элемента. Шаблон будет обернут в {@link Controls/popupTemplate:Sticky}.
 * @property {IMenuPopupOptions} [subMenuTemplateOptions] Опции, которые будут переданы в подменю, открытое у этого элемента.
 * @property {String[]} [prefetchModules] Массив зависимостей, которые грузятся при наведении на пункт меню. Если пункт меню один, то загрузка зависимостей происходит при наведении на кнопку.
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
