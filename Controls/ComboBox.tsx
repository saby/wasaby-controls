/**
 * @kaizen_zone c0714edb-a62a-4dd3-9cac-5eee0d973cde
 */

import rk = require('i18n!Controls');
import * as React from 'react';
import TagTemplate from 'Controls/Application/TagTemplate/TagTemplateReact';
import {
    _Controller as Controller,
    getDropdownControllerOptions,
    BaseDropdown,
    IBaseDropdownOptions,
    prepareEmpty,
    loadItems,
} from 'Controls/dropdown';
import { SyntheticEvent } from 'Vdom/Vdom';
import { FocusRoot } from 'UI/Focus';
import {
    ISingleSelectableOptions,
    IBorderStyleOptions,
    IValidationStatusOptions,
    IInputPlaceholderOptions,
    IContrastBackgroundOptions,
    TSelectedKey,
} from 'Controls/interface';
import { IStickyPopupOptions, IStickyPosition } from 'Controls/popup';
import * as Merge from 'Core/core-merge';
import { isLeftMouseButton } from 'Controls/popup';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { getWasabyContext } from 'UICore/Contexts';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { isRenderer } from 'Controls/dropdown';
import { TemplateFunction } from 'UI/Base';
import 'css!Controls/ComboBox';
import 'css!Controls/CommonClasses';

type THorizontalPadding = 'xs' | 'null';

export interface IComboboxOptions
    extends IBaseDropdownOptions,
        ISingleSelectableOptions,
        IBorderStyleOptions,
        IValidationStatusOptions,
        IInputPlaceholderOptions,
        IContrastBackgroundOptions {
    value?: string;
    horizontalPadding?: THorizontalPadding;
    contentTemplate?: TemplateFunction;
}

interface IComboboxState {
    selectedItems: Model[];
    readOnly: boolean;
    highlightedOnFocus: boolean;
    isOpened: boolean;
}

function getBorderStyle(borderStyle: string, validationStatus: string): string {
    if (borderStyle && validationStatus === 'valid') {
        return borderStyle;
    }
    return validationStatus;
}

function getHorizontalPadding(options: IComboboxOptions): string {
    let padding;
    if (options.horizontalPadding) {
        padding = options.horizontalPadding;
    } else if (options.contrastBackground) {
        padding = 'xs';
    } else {
        padding = 'null';
    }
    return padding;
}

function getDisplayState(
    props: IComboboxOptions,
    selectedItems: Model[]
): { value: string; placeholder: string; isEmptyItem: boolean; item: Model } {
    let value = '';
    let placeholder = props.placeholder;
    let isEmptyItem = false;
    const item = selectedItems[0];
    if (selectedItems) {
        isEmptyItem =
            selectedItems[0] === null ||
            selectedItems[0]?.get(props.keyProperty) === props.emptyKey;
        if (isEmptyItem && props.emptyText) {
            placeholder = prepareEmpty(props.emptyText);
        } else {
            value = String(item?.get(props.displayProperty) ?? '');
        }
    }
    return {
        value,
        placeholder,
        isEmptyItem,
        item,
    };
}

const ContentTemplate = function (props: {
    readOnly: boolean;
    placeholderVisibility: string;
    placeholder: string;
    value: string;
    isEmptyItem: boolean;
    contentTemplate: string | object | TemplateFunction;
    item: object;
    displayProperty: string;
    fontSize: string;
    fontColorStyle: string;
    className: string;
    tabIndex: number;
}) {
    let contentTemplate;
    if (typeof props.contentTemplate === 'string') {
        const ContentTpl = loadSync(props.contentTemplate);
        contentTemplate = <ContentTpl {...props} />;
    } else if (typeof props.contentTemplate === 'object' && !isRenderer(props.contentTemplate)) {
        contentTemplate = props.contentTemplate;
    } else if (props.contentTemplate) {
        contentTemplate = <props.contentTemplate {...props} />;
    } else {
        contentTemplate = (
            <span
                tabIndex={props.tabIndex}
                className={`${props.readOnly ? 'tw-cursor-text' : ''} ${props.className}`}
            >
                {props.value || null}
            </span>
        );
    }
    if (
        (!props.readOnly || props.placeholderVisibility === 'empty') &&
        props.placeholder &&
        !props.value
    ) {
        return (
            <span
                tabIndex={props.tabIndex}
                className={`controls-ComboBox__placeholder ${props.className} ${
                    !props.isEmptyItem ? 'controls-ComboBox__placeholderColor' : ''
                } ${props.placeholderVisibility === 'empty' ? 'tw-cursor-text' : ''}`}
            >
                {props.placeholder}
            </span>
        );
    } else {
        return contentTemplate;
    }
};

