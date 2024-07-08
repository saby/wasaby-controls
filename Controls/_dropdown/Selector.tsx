/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import * as React from 'react';
import DefaultContentTemplate from 'Controls/_dropdown/Selector/resources/DefaultContentTemplate';
import { getWasabyContext } from 'UICore/Contexts';
import { FocusRoot } from 'UI/Focus';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { List, RecordSet } from 'Types/collection';
import { isSingleSelectionItem, loadItems, loadSelectedItems } from 'Controls/_dropdown/Util';
import { getText, getFullText, getMoreText } from 'Controls/_dropdown/Utils/getTextSelector';
import { isEqual } from 'Types/object';
import Controller from 'Controls/_dropdown/_Controller';
import { TKey } from './interface/IDropdownController';
import { IHeaderTemplate } from 'Controls/_dropdown/interface/IHeaderTemplate';
import { BaseDropdown, filterBySelectionUtil } from 'Controls/_dropdown/BaseDropdown';
import { ILazyItemsLoadingOptions } from './interface/ILazyItemsLoading';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { SyntheticEvent } from 'Vdom/Vdom';
import { isLeftMouseButton, IStickyPopupOptions } from 'Controls/popup';
import { InfoboxTarget } from 'Controls/popupTargets';
import { IBaseDropdownOptions } from 'Controls/_dropdown/interface/IBaseDropdown';
import getDropdownControllerOptions from 'Controls/_dropdown/Utils/GetDropdownControllerOptions';
import * as Merge from 'Core/core-merge';
import 'css!Controls/dropdown';
import 'css!Controls/CommonClasses';
import {
    IHeightOptions,
    IUnderlineOptions,
    IValidationStatusOptions,
    TSelectedKeys,
} from 'Controls/interface';
import { isRenderer } from 'Controls/_dropdown/Utils/isRenderer';
import { TemplateFunction } from 'UI/Base';

interface ISelectorOptions
    extends IBaseDropdownOptions,
        IValidationStatusOptions,
        IUnderlineOptions,
        ILazyItemsLoadingOptions,
        IHeightOptions,
        IHeaderTemplate {
    maxVisibleItems?: number;
    fontColorStyle?: string;
    fontSize?: string;
    showHeader?: boolean;
    selectedAllText?: string;
    selectedAllKey: TSelectedKeys;
    onSelectedKeysChanged?: Function;
    itemTemplate?: TemplateFunction;
    contentTemplate?: TemplateFunction;
    buildByItems?: boolean;
}

interface ISelectorState {
    highlightedOnFocus: boolean;
    countItems: number;
    itemsIsLoaded: boolean;
    selectedItems: Model[];
}

const ContentTemplate = React.forwardRef(function (props, ref) {
    const templateProps = {
        item: props.item,
        icon: props.icon,
        iconSize: props.item?.get('iconSize') || props.iconSize,
        iconStyle: props.iconStyle,
        fontSize: props.fontSize,
        fontColorStyle: props.fontColorStyle,
        inlineHeight: props.inlineHeight,
        text: props.text,
        underline: props.underline,
        tooltip: props.needInfobox ? '' : props.tooltip,
        countItems: props.countItems,
        hasMoreText: props.hasMoreText,
        isEmptyItem: props.isEmptyItem,
        validationStatus: props.validationStatus,
        readOnly: props.readOnly,
        needOpenMenuOnClick: props.needOpenMenuOnClick,
        footerTemplate: props.footerTemplate || props.footerContentTemplate,
        className: props.highlightedOnFocus ? 'controls-focused-item_background' : '',
        tabindex: 0,
        ref,
    };
    if (typeof props.contentTemplate === 'string') {
        const ContentTpl = loadSync(props.contentTemplate);
        return <ContentTpl {...templateProps} />;
    } else if (typeof props.contentTemplate === 'object' && !isRenderer(props.contentTemplate)) {
        return props.contentTemplate;
    } else if (props.contentTemplate) {
        return <props.contentTemplate {...templateProps} />;
    } else {
        return <DefaultContentTemplate {...templateProps} />;
    }
});

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
 * @extends UI/Base:Control
 * @mixes Controls/menu:IMenuPopup
 * @mixes Controls/menu:IMenuControl
 * @mixes Controls/menu:IMenuBase
 * @mixes Controls/dropdown:IBaseDropdown
 * @mixes Controls/dropdown:IGrouped
 * @mixes Controls/dropdown:IEmptyItem
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
 * @implements Controls/interface:IHeight
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
class Selector extends BaseDropdown<ISelectorOptions, ISelectorState> {
    protected _controller: Controller;

