/**
 * @kaizen_zone 96668898-7a01-436d-86e7-2f42d52f6246
 */
import * as React from 'react';
import { cssStyleGeneration as getMenuPopupClassName } from 'Controls/_dropdown/Button/MenuUtils';
import { Button, TextAlign } from 'Controls/buttons';
import { getWasabyContext } from 'UICore/Contexts';
import Controller from 'Controls/_dropdown/_Controller';
import { SyntheticEvent } from 'UI/Events';
import { TemplateFunction } from 'UI/Base';
import { loadItems } from 'Controls/_dropdown/Util';
import { BaseDropdown } from 'Controls/_dropdown/BaseDropdown';
import { TKey } from './interface/IDropdownController';
import { IIconOptions, IHeightOptions, IIconStyleOptions } from 'Controls/interface';
import { IBaseDropdownOptions } from 'Controls/_dropdown/interface/IBaseDropdown';
import { IBasePopupDropdownOptions } from 'Controls/_dropdown/interface/IBasePopupDropdown';
import { IHeaderTemplate } from 'Controls/_dropdown/interface/IHeaderTemplate';
import { IViewModeOptions } from 'Controls/buttons';
import { ILazyItemsLoadingOptions } from './interface/ILazyItemsLoading';
import {
    Opener as PopupOpener,
    isLeftMouseButton,
    IStickyPopupOptions,
    CalmTimer,
} from 'Controls/popup';
import getDropdownControllerOptions from 'Controls/_dropdown/Utils/GetDropdownControllerOptions';
import * as Merge from 'Core/core-merge';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import 'css!Controls/dropdown';
import 'css!Controls/CommonClasses';

/**
 * Интерфейс опций для {@link Controls/dropdown:Button}.
 * @public
 */
export interface IButtonOptions
    extends IBaseDropdownOptions,
        IBasePopupDropdownOptions,
        IIconOptions,
        IHeightOptions,
        ILazyItemsLoadingOptions,
        IViewModeOptions,
        IHeaderTemplate,
        IIconStyleOptions {
    additionalProperty?: string;
    buttonStyle?: string;
    contrastBackground?: boolean;
    caption?: string;
    /**
     * @name Controls/_dropdown/Button#captionPosition
     * @cfg {String} Определяет, с какой стороны расположен текст кнопки относительно иконки.
     * @variant start Текст расположен перед иконкой.
     * @variant end Текст расположен после иконки.
     * @default end
     * @demo Controls-demo/dropdown_new/Button/CaptionPosition/Index
     */
    captionPosition?: 'start' | 'end';
    fontColorStyle?: string;
    /**
     * @default m
     * @demo Controls-demo/dropdown_new/Button/FontSize/Index
     */
    fontSize?: string;
    /**
     * @cfg {Function} Шаблон для иконки
     */
    iconTemplate?: TemplateFunction;
    /**
     * @cfg {Boolean} Видимость шапки меню.
     * @default true
     */
    showHeader?: boolean;

    /**
     * @name Controls/_dropdown/Button#reloadOnOpen
     * @cfg {Boolean} Определяет, будут ли элементы меню загружаться при каждом клике на кнопку.
     * @default false
     * @example
     * В данном примере данные для меню будут загружены при каждом клике по кнопке.
     * <pre class="brush: html; highlight: [7];">
     * <!-- WML -->
     * <Controls.dropdown:Button
     *    keyProperty="id"
     *    displayProperty="title"
     *    source="{{_source}}"
     *    reloadOnOpen="{{true}}" />
     * </pre>
     * <pre>
     * // JavaScript
     * _source:null,
     * _beforeMount: function() {
     *    this._source = new source.Memory({
     *       idProperty: 'id',
     *       data: [
     *          {id: 1, title: 'Name', icon: 'icon-small icon-TrendUp'},
     *          {id: 2, title: 'Date of change', icon: 'icon-small icon-TrendDown'}
     *       ]
     *    });
     * }
     * </pre>
     */
    reloadOnOpen?: boolean;
    /**
     * @cfg {String} Режим полупрозрачного отображения кнопки.
     * @variant dark Темная полупрозрачность
     * @variant light Светлая полупрозрачность
     * @variant none Полупрозрачность отсутствует
     * @default none
     */
    translucent?: 'dark' | 'none' | 'light';
    underlineVisible?: boolean;
    /**
     * @name Controls/_dropdown/Button#textAlign
     * @cfg {'left'|'right'|'center'|'justify'} Выравнивание текста кнопки.
     * @default center
     */
    textAlign?: TextAlign;
    /**
     * @cfg {String} Название события, которое запускает открытие или закрытие меню.
     * @variant click Открытие кликом по контенту. Закрытие кликом "мимо" — не по контенту или шаблону.
     * @variant hover Открытие по ховеру — по наведению курсора на контент. Закрытие по ховеру — по навердению курсора на контент или шаблон.
     * @default click
     * @demo Controls-demo/dropdown_new/Button/MenuPopupTrigger/Index
     */
    menuPopupTrigger?: 'click' | 'hover';
    onMenuItemActivate?: (item: Model, event: Event) => void;
    /**
     * @name Controls/_dropdown/Button#menuStickyFooter
     * @cfg {Boolean} Позволяет включать/отключать прилипание футера при скроле.
     * @default true
     */
    menuStickyFooter?: boolean;
}