const ArrowTemplate = function (props: {
    readOnly: boolean;
    horizontalPadding: string;
    isOpened: boolean;
}) {
    if (!props.readOnly) {
        return (
            <span
                className={`controls-ComboBox__arrow-wrapper controls-ComboBox__arrow-wrapper_offset-${props.horizontalPadding}`}
            >
                <span
                    className={`controls-ComboBox__iconArrow icon-${
                        props.isOpened ? 'CollapseLight' : 'ExpandLight'
                    }`}
                ></span>
            </span>
        );
    }
    return null;
};

/**
 * Контрол, позволяющий выбрать значение из списка. Полный список параметров отображается при нажатии на контрол.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2Fdropdown_new%2FCombobox%2FIndex демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/dropdown-menu/combobox/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_dropdown.less переменные тем оформления dropdown}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_dropdownPopup.less переменные тем оформления dropdownPopup}
 *
 * @class Controls/ComboBox
 * @extends UI/Base:Control
 * @implements Controls/interface:ISource
 * @implements Controls/dropdown:IBaseDropdown
 * @implements Controls/dropdown:IEmptyItem
 * @implements Controls/menu:IMenuBase
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:ISingleSelectable
 * @implements Controls/interface:IInputPlaceholder
 * @implements Controls/input:ITag
 * @implements Controls/interface:IValidationStatus
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFontWeight
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IHeight
 * @implements Controls/input:IPadding
 * @implements Controls/input:IBorderVisibility
 * @implements Controls/input:IValue
 *
 * @public
 * @demo Controls-demo/dropdown_new/Combobox/Source/Index
 */

/*
 * Control that shows list of options. In the default state, the list is collapsed, showing only one choice.
 * The full list of options is displayed when you click on the control.
 * <a href="/materials/DemoStand/app/Controls-demo%2FCombobox%2FComboboxVDom">Demo-example</a>.
 * @extends UI/Base:Control
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IItemTemplateListProps
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:ISingleSelectable
 * @implements Controls/input:IBase
 *
 * @public
 * @author Золотова Э.Е.
 * @demo Controls-demo/dropdown_new/Combobox/Source/Index
 */

class ComboBox extends BaseDropdown<IComboboxOptions, IComboboxState> {
    protected _countItems: number;
    protected _selectedItem: Model;
    protected _targetPoint: IStickyPosition = {
        vertical: 'bottom',
    };
    protected _selectedKeys: TSelectedKey[];

    constructor(props: IComboboxOptions) {
        super(props);
        this._deactivated = this._deactivated.bind(this);
        this._handleMouseDown = this._handleMouseDown.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._menuDataLoadCallback = this._menuDataLoadCallback.bind(this);
        this._setText = this._setText.bind(this);
        this._selectedKeys = [props.selectedKey];
        if (props.items && (!props.source || props.buildByItems)) {
            this._setCountItems(props.items);
        }

        this._controller = new Controller(this._getControllerOptions(props));
        this.state = {
            ...this.state,
            readOnly: props.readOnly,
            highlightedOnFocus: this._getHighlightedOnFocus(props),
            selectedItems: this._controller.getSelectedItems(),
        };
    }

    componentDidMount() {
        loadItems(this._controller, this.props);
        const readOnly = this._getReadOnly(this.props.readOnly);
        if (readOnly !== this.state.readOnly) {
            this.setState({
                readOnly,
            });
        }
        if (this._countItems === 1) {
            if (this._selectedItem.get(this.props.keyProperty) !== this.props.selectedKey) {
                this._selectedItemsChangedHandler([this._selectedItem]);
                this._selectedItem = null;
            }
        }
        this._controller.setTheme(this.context.theme);
    }

    componentDidUpdate(prevProps: IComboboxOptions): void {
        if (
            (!this.props.source || this.props.buildByItems) &&
            this.props.items !== prevProps.items
        ) {
            this._setCountItems(this.props.items);
        }
        const newReadOnlyState = this._getReadOnly(this.props.readOnly);
        const newHighlightedOnFocus = this._getHighlightedOnFocus(this.props);

        if (
            newReadOnlyState !== this.state.readOnly ||
            newHighlightedOnFocus !== this.state.highlightedOnFocus
        ) {
            this.setState({
                readOnly: newReadOnlyState,
                highlightedOnFocus: newHighlightedOnFocus,
            });
        }
        if (this._selectedKeys[0] !== this.props.selectedKey) {
            this._selectedKeys = [this.props.selectedKey];
        }
        this._controller.update(this._getControllerOptions(this.props));

        if (this._selectedItem && this._countItems === 1) {
            if (this._selectedItem.get(prevProps.keyProperty) !== prevProps.selectedKey) {
                this._selectedItemsChangedHandler([this._selectedItem]);
                this._selectedItem = null;
            }
        }
    }