    constructor(props: ISelectorOptions) {
        super(props);
        this._handleMouseDown = this._handleMouseDown.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._prepareDisplayState = this._prepareDisplayState.bind(this);
        this._selectorTemplateResult = this._selectorTemplateResult.bind(this);
        this._deactivated = this._deactivated.bind(this);
        this._controller = new Controller(this._getControllerOptions(props));
        const needToGetCountItems = props.items && (!props.source || props.buildByItems);
        this.state = {
            highlightedOnFocus: this._getHighlightedOnFocus(props),
            countItems: needToGetCountItems ? this._getCountItems(props.items, props) : -1,
            itemsIsLoaded: false,
            selectedItems: this._controller.getSelectedItems(),
        };
    }

    componentDidMount() {
        if (this.props.navigation && this.props.selectedKeys && this.props.selectedKeys.length) {
            loadSelectedItems(this._controller, this.props);
        } else {
            loadItems(this._controller, this.props);
        }
    }

    componentDidUpdate(prevProps: ISelectorState): void {
        const newState: Partial<ISelectorState> = {};
        this._controller.update(this._getControllerOptions(this.props));
        if (
            this.props.emptyText !== prevProps.emptyText ||
            this.props.selectedAllText !== prevProps.selectedAllText
        ) {
            if (this._controller.getItems()) {
                // Если в контроллере нет итемов, значит они перезагружаются,
                // после перезагрузки _getCountItems будет вызван
                newState.countItems = this._getCountItems(this._controller.getItems(), this.props);
            }
        }
        newState.highlightedOnFocus = this._getHighlightedOnFocus(this.props);
        if (
            (newState.countItems && newState.countItems !== this.state.countItems) ||
            newState.highlightedOnFocus !== this.state.highlightedOnFocus
        ) {
            this.setState(newState);
        }
    }

    protected _getHighlightedOnFocus(props): boolean {
        return (
            this.context?.workByKeyboard && !props.readOnly && props.validationStatus === 'valid'
        );
    }

    _getControllerOptions(props: ISelectorOptions): object {
        const controllerOptions = getDropdownControllerOptions(props, this.context);
        const selectedKeys =
            !props.selectedKeys || !props.selectedKeys.length
                ? [props.emptyKey]
                : props.selectedKeys;
        return {
            ...controllerOptions,
            ...{
                markerVisibility: 'onactivated',
                dataLoadCallback: this._dataLoadCallback,
                selectedKeys,
                popupClassName:
                    props.popupClassName ||
                    (props.multiSelect
                        ? 'controls-DropdownList_multiSelect__margin'
                        : 'controls-DropdownList__margin'),
                allowPin: false,
                selectedItemsChangedCallback: this._prepareDisplayState,
                selectorDialogResult: this._selectorTemplateResult,
            },
        };
    }