interface IButtonState {
    hasItems: boolean;
}

/**
 * Контрол "Кнопка с меню".
 * @remark
 * Полезные ссылки:
 *
 * * {@link /materials/DemoStand/app/Controls-demo%2Fdropdown_new%2FButton%2FIndex демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/dropdown-menu/button/ руководство разработчика}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_dropdown.less переменные тем оформления dropdown}
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_dropdownPopup.less переменные тем оформления dropdownPopup}
 * @demo Controls-demo/dropdown_new/Button/Source/Index
 * @extends UI/Base:Control
 * @mixes Controls/menu:IMenuPopup
 * @mixes Controls/menu:IMenuControl
 * @mixes Controls/menu:IMenuBase
 * @mixes Controls/dropdown:IBaseDropdown
 * @mixes Controls/dropdown:IBasePopupDropdown
 * @mixes Controls/dropdown:IHeaderTemplate
 * @mixes Controls/dropdown:IGrouped
 * @mixes Controls/dropdown:IButton
 * @mixes Controls/dropdown:IMenuPopupTrigger
 * @mixes Controls/dropdown:ILazyItemsLoading
 * @mixes Controls/interface:ISelectField
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IIcon
 * @implements Controls/interface:ISearch
 * @mixes Controls/buttons:IButton
 * @mixes Controls/buttons:IViewMode
 *
 *
 * @public
 */

/*
 * Button by clicking on which a drop-down list opens.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2FButtons%2FMenu%2FMenu">Demo-example</a>.
 *
 * @class Controls/_dropdown/Button
 * @extends UI/Base:Control
 * @mixes Controls/menu:IMenuPopup
 * @mixes Controls/menu:IMenuControl
 * @mixes Controls/menu:IMenuBase
 * @mixes Controls/dropdown:IBaseDropdown
 * @mixes Controls/dropdown:IHeaderTemplate
 * @mixes Controls/dropdown:IBaseDropdown
 * @mixes Controls/dropdown:IGrouped
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:IFontColorStyle
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/interface:IFontSize
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:ITooltip
 * @implements Controls/interface:IIcon
 * @implements Controls/interface:ISearch
 * @mixes Controls/buttons:IButton
 *
 * @public
 * @author Герасимов А.М.
 * @demo Controls-demo/dropdown_new/Button/Source/Index
 */
class DropdownButton extends BaseDropdown<IButtonOptions, IButtonState> {
    protected _calmTimer: CalmTimer;
    constructor(props: IButtonOptions) {
        super(props);
        this._handleMouseDown = this._handleMouseDown.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._deactivated = this._deactivated.bind(this);
        this._dataLoadCallback = this._dataLoadCallback.bind(this);
        this._getPopupClassName = this._getPopupClassName.bind(this);
        this._controller = new Controller(this._getControllerOptions(props));
        this._calmTimer = new CalmTimer(this._openMenu.bind(this));
        const needToGetCountItems = props.items && (!props.source || props.buildByItems);
        this.state = {
            ...this.state,
            hasItems: needToGetCountItems ? props.items.getCount() > 0 : true,
        };
    }

    componentDidMount() {
        if (!this.props.lazyItemsLoading) {
            return loadItems(this._controller, this.props);
        }
    }

    componentWillUnmount(): void {
        super.componentWillUnmount();
        this._calmTimer.stop();
    }

    componentDidUpdate(prevProps: IButtonOptions): void {
        this._controller.update(this._getControllerOptions(this.props));
    }

    _dataLoadCallback(items: RecordSet): void {
        this.setState({ hasItems: items.getCount() > 0 });

        if (this.props.dataLoadCallback) {
            this.props.dataLoadCallback(items);
        }
    }

    _getPopupClassName(): string {
        if (this.props.popupClassName) {
            return this.props.popupClassName;
        }
        const items = this._controller.getItems();
        return getMenuPopupClassName({ ...this.props, items });
    }

    _getControllerOptions(options: IButtonOptions): object {
        const controllerOptions = getDropdownControllerOptions(options, this.context);
        return {
            ...controllerOptions,
            ...{
                headerTemplate: options.headTemplate || options.headerTemplate,
                headingCaption: options.menuHeadingCaption || options.caption,
                headingIcon: options.menuHeadingIcon || options.icon,
                headingIconSize: options.iconSize,
                dataLoadCallback: this._dataLoadCallback,
                allowPin: true,
                markerVisibility: 'hidden',
                trigger: options.menuPopupTrigger,
                getPopupClassName: this._getPopupClassName,
            },
        };
    }

