/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import rk = require('i18n!Controls');
import { constants, detection } from 'Env/Env';
import { Control, TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { TSelectedKeys, ISelectionObject, TVisibility } from 'Controls/interface';
import * as itemTemplate from 'wml!Controls/_menu/Render/itemTemplate';
import {
    default as IMenuControl,
    IMenuControlOptions,
} from 'Controls/_menu/interface/IMenuControl';
import { RecordSet, List, format } from 'Types/collection';
import { dropdownHistoryUtils, loadItemsTemplates } from 'Controls/dropdown';
import { ICrudPlus, PrefetchProxy, CrudEntityKey } from 'Types/source';
import { Collection, CollectionItem, MultiSelectAccessibility } from 'Controls/display';
import { TreeCollection as Tree, TreeItem } from 'Controls/tree';
import { TreeGridCollection, TreeGridDataRow, ITreeGridCollectionOptions } from 'Controls/treeGrid';
import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import { getItemParentKey, hasPinIcon, isHistorySource } from 'Controls/_menu/Util';
import ColumnTemplate from 'Controls/_menu/Render/ColumnTemplate';
import searchBreadCrumbsItemTemplate from 'Controls/_menu/Render/SearchBreadCrumbsItemTemplate';
import ViewTemplate = require('wml!Controls/_menu/Control/Control');
import { default as groupTemplate, isGroupVisible } from 'Controls/_menu/Render/GroupTemplate';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';
import { isEqual, merge } from 'Types/object';
import * as cInstance from 'Core/core-instance';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import * as multiSelectTemplate from 'wml!Controls/_menu/Render/multiSelectTpl';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { ErrorViewMode, ErrorViewConfig, ErrorController } from 'Controls/error';
import { Controller as HistoryController, Source as HistorySource } from 'Controls/history';
import {
    StickyOpener,
    IStickyPopupOptions,
    IStickyPosition,
    DependencyTimer,
} from 'Controls/popup';
import { TKey } from 'Controls/_menu/interface/IMenuBase';
import { create as DiCreate } from 'Types/di';
import { LOCAL_MOVE_POSITION } from 'Types/source';
import 'css!Controls/menu';
import 'Controls/explorer';
import { Move as MoveAction, IMoveActionOptions } from 'Controls/listCommands';
import {
    ISiblingStrategy,
    FlatSiblingStrategy,
    groupConstants as constView,
} from 'Controls/baseList';
import { scrollToElement } from 'Controls/scroll';
import { controller } from 'I18n/i18n';
import ArraySimpleValuesUtil = require('Controls/Utils/ArraySimpleValuesUtil');
import type { IColumn } from 'Controls/grid';

interface IMenuPosition {
    left: number;
    top: number;
    height: number;
}

interface ISourcePropertyConfig {
    moduleName: string;
    options: object;
}

interface IMenuOpenedResult {
    container: HTMLElement;
    position: IStickyPosition;
}

const SUB_DROPDOWN_DELAY = 400;
const searchGridCollection = 'Controls/searchBreadcrumbsGrid:SearchGridCollection';

/**
 * Контрол меню.
 * @class Controls/_menu/Control
 * @public
 * @implements Controls/interface:IIconSize
 * @implements Controls/interface:IIconStyle
 * @implements Controls/interface:ISource
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilter
 * @implements Controls/interface:IFontColorStyle
 * @mixes Controls/menu:IMenuControl
 * @mixes Controls/menu:IMenuBase
 * @mixes Controls/dropdown:IGrouped
 * @implements Controls/interface/IMultiSelectable
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface:ISelectorDialog
 * @implements Controls/interface:IBackgroundStyle
 * @implements Controls/marker:IMarkerList
 * @ignoreEvents beforeSelectionChanged
 *
 * @demo Controls-demo/Menu/Control/Source/Index
 *
 */
export default class MenuControl
    extends Control<IMenuControlOptions, RecordSet>
    implements IMenuControl
{
    readonly '[Controls/_menu/interface/IMenuControl]': boolean = true;
    protected _template: TemplateFunction = ViewTemplate;

    protected _children: Record<string, Control> = {
        sticky: StickyOpener,
    };

    protected _listModel: Collection<Model>;
    protected _itemActions: IItemAction[];
    protected _itemActionsVisibilityCallback: Function;
    protected _moreButtonVisible: boolean = false;
    protected _expandButtonVisible: boolean = false;
    protected _expander: boolean;
    protected _emptyItem: CollectionItem;
    protected _markedKey: string | number | undefined;
    private _sourceController: SourceController = null;
    private _subDropdownItem: Model | null;
    private _preventCloseSubMenu: boolean = false;
    private _selectionChanged: boolean = false;
    private _selectedItems: Model[] = [];
    protected _expandedItems: (number | string | null)[];
    private _itemsCount: number;
    private _visibleIds: TKey[] = [];
    private _openingTimer: number = null;
    private _closingTimer: number = null;
    private _isMouseInOpenedItemArea: boolean = false;
    private _openedTarget: HTMLElement;
    protected _expandedItemsFilter: Function;
    protected _needStickyHistoryItems: boolean = false;
    private _additionalFilter: Function;
    private _limitHistoryFilter: Function;
    private _notifyResizeAfterRender: Boolean = false;
    private _needToScrollToItemAfterRender: Boolean = false;
    private _viewMode: string;
    private _selectedKeys: TSelectedKeys;
    private _excludedKeys: TSelectedKeys;

    private _subMenu: HTMLElement;
    private _subMenuTemplateOptions: IMenuControlOptions;
    private _historyController: HistoryController = null;
    private _hoveredItem: Model;
    private _hoveredTarget: EventTarget;
    private _enterEvent: MouseEvent;
    private _subMenuPosition: IMenuPosition;
    private _openSubMenuEvent: MouseEvent;
    private _errorController: ErrorController;
    private _dependenciesTimer: DependencyTimer = null;
    private _multiSelectVisibility: TVisibility;
    protected _errorConfig: ErrorViewConfig | void;
    private _subMenuSourceCache: Map<TKey, PrefetchProxy> = new Map();

    constructor(options: IMenuControlOptions) {
        super(options);
        this._expandedItemsFilter = this._expandedItemsFilterCheck.bind(this);
        this._itemsChangedCallback = this._itemsChangedCallback.bind(this);
        this._additionalFilter = MenuControl._additionalFilterCheck.bind(this, options);
        this._limitHistoryFilter = this._limitHistoryCheck.bind(this);
        this._itemActionsVisibilityCallback = this._itemActionsVisibility.bind(this, options);
    }

    protected _beforeMount(
        options: IMenuControlOptions,
        context?: object,
        receivedState?: RecordSet
    ): Promise<RecordSet> {
        this._validateOptions(options);
        this._viewMode = options.viewMode;
        this._selectedKeys = options.selectedKeys || [];
        this._excludedKeys = options.excludedKeys || [];
        this._leftPadding = this._getLeftPadding(options);
        this._columns = this._getColumns(options);
        this._setItemActions(options);
        this._multiSelectVisibility = this._getMultiSelectVisibility(options);

        if (
            (options.historyId &&
                options.hasHistory &&
                options.sourceController?.hasLoaded(options.root)) ||
            options.sourceController
        ) {
            this._sourceController = this._getSourceController(options);
            const error = this._sourceController.getLoadError();
            if (error) {
                this._processError(error);
            } else {
                if (!options.parentProperty || options.sourceController?.hasLoaded(options.root)) {
                    this._setItems(options.sourceController.getItems(), options);
                    this._initHistoryControllerIfNeed(options);
                    return;
                } else {
                    return this._loadAndSetItems(options);
                }
            }
        } else if (options.source) {
            return this._loadAndSetItems(options);
        } else if (options.items) {
            this._setItems(options.items, options);
        }
    }

    private _getColumns(options: IMenuControlOptions): IColumn[] {
        return [
            {
                displayProperty: options.displayProperty,
                keyProperty: this._getKeyProperty(options),
                nodeProperty: options.nodeProperty,
                parentProperty: options.parentProperty,
                fontColorStyle: options.fontColorStyle,
                template: ColumnTemplate,
                width: '100%',
                templateOptions: {
                    source: options.source,
                    root: options.root,
                    itemTemplate: options.itemTemplate || itemTemplate,
                    itemTemplateProperty: options.itemTemplateProperty,
                    cellPadding: null,
                    hierarchyViewMode: options.hierarchyViewMode,
                    menuMode: options.menuMode,
                    subMenuLevel: options.subMenuLevel,
                    useListRender: options.useListRender,
                    isAdaptive: this._isAdaptive(options),
                    allowAdaptive: options.allowAdaptive,
                    itemPadding: options.itemPadding,
                    leftPadding: this._leftPadding,
                    markerVisibility: options.markerVisibility,
                    multiSelect: options.multiSelect,
                    emptyKey: options.emptyKey,
                    emptyText: options.emptyText,
                    selectedAllKey: options.selectedAllKey,
                    selectedAllText: options.selectedAllText,
                    hoverBackgroundStyle: options.hoverBackgroundStyle,
                    breadCrumbsItemTemplate: options.breadCrumbsItemTemplate,
                    displayProperty: options.displayProperty,
                    iconSize: options.iconSize,
                    iconStyle: options.iconStyle,
                    iconPadding: options.iconPadding,
                    markerPosition: options.markerPosition,
                    multiLine: options.multiLine,
                    multiSelectPosition: options.multiSelectPosition,
                    allowPin: options.allowPin,
                    itemAlign: options.itemAlign,
                    historyRoot: options.historyRoot,
                    width: options.width,
                    viewMode: this._viewMode,
                    directionality: controller.currentLocaleConfig.directionality,
                    focusable: options.focusable,
                    fontColorStyle: options.fontColorStyle,
                    onItemClick: this._itemClick.bind(this),
                },
            },
        ];
    }

    private _getKeyProperty(options: IMenuControlOptions, items?: RecordSet<Model>): string {
        let source = options.source;
        if (source instanceof PrefetchProxy) {
            source = source.getOriginal();
        }
        return isHistorySource(source) && options.hasHistory
            ? 'copyOriginalId'
            : options.keyProperty ||
                  source?.getKeyProperty() ||
                  (items || options.items)?.getKeyProperty();
    }

    private _destroySourceController(): void {
        if (this._sourceController) {
            this._sourceController.unsubscribe('itemsChanged', this._itemsChangedCallback);

            if (!this._options.sourceController) {
                this._sourceController.destroy();
            }

            this._sourceController = null;
        }
    }

    protected _afterMount(): void {
        if (
            this._options.openedSubMenuKey &&
            !this._isTreeControl() &&
            this._options.menuMode !== 'selector'
        ) {
            this._openSubMenuByKey(
                this._options.openedSubMenuOptions,
                this._options.openedSubMenuKey
            );
        }
        if (this._options.menuOpenedCallback) {
            this._options.menuOpenedCallback(this._options.root);
        }
    }

    protected _beforeUpdate(newOptions: IMenuControlOptions): void {
        const rootChanged = newOptions.root !== this._options.root;
        const sourceChanged = newOptions.source !== this._options.source;
        const itemsChanged = newOptions.items !== this._options.items;
        const filterChanged = !isEqual(newOptions.filter, this._options.filter);
        const markerPositionChanged = !isEqual(
            newOptions.markerPosition,
            this._options.markerPosition
        );
        const searchValueChanged = newOptions.searchValue !== this._options.searchValue;
        const selectedKeysChanged = this._isSelectedKeysChanged(
            newOptions.selectedKeys,
            this._options.selectedKeys
        );
        const excludedKeysChanged =
            newOptions.excludedKeys &&
            this._isSelectedKeysChanged(newOptions.excludedKeys, this._options.excludedKeys || []);
        const viewModeChanged = newOptions.viewMode !== this._options.viewMode;
        let result;

        if (newOptions.multiSelect !== this._options.multiSelect) {
            this._multiSelectVisibility = this._getMultiSelectVisibility(newOptions);
        }

        if (selectedKeysChanged) {
            this._selectedKeys = newOptions.selectedKeys;
        }
        if (excludedKeysChanged) {
            this._excludedKeys = newOptions.excludedKeys;
        }

        if (markerPositionChanged) {
            this._columns = [...this._columns];
            this._columns[0].templateOptions.markerPosition = newOptions.markerPosition;
        }

        if (newOptions.isDragging && this._options.isDragging !== newOptions.isDragging) {
            this._closeSubMenu();
        }

        if (
            newOptions.openedSubMenuKey &&
            this._options.openedSubMenuKey !== newOptions.openedSubMenuKey
        ) {
            this._openSubMenuByKey(newOptions.openedSubMenuOptions, newOptions.openedSubMenuKey);
        }

        if (
            newOptions.closedSubMenuKey &&
            this._options.closedSubMenuKey !== newOptions.closedSubMenuKey
        ) {
            this._closeSubMenuByKey(newOptions.closedSubMenuKey);
        }

        if (
            newOptions.sourceController &&
            newOptions.searchParam &&
            ((newOptions.searchValue && searchValueChanged) || viewModeChanged || rootChanged)
        ) {
            this._notifyResizeAfterRender = true;
            this._closeSubMenu();
            this._updateItems(newOptions.sourceController.getItems(), newOptions);
            if (rootChanged && newOptions.root) {
                this._listModel.removeFilter(this._limitHistoryFilter);
            } else if (rootChanged && this._needAddLimitHistoryFilter(newOptions)) {
                this._listModel.addFilter(this._limitHistoryFilter);
            }
        } else if (
            (sourceChanged || filterChanged) &&
            !(newOptions.sourceController && newOptions.sourceController.isLoading())
        ) {
            if (sourceChanged && !newOptions.sourceController) {
                this._destroySourceController();
            } else if (rootChanged && !newOptions.sourceController) {
                this._sourceController.setRoot(newOptions.root);
            } else if (filterChanged) {
                this._sourceController.setFilter(newOptions.filter);
            }
            this._closeSubMenu();
            result = this._loadItems(newOptions).then((res) => {
                this._updateItems(res, newOptions);
                this._notifyResizeAfterRender = true;
                return res;
            });
        } else if (newOptions.menuMode === 'selector' && rootChanged) {
            this._setButtonVisibleState(this._listModel.getSourceCollection(), newOptions);
            this._updateListModelFilters(newOptions);
        } else if (itemsChanged && newOptions.items) {
            this._setItems(newOptions.items, newOptions);
        } else {
            if (selectedKeysChanged) {
                this._updateMarkedKey(newOptions);
                if (newOptions.multiSelect) {
                    this._setSelection(newOptions);
                    this._notify('selectedItemsChanged', [this._getSelectedItems()]);
                }
            }
        }

        return result;
    }

    protected _afterRender(oldOptions: IMenuControlOptions): void {
        if (this._notifyResizeAfterRender) {
            this._notify('controlResize', [], { bubbling: true });
            this._notifyResizeAfterRender = false;
        }
        if (this._needToScrollToItemAfterRender) {
            this._scrollToMarkedElement();
            this._needToScrollToItemAfterRender = false;
        }
        if (
            this._options.stickyPosition &&
            !Object.keys(oldOptions.stickyPosition.sizes).length &&
            Object.keys(this._options.stickyPosition.sizes).length &&
            !this._options.multiSelect &&
            this._selectedKeys?.length
        ) {
            const markedKey = this._getMarkedKey(this._options.selectedKeys, this._options);
            if (markedKey) {
                this._children.menuRender.scrollToItem(markedKey);
            }
        }
    }

    protected _beforeUnmount(): void {
        if (this._sourceController) {
            this._sourceController.cancelLoading();
            this._destroySourceController();
        }

        if (this._listModel) {
            this._listModel.destroy();
            this._listModel = null;
        }
        if (this._errorController) {
            this._errorController = null;
        }
        if (this._openingTimer) {
            this._clearOpeningTimout();
        }
    }

    reload(): void {
        this._loadItems(this._options).then((items) => {
            this._setItems(items, this._options);
            this._setSelection(this._options);
        });
    }

    moveItemUp(selectedKey: CrudEntityKey): Promise<void> {
        return this._moveItem(selectedKey, 'up');
    }

    moveItemDown(selectedKey: CrudEntityKey): Promise<void> {
        return this._moveItem(selectedKey, 'down');
    }

    closeSubMenu(fromCode: boolean = true): void {
        this._closeSubMenu(false, fromCode);
    }

    swipeMenuTop(): void {
        this._showOnlyPinned = false;
        this._listModel.removeFilter(MenuControl._pinnedFilter);
    }

    protected _moveItem(selectedKey: CrudEntityKey, direction: 'up' | 'down'): Promise<void> {
        const selection: ISelectionObject = {
            selected: [selectedKey],
            excluded: [],
        };
        return this._getMoveAction().execute({
            selection,
            position: direction === 'up' ? LOCAL_MOVE_POSITION.Before : LOCAL_MOVE_POSITION.After,
        }) as Promise<void>;
    }

    protected _getMoveAction(): MoveAction {
        const controllerOptions: IMoveActionOptions = {
            source: this._options.source,
            keyProperty: this._getKeyProperty(this._options),
            siblingStrategy: this._getSiblingStrategy(),
        };
        return new MoveAction(controllerOptions);
    }

    protected _getSiblingStrategy(): ISiblingStrategy {
        return new FlatSiblingStrategy({
            collection: this._listModel,
        });
    }

    protected _mouseLeaveHandler(): void {
        this._clearOpeningTimout();
        this._clearAllowCloseTimout();
        this._startClosingTimout();
    }

    protected _itemMouseLeave() {
        this._dependenciesTimer?.stop();
    }
    protected _mouseMove(event: SyntheticEvent<MouseEvent>): void {
        if (this._isMouseInOpenedItemArea && this._subDropdownItem) {
            this._startOpeningTimeout();
        }
        if (this._options.focusable && this._listModel.getHoveredItem()) {
            this._updateKeyboardItem(null);
        }
    }

    protected _handleKeyDown(event: SyntheticEvent<KeyboardEvent>): void {
        event.stopPropagation();
        const code = event.nativeEvent.keyCode;
        if (code === constants.key.up) {
            this._updateSelectedItemKeyboard(event, 'previous');
        } else if (code === constants.key.down) {
            this._updateSelectedItemKeyboard(event, 'next');
        } else if (code === constants.key.enter && this._listModel.getHoveredItem()) {
            this._notify('itemClick', [this._listModel.getHoveredItem().contents, event]);
        } else if (code === constants.key.left) {
            if (this._isTreeControl()) {
                if (!this._toggleExpandedItems(this._listModel.getHoveredItem().key, false)) {
                    this._notify('sendResult', ['subMenuClose'], { bubbling: true });
                }
            } else {
                this._notify('sendResult', ['subMenuClose'], { bubbling: true });
            }
        } else if (code === constants.key.right) {
            if (this._isTreeControl()) {
                this._toggleExpandedItems(this._listModel.getHoveredItem().key, true);
            } else {
                this._openSubMenuByKey({ autofocus: true }, this._listModel.getHoveredItem().key);
            }
        } else if (code === constants.key.space) {
            const collectionItem = this._listModel.getHoveredItem().contents;
            if (this._options.multiSelect) {
                this._itemClick(event, collectionItem, event);
            } else if (
                this._options.allowPin &&
                !this._canOpenSubMenu(collectionItem) &&
                !collectionItem.get('doNotSaveToHistory')
            ) {
                this._pinClick(collectionItem);
                this._notify('sendResult', ['subMenuClose'], {
                    bubbling: true,
                });
            }
        } else if (code === constants.key.esc) {
            this._notify('close', [], { bubbling: true });
        }
    }

    protected _itemMouseEnter(
        event: SyntheticEvent<MouseEvent>,
        item: Model,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (item instanceof Model && item.get('prefetchModules')) {
            if (!this._dependenciesTimer) {
                this._dependenciesTimer = new DependencyTimer();
            }
            this._dependenciesTimer.start(() => {
                Promise.all(
                    item.get('prefetchModules').map((module) => {
                        return loadAsync(module);
                    })
                );
            });
        }
        if (this._isNeedStartOpening(item, sourceEvent)) {
            // mousemove всплывает с внутренних элементов, из-за чего будет неправильно определен target
            // поэтому сохраняем target на mouseenter
            this._hoveredTarget = sourceEvent.currentTarget;
            this._hoveredItem = item;

            if (this._preventCloseSubMenu && this._subDropdownItem !== item) {
                this._clearAllowCloseTimout();
                this._allowCloseTimeout = setTimeout((): void => {
                    this._preventCloseSubMenu = false;
                }, SUB_DROPDOWN_DELAY);
            }
        }
    }

    private _updateSelectedItemKeyboard(event: SyntheticEvent, direction: string): void {
        let newItem = null;
        let hoveredItem = this._listModel.getHoveredItem();
        const currentIndex = this._listModel.getIndex(hoveredItem);
        if (!hoveredItem) {
            newItem = this._listModel.getFirst();
        } else {
            do {
                if (direction === 'previous') {
                    if (hoveredItem.isFirstItem()) {
                        newItem = this._listModel.getLast();
                    } else {
                        newItem = this._findNearbyItem(currentIndex - 1, false);
                    }
                } else if (direction === 'next') {
                    if (hoveredItem.isLastItem()) {
                        newItem = this._listModel.getFirst();
                    } else {
                        newItem = this._findNearbyItem(currentIndex + 1, true);
                    }
                }
                hoveredItem = newItem;
            } while (newItem && newItem.contents.get?.('readOnly'));
        }

        this._updateKeyboardItem(newItem);

        this._needToScrollToItemAfterRender = true;

        if (newItem) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    private _findNearbyItem(index: number, next?: boolean) {
        const count = this._listModel.getCount();
        let resIndex = index;
        let item;
        while (next ? resIndex < count : resIndex >= 0) {
            item = this._listModel.at(resIndex);
            if (item && item.Markable && !item.contents?.get?.('readOnly')) {
                break;
            }
            resIndex += next ? 1 : -1;
        }
        if (item && item.Markable) {
            return item;
        }

        return null;
    }

    private _scrollToMarkedElement(): void {
        const element = this._container.querySelector('.controls-Menu__row_hovered') as HTMLElement;
        if (element) {
            scrollToElement(element);
        }
    }

    private _updateKeyboardItem(item: CollectionItem<Model>): void {
        this._listModel.setHoveredItem(item);
    }

    private _isNeedStartOpening(item: Model, sourceEvent: SyntheticEvent<MouseEvent>): boolean {
        // menu:Control могут положить в пункт меню, от такого пунта открывать подменю не нужно
        // TODO: https://online.sbis.ru/opendoc.html?guid=6fdbc4ca-d19a-46b3-ad68-24fceefa8ed0
        return (
            !(this._viewMode === 'list' && this._options.searchValue) &&
            item instanceof Model &&
            !this._isTouch() &&
            !this._options.isDragging &&
            sourceEvent.currentTarget.closest('.controls-menu') === this._container
        );
    }

    protected _itemMouseMove(
        event: SyntheticEvent<MouseEvent>,
        item: Model,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (
            this._isNeedStartOpening(item, sourceEvent) &&
            (!this._subDropdownItem || this._subDropdownItem.getKey() !== item.getKey())
        ) {
            this._clearClosingTimout();
            this._setItemParamsOnHandle(item, sourceEvent.nativeEvent);
            this._checkOpenedMenu(sourceEvent.nativeEvent, item);
            this._startOpeningTimeout();
        }
    }

    protected _rootChanged(event, root) {
        this._notify('rootChanged', [root]);
    }

    private _initHistoryControllerIfNeed(options: IMenuControlOptions): void {
        let source = options.source || options.sourceController?.getSource();
        if (source instanceof PrefetchProxy) {
            source = source.getOriginal();
        }
        if (options.historyId && options.hasHistory && source instanceof HistorySource) {
            this._historyController = new HistoryController({
                source,
                keyProperty: source.getKeyProperty(),
            });
        }
    }

    protected _itemClick(
        event: SyntheticEvent<MouseEvent | KeyboardEvent>,
        item: Model,
        sourceEvent: SyntheticEvent<MouseEvent | KeyboardEvent>
    ): boolean | void {
        if (item.get('readOnly') || this._options.isDragging) {
            return;
        }
        let itemClickResult;
        const key: string | number = item.getKey();
        const { multiSelect, nodeProperty, menuMode } = this._options;
        const isNode = item.get(nodeProperty);

        const isTouch = this._isTouch();
        if (
            (!isTouch || !isNode) &&
            multiSelect &&
            !this._selectionChanged &&
            this._selectedKeys?.length
        ) {
            this._selectionChanged = true;
        }

        if (MenuControl._isPinIcon(sourceEvent?.target)) {
            this._pinClick(item);
        } else if (MenuControl._isRightTemplateClick(sourceEvent?.target)) {
            this._rightTemplateClick(event, item);
        } else {
            if (this._options.multiSelectAccessibilityProperty) {
                const checkBoxState = item.get(this._options.multiSelectAccessibilityProperty);
                if (
                    checkBoxState === MultiSelectAccessibility.hidden ||
                    checkBoxState === MultiSelectAccessibility.disabled
                ) {
                    return;
                }
            }
            if (
                multiSelect &&
                this._selectionChanged &&
                !this._isSingleSelectionKey(item.getKey()) &&
                !MenuControl._isFixedItem(item, this._options.source)
            ) {
                this._changeSelection(key);
            } else {
                if (
                    this._needTouchOpenMenu(this._options) &&
                    isNode &&
                    this._subDropdownItem !== item
                ) {
                    if (isTouch) {
                        this._preventCloseSubMenu = false;
                    }
                    this._handleCurrentItem(
                        item,
                        sourceEvent.currentTarget,
                        sourceEvent.nativeEvent
                    );

                    if (isTouch) {
                        return;
                    }
                }

                if (menuMode !== 'selector' || !isNode) {
                    if (
                        !MenuControl._isItemCurrentRoot(item, this._options) &&
                        !this._isTreeControl()
                    ) {
                        itemClickResult = false;
                        this._notify('itemClick', [item, sourceEvent]);
                    } else {
                        itemClickResult = !!isNode;
                        this._notify('itemClick', [item, sourceEvent]);
                        if (this._historyController) {
                            this._historyController.updateItems([item]).then((items: RecordSet) => {
                                if (this._sourceController) {
                                    items.setKeyProperty(this._listModel.getKeyProperty());
                                    this._sourceController.setItems(items);
                                }
                            });
                        }
                    }
                }
                if (menuMode !== 'selector') {
                    const selectedKeys = multiSelect
                        ? [item.getKey()]
                        : [this._getMarkedKey([item.getKey()], this._options)];
                    this._notify('selectedKeysChanged', [selectedKeys]);
                }
                if (menuMode === 'selector' && isNode === false) {
                    this._children.menuRender.toggleExpanded(key);
                }
            }
        }
        return itemClickResult;
    }

    private _needTouchOpenMenu(): boolean {
        const isSelectorMenu = this._options.menuMode === 'selector';
        return (
            (this._isAdaptive() && !isSelectorMenu) ||
            (!this._isTreeControl() && this._options.menuMode !== 'selector')
        );
    }

    private _isAdaptive(options = this._options): boolean {
        return !!(options.isAdaptive && options.allowAdaptive !== false);
    }

    private _updateMarkedKey(newOptions: IMenuControlOptions): void {
        const markedKey = this._getMarkedKey(this._selectedKeys, newOptions);
        this._markedKey = markedKey !== undefined ? markedKey : this._selectedKeys?.[0];
        if (this._isSingleSelectionKey(markedKey, newOptions)) {
            this._setMarkerEmptyItem(true, newOptions.emptyKey);
        } else {
            this._setMarkerEmptyItem(false, newOptions.emptyKey);
        }
    }

    private _getKeysForSelectionController(options: IMenuControlOptions): TSelectedKeys {
        const selectedKeys = [];
        const items = this._listModel.getSourceCollection();
        this._selectedKeys.forEach((key) => {
            const item = items.getRecordById(key);
            if (
                key !== options.emptyKey &&
                key !== options.selectedAllKey &&
                (!item || !MenuControl._isFixedItem(item, this._options.source))
            ) {
                const itemKey = item?.get(this._getKeyProperty(options, items));
                selectedKeys.push(
                    item && typeof itemKey === 'string' && item.has('HistoryId') ? String(key) : key
                );
            }
        });
        return selectedKeys;
    }

    private _pinClick(item: Model): void {
        if (this._historyController) {
            this._historyController.togglePin(item).then(() => {
                const items = this._historyController.getItems();
                items.setKeyProperty(this._listModel.getKeyProperty());
                this._sourceController.setItems(items);
                this._notify('pinClick', [item]);
            });
        } else {
            this._notify('pinClick', [item]);
        }
    }

    private _rightTemplateClick(event: SyntheticEvent<MouseEvent>, item: Model): void {
        this._notify('rightTemplateClick', [item, event]);
    }

    private _isTouch(): boolean {
        return TouchDetect.getInstance().isTouch();
    }

    protected _toggleExpanded(): void {
        this._preventCloseSubMenu = false;
        this._closeSubMenu();
        this._expander = !this._expander;
        let toggleFilter = this._additionalFilter;
        if (!this._options.additionalProperty) {
            toggleFilter = this._limitHistoryFilter;
        }
        if (this._expander) {
            const filters = this._listModel.getFilter();
            this._listModel.setFilter([]);
            const index = filters.indexOf(toggleFilter);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            this._listModel.setFilter(filters);
        } else {
            if (this._expandedItems?.length && this._options.parentProperty) {
                const newExpandedItems = this._needExpandHiddenNode(
                    this._listModel.getSourceCollection(),
                    this._options
                )
                    ? [null]
                    : [];
                this._setExpandedItems(newExpandedItems);
            }
            this._listModel.addFilter(toggleFilter);
        }
        this._notify('expanderClick', [this._expander]);
        this._notifyResizeAfterRender = true;
    }

    protected _changeIndicatorOverlay(
        event: SyntheticEvent<MouseEvent>,
        config: { overlay: string }
    ): void {
        config.overlay = 'none';
    }

    protected _isSingleSelectionKey(
        key: TKey,
        options?: IMenuControlOptions = this._options
    ): boolean {
        const isAllSelectedItem = options.selectedAllText && key === options.selectedAllKey;
        const isEmptyItem = options.emptyText && key === options.emptyKey;
        return isAllSelectedItem || isEmptyItem;
    }

    protected _openSelectorDialog(): void {
        let selectedItems: List<Model>;
        // TODO: убрать по задаче: https://online.sbis.ru/opendoc.html?guid=637922a8-7d23-4d18-a7f2-b58c7cfb3cb0
        if (this._options.selectorOpenCallback) {
            selectedItems = this._options.selectorOpenCallback();
        } else {
            selectedItems = new List<Model>({
                items: this._getSelectedItems().filter((item: Model): boolean => {
                    return !this._isSingleSelectionKey(item.getKey());
                }) as Model[],
            });
        }
        this._notify('moreButtonClick', [selectedItems]);
    }

    protected _closeSubMenuHandler(): void {
        if (!this._children.Sticky?.isOpened()) {
            this._subDropdownItem = null;
            this._subMenuPopupPosition = null;
            this._preventCloseSubMenu = false;
        }
    }

    protected _subMenuResult(
        event: SyntheticEvent<MouseEvent>,
        eventName: string,
        eventResult: IMenuOpenedResult | ISelectionObject,
        nativeEvent: SyntheticEvent<MouseEvent>
    ): void {
        switch (eventName) {
            case 'menuOpened':
                const menuOpenedResult = eventResult as IMenuOpenedResult;
                const isFirst = this._listModel.getFirst().getContents() === this._subDropdownItem;
                if (isFirst && !this._options.emptyText && !this._options.selectedAllText) {
                    this._notify('closeButtonVisibilityChanged', [
                        false,
                        menuOpenedResult.position,
                    ]);
                }
                this._subMenu = menuOpenedResult.container;
                this._subMenuPopupPosition = {
                    direction: menuOpenedResult.position?.direction,
                    targetPoint: menuOpenedResult.position?.targetPoint,
                    fittingMode: {
                        horizontal: 'fixed',
                    },
                };
                Promise.resolve(this._openSubMenu(this._openedTarget, this._subDropdownItem)).then(
                    () => {
                        this._subMenuTemplateOptions = null;
                    }
                );
                break;
            case 'expanderClick':
                this._subMenuPopupPosition = {
                    ...this._subMenuPopupPosition,
                    fittingMode: {
                        horizontal: 'fixed',
                        vertical: eventResult ? 'overflow' : 'adaptive',
                    },
                };
                this._openSubMenu(this._openedTarget, this._subDropdownItem);
                break;
            case 'menuClosed':
                this._notify('closeButtonVisibilityChanged', [true]);
                break;
            case 'subMenuMouseenter':
                this._clearClosingTimout();
                break;
            case 'subMenuClose': // закрытие подменю с клавиатуры
                this.closeSubMenu();
                this.activate();
                break;
            case 'selectionChanged':
                this._selectedKeys = eventResult.selected;
                this._excludedKeys = eventResult.excluded;
                this._updateEmptyItemMarker(eventResult as ISelectionObject);
                this._selectedItems = this._getSelectedItemsFromController();
                this._notify('selectionChanged', [eventResult]);
                this._notify('selectedItemsChanged', [this._getSelectedItems()]);
                this._notifySelectionChanged();
                break;
            case 'pinClick':
                if (this._historyController) {
                    this._updateItems(this._historyController.getItems(), this._options);
                }
            default:
                const notifyResult = this._notify(eventName, [eventResult, nativeEvent]);
                if (
                    eventName === 'pinClick' ||
                    (eventName === 'itemClick' && notifyResult !== false)
                ) {
                    this._preventCloseSubMenu = false;
                    this._closeSubMenu();
                }
        }
    }

    protected _footerMouseEnter(event: SyntheticEvent<MouseEvent>): void {
        this._checkOpenedMenu(event.nativeEvent);
    }

    protected _separatorMouseEnter(
        event: SyntheticEvent<MouseEvent>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        this._checkOpenedMenu(sourceEvent.nativeEvent);
    }

    private _checkOpenedMenu(nativeEvent: MouseEvent, newItem?: Model): void {
        const needCloseSubMenu: boolean =
            !this._preventCloseSubMenu &&
            this._subMenu &&
            this._subDropdownItem &&
            (!newItem || newItem !== this._subDropdownItem);
        if (!this._isNeedKeepMenuOpen(needCloseSubMenu, nativeEvent) && needCloseSubMenu) {
            this._closeSubMenu();
        }
    }

    private _isNeedKeepMenuOpen(needCloseDropDown: boolean, nativeEvent: MouseEvent): boolean {
        if (needCloseDropDown) {
            this._setSubMenuPosition();
            this._isMouseInOpenedItemArea = this._isMouseInOpenedItemAreaCheck(nativeEvent);
        } else {
            this._isMouseInOpenedItemArea = false;
        }
        return this._isMouseInOpenedItemArea;
    }

    private _closeSubMenuByKey(key?: TKey): void {
        if (this._subDropdownItem && this._subDropdownItem.getKey() === key) {
            this.closeSubMenu();
        } else if (this._children.Sticky.isOpened()) {
            this._openSubMenuByKey(undefined, key);
        }
    }

    private _closeSubMenu(needOpenDropDown: boolean = false, closeFromCode: boolean = false): void {
        if (closeFromCode || !this._preventCloseSubMenu) {
            if (this._children.Sticky) {
                this._preventCloseSubMenu = false;
                this._children.Sticky.close();
            }
            if (!needOpenDropDown) {
                this._subDropdownItem = null;
            }
        }
    }

    private _setItemParamsOnHandle(item: Model, nativeEvent: MouseEvent): void {
        this._hoveredItem = item;
        this._enterEvent = nativeEvent;
    }

    private _setSubMenuPosition(): void {
        const clientRect: DOMRect = this._subMenu.getBoundingClientRect();
        this._subMenuPosition = {
            left: clientRect.left,
            top: clientRect.top,
            height: clientRect.height,
        };

        if (this._subMenuPosition.left < this._openSubMenuEvent?.clientX) {
            this._subMenuPosition.left += clientRect.width;
        }
    }

    private _canOpenSubMenu(item: Model): boolean {
        return item.get(this._options.nodeProperty) && !item.get('readOnly');
    }

    private _isTreeControl(): boolean {
        return (
            (this._options.hierarchyViewMode === 'tree' && this._options.subMenuLevel) ||
            this._options.useListRender
        );
    }

    private _toggleExpandedItems(hoveredKey: TKey, expand?: boolean): boolean {
        let result;
        let key = hoveredKey;
        const parentKey = this._listModel
            .getItemBySourceKey(key)
            ?.contents.get?.(this._options.parentProperty);
        if (!expand && parentKey !== this._options.root) {
            // Если запись не из корня, пробуем свернуть родителя
            key = parentKey;
        }
        if (!this._canOpenSubMenu(this._listModel.getItemBySourceKey(key)?.contents)) {
            return;
        }
        const expandedItems = this._expandedItems;
        if ((expand && !expandedItems.includes(key)) || (!expand && expandedItems.includes(key))) {
            this._children.menuRender.toggleExpanded(key);
            result = !expand || expandedItems.includes(key);
        }
        this._updateKeyboardItem(this._listModel.getItemBySourceKey(key));
        return result;
    }

    private _handleCurrentItem(item: Model, target: EventTarget, nativeEvent: MouseEvent): void {
        if (!this._preventCloseSubMenu) {
            const needOpenDropDown: boolean = this._canOpenSubMenu(item);
            const needCloseDropDown: boolean =
                this._subMenu && this._subDropdownItem && this._subDropdownItem !== item;

            // Close the already opened sub menu. Installation of new data sets new size of the container.
            // If you change the size of the update, you will see the container twitch.
            if (needCloseDropDown) {
                this._setSubMenuPosition();
                this._closeSubMenu(needOpenDropDown);
            }

            if (needOpenDropDown) {
                this._openSubMenuEvent = nativeEvent;
                this._subDropdownItem = item;
                this._openSubMenu(target, item);
            }
        }
    }

    private _clearAllowCloseTimout(): void {
        clearTimeout(this._allowCloseTimeout);
    }

    private _clearClosingTimout(): void {
        clearTimeout(this._closingTimer);
    }

    private _startClosingTimout(): void {
        // window для соотвествия типов
        this._closingTimer = setTimeout(this._closeSubMenu.bind(this), SUB_DROPDOWN_DELAY);
    }

    private _clearOpeningTimout(): void {
        clearTimeout(this._openingTimer);
    }

    private _handleItemTimeoutCallback(): void {
        this._isMouseInOpenedItemArea = false;
        this._handleCurrentItem(this._hoveredItem, this._hoveredTarget, this._enterEvent);
    }

    private _startOpeningTimeout(): void {
        this._clearOpeningTimout();
        this._openingTimer = setTimeout((): void => {
            this._handleItemTimeoutCallback();
        }, SUB_DROPDOWN_DELAY);
    }

    private _isMouseInOpenedItemAreaCheck(curMouseEvent: MouseEvent): boolean {
        const firstSegment: number = MenuControl._calculatePointRelativePosition(
            this._openSubMenuEvent?.clientX,
            this._subMenuPosition.left,
            this._openSubMenuEvent?.clientY,
            this._subMenuPosition.top,
            curMouseEvent.clientX,
            curMouseEvent.clientY
        );

        const secondSegment: number = MenuControl._calculatePointRelativePosition(
            this._subMenuPosition.left,
            this._subMenuPosition.left,
            this._subMenuPosition.top,
            this._subMenuPosition.top + this._subMenuPosition.height,
            curMouseEvent.clientX,
            curMouseEvent.clientY
        );

        const thirdSegment: number = MenuControl._calculatePointRelativePosition(
            this._subMenuPosition.left,
            this._openSubMenuEvent?.clientX,
            this._subMenuPosition.top + this._subMenuPosition.height,
            this._openSubMenuEvent?.clientY,
            curMouseEvent.clientX,
            curMouseEvent.clientY
        );

        return (
            Math.sign(firstSegment) === Math.sign(secondSegment) &&
            Math.sign(firstSegment) === Math.sign(thirdSegment)
        );
    }

    private _changeSelection(key: string | number | null): void {
        const markedKey = this._getMarkedKey(this._selectedKeys, this._options);
        const selectedItem = this._listModel.getItemBySourceKey(markedKey);
        if (
            selectedItem &&
            (MenuControl._isFixedItem(selectedItem.getContents(), this._options.source) ||
                this._isSingleSelectionKey(selectedItem.getContents().getKey()))
        ) {
            this._markedKey = undefined;
            this._setMarkerEmptyItem(false, this._options.emptyKey);
        }
        const oldSelectedKeys = [...this._selectedKeys];
        const newSelectedKeys = [...this._selectedKeys];

        if (newSelectedKeys.includes(key)) {
            newSelectedKeys.splice(newSelectedKeys.indexOf(key), 1);
        } else {
            newSelectedKeys.push(key);
            if (this._excludedKeys.includes(key)) {
                this._excludedKeys.splice(this._excludedKeys.indexOf(key), 1);
            }
        }

        const selectedKeysDiff = ArraySimpleValuesUtil.getArrayDifference(
            oldSelectedKeys,
            newSelectedKeys
        );
        const beforeSelectionResult = this._beforeSelectionChanged(null, {
            excludedKeysDifference: {
                keys: [],
                added: [],
                removed: [],
            },
            selectedKeysDifference: {
                keys: newSelectedKeys,
                ...selectedKeysDiff,
            },
        });

        this._selectedKeys = beforeSelectionResult?.selected || newSelectedKeys;
        this._updateSelectionAndNotify(this._selectedKeys, this._excludedKeys, key);
    }

    protected _markedKeyChanged(event, markedKey): void {
        const item = this._listModel.getItemBySourceKey(markedKey);
        const isNode = item?.isNode();
        const isReadOnly = item?.contents?.get('readOnly');
        if (!isNode && !isReadOnly) {
            this._markedKey = markedKey;
        }
    }

    protected _selectedKeysChanged(event, newKeys, added, removed) {
        if (!isEqual(this._selectedKeys, newKeys)) {
            this._selectedKeys = newKeys;
            this._updateSelectionAndNotify(newKeys, this._excludedKeys, added?.[0], removed?.[0]);
        }
    }

    protected _checkBoxClick(): void {
        this._selectionChanged = true;
    }

    protected _excludedKeysChanged(event, newKeys, added, removed) {
        this._excludedKeys = newKeys;
        this._updateSelectionAndNotify(this._selectedKeys, newKeys, added?.[0], removed?.[0]);
    }

    protected _beforeSelectionChanged(event, selectionDifference) {
        if (this._options.beforeSelectionChangedCallback) {
            return this._options.beforeSelectionChangedCallback(selectionDifference);
        }
    }

    protected _expandedItemsChanged(event, expandedItems): void {
        this._expandedItems = expandedItems;
    }

    protected _beforeItemExpand(event, item: Model): void {
        if (this._isAdaptive()) {
            this._rootChanged(event, item.getKey());
        }
    }

    protected _afterItemCollapse(event, item: Model): void {
        this._notifyResizeAfterRender = true;
    }

    private _updateSelectionAndNotify(
        selectedKeys: TKey[],
        excludedKeys: TKey[],
        key: TKey,
        deletedKey: TKey
    ): void {
        const selection = {
            selected: selectedKeys,
            excluded: excludedKeys,
        };
        // При поиске отмеченные ранее записи могут отсутствовать в коллекции,
        // и selectionController не вернет все отмеченные записи, поэтому храним записи на состоянии.
        // toggleSelectedItem сохраняет записи в порядке выбора, чтобы записи вернулись в порядке источника,
        // без поиска зовем метод selectionController'a.
        // selectionController возвращает записи в порядке, в котором они находятся в источнике
        if (this._options.searchParam && this._options.searchValue) {
            this._toggleSelectedItem(this._selectedItems, deletedKey || key);
        } else {
            this._selectedItems = this._getSelectedItemsFromController();
        }

        this._updateEmptyItemMarker(selection);
        if (this._subDropdownItem && this._subMenu) {
            this._openSubMenu(this._hoveredTarget, this._subDropdownItem);
        }
        this._notify('selectionChanged', [selection]);
        this._notifySelectionChanged();
        this._notify('selectedItemsChanged', [this._getSelectedItems()]);
    }

    private _setMarkerEmptyItem(marker: boolean, emptyKey?: string): void {
        if (this._emptyItem) {
            this._emptyItem?.setMarked(marker);
        } else {
            this._listModel.getItemBySourceKey(emptyKey)?.setMarked(marker);
        }
    }

    private _notifySelectionChanged(): void {
        this._notify('selectedKeysChanged', [this._selectedKeys]);
        this._notify('excludedKeysChanged', [this._excludedKeys]);
    }

    private _toggleSelectedItem(selectedItems: Model[], key: TKey): void {
        const selectedIndex = selectedItems.findIndex((item) => {
            return item.getKey() === key;
        });
        if (selectedIndex > -1) {
            selectedItems.splice(selectedIndex, 1);
        } else {
            selectedItems.push(this._listModel.getItemBySourceKey(key).getContents());
        }
    }

    private _updateEmptyItemMarker(selection: ISelectionObject): void {
        const isEmptySelected = this._options.emptyText && !selection.selected.length;
        const isAllItemSelected = this._options.selectedAllText && !selection.selected.length;
        let isFixedItemSelected;
        if (selection.selected.length === 1) {
            const item = this._listModel.getItemBySourceKey(selection.selected[0]);
            if (item) {
                isFixedItemSelected = MenuControl._isFixedItem(
                    item.getContents(),
                    this._options.source
                );
            }
        }
        if (isFixedItemSelected) {
            this._markedKey = selection.selected[0];
        }
        if (isEmptySelected) {
            this._markedKey = this._options.emptyKey;
        } else if (isAllItemSelected) {
            this._markedKey = this._options.selectedAllKey;
        }
        if (isEmptySelected || isAllItemSelected) {
            this._setMarkerEmptyItem(true, this._options.emptyKey);
        } else {
            this._setMarkerEmptyItem(false, this._options.emptyKey);
        }
    }

    private _dataLoadCallback(items: RecordSet, options: IMenuControlOptions): void {
        if (options.dataLoadCallback) {
            options.dataLoadCallback(items);
        }
    }

    private _loadItemTemplateProperty(
        items: RecordSet,
        options: IMenuControlOptions
    ): void | Promise<unknown> {
        if (items && options.itemTemplateProperty) {
            return loadItemsTemplates(items, options.itemTemplateProperty);
        }
    }

    private _setItems(items: RecordSet, options: IMenuControlOptions): void {
        this._dataLoadCallback(items, options);
        this._setStateByItems(items, options);
        this._updateMarkedKey(options);
        this._setSelection(options);
        this._selectedItems = this._getSelectedItemsFromController();
    }

    private _updateItems(items: RecordSet, options: IMenuControlOptions): void {
        this._dataLoadCallback(items, options);
        this._setStateByItems(items, options);
        this._updateMarkedKey(options);
        this._setSelection(options);
    }

    protected _setStateByItems(items: RecordSet, options: IMenuControlOptions): void {
        if (!items.getKeyProperty() && options.keyProperty) {
            items.setKeyProperty(options.keyProperty);
        }
        this._expandedItems = this._getExpandedItems(items, options);
        this._setButtonVisibleState(items, options);
        const viewModeChanged = options.viewMode !== this._options.viewMode;
        if (options.menuMode !== 'selector' || !this._listModel || viewModeChanged) {
            this._createViewModel(items, options);
            if (viewModeChanged && options.viewMode !== this._columns[0].templateOptions.viewMode) {
                this._columns = [...this._columns];
                this._columns[0].templateOptions.viewMode = options.viewMode;
            }
        }
        if (options.focusable && !this._listModel.getHoveredItem()) {
            const item = this._getMarkedItem(options.selectedKeys, options);
            this._updateKeyboardItem(item || this._listModel.getNext(item));
        }
        this._needStickyHistoryItems = this._checkStickyHistoryItems(options);
    }

    private _getMultiSelectVisibility(options: IMenuControlOptions): TVisibility {
        if (options.multiSelect) {
            if (this._isAdaptive(options) || detection.isMobilePlatform) {
                return 'visible';
            } else {
                return 'onhover';
            }
        } else {
            return 'hidden';
        }
    }

    private _getExpandedItems(items: RecordSet, options: IMenuControlOptions): TKey[] {
        let expandedItems = [];
        if (this._needExpandHiddenNode(items, options)) {
            expandedItems = [null];
        } else if (options.openedSubMenuKey) {
            let key = options.openedSubMenuKey;
            while (key !== options.root && key) {
                expandedItems.push(key);
                const item = items.getRecordById(key);
                key = item?.get(options.parentProperty);
            }
        } else if (options.expandedItems) {
            expandedItems = options.expandedItems;
        }
        return expandedItems;
    }

    private _setExpandedItems(expandedItems: TKey[]): void {
        this._expandedItems = expandedItems;
        this._listModel.setExpandedItems?.(this._expandedItems);
    }

    private _needExpandHiddenNode(items: RecordSet, options: IMenuControlOptions): boolean {
        return (
            options.hierarchyViewMode !== 'tree' &&
            options.menuMode !== 'selector' &&
            this._hasHiddenNode(items, options)
        );
    }

    private _hasHiddenNode(
        items: RecordSet,
        { parentProperty, nodeProperty, root }: IMenuControlOptions
    ): boolean {
        let has = false;

        items.forEach((item) => {
            if (!has) {
                has = MenuControl._isHiddenNode(
                    getItemParentKey({ root, parentProperty }, item),
                    items,
                    parentProperty,
                    nodeProperty,
                    root
                );
            }
        });

        return has;
    }

    private _setSelection(options: IMenuControlOptions): void {
        if (options.multiSelect) {
            this._selectedKeys = this._getKeysForSelectionController(options);
            if (options.multiSelectAccessibilityProperty) {
                this._selectionChanged = this._getSelectedItems().some((item) => {
                    return (
                        item.get(options.multiSelectAccessibilityProperty) ===
                        MultiSelectAccessibility.disabled
                    );
                });
            }
        }
    }

    private _updateListModelFilters(newOptions: IMenuControlOptions): void {
        const filters = this._listModel.getFilter();
        if (newOptions.additionalProperty && !this._expander) {
            this._listModel.addFilter(this._additionalFilter);
        } else if (this._needAddLimitHistoryFilter(newOptions)) {
            this._listModel.addFilter(this._limitHistoryFilter);
        } else {
            const index = filters.indexOf(this._limitHistoryFilter);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            this._listModel.setFilter(filters);
        }
    }

    private _setButtonVisibleState(items: RecordSet, options: IMenuControlOptions): void {
        this._moreButtonVisible =
            options.selectorTemplate && this._getSourceController(options).hasMoreData('down');
        this._expandButtonVisible = this._isExpandButtonVisible(items, options);
        if (this._expandButtonVisible && this._visibleIds.length && options.openedSubMenuKey) {
            this._expander = !this._visibleIds.includes(options.openedSubMenuKey);
        }
    }

    private _getTargetItem(item: Model): HTMLElement {
        const dataName = this._options.dataName + '_item_' + item.getKey();
        return this._container.querySelector(`[data-target='${dataName}']`) as HTMLElement;
    }

    private _getMarkedItem(
        selectedKeys: TSelectedKeys,
        options: IMenuControlOptions
    ): CollectionItem<Model> {
        const markedKey = this._getMarkedKey(selectedKeys, options);
        return this._listModel.getItemBySourceKey(markedKey);
    }

    private _getMarkedKey(
        selectedKeys: TSelectedKeys,
        {
            emptyKey,
            selectedAllKey,
            multiSelect,
            selectedAllText,
            emptyText,
            source,
            markedKey,
        }: Partial<IMenuControlOptions>
    ): string | number | undefined {
        let menuMarkedKey = markedKey;
        if (multiSelect) {
            if ((!selectedKeys.length || selectedKeys.includes(emptyKey)) && emptyText) {
                menuMarkedKey = emptyKey;
            } else if (
                (!selectedKeys.length || selectedKeys.includes(selectedAllKey)) &&
                selectedAllText
            ) {
                menuMarkedKey = selectedAllKey;
            } else {
                const item = this._listModel.getItemBySourceKey(selectedKeys[0]);
                if (item && MenuControl._isFixedItem(item.getContents(), source)) {
                    menuMarkedKey = selectedKeys[0];
                }
            }
        } else {
            menuMarkedKey = selectedKeys[0];
        }
        return menuMarkedKey;
    }

    private _getSelectedItems(): Model[] {
        let selectedItems = this._selectedItems;
        if (!selectedItems.length && this._emptyItem) {
            selectedItems = [this._emptyItem.contents];
        }
        return selectedItems;
    }

    private _getSelectedItemsFromController(): Model[] {
        const selectedItems = [];
        const items = this._listModel.getSourceCollection();
        items.forEach((item) => {
            if (this._selectedKeys.includes(item.getKey())) {
                selectedItems.push(item);
            }
        });
        return selectedItems;
    }

    private _expandedItemsFilterCheck(item: CollectionItem<Model>, index: number): boolean {
        return index <= this._itemsCount;
    }

    private _limitHistoryCheck(
        item: Model | Model[],
        index: number,
        collectionItem: TreeGridDataRow
    ): boolean {
        const owner = collectionItem.getOwner();
        let isVisible: boolean = true;
        if (item && item.getKey && !MenuControl._isSpacer(collectionItem)) {
            isVisible = this._visibleIds.includes(item.getKey());
            if (!isVisible && this._expandedItems?.length) {
                isVisible = this._expandedItems.includes(item.get(owner.getParentProperty()));
            }
        } else if (item && item.forEach) {
            isVisible = this._visibleIds.includes(item[0].getKey());
        }
        return isVisible;
    }

    private _isSelectedKeysChanged(newKeys: TSelectedKeys, oldKeys: TSelectedKeys): boolean {
        const diffKeys: TSelectedKeys = factory(newKeys)
            .filter((key) => {
                return !oldKeys.includes(key);
            })
            .value();
        return newKeys.length !== oldKeys.length || !!diffKeys.length;
    }

    protected _checkStickyHistoryItems(options: IMenuControlOptions): boolean {
        let countSticky = 0;
        if (options.allowPin) {
            this._listModel.each((item) => {
                if (item.getContents().get && item.getContents().get('doNotSaveToHistory')) {
                    countSticky++;
                }
            });
        }
        return this._listModel.getCount(true) !== countSticky;
    }

    private _createViewModel(items: RecordSet, options: IMenuControlOptions): void {
        this._listModel = this._getCollection(items, options);
    }

    private _getCollection(
        items: RecordSet<Model>,
        options: IMenuControlOptions
    ): SearchGridCollection<Model> | TreeGridCollection<Model> {
        this._prepareGroups(options, items);
        const collectionConfig: ITreeGridCollectionOptions = {
            collection: items,
            displayProperty: options.displayProperty,
            keyProperty: this._getKeyProperty(options, items),
            nodeProperty: options.nodeProperty,
            parentProperty: options.parentProperty,
            groupProperty: options.groupProperty,
            groupingKeyCallback: options.groupingKeyCallback,
            itemActionsBackgroundStyle: options.hoverBackgroundStyle,
            root: options.root,
            unique: true,
            multiSelectAccessibilityProperty: options.multiSelectAccessibilityProperty || '',
            topPadding: 'null',
            bottomPadding: 'null',
            leftPadding: options.menuMode === 'selector' ? this._leftPadding : 'menu-null',
            itemsSpacing: options.isAdaptive ? null : options.itemsSpacing,
            // для каждого пункта должен быть свой отступ справа
            rightPadding: '',
            multiSelectVisibility: this._multiSelectVisibility,
            multiSelectPosition: 'custom',
            recursiveSelection: false,
            emptyTemplate: options.emptyTemplate,
            multiSelectTemplate,
            columns: this._columns,
            searchNavigationMode: 'readonly',
            searchBreadCrumbsItemTemplate,
            expandedItems: this._expandedItems,
            itemActionsPosition: 'custom',
            roundBorder: {
                tl: 'menu-m',
                tr: 'menu-m',
                bl: 'menu-m',
                br: 'menu-m',
            },
        };
        const isSelectorMode = options.menuMode === 'selector';
        let listModel: SearchGridCollection<Model> | TreeGridCollection<Model>;

        const isSearchModel = !!(options.searchParam && options.searchValue);
        const filters = this._getCollectionFilters(options);
        if (isSearchModel) {
            const searchConfig = {
                ...collectionConfig,
                expandedItems: [null],
                filter: filters,
            };
            if (this._viewMode === 'list') {
                listModel = new Tree(searchConfig);
            } else {
                const searchCollection = loadSync(searchGridCollection);
                listModel = new searchCollection({ ...searchConfig });
            }
        } else {
            if (options.parentProperty) {
                this._checkParentsItems(items, options);
            }

            if (options.viewMode === 'list') {
                listModel = new Tree({
                    ...collectionConfig,
                    // Tree ругается если не заданы nodeProperty и parentProperty
                    nodeProperty: options.nodeProperty || 'node_field',
                    parentProperty: options.parentProperty || 'parent_field',
                    expandedItems: this._expandedItems,
                    expanderIcon: 'hiddenNode',
                    expanderPosition: isSelectorMode ? 'default' : 'custom',
                    filter: filters.length ? filters : null,
                });
            } else if (MenuControl._isTreeViewRender(options)) {
                listModel = new TreeGridCollection({
                    ...collectionConfig,
                    expandedItems: this._expandedItems,
                    expanderIcon: 'hiddenNode',
                    expanderPosition: isSelectorMode ? 'default' : 'custom',
                    filter: filters.length ? filters : null,
                });
            } else {
                listModel = new TreeGridCollection({
                    ...collectionConfig,
                    filter: filters.length ? filters : null,
                });
            }
        }

        if (!options.searchValue && !items.getRecordById(options.emptyKey)) {
            if (options.emptyText) {
                this._addSingleSelectionItem(
                    options.emptyText,
                    options.emptyKey,
                    items,
                    options,
                    listModel
                );
            } else if (options.selectedAllText) {
                this._addSingleSelectionItem(
                    options.selectedAllText,
                    options.selectedAllKey,
                    items,
                    options,
                    listModel
                );
            }
        } else {
            this._emptyItem = null;
        }
        return listModel;
    }

    private _getCollectionFilters(options: IMenuControlOptions): Function[] {
        const filters = [];

        const isSearchModel = !!(options.searchParam && options.searchValue);
        if (isSearchModel) {
            if (options.allowPin && options.parentProperty) {
                filters.push(MenuControl._searchHistoryDisplayFilter.bind(this));
            }
        } else if (options.parentProperty && options.nodeProperty) {
            filters.push(MenuControl._displayFilter.bind(this, options));
        }

        if (options.additionalProperty && !this._expander) {
            filters.push(this._additionalFilter);
        } else if (this._needAddLimitHistoryFilter(options)) {
            filters.push(this._limitHistoryFilter);
        }
        return filters;
    }

    private _needAddLimitHistoryFilter(options: IMenuControlOptions): boolean {
        const isSearchModel = !!(options.searchParam && options.searchValue);
        return (
            !isSearchModel &&
            options.allowPin &&
            ((!options.subMenuLevel && options.menuMode !== 'selector') ||
                (options.menuMode === 'selector' && !options.root)) &&
            !this._expander &&
            this._expandButtonVisible
        );
    }

    private _getLeftPadding(options: IMenuControlOptions): string {
        let leftSpacing = options.multiSelect || options.markerVisibility !== 'hidden' ? 's' : 'm';
        if (this._isAdaptive(options)) {
            leftSpacing = `menu-adaptive-${leftSpacing}`;
        }
        if (options.itemPadding.left) {
            leftSpacing = options.itemPadding.left;
        }
        return leftSpacing;
    }

    private _addSingleSelectionItem(
        itemText: string,
        key: TKey,
        items: RecordSet,
        options: IMenuControlOptions,
        listModel: Collection
    ): void {
        const emptyItem = this._getSingleSelectionItem(itemText, key, items, options);
        const emptyConfig = {
            contents: emptyItem,
            owner: listModel,
            columns: this._columns,
            columnsConfig: this._columns,
            expanderPosition: options.menuMode === 'selector' ? 'default' : 'custom',
            parent: listModel?.getRoot(),
        };
        if (options.viewMode === 'list') {
            this._emptyItem = new TreeItem({
                ...emptyConfig,
            });
        } else {
            this._emptyItem = new TreeGridDataRow({
                ...emptyConfig,
            });
        }
    }

    private _getSingleSelectionItem(
        itemText: string,
        key: TKey,
        items: RecordSet,
        options: IMenuControlOptions
    ): Model {
        const keyProperty = this._getKeyProperty(options, items);
        const emptyItem = this._getItemModel(items, keyProperty);

        const data = {};
        data[keyProperty] = key;
        data[options.displayProperty] = itemText;

        if (options.parentProperty) {
            data[options.parentProperty] = options.root;
        }
        if (options.nodeProperty) {
            data[options.nodeProperty] = null;
        }
        for (const field in data) {
            if (data.hasOwnProperty(field)) {
                const fieldValue = data[field];
                this._addField(field, emptyItem, emptyItem.getFormat(), fieldValue);

                if (emptyItem.get(field) !== fieldValue) {
                    emptyItem.set(field, fieldValue);
                }
            }
        }
        return emptyItem;
    }

    private _getItemModel(items: RecordSet, keyProperty: string): Model {
        const model = items.getModel();
        const modelConfig = {
            keyProperty,
            format: items.getFormat(),
            adapter: items.getAdapter(),
        };
        if (typeof model === 'string') {
            return this._createModel(model, modelConfig);
        } else {
            return new model(modelConfig);
        }
    }

    private _createModel(model: string, config: object): Model {
        return DiCreate(model, config);
    }

    private _getSourceController(options: IMenuControlOptions): SourceController {
        const {
            source,
            navigation,
            keyProperty,
            filter,
            sourceController,
            root,
            parentProperty,
            nodeProperty,
            viewMode,
            dataLoadCallback,
        } = options;
        if (!this._sourceController) {
            const isList = viewMode === 'list';
            this._sourceController =
                sourceController ||
                new SourceController({
                    source,
                    filter,
                    navigation,
                    keyProperty: this._getKeyProperty(options),
                    root,
                    parentProperty: parentProperty || (isList ? 'parent_field' : parentProperty),
                    nodeProperty: nodeProperty || (isList ? 'node_field' : nodeProperty),
                });
            this._sourceController.subscribe('itemsChanged', this._itemsChangedCallback);
            this._sourceController.setDataLoadCallback(dataLoadCallback);
        }
        return this._sourceController;
    }

    private _itemsChangedCallback(): void {
        if (this._listModel) {
            const items = this._sourceController.getItems();
            this._setButtonVisibleState(items, this._options);
            this._listModel.setCollection(items);
            this._updateMarkedKey(this._options);
            this._setSelection(this._options);
        }
    }

    private _loadAndSetItems(options: IMenuControlOptions): Promise<RecordSet | void> {
        return this._loadItems(options).then(
            (items) => {
                const itemTemplatesPromise = this._loadItemTemplateProperty(items, options);
                this._setItems(items, options);
                this._initHistoryControllerIfNeed(options);
                if (itemTemplatesPromise) {
                    return itemTemplatesPromise.then(() => {
                        return items;
                    });
                }
                return items;
            },
            (error) => {
                return error;
            }
        );
    }

    private _loadItems(options: IMenuControlOptions): Promise<RecordSet | void> {
        const sourceController = this._getSourceController(options);
        let filter;
        if (options.historyId && options.hasHistory) {
            filter = { ...sourceController.getFilter() };
            filter.$_history = true;
            filter[options.parentProperty] = options.root;
        }

        return sourceController.load(void 0, options.root, filter).catch((error: Error) => {
            return this._processError(error);
        });
    }

    private _isExpandButtonVisible(items: RecordSet, options: IMenuControlOptions): boolean {
        let hasAdditional: boolean = false;

        if (options.additionalProperty) {
            items.each((item: Model): void => {
                if (!hasAdditional) {
                    hasAdditional = MenuControl._isAddItem(options, item);
                }
            });
        } else if (this._needCheckVisibleItems(options)) {
            this._visibleIds = [];
            const fixedIds = [];
            factory(items).each((item) => {
                if (MenuControl._isItemCurrentRoot(item, options)) {
                    if (item.get('doNotSaveToHistory')) {
                        fixedIds.push(item.getKey());
                    } else {
                        this._visibleIds.push(item.getKey());
                    }
                }
            });
            hasAdditional = this._visibleIds.length > options.maxHistoryVisibleItems + 1;
            if (hasAdditional) {
                this._visibleIds.splice(options.maxHistoryVisibleItems);
            }

            fixedIds.forEach((fixedId) => {
                if (!this._visibleIds.includes(fixedId)) {
                    this._visibleIds.push(fixedId);
                }
            });
        }
        return hasAdditional;
    }

    private _needCheckVisibleItems(options: IMenuControlOptions): boolean {
        const isSearch = options.searchParam && options.searchValue;
        const isSelectorMode = options.menuMode === 'selector';
        return (
            !isSearch &&
            options.allowPin &&
            ((isSelectorMode && !options.root) || (!isSelectorMode && !options.subMenuLevel))
        );
    }

    private _getItemForOpen(key: TKey): Model {
        let item = this._listModel.getItemBySourceKey(key);
        if (!item) {
            // Если item'a нет в текущей модели, ищем родителя из этого меню
            const parentKey = this._getParentKey(key);
            item = this._listModel.getItemBySourceKey(parentKey);
        }
        return item?.getContents();
    }

    private _openSubMenuByKey(popupOptions?: IStickyPopupOptions, key?: TKey): void {
        const item = this._getItemForOpen(key);
        if (item && this._canOpenSubMenu(item)) {
            const target = this._getTargetItem(item);
            this._preventCloseSubMenu = true;
            this._openSubMenuEvent = null;
            this._subDropdownItem = item;
            this._openedTarget = target;
            const subMenuOptions = this._listModel.getItemBySourceKey(key) ? popupOptions : null;
            this._openSubMenu(target, item, subMenuOptions);
        }
    }

    private _getParentKey(key: TKey): TKey {
        const items = this._listModel.getSourceCollection();
        let parentKey;
        let curKey = key;
        while (!parentKey) {
            const item = items.getRecordById(curKey);
            const parent = item?.get(this._options.parentProperty) ?? this._options.root;
            if (item && this._listModel.getItemBySourceKey(parent)) {
                parentKey = parent;
            } else {
                curKey = parent;
            }
            if (parent === null) {
                return;
            }
        }
        return parentKey;
    }

    private _openSubMenu(
        target: EventTarget,
        item: Model,
        menuPopupOptions?: IStickyPopupOptions
    ): void | Promise<void> {
        // openSubMenu is called by debounce and a function call can occur when the control is destroyed,
        // just check _children to make sure, that the control isn't destroyed
        if (item && this._children.Sticky && this._subDropdownItem) {
            return this._getPopupOptions(target, item, menuPopupOptions).then((popupOptions) => {
                this._notify(
                    'beforeSubMenuOpen',
                    [popupOptions, this._options.subMenuDirection, this._options.itemAlign],
                    // menu:Control могут положить в пункт меню, чтобы событие долетело до menu:Popup
                    { bubbling: true }
                );
                this._children.Sticky.open(popupOptions);
            });
        }
    }

    private _getPopupOptions(
        target: EventTarget,
        item: Model,
        popupOptions?: IStickyPopupOptions
    ): Promise<object> {
        this._openedTarget = target;
        const subMenuDirection = this._options.subMenuDirection;
        const direction = this._subMenuPopupPosition?.direction || {
            vertical: 'bottom',
            horizontal: this._options.itemAlign,
        };
        let targetPoint;
        if (subMenuDirection === 'bottom') {
            targetPoint = {
                vertical: 'bottom',
                horizontal: 'center',
            };
        } else if (this._subMenuPopupPosition?.targetPoint) {
            targetPoint = this._subMenuPopupPosition?.targetPoint;
        } else {
            targetPoint = {
                vertical: direction?.vertical === 'top' ? 'bottom' : 'top',
                horizontal: direction?.horizontal || this._options.itemAlign,
            };
        }

        let className = `controls-Menu__subMenu controls_popupTemplate_theme-${this._options.theme}`;
        if (subMenuDirection !== 'bottom') {
            className += ` controls-Menu__subMenu_marginTop${
                direction?.vertical !== 'bottom' ? '-revert' : ''
            }`;
        }

        const getOptions = (templateOptions) => {
            const config = {
                animation: false,
                adaptiveOptions: {
                    modal: true,
                },
                templateOptions,
                target,
                autofocus: this._options.focusable,
                direction,
                targetPoint,
                calmTimer: this._options.calmTimer,
                backgroundStyle: this._options.backgroundStyle,
                trigger: this._options.trigger,
                className,
                opener: this,
                indicatorConfig: { overlay: 'none' },
                fittingMode: this._subMenuPopupPosition?.fittingMode,
            };
            return merge(config, popupOptions);
        };

        if (this._subMenuTemplateOptions && this._subMenuTemplateOptions.root === item.getKey()) {
            return Promise.resolve(getOptions(this._subMenuTemplateOptions));
        }
        return this._getTemplateOptions(item).then((templateOptions) => {
            this._subMenuTemplateOptions = templateOptions;
            return getOptions(this._subMenuTemplateOptions);
        });
    }

    private _getTemplateOptions(item: Model): Promise<IMenuControlOptions> {
        const root: TKey = item.getKey();
        const allowAdaptive = this._isAdaptive();
        const headingCaption = allowAdaptive
            ? item.get(this._options.displayProperty)
            : item.get(this._options.headingCaptionProperty);
        const historyId = this._historyController?.getHistoryId();
        const isLoadedChildItems = this._isLoadedChildItems(root);
        const sourcePropertyConfig = item.get(this._options.sourceProperty);
        const dataLoadCallback =
            !isLoadedChildItems && !sourcePropertyConfig
                ? this._subMenuDataLoadCallback.bind(this)
                : null;
        const selection = {
            selected: this._selectedKeys,
            excluded: this._excludedKeys,
        };
        const selectedKeys = this._options.multiSelect
            ? selection?.selected
            : this._options.selectedKeys;
        const excludedKeys = this._options.multiSelect
            ? selection?.excluded
            : this._options.excludedKeys;
        const subMenuTemplate = item.get('subMenuTemplate');
        const promises = [];
        if (!(isLoadedChildItems && this._options.items && !this._options.source)) {
            promises.push(
                this._getSourceSubMenu(root, isLoadedChildItems, sourcePropertyConfig, historyId)
            );
        } else {
            promises.push(this._options.source);
        }
        if (typeof subMenuTemplate === 'string') {
            promises.push(loadAsync(subMenuTemplate));
        }
        return Promise.all(promises).then(([source]) => {
            const subMenuOptions: object = {
                root: sourcePropertyConfig ? null : root,
                dataLoadCallback,
                headingCaption,
                focusable: this._preventCloseSubMenu,
                footerContentTemplate: this._options.nodeFooterTemplate,
                footerItemData: {
                    key: root,
                    item,
                },
                sourceController: null,
                closeButtonVisibility: !!allowAdaptive,
                historyId,
                historyRoot: this._historyController?.getRoot() || null,
                emptyText: null,
                selectedAllText: null,
                showClose: false,
                showHeader: !!headingCaption,
                headerTemplate: undefined,
                headerContentTemplate: null,
                showMoreRightTemplate: null,
                searchParam: null,
                itemPadding: undefined,
                draggable: false,
                source,
                selectedKeys,
                excludedKeys,
                ...item.get('menuOptions'),
                subMenuTemplate,
                subMenuTemplateOptions: {
                    ...item.get('subMenuTemplateOptions'),
                    ...item.get('menuOptions'),
                },
                applyButtonVisibility: this._options.multiSelect ? 'hidden' : undefined,
                items: isLoadedChildItems ? this._options.items : null,
                subMenuLevel: this._options.subMenuLevel + 1,
                iWantBeWS3: false, // FIXME https://online.sbis.ru/opendoc.html?guid=9bd2e071-8306-4808-93a7-0e59829a317a
            };

            return { ...this._options, ...subMenuOptions };
        });
    }

    private _getPrefetchProxy(root: TKey, source: IMenuControlOptions['source']) {
        if (!this._subMenuSourceCache.has(root)) {
            this._subMenuSourceCache.set(
                root,
                new PrefetchProxy({
                    target: source,
                    data: {
                        query: this._listModel.getSourceCollection(),
                    },
                })
            );
        }

        return this._subMenuSourceCache.get(root);
    }

    private _getSourceSubMenu(
        root: TKey,
        isLoadedChildItems: boolean,
        sourcePropertyConfig: ISourcePropertyConfig | ICrudPlus,
        historyId?: string
    ): Promise<ICrudPlus | HistorySource> {
        let source;
        if (this._options.sourceController) {
            source = this._options.sourceController.getSource();
        } else {
            source = this._options.source;
        }
        let targetSource = source;
        const targetIsHistorySource = this._options.source instanceof HistorySource;

        if (isLoadedChildItems) {
            targetSource = this._getPrefetchProxy(root, source);
        } else if (sourcePropertyConfig) {
            targetSource = this._createMenuSource(sourcePropertyConfig);
        } else if (this._historyController && this._options.hierarchyViewMode !== 'tree') {
            targetSource = this._sourceController.getSource();
        }

        if (historyId) {
            if (
                (targetIsHistorySource && this._options.source.getHistoryId() !== historyId) ||
                !targetIsHistorySource
            ) {
                targetSource = dropdownHistoryUtils.getSource(targetSource, this._options);
            }
        }

        return Promise.resolve(targetSource);
    }

    private _createMenuSource(source: ISourcePropertyConfig | ICrudPlus): Promise<ICrudPlus> {
        if (
            cInstance.instanceOfModule(source, 'Types/_source/ICrud') ||
            cInstance.instanceOfMixin(source, 'Types/_source/ICrud')
        ) {
            return Promise.resolve(source as ICrudPlus);
        } else {
            const sourceConfig = source as ISourcePropertyConfig;
            return loadAsync(sourceConfig.moduleName).then((module) => {
                return new module(sourceConfig.options);
            });
        }
    }

    private _isLoadedChildItems(root: TKey): boolean {
        let isLoaded = false;
        const collection = this._listModel.getSourceCollection() as unknown as RecordSet<Model>;

        if (collection.getIndexByValue(this._options.parentProperty, root) !== -1) {
            isLoaded = true;
        }
        return isLoaded;
    }

    protected _prepareGroups(options, items): void {
        if (options.groupProperty) {
            items.setEventRaising(false, false);
            items.forEach((item) => {
                this._setGroupKey(options, item);
            });
            items.setEventRaising(true, false);
        }
    }

    protected _setGroupKey(options, item): void {
        const groupKey: string = item.get(options.groupProperty);
        const isHistoryItem: boolean =
            MenuControl._isHistoryItem(item) && !this._options.subMenuLevel;

        if (groupKey === undefined || groupKey === null || isHistoryItem) {
            let newGroupProperty = constView.hiddenGroup;
            if (options.parentProperty) {
                // Если родительская запись имеет группировку, установим ее и для дочерней, чтобы не появлялся лишний разделитель
                let parent = item.get(options.parentProperty);
                let parentGroup = null;
                while (!parentGroup && parent) {
                    const parentItem = this._listModel?.getSourceItemByKey(parent);
                    parentGroup = parentItem?.get(options.groupProperty);
                    parent = parentItem?.get(options.parentProperty);
                }
                if (parentGroup) {
                    newGroupProperty = parentGroup;
                }
            }
            try {
                item.set(options.groupProperty, newGroupProperty);
            } catch (e) {
                Logger.error(
                    `Для элемента меню с идентификатором ${item.getKey()} в формате не задано значение поля ${
                        options.groupProperty
                    }, указанного в качестве groupProperty`,
                    this
                );
            }
        }
    }

    private _isLocalSource(source): boolean {
        if (source instanceof PrefetchProxy) {
            return cInstance.instanceOfModule(source.getOriginal(), 'Types/source:Local');
        }
        return cInstance.instanceOfModule(source, 'Types/source:Local');
    }

    private _subMenuDataLoadCallback(items: RecordSet): void {
        if (this._listModel) {
            this._prepareFormat(items);
            this._prepareGroups(this._options, items);

            if (!this._hasEqualGroupIds(items) && !this._isLocalSource(this._options.source)) {
                this._listModel.getSourceCollection().append(items);
                const filters = this._listModel.getFilter();
                this._listModel.setFilter([]);
                this._listModel.setFilter(filters);
            }
        }
    }

    private _prepareFormat(items: RecordSet): void {
        const collection = this._listModel.getSourceCollection();
        items.getFormat().forEach((field) => {
            const name = field.getName();
            this._addField(name, collection, collection.getFormat());
        });
    }

    private _hasEqualGroupIds(items: RecordSet): boolean {
        const { groupProperty } = this._options;
        let hasEqualGroupIds = false;

        if (groupProperty) {
            const collection = this._listModel.getSourceCollection();

            // Коллекция сходит с ума, если в RecordSet'e оказываются элементы с одинаковым идентификатором группы
            // даже если они лежат в разных папках
            items.each((item) => {
                if (!hasEqualGroupIds && item.get(groupProperty) !== constView.hiddenGroup) {
                    hasEqualGroupIds =
                        collection.getIndexByValue(groupProperty, item.get(groupProperty)) !== -1;
                }
            });
        }

        return hasEqualGroupIds;
    }

    private _addField(
        name: string,
        items: RecordSet | Model,
        RSFormat: format.Format,
        defaultValue?: unknown
    ): void {
        if (RSFormat.getFieldIndex(name) === -1) {
            items.addField({
                name,
                type: 'string',
                defaultValue,
            });
        }
    }

    private _setItemActions(options: IMenuControlOptions): void {
        let itemActions: IItemAction[] = options.itemActions;

        if (options.allowPin) {
            itemActions = this._getItemActionsWithPin(itemActions);
        }

        if (!itemActions && !options.itemActionsProperty) {
            return;
        }

        if (!this._itemActions) {
            this._itemActions = itemActions;
        }
    }

    private _getItemActionsWithPin(itemActions: IItemAction[] = []): IItemAction[] {
        let showType = TItemActionShowType.TOOLBAR;
        let iconSize;
        itemActions.forEach((item) => {
            if (item.showType === TItemActionShowType.MENU) {
                showType = TItemActionShowType.MENU;
            }
            if (item.iconSize) {
                iconSize = item.iconSize;
            }
        });
        if (!iconSize) {
            iconSize = itemActions.length && showType === TItemActionShowType.MENU ? 'm' : 's';
        }
        const baseConfig = {
            showType,
            iconStyle: 'unaccented',
            iconSize,
            handler: (item) => {
                return this._pinClick(item);
            },
        } as IItemAction;
        const historyActions = [
            {
                ...baseConfig,
                id: 'pin',
                icon: 'icon-PinNull',
                tooltip: rk('Закрепить'),
                title: rk('Закрепить'),
            },
            {
                ...baseConfig,
                id: 'unpin',
                icon: 'icon-PinOff',
                tooltip: rk('Открепить'),
                title: rk('Открепить'),
            },
        ];
        return historyActions.concat(itemActions);
    }

    private _itemActionsVisibility(
        options: IMenuControlOptions,
        action: IItemAction,
        item: Model,
        isEditing: boolean
    ): boolean {
        const isPinned = item.get('pinned');
        if (action.id === 'pin' || action.id === 'unpin') {
            const hasPin = hasPinIcon(options, item);
            if (action.id === 'pin') {
                return hasPin && !isPinned;
            } else {
                return hasPin && isPinned;
            }
        } else if (options.itemActionVisibilityCallback) {
            return options.itemActionVisibilityCallback(action, item, isEditing);
        }
        return true;
    }

    private _validateOptions(options: IMenuControlOptions): void {
        if (options.multiSelect && options.nodeProperty) {
            if (options.emptyText && options.emptyKey === null) {
                Logger.error(
                    'Для меню с множественным выбором и иерархией' +
                        ' необходимо задать опцию emptyKey отличную от null',
                    this
                );
            } else if (options.selectedAllText && options.selectedAllKey === null) {
                Logger.error(
                    'Для меню с множественным выбором и иерархией' +
                        ' необходимо задать опцию selectedAllKey отличную от null',
                    this
                );
            }
        }
        if (options.groupingKeyCallback) {
            Logger.warn(
                'В меню используется устаревшая опция "groupingKeyCallback", нужно использовать опцию "groupProperty".',
                this
            );
        }
    }

    private _checkParentsItems(
        items: RecordSet,
        { parentProperty, root, subMenuLevel }: IMenuControlOptions
    ): void {
        if (!subMenuLevel) {
            items.forEach((item) => {
                if (
                    !item.hasOwnProperty(parentProperty) &&
                    item.get(parentProperty) === undefined
                ) {
                    Logger.warn(
                        `Для элемента меню с идентификатором ${item.getKey()} не задано значение parentProperty`,
                        this
                    );
                    try {
                        item.set(parentProperty, root);
                    } catch (e) {
                        Logger.error(
                            `Для элемента меню с идентификатором ${item.getKey()} в формате не задано значение поля ${parentProperty}, указанного в качестве parentProperty`,
                            this
                        );
                    }
                }
            });
        }
    }

    private _processError(error: Error): Promise<ErrorViewConfig | void> {
        if (this._options.dataLoadErrback) {
            this._options.dataLoadErrback(error);
        }
        return this._getErrorController()
            .process({
                error,
                theme: this._options.theme,
                mode: ErrorViewMode.include,
            })
            .then((errorConfig: ErrorViewConfig | void): ErrorViewConfig | void => {
                if (errorConfig) {
                    errorConfig.options.size = 'medium';
                }
                this._showError(errorConfig);
                return errorConfig;
            });
    }

    private _showError(error: ErrorViewConfig | void): void {
        this._errorConfig = error;
    }

    private _getErrorController(): ErrorController {
        if (!this._errorController) {
            this._errorController = new ErrorController({});
        }
        return this._errorController;
    }

    static defaultProps: object = {
        displayProperty: 'title',
        selectedKeys: [],
        root: null,
        emptyKey: null,
        selectedAllKey: null,
        moreButtonCaption: rk('Еще') + '...',
        groupTemplate,
        itemPadding: {},
        markerVisibility: 'hidden',
        hoverBackgroundStyle: 'default',
        historyRoot: null,
        subMenuDirection: 'right',
        itemAlign: 'right',
        subMenuLevel: 0,
        maxHistoryVisibleItems: 10,
        focusable: false,
        dataName: 'menu',
        selectionType: 'all',
        itemsSpacing: 'xs',
        fontColorStyle: 'default',
    };

    private static _isTreeViewRender(options: IMenuControlOptions): boolean {
        return !!options.parentProperty;
    }

    private static _isPinIcon(target: EventTarget): boolean {
        return !!(target as HTMLElement)?.closest('.controls-Menu__iconPin');
    }

    private static _isRightTemplateClick(target: EventTarget): boolean {
        return !!(target as HTMLElement)?.closest('.controls-Menu__row__rightTemplate_wrapper');
    }

    private static _calculatePointRelativePosition(
        firstSegmentPointX: number,
        secondSegmentPointX: number,
        firstSegmentPointY: number,
        secondSegmentPointY: number,
        curPointX: number,
        curPointY: number
    ): number {
        return (
            (firstSegmentPointX - curPointX) * (secondSegmentPointY - firstSegmentPointY) -
            (secondSegmentPointX - firstSegmentPointX) * (firstSegmentPointY - curPointY)
        );
    }

    private static _isHistoryItem(item: Model): boolean {
        return !!(item.get('pinned') || item.get('recent') || item.get('frequent'));
    }

    private static _isFixedItem(item: Model, source?: ICrudPlus): boolean {
        return (
            item.has && (!item.has('HistoryId') || !isHistorySource(source)) && item.get('pinned')
        );
    }

    private static _isAddItem(options: IMenuControlOptions, item: Model): boolean {
        const isSelected = options.selectedKeys?.includes(item.getKey());
        const isHistoryItem = MenuControl._isHistoryItem(item);
        const isCurrentRoot = getItemParentKey(options, item) === options.root;
        return (
            item.get?.(options.additionalProperty) && !isSelected && !isHistoryItem && isCurrentRoot
        );
    }

    private static _additionalFilterCheck(
        options: IMenuControlOptions,
        item: Model,
        index,
        collectionItem: TreeGridDataRow
    ): boolean {
        let isVisible = true;
        if (item?.get) {
            if (!MenuControl._isSpacer(collectionItem)) {
                isVisible = !MenuControl._isAddItem(options, item);
            }
        } else if (collectionItem['[Controls/_display/GroupItem]']) {
            const model = collectionItem.getOwner();
            const groupItems = model.getGroupItems(item);
            isVisible = groupItems.some((groupItem) => {
                return (
                    !MenuControl._isSpacer(groupItem) &&
                    !MenuControl._isAddItem(options, groupItem.contents)
                );
            });
        }
        return isVisible;
    }

    private static _pinnedFilter(item: Model): boolean {
        return item.get('pinned');
    }

    private static _isSpacer(treeItem): boolean {
        return (
            treeItem['[Controls/_display/SpaceCollectionItem]'] ||
            treeItem['[Controls/treeGrid:TreeGridSpaceRow]']
        );
    }

    private static _displayFilter(
        options,
        item: Model,
        index: number,
        treeItem: TreeItem
    ): boolean {
        if (!index) {
            this._groupSet = new Set();
            this._spacerSet = new Set();
        }
        const model = treeItem.getOwner();
        const root = model.getRoot().contents;
        const parentProperty = model.getParentProperty();
        const nodeProperty = model.getNodeProperty();
        const items = model.getSourceCollection();

        const isVisibleItem = (itemToCheck) => {
            return MenuControl._isVisibleItem(itemToCheck, items, {
                root,
                parentProperty,
                nodeProperty,
                hierarchyViewMode: options.hierarchyViewMode,
                menuMode: options.menuMode,
                subMenuLevel: options.subMenuLevel,
            });
        };

        let isVisible: boolean = true;
        if (MenuControl._isSpacer(treeItem)) {
            isVisible = !this._spacerSet?.has(item.getKey());
            if (isVisible) {
                this._spacerSet?.add(item.getKey());
            }
        } else if (item && item.get) {
            isVisible = isVisibleItem(item);
        } else if (treeItem['[Controls/_display/GroupItem]']) {
            const groupItems = model.getGroupItems(treeItem.contents);
            isVisible =
                !this._groupSet.has(item) &&
                groupItems?.some(
                    (item) => !MenuControl._isSpacer(item) && isVisibleItem(item.contents)
                ) &&
                isGroupVisible(treeItem, options.emptyItem);
            if (isVisible) {
                this._groupSet.add(item);
            }
        }
        return isVisible;
    }

    private static _isVisibleItem(
        item: Model,
        items: RecordSet,
        {
            root,
            parentProperty,
            nodeProperty,
            hierarchyViewMode,
            menuMode,
            subMenuLevel,
        }: Partial<IMenuControlOptions>
    ): boolean {
        const parent = getItemParentKey({ root, parentProperty }, item);
        return (
            parent === root ||
            MenuControl._isHiddenNode(parent, items, parentProperty, nodeProperty, root) ||
            (subMenuLevel && hierarchyViewMode === 'tree') ||
            menuMode === 'selector'
        );
    }

    private static _isHiddenNode(
        key: TKey,
        items: RecordSet<Model>,
        parentProperty: string,
        nodeProperty: string,
        root: TKey
    ): boolean {
        const parentItem = items.getRecordById(key);
        return (
            parentItem &&
            (!nodeProperty || parentItem.get(nodeProperty) === false) &&
            MenuControl._isVisibleItem(parentItem, items, {
                root,
                parentProperty,
                nodeProperty,
            })
        );
    }

    private static _searchHistoryDisplayFilter(item: Model, index, treeItem): boolean {
        let result = true;
        const model = treeItem.getOwner();
        const parentProperty = model.getParentProperty();
        const items = model.getSourceCollection();
        if (item && item.get && MenuControl._isHistoryItem(item) && item.get(parentProperty)) {
            const historyKey = item.getKey() + '_history';
            const historyItem = items.getRecordById(historyKey);
            result = !historyItem;
        }
        return result;
    }

    private static _isItemCurrentRoot(item: Model, options: IMenuControlOptions): boolean {
        const parent = getItemParentKey(options, item);
        return parent === options.root || (!parent && options.root === null);
    }
}
/**
 * @name Controls/_menu/Control#multiSelect
 * @cfg {Boolean} Видимость чекбоксов в меню.
 * @default false
 * @demo Controls-demo/Menu/Control/MultiSelect/Index
 * @example
 * Множественный выбор установлен.
 * <pre class="brush: html; highlight: [7]">
 * <!-- WML -->
 * <Controls.menu:Control
 *    selectedKeys="{{_selectedKeys}}"
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
 * this._selectedKeys = [1, 3];
 * </pre>
 */

/**
 * @name Controls/_menu/Control#emptyText
 * @cfg {String} Добавляет пустой элемент в список с заданным текстом.
 * Ключ пустого элемента по умолчанию null, для изменения значения ключа используйте {@link emptyKey}.
 * @demo Controls-demo/Menu/Control/EmptyText/Index
 */

/**
 * @name Controls/_menu/Control#emptyKey
 * @cfg {String} Первичный ключ для пункта выпадающего списка, который создаётся при установке опции {@link emptyText}.
 * @default null
 * @demo Controls-demo/Menu/Control/EmptyText/EmptyKey/Index
 */

/**
 * @name Controls/_menu/Control#selectedAllText
 * @cfg {String} Добавляет обобщающий элемент в список с заданным текстом.
 * Под обобщающим значением понимается элемент меню, клик по которому выбирает все элементы списка.
 * @remark Ключ обобщающего элемента по умолчанию null, для изменения значения ключа используйте {@link selectedAllKey}.
 * @example
 *  <pre class="brush: html">
 *    <Controls.menu:Control
 *          keyProperty="id"
 *          displayProperty="title"
 *          source="{{_source}}"
 *          selectedAllText="Все записи"/>
 * </pre>
 */

/**
 * @name Controls/_menu/Control#selectedAllKey
 * @cfg {String} Первичный ключ для пункта выпадающего списка, который создаётся при установке опции {@link selectedAllText}.
 * @default null
 * @example
 *  <pre class="brush: html">
 *    <Controls.menu:Control
 *          keyProperty="id"
 *          displayProperty="title"
 *          source="{{_source}}"
 *          selectedAllText="Все записи"
 *          selectedAllKey="all" />
 * </pre>
 */

/**
 * @name Controls/_menu/Control#root
 * @cfg {Number|String|null} Идентификатор корневого узла.
 * @demo Controls-demo/Menu/Control/Root/Index
 */

/**
 * @name Controls/_menu/Control#viewMode
 * @cfg {String} Режим отображения меню.
 * @variant search Поиск.
 * @variant list Плоский список.
 */

/**
 * @name Controls/_menu/Control#markerVisibility
 * @cfg {Controls/_marker/interface/IMarkerList/TVisibility} Режим отображения маркера.
 * @default hidden
 * @demo Controls-demo/Menu/Control/SelectedKeys/Simple/Index В примере опция markerVisibility установлена в значение "hidden" и "visible".
 */

/**
 * @name Controls/_menu/Control#beforeSelectionChangedCallback
 * @cfg {Function} Происходит до изменения {@link selectedKeys списка выбранных элементов}.
 * В аргументы приходит параметр selectionDiff - изменение в списке выбранных элементов по сравнению с текущим выбором {@link Controls/multiselection:ISelectionDifference}.
 * Из обработчика события можно вернуть новый список выбранных элементов или промис с ними {@link Controls/interface:ISelectionObject}.
 * @demo Controls-demo/dropdown_new/Input/MultiSelect/BeforeSelectionChangedCallback/Index
 * @example
 * Если в меню ничего не выбрано, из обработчика вернется selection с выбранной первой записью.
 * <pre class="brush: html; highlight: [7]">
 * <!-- WML -->
 * <Controls.menu:Control
 *    beforeSelectionChangedCallback="{{_beforeSelectionChangedCallback}}"
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
 * @name Controls/_menu/Control#hasHistory
 * @cfg {Boolean} Определяет строить ли меню с историей. Для правильной работы опции в качестве {@link source источника} должен быть задан {@link Controls/history:Source}
 * и должна быть задана опция {@link historyId}.
 * @see historyId
 */

/**
 * @name Controls/_menu/Control#historyId
 * @cfg {String} Уникальный идентификатор истории. Для правильной работы опции в качестве {@link source источника} должен быть задан {@link Controls/history:Source}
 * и должна быть задана опция {@link hasHistory}.
 * @see hasHistory
 */

/**
 * @name Controls/_menu/Control#allowPin
 * @cfg {boolean} Определяет разрешить ли запинивание записей. Для правильной работы опции в качестве {@link source источника} должен быть задан {@link Controls/history:Source}
 * и должна быть задана опция {@link hasHistory} и {@link historyId}.
 * @see hasHistory
 * @see historyId
 */

/**
 * @name Controls/_menu/Control#selectedItemsChanged
 * @event Происходит при изменении набора выбранных элементов.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/collection:RecordSet} items Выбранные элементы.
 */

/**
 * @name Controls/_menu/Control#itemClick
 * @event Происходит при выборе элемента.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Types/entity:Model} item Выбранный элемент.
 * @remark Из обработчика события можно возвращать результат обработки. Если результат будет равен false, подменю не закроется.
 * По умолчанию, когда выбран пункт с иерархией, подменю закрывается.
 * @example
 * В следующем примере показано, как незакрывать подменю, если кликнули на пункт с иерархией.
 * <pre class="brush: html; highlight: [6]">
 * <!-- WML -->
 * <Controls.menu:Control
 *    displayProperty="title"
 *    keyProperty="key"
 *    source="{{_source}}"
 *    on:itemClick="_itemClickHandler()" />
 * </pre>
 * <pre  class="brush: js;">
 * // TypeScript
 * protected _itemClickHandler(e, item): boolean {
 *     if (item.get(nodeProperty)) {
 *         return false;
 *     }
 * }
 * </pre>
 */