    _getMenuPopupConfig(): IStickyPopupOptions {
        return {
            opener: this,
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
            getText(items, this.props, this._controller) +
            getMoreText(items, this.props.maxVisibleItems);
        this._callHandler(this.props.onTextValueChanged, 'textValueChanged', [text]);

        if (!isEqual(this.props.excludedKeys, excludedKeys)) {
            this._callHandler(this.props.onExcludedKeysChanged, 'excludedKeysChanged', [
                excludedKeys,
            ]);
        }

        if (!isEqual(this.props.selectedKeys, newSelectedKeys) || this.props.task1178744737) {
            return this._callHandler(this.props.onSelectedKeysChanged, 'selectedKeysChanged', [
                newSelectedKeys,
            ]);
        }
    }

    _dataLoadCallback(items: RecordSet<Model>): void {
        if (this.props.dataLoadCallback) {
            this.props.dataLoadCallback(items);
        }

        const newCountItems = this._getCountItems(items, this.props);
        if (this.state.countItems !== newCountItems) {
            this.setState({
                countItems: newCountItems,
            });
        }
    }

    _prepareDisplayState(items: Model[]): void {
        const newState = {
            itemsIsLoaded: true,
        };
        if (items.length) {
            if (!isEqual(this.state.selectedItems, items)) {
                this.setState({
                    ...newState,
                    selectedItems: items,
                });
            }
        } else if (newState.itemsIsLoaded !== this.state.itemsIsLoaded) {
            this.setState(newState);
        }
    }

    _handleMouseDown(event: SyntheticEvent<MouseEvent>): void {
        if (this.props.onMouseDown) {
            this.props.onMouseDown(event);
        }
        if ((!isLeftMouseButton(event) || this.props.readOnly) ?? this.context.readOnly) {
            return;
        }
        this.openMenu();
    }

    openMenu(popupOptions?: IStickyPopupOptions): void {
        const config = this._getMenuPopupConfig();
        this._controller.setMenuPopupTarget(this._ref.current);

        this._controller.openMenu(Merge(config, popupOptions || {})).then((result) => {
            if (result) {
                const selectedKeys = this._getSelectedKeys(result, this.props.keyProperty);
                this._selectedItemsChangedHandler(result, selectedKeys);
                this._callHandler(this.props.onMenuItemClick, 'menuItemClick', result);
            }
        });
    }

    protected _resultHandler(action: string, data: object): void {
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
        const selectedKeys = this._getSelectedKeys([item], this.props.keyProperty);
        const res = this._selectedItemsChangedHandler([item], selectedKeys);

        // dropDown must close by default, but user can cancel closing, if returns false from event
        if (res !== false) {
            this._controller.updateHistoryAndCloseMenu(item);
            this._controller.setSelectedKeys(selectedKeys);

            if (this.props.searchParam) {
                // Если был поиск, items будут занулены, чтобы не потерять выбранные значения сохраним их в selectedItems.
                this._setSelectedItems([data]);
            } else {
                this._prepareDisplayState([item]);
            }
        }
        this._callHandler(this.props.onMenuItemClick, 'menuItemClick', [item]);
    }

    protected _applyClick(data: Model[], selectedKeys?: TKey[], excludedKeys?: TKey[]): void {
        const selected = this._getSelectedKeys(factory(data).toArray(), this.props.keyProperty);
        const updateSelectedItems = () => {
            this._controller.updateHistoryAndCloseMenu(data);
            this._controller.setSelectedKeys(selected);
            let items;

            if (this.props.searchParam) {
                // Если был поиск, items будут занулены, чтобы не потерять выбранные значения сохраним их в selectedItems.
                items = this._setSelectedItems(data);
            } else {
                items = this._controller.updateSelection(selected, excludedKeys);
            }
            this._selectedItemsChangedHandler(items, selected, excludedKeys);
        };
        if (
            this.props.parentProperty &&
            this.props.multiSelect &&
            !isLoaded(filterBySelectionUtil)
        ) {
            loadAsync(filterBySelectionUtil).then(() => {
                updateSelectedItems();
            });
        } else {
            updateSelectedItems();
        }
    }

    protected _selectorResult(data: object): void {
        const selectedKeys = this._getSelectedKeys(factory(data).toArray(), this.props.keyProperty);
        const selectedItems = this._controller.getFormattedSelectedItems(data, selectedKeys);
        this._selectedItemsChangedHandler(selectedItems, selectedKeys);
        this._controller.setSelectedKeys(selectedKeys);
        this._controller.handleSelectorResult(data);
    }

    protected _selectorTemplateResult(selectedItems: List<Model>): void {
        const result =
            this._callHandler(this.props.onSelectorCallback, 'selectedCallback', [
                this._initSelectorItems,
                selectedItems,
            ]) || selectedItems;
        this._selectorResult(result);
    }

    private _setSelectedItems(selectedItems: Model[]): Model[] | void {
        const items = this._controller.getItems().clone();
        items?.assign(selectedItems);
        return this._controller.updateSelectedItems(items);
    }

    private _getCountItems(items: RecordSet, props: ISelectorOptions): number {
        let countItems = items.getCount();
        if (props.emptyText) {
            countItems += 1;
        }
        if (props.selectedAllText) {
            countItems += 1;
        }
        return countItems;
    }

    private _getSelectedKeys(items: Model[], keyProperty: string): TKey[] {
        const keys = [];
        if (
            isSingleSelectionItem(
                items[0],
                this.props.selectedAllText,
                this.props.keyProperty,
                this.props.selectedAllKey
            )
        ) {
            keys.push(this.props.selectedAllKey);
        } else if (
            isSingleSelectionItem(
                items[0],
                this.props.emptyText,
                this.props.keyProperty,
                this.props.emptyKey
            )
        ) {
            keys.push(this.props.emptyKey);
        } else {
            factory(items).each((item) => {
                keys.push(item.get(keyProperty));
            });
        }
        return keys;
    }

    protected _deactivated(): void {
        if (this.props.closeMenuOnOutsideClick) {
            this.closeMenu();
        }
    }

    render() {
        const props = this.props;
        const state = this.state;
        const readOnly = props.readOnly ?? this.context?.readOnly;
        const needInfobox = readOnly && state.selectedItems?.length > 1;
        const isEmptyItem = isSingleSelectionItem(
            state.selectedItems?.[0],
            props.emptyText,
            props.keyProperty,
            props.emptyKey
        );
        const isAllSelectedItem = isSingleSelectionItem(
            state.selectedItems?.[0],
            props.selectedAllText,
            props.keyProperty,
            props.selectedAllKey
        );
        const item = isAllSelectedItem || isEmptyItem ? null : state.selectedItems?.[0];
        const icon = isEmptyItem || isAllSelectedItem ? null : item?.get('icon');
        const text = getText(state.selectedItems, props, this._controller);
        const hasMoreText = getMoreText(state.selectedItems, props.maxVisibleItems);
        const tooltip = getFullText(state.selectedItems, props, this._controller);
        const isNeedOpenMenu =
            props.selectedItems ||
            !(state.countItems < 2 && !props.footerTemplate && !props.footerContentTemplate);

        return (
            <FocusRoot
                as="div"
                //TODO: Временное решение, ждем ошибку: https://online.sbis.ru/opendoc.html?guid=fd50888a-06bb-4b7d-820d-dd5d26b48ce0&client=3
                ref={(element) => this._setRef(element)}
                {...props.attrs}
                className={`controls-Dropdown ${props.className || props.attrs?.className || ''}`}
                data-qa={props.attrs?.['data-qa'] || props['data-qa'] || props.dataQa}
                onDeactivated={this._deactivated}
                onClick={this._handleClick}
                onMouseDown={this._handleMouseDown}
                onMouseEnter={this._handleMouseEnter}
                onMouseLeave={this._handleMouseLeave}
                onKeyDown={this._handleKeyDown}
            >
                <InfoboxTarget
                    targetSide="bottom"
                    trigger={needInfobox ? 'hover' : 'demand'}
                    horizontalPadding="null"
                    template="Controls/_dropdown/Selector/resources/infoBoxContentTemplate"
                    templateOptions={{
                        selectedItems: state.selectedItems,
                        displayProperty: props.displayProperty,
                    }}
                >
                    <div className="ws-inline-flexbox controls-Dropdown__infoboxWrapper">
                        {state.selectedItems?.length || state.itemsIsLoaded ? (
                            <ContentTemplate
                                contentTemplate={props.contentTemplate}
                                selectedItems={state.selectedItems}
                                item={item}
                                icon={icon}
                                iconSize={item?.get('iconSize') || props.iconSize}
                                iconStyle={props.iconStyle}
                                fontSize={props.fontSize}
                                fontColorStyle={props.fontColorStyle}
                                inlineHeight={props.inlineHeight}
                                text={text}
                                underline={props.underline}
                                tooltip={needInfobox ? '' : tooltip}
                                countItems={state.countItems}
                                hasMoreText={hasMoreText}
                                isEmptyItem={isEmptyItem}
                                validationStatus={props.validationStatus}
                                readOnly={readOnly}
                                needOpenMenuOnClick={isNeedOpenMenu}
                                footerTemplate={props.footerTemplate || props.footerContentTemplate}
                                className={
                                    state.highlightedOnFocus
                                        ? 'controls-focused-item_background'
                                        : ''
                                }
                            />
                        ) : null}
                    </div>
                </InfoboxTarget>
            </FocusRoot>
        );
    }

    static contextType = getWasabyContext();

    static defaultProps: Partial<ISelectorOptions> = {
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

export default Selector;

/**
 * @name Controls/_dropdown/Selector#underline
 * @cfg {String} Стиль декоративной линии.
 * @variant fixed всегда будет подчеркивание
 * @variant none никогда не будет подчеркивания
 * @variant hovered подчеркивание только по наведению
 * @default hovered
 * @demo Controls-demo/dropdown_new/Input/Underline/Index
 */

/**
 * @name Controls/_dropdown/Selector#maxVisibleItems
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
 * @name Controls/_dropdown/Selector#contentTemplate
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
 * @name Controls/_dropdown/Selector#multiSelect
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
 * @name Controls/_lookupPopup/Controller#selectedItems
 * @cfg {Types/collection:RecordSet} Выбранные записи, необходимы для отображения выбранного значение без вызова метода бл.
 * Вызов метода бл произойдет только по наведению на вызывающий элемент.
 * @default null
 * @example
 * JS
 * <pre>
 *    import {RecordSet} from 'Types/collection';
 *    import {SbisService} from 'Types/source';
 *
 *    protected _selectedItems = new RecordSet({
 *         rawData: [
 *            {id: 'Yaroslavl', title: 'Ярославль'},
 *            {id: 'Moscow', title: 'Москва'}
 *         ],
 *         keyProperty: 'id'
 *    });
 *
 *    protected _source = new SbisService({
 *       ...
 *    });
 * </pre>
 *
 * WML
 * <pre>
 *    <Controls.dropdown:Selector
 *         bind:selectedKeys="_selectedKeys"
 *         keyProperty="id"
 *         displayProperty="title"
 *         source="{{_source}}"
 *         selectedItems="{{_selectedItems}}"
 *         multiSelect="{{true}}" />
 * </pre>
 */

/**
 * @name Controls/_dropdown/Selector#selectedAllKey
 * @cfg {String} Первичный ключ для пункта выпадающего списка, который создаётся при установке опции {@link selectedAllText}.
 * @default null
 * @demo Controls-demo/dropdown_new/Input/SelectedAllText/SelectedAllKey/Index
 */

/**
 * @name Controls/_dropdown/Selector#selectedAllText
 * @cfg {String} Добавляет пустой элемент в список с заданным текстом.
 * Ключ элемента по умолчанию null, для изменения значения ключа используйте {@link selectedAllKey}.
 * @demo Controls-demo/dropdown_new/Input/SelectedAllText/Simple/Index
 */

/**
 * @name Controls/_dropdown/Selector#multiSelect
 * @cfg {boolean} Определяет, установлен ли множественный выбор.
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/Index
 * @default false
 */

/**
 * @name Controls/_dropdown/Selector#multiSelectAccessibilityProperty
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
 * @name Controls/_dropdown/Selector#selectedKeysChanged
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
 * @name Controls/_dropdown/Selector#fontSize
 * @cfg {Controls/_interface/IFontSize/TFontSize.typedef} Размер шрифта для текста вызывающего элемента
 * @demo Controls-demo/dropdown_new/Input/FontSize/Index
 */

/**
 * @name Controls/_dropdown/Selector#source
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
 * @variant allBySelectAction Для выбора доступен любой тип элемента. Выбор осуществляется нажатием кнопки «Выбрать».
 * @variant node Для выбора доступны только элементы типа «узел» и «скрытый узел».
 * @variant leaf Для выбора доступны только элементы типа «лист».
 */

/**
 * @name Controls/_dropdown/Selector#selectionType
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
 * @name Controls/_dropdown/Selector#menuBeforeSelectionChangedCallback
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
 * @name Controls/_dropdown/Selector#menuItemClick
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Record} item Элемент, по которому производим клик.
 * @remark Событие используют, когда необходимо обработать клик по элементу выпадающего списка, который уже выбран.
 * В остальных случаях используйте событие @{link selectedKeysChanged}.
 */