    protected _getHighlightedOnFocus(options): boolean {
        return (
            this.context?.workByKeyboard &&
            !options.readOnly &&
            options.validationStatus === 'valid'
        );
    }

    _getControllerOptions(options: IComboboxOptions): object {
        const controllerOptions = getDropdownControllerOptions(options, this.context);
        const popupClassName = `controls-ComboBox-popup ${options.popupClassName || ''} ${
            options.contrastBackground
                ? ' controls-ComboBox-popup_shift_contrastBackground'
                : ' controls-ComboBox-popup_shift'
        } ${
            options.borderVisibility === 'visible'
                ? ' controls-ComboBox-popup_shift_borderVisible'
                : ''
        }`;

        return {
            ...controllerOptions,
            ...{
                selectedKeys: this._selectedKeys,
                markerVisibility: 'onactivated',
                dataLoadCallback: this._dataLoadCallback,
                menuDataLoadCallback: this._menuDataLoadCallback,
                popupClassName,
                close: this._onClose,
                open: this._onOpen,
                allowPin: false,
                selectedItemsChangedCallback: this._setText,
                theme: options.theme,
                itemPadding: {
                    right: 'menu-s',
                    left: 'menu-s',
                },
                targetPoint: this._targetPoint,
                openerControl: this,
                closeButtonVisibility: false,
                readOnly: this.state.readOnly,
            },
        };
    }

    _getMenuPopupConfig(): IStickyPopupOptions {
        return {
            templateOptions: {
                width:
                    !this.props.menuPopupOptions?.width &&
                    this._getContainerNode(this._ref.current).offsetWidth,
            },
            eventHandlers: {
                onOpen: this._onOpen.bind(this),
                onClose: this._onClose.bind(this),
                onResult: this._onResult.bind(this),
            },
        };
    }

    _dataLoadCallback(items: RecordSet<Model>): void {
        this._setCountItems(items);
        if (this.props.dataLoadCallback) {
            this.props.dataLoadCallback(items);
        }
    }

    _setCountItems(items: RecordSet<Model>): void {
        this._countItems = items.getCount();
        if (this._countItems === 1) {
            this._selectedItem = items.at(0);
        }
        if (this._countItems && this.props.emptyText) {
            this._countItems += 1;
        }
    }

    _menuDataLoadCallback(items): void {
        // убрать после перевода меню на работу с sourceController
        if (!this._opening) {
            if (this.props.dataLoadCallback) {
                this.props.dataLoadCallback(items);
            }
        }
    }

    _onOpen(): void {
        super._onOpen();
        this._opening = false;
    }

    _getReadOnly(readOnly: boolean): boolean {
        const hasFooter = this.props.footerContentTemplate || this.props.footerTemplate;
        return (this._countItems < 2 && (!this.props.emptyText || !hasFooter)) || readOnly;
    }

    _selectedItemsChangedHandler(selectedItems: Model[]): void {
        const key = selectedItems[0]?.get(this.props.keyProperty);
        this._controller.setSelectedKeys([key]);
        this._setText(selectedItems);
        this._callHandler(this.props.onValueChanged, 'valueChanged', [
            getDisplayState(this.props, selectedItems).value,
        ]);
        this._callHandler(this.props.onSelectedKeyChanged, 'selectedKeyChanged', [key]);
    }

    _setText(selectedItems: Model[]): void {
        this.setState({ selectedItems });
    }