    _getMenuPopupConfig(): IStickyPopupOptions {
        return {
            opener:
                this.props.buttonContent && this.props.buttonContent.isWasaby
                    ? this._ref.current
                    : this,
            eventHandlers: {
                onOpen: this._onOpen.bind(this),
                onClose: this._onClose.bind(this),
                onResult: (action, data, nativeEvent) => {
                    this._onResult(action, data, nativeEvent);
                },
            },
        };
    }

    _onItemClickHandler(result: object, nativeEvent: Event) {
        // onMenuItemActivate will deleted by task
        // https://online.sbis.ru/opendoc.html?guid=6175f8b3-4166-497e-aa51-1fdbcf496944
        const onMenuItemActivateResult = this._callHandler(
            this.props.onOnMenuItemActivate,
            'onOnMenuItemActivate',
            [result[0], nativeEvent]
        );
        const menuItemActivateResult = this._callHandler(
            this.props.onMenuItemActivate,
            'onMenuItemActivate',
            [result[0], nativeEvent]
        );

        let handlerResult;

        // (false || undefined) === undefined
        if (onMenuItemActivateResult !== undefined) {
            handlerResult = onMenuItemActivateResult;
        } else {
            handlerResult = menuItemActivateResult;
        }

        return handlerResult;
    }

    _onSingleItemClick(result: Model[]): void {
        this._onItemClickHandler(result);
    }

    _handleMouseDown(event: SyntheticEvent<MouseEvent>): void {
        if (this.props.onMouseDown?.(event) === false) {
            return;
        }
        if (!isLeftMouseButton(event)) {
            return;
        }

        if (!this._isOpened) {
            this._clickHandled = false;
            this._openMenu().then((result: Model[]) => {
                this._openMenuResultHandler(result, event);
            });
        }
    }

    _handleMouseLeave(event: SyntheticEvent<MouseEvent>): void {
        super._handleMouseLeave(event);
        this._calmTimer.stop();
    }

    _handleMouseMove(event: SyntheticEvent<MouseEvent>): void {
        const isOpenMenuPopup = !(
            event.nativeEvent.relatedTarget &&
            event.nativeEvent.relatedTarget.closest('.controls-Menu__popup')
        );
        if (this.props.menuPopupTrigger === 'hover' && isOpenMenuPopup) {
            this._calmTimer.start();
        }
    }

    _openMenu(
        popupOptions?: IStickyPopupOptions,
        key?: TKey,
        subMenuOptions?: IStickyPopupOptions
    ): Promise<any> {
        let config;
        if (key) {
            config = Merge(this._getMenuPopupConfig(), {
                templateOptions: {
                    openedSubMenuOptions: subMenuOptions,
                    openedSubMenuKey: key,
                },
            });
        } else {
            config = this._getMenuPopupConfig();
        }
        this._controller.setMenuPopupTarget(this._ref.current);
        this._controller.setMenuPopupOpener(this._popupOpenerRef.current);

        return this._controller.openMenu(Merge(config, popupOptions || {}));
    }

    openMenu(
        popupOptions?: IStickyPopupOptions,
        key?: TKey,
        subMenuOptions?: IStickyPopupOptions
    ): Promise<any> {
        return this._openMenu(popupOptions, key, subMenuOptions).then((result: Model[]) => {
            if (result) {
                this._onSingleItemClick(result);
            }
        });
    }

    closeMenu(key?: string): void {
        if (key) {
            this._openMenu({
                templateOptions: {
                    closedSubMenuKey: key,
                },
            });
        } else {
            this._controller.closeMenu();
        }
    }

    protected _resultHandler(action: string, data: object, nativeEvent: object) {
        switch (action) {
            case 'applyClick':
                this._applyClick(data.items, nativeEvent);
                break;
        }
    }

    protected _applyClick(data: Model[], nativeEvent) {
        const selectedItems = [];
        data.forEach((item) => {
            selectedItems.push(this._controller.getPreparedItem(item));
        });
        this._callHandler(this.props.onSelectComplete, 'onSelectComplete', [
            selectedItems,
            nativeEvent,
        ]);
        this._controller.updateHistoryAndCloseMenu(selectedItems);
    }

    protected _itemClick(data: object, nativeEvent: MouseEvent): void {
        const item = this._controller.getPreparedItem(data);
        const res = this._onItemClickHandler([item], nativeEvent);

        if (res !== false) {
            this._controller.updateHistoryAndCloseMenu(item);
        }
    }

    protected _deactivated(): void {
        if (
            this._controller.getPopupOptions().closeOnOutsideClick ??
            this.props.closeMenuOnOutsideClick
        ) {
            this.closeMenu();
        }
    }

