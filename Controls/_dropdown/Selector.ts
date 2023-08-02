/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import rk = require('i18n!Controls');
import { TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_dropdown/Selector/Selector');
import defaultContentTemplate = require('wml!Controls/_dropdown/Selector/resources/defaultContentTemplate');
import * as Utils from 'Types/util';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { RecordSet, List } from 'Types/collection';
import {
    prepareEmpty,
    loadItems,
    loadSelectedItems,
    isSingleSelectionItem,
} from 'Controls/_dropdown/Util';
import { isEqual } from 'Types/object';
import Controller from 'Controls/_dropdown/_Controller';
import { TKey } from './interface/IDropdownController';
import {
    BaseDropdown,
    IDropdownReceivedState,
    filterBySelectionUtil,
} from 'Controls/_dropdown/BaseDropdown';
import ILazyItemsLoadingOptions from './interface/ILazyItemsLoading';
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IStickyPopupOptions, InfoboxTarget } from 'Controls/popup';
import { IBaseDropdownOptions } from 'Controls/_dropdown/interface/IBaseDropdown';
import getDropdownControllerOptions from 'Controls/_dropdown/Utils/GetDropdownControllerOptions';
import * as Merge from 'Core/core-merge';
import { isLeftMouseButton } from 'Controls/popup';
import 'css!Controls/dropdown';
import 'css!Controls/CommonClasses';
import {
    IValidationStatusOptions,
    TSelectedKeys,
    IUnderlineOptions,
    ISelectionObject,
} from 'Controls/interface';

interface ISelectorOptions
    extends IBaseDropdownOptions,
        IValidationStatusOptions,
        IUnderlineOptions,
        ILazyItemsLoadingOptions {
    maxVisibleItems?: number;
    fontColorStyle?: string;
    fontSize?: string;
    showHeader?: boolean;
    selectedAllText?: string;
    selectedAllKey: TSelectedKeys;
}

const getPropValue = Utils.object.getPropertyValue.bind(Utils);

/**
 * Контрол, позволяющий выбрать значение из списка. Отображается в виде ссылки.
 * Текст ссылки отображает выбранные значения. Значения выбирают в выпадающем меню, которое по умолчанию закрыто.
 *
 * @remark
 * Меню можно открыть кликом на контрол. Для работы единичным параметром selectedKeys используйте контрол с {@link Controls/source:SelectedKey}.
 *
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2Fdropdown_new%2FInput%2FIndex демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/dropdown-menu/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_dropdown.less переменные тем оформления dropdown}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_dropdownPopup.less переменные тем оформления dropdownPopup}
 *
 * @class Controls/dropdown:Selector
 * @extends UI/Base:Control
 * @mixes Controls/menu:IMenuPopup
 * @mixes Controls/menu:IMenuControl
 * @mixes Controls/menu:IMenuBase
 * @mixes Controls/dropdown:IBaseDropdown
 * @mixes Controls/dropdown:IGrouped
 * @mixes Controls/dropdown:IHeaderTemplate
 * @mixes Controls/dropdown:ILazyItemsLoading
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:ISelectorDialog
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:ITextValue
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:IUnderline
 * @ignoreEvents beforeSelectionChanged
 *
 * @public
 * @demo Controls-demo/dropdown_new/Input/Source/Simple/Index
 */

/*
 * Control that shows list of options. In the default state, the list is collapsed, showing only one choice.
 * The full list of options is displayed when you click on the control.
 *
 * To work with single selectedKeys option you can use control with {@link Controls/source:SelectedKey}.
 * @extends UI/Base:Control
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:INavigation
 * @mixes Controls/Input/interface/IValidation
 * @implements Controls/interface:IMultiSelectable
 * @mixes Controls/dropdown:IHeaderTemplate
 * @implements Controls/interface:ISelectorDialog
 * @mixes Controls/dropdown:IGrouped
 * @implements Controls/interface:ITextValue
 *
 * @public
 * @author Золотова Э.Е.
 * @demo Controls-demo/dropdown_new/Input/Source/Index
 */

