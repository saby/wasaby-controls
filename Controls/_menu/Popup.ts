/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { Control, TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';
import IMenuPopup, { IMenuPopupOptions } from 'Controls/_menu/interface/IMenuPopup';
import { TSubMenuDirection } from 'Controls/_menu/interface/IMenuControl';
import { default as MenuControl } from 'Controls/_menu/Control';
import { default as searchHeaderTemplate } from 'Controls/_menu/Popup/searchHeaderTemplate';
import { getItemParentKey } from 'Controls/_menu/Util';
import { SyntheticEvent } from 'Vdom/Vdom';
import { default as headerTemplate } from 'Controls/_menu/Popup/HeaderTemplate';
import { CalmTimer, IStickyPopupOptions, IStickyPosition } from 'Controls/popup';
import { RecordSet } from 'Types/collection';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { CrudEntityKey, PrefetchProxy } from 'Types/source';
import { TSelectedKeys } from 'Controls/interface';
import scheduleCallbackAfterRedraw from 'Controls/Utils/scheduleCallbackAfterRedraw';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { Source as HistorySource } from 'Controls/history';
import 'css!Controls/menu';
import 'css!Controls/CommonClasses';
import PopupTemplate = require('wml!Controls/_menu/Popup/template');

const SEARCH_DEPS = [
    'Controls/browser',
    'Controls/list',
    'Controls/search',
    'Controls/searchDeprecated',
];

type CancelableError = Error & { canceled?: boolean; isCanceled: boolean };

const MENU_PINNED_SELECTOR = 'controls-Menu__row_pinned';
const MENU_HISTORY_GROUP = 'controls-Menu-historySeparator';

/**
 * Базовый шаблон для {@link Controls/menu:Control}, отображаемого в прилипающем блоке.
 * @mixes Controls/menu:IMenuPopup
 * @mixes Controls/menu:IMenuControl
 * @mixes Controls/menu:IMenuBase
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilter
 * @implements Controls/interface:ISource
 *
 * @public
 */

class Popup extends Control<IMenuPopupOptions> implements IMenuPopup {
    readonly '[Controls/_menu/interface/IMenuPopup]': boolean;
    protected _children: {
        menuControl: MenuControl;
    };
    protected _template: TemplateFunction = PopupTemplate;
    protected _paddingClassName: string = '';
    protected _dataName: string = '';
    protected _headerVisible: boolean = true;
    protected _hasHeader: boolean;
    protected _headerTemplate: TemplateFunction;
    protected _headingCaption: string;
    protected _headingIcon: string;
    protected _headingIconSize: string;
    protected _itemPadding: object;
    protected _closeButtonVisibility: boolean;
    protected _verticalDirection: string = 'bottom';
    protected _horizontalDirection: string = 'right';
    protected _applyButtonVisible: boolean = false;
    protected _selectedItems: Model[] = null;
    protected _items = RecordSet;
    protected _selectedKeys: TSelectedKeys = [];
    protected _excludedKeys: TSelectedKeys = [];
    protected _calmTimer: CalmTimer = null;
    protected _shadowVisible: boolean = false;
    protected _searchValue: string;
    protected _adaptiveMenuIsSwiped = false;
    private _stickyPositionFixed: boolean = false;
    private _openedSubMenuTarget: EventTarget;

    protected _beforeMount(options: IMenuPopupOptions): Promise<void> | void {
        this._slidingPanelOptions = {
            ...options.slidingPanelOptions,
            shouldSwipeOnContent: true,
        };
        if (options.isAdaptive && options.allowAdaptive !== false) {
            this._shadowVisible = true;
        }
        this._dataName = options.dataName + '_root_' + options.root;
        this._searchValue = options.searchValue;
        this._selectedKeys = options.selectedKeys || [];
        this._excludedKeys = options.excludedKeys || [];
        this._dataLoadCallback = this._dataLoadCallback.bind(this, options);
        this._dataLoadErrback = this._dataLoadErrback.bind(this, options);

        this._setCloseButtonVisibility(options);
        if (this._closeButtonVisibility && !options.isAdaptive) {
            this._paddingClassName = 'controls-Menu__popup_with-closeButton ';
        } else {
            this._paddingClassName = 'controls-Menu__popup_without-closeButton ';
        }
        this._prepareHeaderConfig(options);
        this._setItemPadding(options);

        if (options.items) {
            this._updateHeadingIcon(options, options.items);
        }

        if (options.trigger === 'hover' && !this._isTouch()) {
            if (!options.root) {
                this._calmTimer = new CalmTimer(() => {
                    this._notify('close', [], { bubbling: true });
                });
            } else {
                this._calmTimer = options.calmTimer;
            }
        }
        if (options.searchParam) {
            const depPromise = SEARCH_DEPS.map((dep) => {
                return import(dep);
            });
            return Promise.all(depPromise).then(() => {
                return null;
            });
        }
    }

    protected _afterMount() {
        if (
            this._options.isAdaptive &&
            this._options.allowAdaptive !== false &&
            this._options.allowPin
        ) {
            const calculatedHeight = this._calculatePinnedItems();
            if (calculatedHeight > this._container.clientHeight) {
                this._notify(
                    'sendResult',
                    [
                        'slidingHeightUpdate',
                        {
                            heightList: [calculatedHeight, 'auto'],
                            autoHeight: false,
                        },
                    ],
                    { bubbling: true }
                );
            }
        }
        if (this._options.slidingPanelOptions && this._options.root) {
            this._shadowVisible =
                this._options.slidingPanelOptions.minHeight !== this._container.clientHeight;
        }
    }

    protected _beforeUpdate(newOptions: IMenuPopupOptions): void {
        if (this._options.slidingPanelOptions !== newOptions.slidingPanelOptions) {
            this._slidingPanelOptions = {
                ...newOptions.slidingPanelOptions,
                shouldSwipeOnContent: true,
            };
        }
        if (newOptions.stickyPosition && newOptions.stickyPosition.direction) {
            if (this._options.stickyPosition.direction !== newOptions.stickyPosition.direction) {
                this._verticalDirection =
                    newOptions.footerContentTemplate || newOptions.searchParam
                        ? 'bottom'
                        : newOptions.stickyPosition.direction.vertical;
                this._horizontalDirection = newOptions.stickyPosition.direction.horizontal;
            }
            if (newOptions.root && !this._stickyPositionFixed) {
                this._stickyPositionFixed = true;
                this._notify(
                    'sendResult',
                    [
                        'menuOpened',
                        {
                            container: this._container,
                            position: newOptions.stickyPosition,
                        },
                    ],
                    { bubbling: true }
                );
            }
        }

        if (this._options.itemPadding !== newOptions.itemPadding) {
            this._setItemPadding(newOptions);
        }

        if (
            this._options.headerContentTemplate !== newOptions.headerContentTemplate ||
            this._options.headConfig !== newOptions.headConfig
        ) {
            this._prepareHeaderConfig(newOptions);
        }

        if (this._options.searchValue !== newOptions.searchValue) {
            this._searchValue = newOptions.searchValue;
        }
    }

    reload(): void {
        this._children.menuControl.reload();
    }

    moveItemUp(selectedKey: CrudEntityKey): Promise<void> {
        return this._children.menuControl.moveItemUp(selectedKey).then(() => {
            this._applyButtonVisible = true;
        });
    }

    moveItemDown(selectedKey: CrudEntityKey): Promise<void> {
        return this._children.menuControl.moveItemDown(selectedKey).then(() => {
            this._applyButtonVisible = true;
        });
    }

    protected _sendResult(
        event: SyntheticEvent<MouseEvent>,
        action: string,
        data: unknown,
        nativeEvent: SyntheticEvent<MouseEvent>
    ): false {
        event.stopPropagation();
        this._notify('sendResult', [action, data, nativeEvent], {
            bubbling: true,
        });

        // Чтобы подменю не закрывалось после клика на пункт
        // https://wi.sbis.ru/docs/js/Controls/menu/Control/events/itemClick/
        return false;
    }

    protected _searchValueChanged(event: SyntheticEvent<MouseEvent>, value: string): void {
        this._searchValue = value;
        this._notify('sendResult', ['searchValueChanged', value], {
            bubbling: true,
        });
    }

    protected _isWithSelect() {
        return this._options.multiSelect || this._options.markerVisibility !== 'hidden';
    }

    protected _inputSearchValueChanged(event: SyntheticEvent<MouseEvent>, value: string): void {
        if (value) {
            this._children.menuControl.closeSubMenu();
        }
    }

    protected _beforeUnmount(): void {
        this._notify(
            'sendResult',
            ['menuClosed', { container: this._container, searchValue: this._searchValue }],
            { bubbling: true }
        );
    }

    protected _mouseEvent(event: SyntheticEvent<MouseEvent>) {
        if (this._calmTimer) {
            switch (event.type) {
                case 'mouseenter':
                    this._ignoreMouseLeave = false;
                    this._calmTimer.stop();
                    break;
                case 'mouseleave':
                    if (!this._ignoreMouseLeave) {
                        this._calmTimer.start();
                    }
                    break;
                case 'mousemove':
                    this._ignoreMouseLeave = false;
                    break;
            }
        }
    }

    protected _swipeMenu(event, direction): void {
        if (direction === 'top' && !this._adaptiveMenuIsSwiped) {
            this._notify(
                'sendResult',
                [
                    'slidingHeightUpdate',
                    {
                        autoHeight: true,
                    },
                ],
                { bubbling: true }
            );
            this._adaptiveMenuIsSwiped = true;
        }
    }

    protected _expanderClick(event: SyntheticEvent<MouseEvent>, state: boolean): void {
        if (!state) {
            this._ignoreMouseLeave = true;
        }
    }

    protected _headerClick(): void {
        if (!this._options.searchParam && !this._options.draggable) {
            this._notify('close', [], { bubbling: true });
        }
    }

    protected _footerClick(
        event: SyntheticEvent<MouseEvent>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        this._notify('sendResult', ['footerClick', sourceEvent], {
            bubbling: true,
        });
    }

    protected _mouseEnterHandler(): void {
        if (this._container.closest('.controls-Menu__subMenu')) {
            this._notify('sendResult', ['subMenuMouseenter'], {
                bubbling: true,
            });
        }
    }

    protected _dataLoadCallback(options: IMenuPopupOptions, items: RecordSet): void {
        if (!this._selectedItems) {
            this._selectedItems = this._getItemsBySelectedKeys(items);
            this._items = items;
        }
        this._updateHeadingIcon(options, items);
        if (options.dataLoadCallback) {
            options.dataLoadCallback(items);
        }
    }

    protected _dataLoadErrback(options: IMenuPopupOptions, error: CancelableError): void {
        if (!error.canceled && !error.isCanceled) {
            this._headerVisible = false;
            this._headingCaption = null;
            this._headerTemplate = null;
        }
        if (options.dataLoadErrback) {
            options.dataLoadErrback(error);
        }
    }

    protected _prepareSubMenuConfig(
        event: SyntheticEvent<MouseEvent>,
        popupOptions: IStickyPopupOptions,
        subMenuDirection: TSubMenuDirection,
        itemAlign: string
    ): void {
        event.stopPropagation();
        if (this._options.isAdaptive && this._options.allowAdaptive !== false) {
            popupOptions.slidingPanelOptions = {
                ...popupOptions.slidingPanelOptions,
                minHeight: this._container.clientHeight,
                autoHeight: true,
            };
        }
        if (subMenuDirection !== 'bottom') {
            // The first level of the popup is always positioned on the right by standard
            if (
                this._options.root &&
                subMenuDirection === 'right' &&
                (!popupOptions.fittingMode || popupOptions.fittingMode.horizontal !== 'fixed')
            ) {
                popupOptions.direction.horizontal = this._horizontalDirection;
                popupOptions.targetPoint.horizontal = this._horizontalDirection;
            }
            if (popupOptions.direction.horizontal === 'right' && itemAlign === 'right') {
                popupOptions.className += ' controls-Menu__subMenu_marginLeft';
            } else {
                popupOptions.className += ' controls-Menu__subMenu_marginLeft-revert';
            }
        }
        if (
            this._openedSubMenuTarget &&
            this._openedSubMenuTarget !== event.target &&
            this._children.menuControl !== popupOptions.opener
        ) {
            this._closeSubMenu();
        }
        this._openedSubMenuTarget = event.target;
    }

    protected _updateCloseButtonState(
        event: SyntheticEvent<MouseEvent>,
        state: boolean,
        position: { direction: IStickyPosition }
    ): void {
        if (
            !this._options.isAdaptive &&
            (!this._hasHeader || this._verticalDirection === 'top') &&
            this._closeButtonVisibility !== state
        ) {
            if (!state && position.direction.horizontal === 'right') {
                this._closeButtonVisibility = false;
            } else {
                this._setCloseButtonVisibility(this._options);
            }
        }
    }

    protected _setSelectedItems(event: SyntheticEvent<MouseEvent>, items: Model[]): void {
        this._selectedItems = items;
    }

    protected _updateSelectedKeys(
        event: SyntheticEvent<MouseEvent>,
        selectedKeys: TSelectedKeys
    ): void {
        if (this._options.multiSelect) {
            this._selectedKeys = selectedKeys || [];
        }
    }

    protected _updateExcludedKeys(
        event: SyntheticEvent<MouseEvent>,
        excludedKeys: TSelectedKeys
    ): void {
        if (this._options.multiSelect) {
            this._excludedKeys = excludedKeys || [];
        }
    }

    protected _onFooterMouseEnter(): void {
        this._closeSubMenu();
    }

    protected _headerMouseEnter(): void {
        this._closeSubMenu();
    }

    private _closeSubMenu(): void {
        if (this._stickyPositionFixed) {
            this._children.menuControl?.closeSubMenu(false);
        }
    }

    private _getItemsBySelectedKeys(items: RecordSet): Model[] {
        const selectedItems = [];
        items.forEach((item) => {
            if (this._selectedKeys?.includes?.(item.getKey())) {
                selectedItems.push(item);
            }
        });
        return selectedItems;
    }

    private _setItemPadding(options: IMenuPopupOptions): void {
        if (options.itemPadding) {
            this._itemPadding = options.itemPadding;
        } else if (
            this._closeButtonVisibility &&
            (!options.isAdaptive || options.allowAdaptive === false)
        ) {
            this._itemPadding = {
                right: 'menu-close',
            };
        }
    }

    private _updateApplyButton(event, newApplyButtonVisible: boolean): void {
        if (this._applyButtonVisible !== newApplyButtonVisible) {
            this._applyButtonVisible = newApplyButtonVisible;
            scheduleCallbackAfterRedraw(this, (): void => {
                this._notify('controlResize', [], { bubbling: true });
            });
        }
    }

    protected _searchStart(): void {
        this._setUnpinHistorySource(false);
    }

    protected _searchReset(): void {
        this._setUnpinHistorySource(true);
    }

    private _setUnpinHistorySource(isSearchMode): void {
        let source = this._options.source;
        if (source instanceof PrefetchProxy) {
            source = source.getOriginal();
        }
        if (source instanceof HistorySource) {
            source.setUnpinIfNotExist?.(isSearchMode);
        }
    }

    protected _applyButtonClick(event: SyntheticEvent): void {
        this._notify(
            'sendResult',
            [
                'applyClick',
                {
                    items: this._selectedItems,
                    menuItems: this._items,
                    root: this._options.root,
                    selection: {
                        selected: this._selectedKeys,
                        excluded: this._excludedKeys,
                    },
                },
                event,
            ],
            { bubbling: true }
        );
    }

    private _setCloseButtonVisibility(options: IMenuPopupOptions): void {
        this._closeButtonVisibility =
            (!options.isAdaptive || !!options.subMenuLevel) &&
            !!(
                options.closeButtonVisibility ||
                (options.showClose && !options.root) ||
                (options.searchParam && !options.multiSelect)
            );
    }

    private _prepareHeaderConfig(options: IMenuPopupOptions): void {
        this._validateHeadingOptions(options);
        this._headingCaption = this._getHeadingCaption(options);
        this._headingIcon = this._getHeadingIcon(options);
        this._headerTemplate = this._getHeaderTemplate(options);

        this._hasHeader = options.headerTemplate || this._headingCaption || this._headerTemplate;
    }

    private _getHeaderTemplate(options: IMenuPopupOptions): TemplateFunction {
        let template = null;
        if (options.headerContentTemplate) {
            template = options.headerContentTemplate;
        } else if (options.searchParam) {
            template = searchHeaderTemplate;
        } else if (this._headingIcon && !options.headerTemplate) {
            template = headerTemplate;
        }
        return template;
    }

    private _getHeadingCaption(options: IMenuPopupOptions): string {
        let caption = '';
        if (
            !options.searchParam &&
            ((options.showHeader !== false && options.headerTemplate !== null) ||
                options.headerTemplate)
        ) {
            if (options.headConfig && (options.showHeader || options.headerTemplate)) {
                caption = options.headConfig.caption;
            } else if (options.headingCaption) {
                caption = options.headingCaption;
            }
        }
        return caption;
    }

    private _getHeadingIcon(options: IMenuPopupOptions): string {
        let icon = '';
        if ((options.showHeader && options.headerTemplate !== null) || options.headerTemplate) {
            if (options.headConfig) {
                icon = !options.headConfig?.menuStyle
                    ? options.headConfig?.icon || options.headingIcon
                    : '';
            } else {
                icon = options.headingIcon;
            }
        }
        return icon;
    }

    private _validateHeadingOptions(options: IMenuPopupOptions): void {
        const isPopup = !!options.stickyPosition;
        const getOptionName = (optionName: string) => {
            return isPopup ? `menu${optionName}` : optionName;
        };
        if (options.headConfig) {
            if (options.headConfig.caption) {
                Logger.warn(
                    `Опция headConfig устарела,
                 вместо headConfig.caption используйте опцию ${getOptionName('headingCaption')}`,
                    this
                );
            }
            if (options.headConfig.icon) {
                Logger.warn(
                    `Опция headConfig устарела,
                 вместо headConfig.icon используйте опцию ${getOptionName('headingIcon')}`,
                    this
                );
            }
            if (options.headConfig.iconSize) {
                Logger.warn(
                    `Опция headConfig устарела,
                 вместо headConfig.iconSize используйте опцию ${getOptionName('headingIconSize')}`,
                    this
                );
            }
            if (options.headConfig.iconStyle) {
                Logger.warn(
                    `Опция headConfig устарела,
                 вместо headConfig.iconStyle используйте опцию iconStyle`,
                    this
                );
            }
            if (options.headConfig.menuStyle) {
                Logger.warn(`Опция headConfig устарела,
                 вместо headConfig.menuStyle используйте опции:
                  ${getOptionName('headingCaption')} и ${getOptionName('headingIcon')}`);
            }
        }
    }

    private _updateHeadingIcon(options: IMenuPopupOptions, items: RecordSet): void {
        let iconSize;
        let headingIconSize;
        if (this._headingIcon && !this._searchValue) {
            const root = options.root !== undefined ? options.root : null;
            let needShowHeadingIcon = false;
            const firstItem = factory(items)
                .filter((item) => {
                    return (
                        // Найдем первый пункт на первом уровне, не из истории
                        (!options.parentProperty || getItemParentKey(options, item) === root) &&
                        (!options.historyId ||
                            (!item.get('pinned') && !item.get('recent') && !item.get('frequent')))
                    );
                })
                .first(1)
                .value()[0];
            const firstItemHasIcon = !!firstItem?.get('icon');
            if (!firstItemHasIcon || options.searchParam) {
                factory(items).each((item) => {
                    if (
                        item.get('icon') &&
                        (!options.parentProperty || getItemParentKey(options, item) === root)
                    ) {
                        iconSize = item.get('iconSize');
                        headingIconSize = headingIconSize || iconSize;
                        needShowHeadingIcon = true;
                    }
                });
            }
            if (!needShowHeadingIcon) {
                this._headingIcon = null;
            } else {
                this._headingIconSize = headingIconSize || options.iconSize;
            }
        }
    }

    private _calculatePinnedItems(): number {
        const itemsContainer = this._container.querySelector('[name="itemsContainer"]');
        let height = 0;
        let isStop = false;
        itemsContainer?.childNodes.forEach((item, index) => {
            if (!isStop) {
                if (item.classList.contains(MENU_PINNED_SELECTOR)) {
                    if (!index) {
                        // Добавим высоту половины элемента, чтобы было видно, что снизу есть еще записи
                        height += item.clientHeight / 2;
                    }
                    height =
                        height +
                        item.clientHeight +
                        parseInt(getComputedStyle(item).marginBottom, 10);
                } else if (item.classList.contains(MENU_HISTORY_GROUP)) {
                    height += item.clientHeight;
                    isStop = true;
                } else {
                    isStop = true;
                }
            }
        });
        // Кнопка разворота шторки
        const controlLine = this._container.querySelector(
            '.controls-SlidingPanel__controller-container'
        );
        if (controlLine) {
            height += controlLine.clientHeight;
        }
        const headerHeight =
            this._container.querySelector('.controls-SlidingPanel__customContent-header')
                ?.clientHeight || 0;
        height += headerHeight;
        return height;
    }

    private _isTouch(): boolean {
        return TouchDetect.getInstance().isTouch();
    }

    static defaultProps: Partial<IMenuPopupOptions> = {
        root: null,
        selectedKeys: [],
        hoverBackgroundStyle: 'default',
        closeButtonVisibility: true,
        closeButtonViewMode: 'external',
        borderVisible: false,
        borderRadius: 's',
        markerVisibility: 'hidden',
        footerVisibility: true,
    };
}

export default Popup;

/**
 * @name Controls/_menu/Popup#headingCaption
 * @cfg {String} Заголовок шапки меню.
 * @demo Controls-demo/dropdown_new/Button/MenuHeadingCaption/Index
 * @example
 * <pre class="brush: html; highlight: [7]">
 * <!-- WML -->
 * <Controls.menu:Popup
 *    keyProperty="id"
 *    displayProperty="title"
 *    source="{{_source}}"
 *    headingCaption="{[Заголовок для меню]}" />
 * </pre>
 */

/**
 * Перемещает один элемент вверх.
 * @function Controls/_menu/Popup#moveItemUp
 * @param {String|Number} item Элемент перемещения.
 * @returns {Core/Deferred} Отложенный результат перемещения.
 * @see moveItemDown
 * @see moveItems
 */
/**
 * Перемещает один элемент вниз.
 * @function Controls/_menu/Popup#moveItemDown
 * @param {String|Number} item Элемент перемещения.
 * @returns {Core/Deferred} Отложенный результат перемещения.
 * @see moveItemUp
 * @see moveItems
 */