    render() {
        const props = this.props;
        const state = this.state;
        if (!props.lazyItemsLoading && !state.hasItems && props.viewMode === 'link') {
            return (
                <div
                    {...props.attrs}
                    ref={this._setRef}
                    className={`controls-MenuButton controls-MenuButton_link controls-MenuButton__Wrapper ${
                        props.className ?? ''
                    }`}
                >
                    <div
                        className={`controls-text controls-MenuButton__text controls-text-default controls-fontsize-${this.props.fontSize}`}
                        title={props.caption}
                    >
                        {props.caption}
                    </div>
                </div>
            );
        } else {
            const ButtonComponent = this.props.buttonContent ? this.props.buttonContent : Button;
            return (
                <>
                    <ButtonComponent
                        data-qa={props['data-qa'] || props.dataQa}
                        data-name={props['data-name']}
                        style={props.style}
                        ref={ButtonComponent.isWasaby ? undefined : this._setRef}
                        forwardedRef={this._setRef}
                        className={`controls-MenuButton controls-MenuButton__Wrapper ${
                            props.className || ''
                        }`}
                        icon={props.icon}
                        iconSize={props.iconSize}
                        iconStyle={props.iconStyle}
                        textAlign={props.textAlign}
                        caption={props.caption}
                        captionPosition={props.captionPosition}
                        fontColorStyle={props.fontColorStyle}
                        fontSize={props.fontSize}
                        inlineHeight={props.inlineHeight}
                        buttonStyle={props.buttonStyle}
                        contrastBackground={props.contrastBackground}
                        viewMode={props.viewMode}
                        translucent={props.translucent}
                        tooltip={props.tooltip}
                        iconTemplate={props.iconTemplate}
                        underlineVisible={props.underlineVisible}
                        readOnly={props.readOnly ?? this.context?.readOnly}
                        onClick={this._handleClick}
                        onMouseDown={this._handleMouseDown}
                        onMouseUp={props.onMouseUp}
                        onTouchStart={props.onTouchStart}
                        onMouseEnter={this._handleMouseEnter}
                        onMouseLeave={this._handleMouseLeave}
                        onMouseMove={this._handleMouseMove}
                        onKeyDown={this._handleKeyDown}
                        onDeactivated={this._deactivated}
                        onContextMenu={props.onContextMenu}
                    />
                    <PopupOpener className="tw-contents" ref={this._popupOpenerRef} />
                </>
            );
        }
    }

    static contextType = getWasabyContext();

    static defaultProps: Partial<IButtonOptions> = {
        showHeader: true,
        filter: {},
        menuPopupTrigger: 'click',
        viewMode: 'outlined',
        fontSize: 'm',
        lazyItemsLoading: false,
        closeMenuOnOutsideClick: true,
    };
}

export default DropdownButton;
/**
 * @event Controls/_dropdown/DropdownButton#menuItemActivate Происходит при выборе элемента из списка.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Новая структура фильтра.
 * @remark Из обработчика события можно возвращать результат обработки. Если результат будет равен false, выпадающий список не закроется.
 * По умолчанию, когда выбран пункт с иерархией, выпадающий список закрывается.
 * @demo Controls-demo/dropdown_new/Button/Items/Index
 * @example
 * В следующем примере создается список и показано как изменить сообщение, выведенное пользователю на основе выбора.
 * <pre class="brush: js;">
 * <!-- TSX -->
 * import { Button } from 'Controls/dropdown';
 * import * as React from 'react';
 *
 * ...
 *
 * const [message, setMessage] = React.useState('');
 *
 * const menuItemActivate = React.useCallback((item) => {
 *     setMessage(`Выбран элемент с id: ${item.getKey()}`);
 * }, []);
 *
 * <Button
 *     onMenuItemActivate="onMenuItemActivate()"
 *     ... />
 *
 *    <h1>{ message }</h1>
 * </pre>
 */

/**
 * @name Controls/_dropdown/DropdownButton#source
 * @cfg {Controls/_dropdown/interface/IBaseDropdown/SourceCfg.typedef}
 * @default undefined
 * @remark
 * Запись может иметь следующие {@link Controls/dropdown:IBaseDropdown/Item.typedef свойства}.
 * @demo Controls-demo/dropdown_new/Button/Source/Index
 * @example
 * Записи будут отображены из источника _source.
 * <pre class="brush: html; highlight: [4];">
 * <!-- WML -->
 * <Controls.dropdown:Button
 *    keyProperty="key"
 *    source="{{_source}}"
 *    caption="Create"
 *    viewMode="link"
 *    iconSize="m" />
 * </pre>
 * <pre class="brush: js; highlight: [2-10];">
 * // JavaScript
 * _source: new source.Memory({
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