export default class Selector extends BaseDropdown {
    protected readonly _options: ISelectorOptions;
    protected _template: TemplateFunction = template;
    protected _defaultContentTemplate: TemplateFunction = defaultContentTemplate;
    protected _text: string = '';
    protected _hasMoreText: string = '';
    protected _countItems: number;
    protected _needInfobox: boolean = false;
    protected _item: Model = null;
    protected _isEmptyItem: boolean = false;
    protected _isAllSelectedItem: boolean = false;
    protected _icon: string;
    protected _tooltip: string;
    protected _selectedItems: Model[];
    protected _controller: Controller;
    protected _children: {
        infoboxTarget: InfoboxTarget;
    };

    _beforeMount(
        options: ISelectorOptions,
        context: object,
        receivedState: IDropdownReceivedState
    ): void | Promise<void | IDropdownReceivedState> {
        this._controller = new Controller(this._getControllerOptions(options));

        if (options.navigation && options.selectedKeys && options.selectedKeys.length) {
            return loadSelectedItems(this._controller, receivedState, options);
        } else {
            return loadItems(this._controller, receivedState, options);
        }
    }

    _beforeUpdate(options: ISelectorOptions): void {
        this._controller.update(this._getControllerOptions(options));
        if (
            this._options.emptyText !== options.emptyText ||
            this._options.selectedAllText !== options.selectedAllText
        ) {
            if (this._controller.getItems()) {
                // Если в контроллере нет итемов, значит они перезагружаются,
                // после перезагрузки _setCountItems будет вызван
                this._setCountItems(this._controller.getItems(), options);
            }
        }
    }

    _getControllerOptions(options: ISelectorOptions): object {
        const controllerOptions = getDropdownControllerOptions(options);
        return {
            ...controllerOptions,
            ...{
                markerVisibility: 'onactivated',
                dataLoadCallback: this._dataLoadCallback.bind(this, options),
                selectedKeys: options.selectedKeys || [],
                popupClassName:
                    options.popupClassName ||
                    (options.multiSelect
                        ? 'controls-DropdownList_multiSelect__margin'
                        : 'controls-DropdownList__margin'),
                allowPin: false,
                selectedItemsChangedCallback: this._prepareDisplayState.bind(this, options),
                selectorDialogResult: this._selectorTemplateResult.bind(this),
            },
        };
    }

    _getMenuPopupConfig(): IStickyPopupOptions {
        return {
            opener: this._children.infoboxTarget,
            eventHandlers: {
                onOpen: this._onOpen.bind(this),
                onClose: this._onClose.bind(this),
                onResult: this._onResult.bind(this),
            },
        };
    }

    _selectedItemsChangedHandler(
        items: Model[],
        newSelectedKeys: TKey[],
        excludedKeys: TKey[]
    ): void | unknown {
        const text =
            this._getText(items, this._options) +
            this._getMoreText(items, this._options.maxVisibleItems);
        this._notify('textValueChanged', [text]);

        if (!isEqual(this._options.excludedKeys, excludedKeys)) {
            this._notify('excludedKeysChanged', [excludedKeys]);
        }

        if (!isEqual(this._options.selectedKeys, newSelectedKeys) || this._options.task1178744737) {
            return this._notify('selectedKeysChanged', [newSelectedKeys]);
        }
    }

    _dataLoadCallback(options: ISelectorOptions, items: RecordSet<Model>): void {
        if (options.dataLoadCallback) {
            options.dataLoadCallback(items);
        }

        this._setCountItems(items, options);
    }

    _prepareDisplayState(options: ISelectorOptions, items: Model[]): void {
        if (items.length) {
            this._selectedItems = items;
            this._needInfobox = options.readOnly && this._selectedItems.length > 1;
            this._isEmptyItem = isSingleSelectionItem(
                items[0],
                options.emptyText,
                options.keyProperty,
                options.emptyKey
            );
            this._isAllSelectedItem = isSingleSelectionItem(
                items[0],
                options.selectedAllText,
                options.keyProperty,
                options.selectedAllKey
            );
            this._item = this._isAllSelectedItem || this._isEmptyItem ? null : items[0];
            this._icon =
                this._isEmptyItem || this._isAllSelectedItem
                    ? null
                    : getPropValue(this._item, 'icon');
            this._text = this._getText(items, options);
            this._hasMoreText = this._getMoreText(items, options.maxVisibleItems);
            this._tooltip = this._getFullText(
                items,
                options.displayProperty,
                options.parentProperty,
                options.nodeProperty
            );
        }
    }