    _handleMouseDown(event: SyntheticEvent<MouseEvent>): void {
        if (!isLeftMouseButton(event)) {
            return;
        }
        if (this.state.isOpened) {
            this._controller.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu(popupOptions?: IStickyPopupOptions): void {
        const config = this._getMenuPopupConfig();
        this._controller.setMenuPopupTarget(this._ref.current);
        this._opening = true;

        this._controller.openMenu(Merge(config, popupOptions || {})).then((result) => {
            if (result) {
                this._selectedItemsChangedHandler(result);
            }
        });
    }

    protected _itemClick(data: object): void {
        const item = this._controller.getPreparedItem(data);
        this._selectedItemsChangedHandler([item]);
        this._controller.updateHistoryAndCloseMenu(item);
    }

    // FIXME delete after https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
    private _getContainerNode(container: [HTMLElement] | HTMLElement): HTMLElement {
        return container[0] || container;
    }

    protected _deactivated(): void {
        if (this.props.closeMenuOnOutsideClick) {
            this.closeMenu();
        }
    }

    render() {
        const props = this.props;
        const state = this.state;
        const { value, placeholder, isEmptyItem, item } = getDisplayState(
            props,
            state.selectedItems
        );
        const horizontalPadding = getHorizontalPadding(props);
        const borderStyle = getBorderStyle(props.borderStyle, props.validationStatus);
        const classNameWrapper = `controls-ComboBox controls_toggle_theme-${
            props.theme
        } controls-ComboBox-${state.readOnly ? 'readOnly' : 'borderStyle-' + borderStyle} ${
            state.isOpened
                ? 'controls-ComboBox__opened controls-Popup__isolatedFocusingContext'
                : ''
        } ${
            !state.readOnly && props.contrastBackground
                ? `controls-ComboBox-validationStatus-${props.validationStatus}`
                : ''
        } ${
            state.highlightedOnFocus
                ? 'controls-Render-focused-item'
                : !state.readOnly && 'controls-ComboBox-borderStyle-' + borderStyle + '_focusing'
        } ${
            props.contrastBackground
                ? 'controls-ComboBox_background-contrast'
                : 'controls-ComboBox_background-same'
        } controls-text-${props.fontColorStyle} controls-fontweight-${
            props.fontWeight
        } controls-inlineheight-${props.inlineHeight} controls-Combobox-fontsize-${
            props.fontSize
        } controls-ComboBox_textAlign-${props.textAlign} controls-ComboBox_border-${
            props.borderVisibility
        } ${props.className || props.attrs?.className || ''}`;
        return (
            <FocusRoot
                as="div"
                {...props.attrs}
                ref={this._setRef}
                data-qa={props.attrs?.['data-qa'] || props['data-qa'] || props.dataQa}
                className={classNameWrapper}
                title={props.tooltip || value}
                onKeyDown={this._handleKeyDown}
                onClick={this._handleClick}
                onMouseDown={this._handleMouseDown}
                onMouseMove={this._handleMouseMove}
                onMouseEnter={this._handleMouseEnter}
                onTouchStart={this._handleTouchStart}
                onMouseLeave={this._handleMouseLeave}
                onDeactivated={this._deactivated}
            >
                <div className="controls-ComboBox-wrapper">
                    <div
                        className={`controls-ComboBox__field controls-ComboBox__field_margin-${horizontalPadding}`}
                    >
                        <ContentTemplate
                            placeholder={placeholder}
                            value={value}
                            readOnly={state.readOnly}
                            isEmptyItem={isEmptyItem}
                            placeholderVisibility={props.placeholderVisibility}
                            contentTemplate={props.contentTemplate}
                            item={item}
                            displayProperty={props.displayProperty}
                            fontSize={props.fontSize}
                            fontColorStyle={props.fontColorStyle}
                            className={`controls-ComboBox__contentTemplate ${
                                state.highlightedOnFocus ? 'controls-focused-item_background' : ''
                            }`}
                            tabIndex={0}
                        />
                    </div>
                    <ArrowTemplate
                        readOnly={state.readOnly}
                        horizontalPadding={horizontalPadding}
                        isOpened={state.isOpened}
                    />
                </div>
                {props.tagStyle ? (
                    <TagTemplate
                        className="controls-Render_tag_padding-right"
                        tagStyle={props.tagStyle}
                        onClick={props.onTagClick}
                        onMouseEnter={props.onTagHover}
                    />
                ) : null}
            </FocusRoot>
        );
    }

    static contextType = getWasabyContext();

    static defaultProps: Partial<IComboboxOptions> = {
        borderVisibility: 'partial',
        placeholder: rk('Выберите') + '...',
        validationStatus: 'valid',
        textAlign: 'left',
        inlineHeight: 'default',
        fontSize: 'm',
        fontColorStyle: 'default',
        fontWeight: 'default',
        tooltip: '',
        emptyKey: null,
        contrastBackground: false,
        closeMenuOnOutsideClick: true,
    };
}

export default ComboBox;

/**
 * @name Controls/ComboBox#contentTemplate
 * @cfg {Function} Шаблон отображения вызывающего элемента.
 * @demo Controls-demo/dropdown_new/Combobox/ContentTemplate/Index
 */

/**
 * @event Controls/ComboBox#valueChanged Происходит при изменении отображаемого значения контрола.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {String} value Отображаемое значение контрола.
 * @remark
 * Событие используется в качестве реакции на изменения, вносимые пользователем.
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.ComboBox
 *     on:valueChanged="_valueChangedHandler()"
 *     source="{{_source}}"/>
 * </pre>
 * <pre class="brush: js">
 * // TypeScript
 * private _valueChangedHandler(event, value) {
 *     this._text = value;
 * }
 * </pre>
 */