    _handleMouseDown(event: SyntheticEvent<MouseEvent>): void {
        if (!isLeftMouseButton(event) || this._options.readOnly) {
            return;
        }
        this.openMenu();
    }

    openMenu(popupOptions?: IStickyPopupOptions): void {
        const config = this._getMenuPopupConfig();
        this._controller.setMenuPopupTarget(this._container);

        this._controller.openMenu(Merge(config, popupOptions || {})).then((result) => {
            if (result) {
                const selectedKeys = this._getSelectedKeys(result, this._options.keyProperty);
                this._selectedItemsChangedHandler(result, selectedKeys);
            }
        });
    }

    protected _resultHandler(
        action: string,
        data: object
    ): void {
        switch (action) {
            case 'applyClick':
                this._applyClick(data.items, data.selection?.selected, data.selection?.excluded);
                break;
            case 'selectorResult':
                this._selectorResult(data);
                break;
        }
    }

    protected _itemClick(data: Model): void {
        const item = this._controller.getPreparedItem(data);
        const selectedKeys = this._getSelectedKeys([item], this._options.keyProperty);
        const res = this._selectedItemsChangedHandler([item], selectedKeys);

        // dropDown must close by default, but user can cancel closing, if returns false from event
        if (res !== false) {
            this._prepareDisplayState(this._options, [item]);
            this._controller.handleSelectedItems(item);
            this._controller.setSelectedKeys(selectedKeys);
        }
        this._notify('menuItemClick', [item]);
    }

    protected _applyClick(data: Model[], selectedKeys?: TKey[], excludedKeys?: TKey[]): void {
        const selected = this._getSelectedKeys(
            factory(data).toArray(),
            this._options.keyProperty
        );
        const updateSelectedItems = () => {
            this._updateSelectedItems(selected, excludedKeys);
            this._controller.handleSelectedItems(data);
        };
        if (!isLoaded(filterBySelectionUtil)) {
            loadAsync(filterBySelectionUtil).then(() => {
                updateSelectedItems();
            });
        } else {
            updateSelectedItems();
        }
    }

    protected _selectorResult(data: object): void {
        const selectedKeys = this._getSelectedKeys(
            factory(data).toArray(),
            this._options.keyProperty
        );
        const selectedItems = this._controller.getFormattedSelectedItems(data, selectedKeys);
        this._selectedItemsChangedHandler(selectedItems, selectedKeys);
        this._controller.setSelectedKeys(selectedKeys);
        this._controller.handleSelectorResult(data);
    }

    protected _selectorTemplateResult(selectedItems: List<Model>): void {
        const result =
            this._notify('selectorCallback', [this._initSelectorItems, selectedItems]) ||
            selectedItems;
        this._selectorResult(result);
    }

    private _setCountItems(items: RecordSet, options: ISelectorOptions): void {
        this._countItems = items.getCount();
        if (options.emptyText) {
            this._countItems += 1;
        }
        if (options.selectedAllText) {
            this._countItems += 1;
        }
        this._needOpenMenuOnClick = options.selectedItems || this._isNeedOpenMenuOnClick(options);
    }

    private _isNeedOpenMenuOnClick(options: ISelectorOptions): boolean {
        return !(this._countItems < 2 && !options.footerTemplate);
    }

    private _updateSelectedItems(selected?: TKey[], excluded?: TKey[]): void {
        this._controller.setSelectedKeys(selected);
        const items = this._controller.updateSelection(selected, excluded);
        this._selectedItemsChangedHandler(items, selected, excluded);
    }

    private _getSelectedKeys(items: Model[], keyProperty: string): TKey[] {
        const keys = [];
        if (
            isSingleSelectionItem(
                items[0],
                this._options.selectedAllText,
                this._options.keyProperty,
                this._options.selectedAllKey
            )
        ) {
            keys.push(this._options.selectedAllKey);
        } else if (
            isSingleSelectionItem(
                items[0],
                this._options.emptyText,
                this._options.keyProperty,
                this._options.emptyKey
            )
        ) {
            keys.push(this._options.emptyKey);
        } else {
            factory(items).each((item) => {
                keys.push(getPropValue(item, keyProperty));
            });
        }
        return keys;
    }

    private _getFullText(
        items: Model[],
        displayProperty: string,
        parentProperty: string,
        nodeProperty: string,
        maxVisibleItems?: number
    ): string {
        const texts = [];
        factory(items).each((item) => {
            let text = '';
            if (!maxVisibleItems || texts.length < maxVisibleItems) {
                if (parentProperty) {
                    const items = this._controller.getItems();
                    let parentKey = getPropValue(item, parentProperty);
                    while (
                        parentKey !== undefined &&
                        parentKey !== null &&
                        parentKey !== this._options.root
                    ) {
                        const parent = parentKey && items.getRecordById(parentKey);
                        if (getPropValue(parent, nodeProperty) === false) {
                            text = `${getPropValue(parent, displayProperty)} ${text}`;
                        } else {
                            break;
                        }
                        parentKey = getPropValue(parent, parentProperty);
                    }
                }
                text += getPropValue(item, displayProperty) ?? '';
                texts.push(text);
            }
        });
        return texts.join(', ');
    }

    private _getText(
        items: Model[],
        {
            selectedAllText,
            selectedAllKey,
            emptyText,
            emptyKey,
            parentProperty,
            nodeProperty,
            keyProperty,
            displayProperty,
            maxVisibleItems,
        }: Partial<ISelectorOptions>
    ): string {
        const item = items[0];
        let text = '';
        if (isSingleSelectionItem(item, selectedAllText, keyProperty, selectedAllKey)) {
            text = selectedAllText;
        } else if (isSingleSelectionItem(item, emptyText, keyProperty, emptyKey)) {
            text = prepareEmpty(emptyText);
        } else {
            text = this._getFullText(
                items,
                displayProperty,
                parentProperty,
                nodeProperty,
                maxVisibleItems
            );
        }
        return text;
    }

    private _getMoreText(items: Model[], maxVisibleItems: number): string {
        let moreText = '';
        if (maxVisibleItems) {
            if (items.length > maxVisibleItems) {
                moreText = ', ' + rk('еще') + ' ' + (items.length - maxVisibleItems);
            }
        }
        return moreText;
    }

    protected _deactivated(): void {
        if (this._options.closeMenuOnOutsideClick) {
            this.closeMenu();
        }
    }

    static getDefaultOptions(): Partial<ISelectorOptions> {
        return {
            iconSize: 's',
            maxVisibleItems: 1,
            validationStatus: 'valid',
            closeMenuOnOutsideClick: true,
            emptyKey: null,
            selectedAllKey: null,
            underline: 'hovered',
            selectionType: 'all',
        };
    }
}
/**
 * @name Controls/dropdown:Selector#maxVisibleItems
 * @cfg {Number} Максимальное количество выбранных записей, которые будут отображены.
 * @default 1
 * @demo Controls-demo/dropdown_new/Input/MaxVisibleItems/Index
 * @example
 * Отображение всех выбранных записей.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="key"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    multiSelect="{{true}}"
 *    maxVisibleItems="{{null}}">
 * </Controls.dropdown:Selector>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * this._source = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *        {key: 1, title: 'Ярославль'},
 *        {key: 2, title: 'Москва'},
 *        {key: 3, title: 'Санкт-Петербург'},
 *        {key: 4, title: 'Новосибирск'},
 *        {key: 5, title: 'Нижний новгород'},
 *        {key: 6, title: 'Кострома'},
 *        {key: 7, title: 'Рыбинск'}
 *    ]
 * });
 * </pre>
 */

/**
 * @name Controls/dropdown:Selector#contentTemplate
 * @cfg {Function} Шаблон отображения вызывающего элемента.
 * @remark
 * Для определения шаблона вызовите базовый шаблон - "Controls/dropdown:inputDefaultContentTemplate".
 * Шаблон должен быть помещен в контрол с помощью тега <ws:partial> с атрибутом "template".
 * Содержимое можно переопределить с помощью параметра "contentTemplate".
 * Базовый шаблон Controls/dropdown:inputDefaultContentTemplate по умолчанию отображает только текст.
 * Для отображения иконки и текста используйте шаблон "Controls/dropdown:defaultContentTemplateWithIcon".
 * @demo Controls-demo/dropdown_new/Input/ContentTemplate/Index
 * @example
 * Отображение иконки и текста.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="id"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    contentTemplate="Controls/dropdown:defaultContentTemplateWithIcon">
 * </Controls.dropdown:Selector>
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * this._source = new Memory({
 *    keyProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Name', icon: 'icon-small icon-TrendUp'},
 *       {id: 2, title: 'Date of change', icon: 'icon-small icon-TrendDown'}
 *    ]
 * });
 * </pre>
 */

/**
 * @name Controls/dropdown:Selector#multiSelect
 * @cfg {Boolean} Определяет, установлен ли множественный выбор.
 * @default false
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/Simple/Index
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/PinnedItems/Index
 * @example
 * Множественный выбор установлен.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="id"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    multiSelect="{{true}}" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * this._source = new Memory({
 *    keyProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Yaroslavl'},
 *       {id: 2, title: 'Moscow'},
 *       {id: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * this._selectedKeys = [1, 3];
 * </pre>
 */

/**
 * @name Controls/dropdown:Selector#selectedAllKey
 * @cfg {String} Первичный ключ для пункта выпадающего списка, который создаётся при установке опции {@link selectedAllText}.
 * @default null
 * @demo Controls-demo/dropdown_new/Input/SelectedAllText/SelectedAllKey/Index
 */

/**
 * @name Controls/dropdown:Selector#selectedAllText
 * @cfg {String} Добавляет пустой элемент в список с заданным текстом.
 * Ключ элемента по умолчанию null, для изменения значения ключа используйте {@link selectedAllKey}.
 * @demo Controls-demo/dropdown_new/Input/SelectedAllText/Simple/Index
 */

/**
 * @name Controls/dropdown:Selector#multiSelectAccessibilityProperty
 * @cfg {Controls/display:MultiSelectAccessibility} Имя поля записи, в котором хранится состояние видимости чекбокса.
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/MultiSelectAccessibilityProperty/Index
 * @example
 * Множественный выбор установлен
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="id"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    multiSelectAccessibilityProperty="checkBoxState"
 *    multiSelect="{{true}}" />
 * </pre>
 * <pre class="brush: js">
 * // JavaScript
 * import {MultiSelectAccessibility} from 'Controls/dropdown';
 *
 * this._source = new Memory({
 *    keyProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Yaroslavl', checkBoxState: MultiSelectAccessibility.disabled},
 *       {id: 2, title: 'Moscow'},
 *       {id: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * this._selectedKeys = [1, 3];
 * </pre>
 */

/**
 * @event selectedKeysChanged Происходит при изменении выбранных элементов.
 * @name Controls/dropdown:Selector#selectedKeysChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Number|String>} keys Набор ключей выбранных элементов.
 * @remark Из обработчика события можно возвращать результат обработки. Если результат будет равен false, выпадающий список не закроется.
 * По умолчанию, когда выбран пункт с иерархией, выпадающий список закрывается.
 * @example
 * В следующем примере создается список и устанавливается опция selectedKeys со значением [1, 2, 3], а также показано, как изменить сообщение, выведенное пользователю на основе выбора.
 * <pre class="brush: html; highlight: [3,4]">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *     on:selectedKeysChanged="onSelectedKeysChanged()"
 *     selectedKeys="{{ _selectedKeys }}"/>
 *    <h1>{{ _message }}</h1>
 * </pre>
 * <pre class="brush: js;">
 * // JavaScript
 * _beforeMount: function() {
 *    this._selectedKeys = [1, 2, 3];
 * },
 * onSelectedKeysChanged: function(e, keys) {
 *    this._selectedKeys = keys; //We don't use binding in this example so we have to update state manually.
 *    if (keys.length > 0) {
 *       this._message = 'Selected ' + keys.length + ' items.';
 *    } else {
 *       this._message = 'You have not selected any items.';
 *    }
 * }
 * </pre>
 */

/**
 * @name Controls/dropdown:Selector#fontSize
 * @cfg {Controls/_interface/IFontSize/TFontSize.typedef} Размер шрифта для текста вызывающего элемента
 * @demo Controls-demo/dropdown_new/Input/FontSize/Index
 */

/**
 * @name Controls/dropdown:Selector#source
 * @cfg {Controls/_dropdown/interface/IBaseDropdown/SourceCfg.typedef}
 * @default undefined
 * @remark
 * Запись может иметь следующие {@link Controls/_dropdown/interface/IBaseDropdown/Item.typedef свойства}.
 * @demo Controls-demo/dropdown_new/Input/Source/Simple/Index
 * @example
 * Записи будут отображены из источника _source.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector bind:selectedKeys="_selectedKeys"
 *                             keyProperty="key"
 *                             displayProperty="title"
 *                             source="{{_source}}">
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * import {Memory} from 'Types/source';
 *
 * protected _selectedKeys: string[] = ['2'];
 * protected _source: Memory = new Memory({
 *    keyProperty: 'key',
 *    data: [
 *       {key: '1', icon: 'icon-EmptyMessage', iconStyle: 'info', title: 'Message'},
 *       {key: '2', icon: 'icon-TFTask', title: 'Task'},
 *       {key: '3', title: 'Report'},
 *       {key: '4', title: 'News', readOnly: true}
 *    ]
 * })
 * </pre>
 */

/**
 * @typedef {String} SelectionType
 * @variant all Для выбора доступны любые типы элементов.
 * @variant allBySelectAction Для выбора доступен любой тип элемента. Выбор осуществляется нажатием на кнопку «Выбрать».
 * @variant node Для выбора доступны любые типа «Узел».
 * @variant leaf Для выбора доступны только элементы типа «лист» и «скрытый узел».
 */

/**
 * @name Controls/dropdown:Selector#selectionType
 * @cfg {SelectionType} Тип выбираемых записей, используется для меню с иерархией и множественным выбором.
 * @default all
 * @example
 * В этом примере для выбора будут доступны только узлы.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.dropdown:Selector ...
 *                             parentProperty="Раздел"
 *                             nodeProperty="Раздел@"
 *                             selectionType="node" />
 * </pre>
 * @see multiSelect
 * @see nodeProperty
 * @see parentProperty
 */

/**
 * @name Controls/dropdown:Selector#menuBeforeSelectionChangedCallback
 * @cfg {Function} Происходит до изменения {@link selectedKeys списка выбранных элементов}.
 * В аргументы приходит параметр selectionDiff - изменение в списке выбранных элементов по сравнению с текущим выбором {@link Controls/multiselection:ISelectionDifference}.
 * Из обработчика события можно вернуть новый список выбранных элементов или промис с ними {@link Controls/interface:ISelectionObject}.
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/BeforeSelectionChangedCallback/Index
 * @example
 * Если в меню ничего не выбрано, из обработчика вернется selection с выбранной первой записью.
 * <pre class="brush: html; highlight: [7]">
 * <!-- WML -->
 * <Controls.dropdown:Selector
 *    menuBeforeSelectionChangedCallback="{{_beforeSelectionChangedCallback}}"
 *    bind:selectedKeys="_selectedKeys"
 *    keyProperty="id"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    multiSelect="{{true}}" />
 * </pre>
 * <pre class="brush: js;">
 * // JavaScript
 * this._source = new Memory({
 *    keyProperty: 'id',
 *    data: [
 *       {id: 1, title: 'Yaroslavl'},
 *       {id: 2, title: 'Moscow'},
 *       {id: 3, title: 'St-Petersburg'}
 *    ]
 * });
 * this._beforeSelectionChangedCallback = (selection: ISelectionDifference) => {
 *     if (!selection.selectedKeysDifference.keys.length) {
 *         return {
 *             selected: [1],
 *             excluded: []
 *         }
 *     }
 * }
 * this._selectedKeys = [1, 3];
 * </pre>
 * @see selectedKeys
 * @see multiSelect
 */

/**
 * @event Происходит при клике по элементу выпадающего списка.
 * @name Controls/dropdown:Selector#menuItemClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому производим клик.
 * @remark Событие используют, когда необходимо обратать клик по элементу выпадающего списка, который уже выбран.
 * В остальных случаях используйте событие @{link selectedKeysChanged}.
 */
