/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import rk = require('i18n!Controls');
import { constants } from 'Env/Env';
import { Control, TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { TSelectedKeys, IOptions, ISelectionObject } from 'Controls/interface';
import {
    default as IMenuControl,
    IMenuControlOptions,
} from 'Controls/_menu/interface/IMenuControl';
import { RecordSet, List, format } from 'Types/collection';
import { dropdownHistoryUtils } from 'Controls/dropdown';
import { ICrudPlus, PrefetchProxy, CrudEntityKey } from 'Types/source';
import { Collection, CollectionItem, MultiSelectAccessibility } from 'Controls/display';
import { Search, Tree, TreeItem } from 'Controls/baseTree';
import { getItemParentKey, hasPinIcon } from 'Controls/_menu/Util';
import ViewTemplate = require('wml!Controls/_menu/Control/Control');
import * as groupTemplate from 'wml!Controls/_menu/Render/groupTemplate';
import { SyntheticEvent } from 'Vdom/Vdom';
import { Model } from 'Types/entity';
import { factory } from 'Types/chain';
import { isEqual, merge } from 'Types/object';
import * as cInstance from 'Core/core-instance';
import { loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import {
    IItemAction,
    TItemActionShowType,
    Controller as ItemActionsController,
} from 'Controls/itemActions';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { ErrorViewMode, ErrorViewConfig, ErrorController } from 'Controls/error';
import { ISwipeEvent } from 'Controls/listRender';
import { Controller as HistoryController, Source as HistorySource } from 'Controls/history';
import { StickyOpener, IStickyPopupOptions, IStickyPosition } from 'Controls/popup';
import { TKey } from 'Controls/_menu/interface/IMenuBase';
import { MarkerController, Visibility as MarkerVisibility } from 'Controls/marker';
import {
    FlatSelectionStrategy,
    SelectionController,
    IFlatSelectionStrategyOptions,
    ISelectionControllerOptions,
    TreeSelectionStrategy,
} from 'Controls/multiselection';
import { create as DiCreate } from 'Types/di';
import { LOCAL_MOVE_POSITION } from 'Types/source';
import 'css!Controls/menu';
import { Move as MoveAction, IMoveActionOptions } from 'Controls/listCommands';
import {
    ISiblingStrategy,
    FlatSiblingStrategy,
    groupConstants as constView,
} from 'Controls/baseList';
import { scrollToElement } from 'Controls/scroll';

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
const TREE_DEPS = ['Controls/tree'];
const TREE_COLLECTION = 'Controls/tree:TreeCollection';

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
    protected _moreButtonVisible: boolean = false;
    protected _expandButtonVisible: boolean = false;
    protected _expander: boolean;
    protected _emptyItem: CollectionItem;
    protected _itemActionsVisibilityCallback: Function;
    private _sourceController: SourceController = null;
    private _subDropdownItem: CollectionItem<Model> | null;
    private _preventCloseSubMenu: boolean = false;
    private _selectionChanged: boolean = false;
    private _selectedItems: Model[] = [];
    protected _expandedItems: RecordSet;
    private _itemsCount: number;
    private _visibleIds: TKey[] = [];
    private _openingTimer: number = null;
    private _closingTimer: number = null;
    private _isMouseInOpenedItemArea: boolean = false;
    private _openedTarget: HTMLElement;
    protected _expandedItemsFilter: Function;
    private _itemActionSticky: StickyOpener;
    protected _needStickyHistoryItems: boolean = false;
    private _additionalFilter: Function;
    private _limitHistoryFilter: Function;
    private _notifyResizeAfterRender: Boolean = false;
    private _needToScrollToItemAfterRender: Boolean = false;
    private _itemActionsController: ItemActionsController;
    private _viewMode: string;
    private _selectedKeys: TSelectedKeys;
    private _excludedKeys: TSelectedKeys;

    private _subMenu: HTMLElement;
    private _subMenuTemplateOptions: IMenuControlOptions;
    private _historyController: HistoryController = null;
    private _hoveredItem: CollectionItem<Model>;
    private _hoveredTarget: EventTarget;
    private _enterEvent: MouseEvent;
    private _subMenuPosition: IMenuPosition;
    private _openSubMenuEvent: MouseEvent;
    private _errorController: ErrorController;
    protected _errorConfig: ErrorViewConfig | void;
    private _markerController: MarkerController;
    private _selectionController: SelectionController = null;

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
        this._selectedKeys = options.selectedKeys;
        this._excludedKeys = options.excludedKeys;

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

    private _destroySourceController(): void {
        if (this._sourceController) {
            this._sourceController.unsubscribe('itemsChanged', this._itemsChangedCallback);
            this._sourceController = null;
        }
    }

    protected _afterMount(): void {
        if (
            this._options.openedSubMenuKey &&
            (this._options.hierarchyViewMode !== 'tree' || !this._options.subMenuLevel)
        ) {
            this._openSubMenuByKey(
                this._options.openedSubMenuOptions,
                this._options.openedSubMenuKey
            );
        }
        if (this._options.menuOpenedCallback) {
            this._options.menuOpenedCallback(this._options.root);
        }
        if (!this._options.multiSelect && this._selectedKeys?.length) {
            const markedItem = this._getMarkedItem(this._options.selectedKeys, this._options);
            if (markedItem) {
                const target = this._getTargetItem(markedItem);

                if (target) {
                    scrollToElement(target);
                }
            }
        }
    }

    protected _beforeUpdate(newOptions: IMenuControlOptions): void {
        this._itemActionsVisibilityCallback = this._itemActionsVisibility.bind(this, newOptions);

        const rootChanged = newOptions.root !== this._options.root;
        const sourceChanged = newOptions.source !== this._options.source;
        const itemsChanged = newOptions.items !== this._options.items;
        const filterChanged = !isEqual(newOptions.filter, this._options.filter);
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

        if (selectedKeysChanged) {
            this._selectedKeys = newOptions.selectedKeys;
        }
        if (excludedKeysChanged) {
            this._excludedKeys = newOptions.excludedKeys;
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
            ((newOptions.searchValue && searchValueChanged) || viewModeChanged)
        ) {
            this._notifyResizeAfterRender = true;
            this._closeSubMenu();
            this._updateItems(newOptions.sourceController.getItems(), newOptions);
        } else if (
            (rootChanged || sourceChanged || filterChanged) &&
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
        } else if (itemsChanged && newOptions.items) {
            this._setItems(newOptions.items, newOptions);
        } else if (
            selectedKeysChanged &&
            (this._selectionController || this._needCreateSelectionController(newOptions))
        ) {
            this._updateSelectionController(newOptions);
            this._notify('selectedItemsChanged', [this._getSelectedItems()]);
        } else if (selectedKeysChanged && this._markerController) {
            this._updateMarkerController(newOptions);
        }

        return result;
    }

    protected _afterRender(): void {
        if (this._notifyResizeAfterRender) {
            this._notify('controlResize', [], { bubbling: true });
        }
        if (this._needToScrollToItemAfterRender) {
            this._scrollToMarkedElement();
            this._needToScrollToItemAfterRender = false;
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
            this._updateSelectionController(this._options);
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
            keyProperty: this._options.keyProperty,
            siblingStrategy: this._getSiblingStrategy(),
        };
        return new MoveAction(controllerOptions);
    }

    protected _getSiblingStrategy(): ISiblingStrategy {
        return new FlatSiblingStrategy({
            collection: this._listModel,
        });
    }
    protected _mouseEnterHandler(): void {
        if (!this._itemActionsController?.isActionsAssigned()) {
            this._updateItemActions(this._listModel, this._options);
        }
    }

    protected _touchStartHandler(): void {
        if (!this._itemActionsController?.isActionsAssigned()) {
            this._updateItemActions(this._listModel, this._options);
        }
    }

    protected _mouseLeaveHandler(): void {
        this._clearOpeningTimout();
        this._clearAllowCloseTimout();
        this._startClosingTimout();
    }

    protected _mouseMove(event: SyntheticEvent<MouseEvent>): void {
        if (this._isMouseInOpenedItemArea && this._subDropdownItem) {
            this._startOpeningTimeout();
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
            this._notify('sendResult', ['subMenuClose'], { bubbling: true });
        } else if (code === constants.key.right) {
            this._openSubMenuByKey({ autofocus: true }, this._listModel.getHoveredItem().key);
        } else if (code === constants.key.space) {
            const collectionItem = this._listModel.getHoveredItem().contents;
            if (this._options.multiSelect) {
                this._checkBoxClick(event);
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
        item: CollectionItem<Model>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
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
        if (!hoveredItem) {
            newItem = this._listModel.getFirst();
        } else {
            do {
                if (direction === 'previous') {
                    if (hoveredItem.isFirstItem()) {
                        newItem = this._listModel.getLast();
                    } else {
                        newItem = this._listModel.getPrevious(hoveredItem);
                    }
                } else if (direction === 'next') {
                    if (hoveredItem.isLastItem()) {
                        newItem = this._listModel.getFirst();
                    } else {
                        newItem = this._listModel.getNext(hoveredItem);
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

    private _scrollToMarkedElement(): void {
        const element = this._container.querySelector('.controls-Menu__row_hovered') as HTMLElement;
        if (element) {
            scrollToElement(element);
        }
    }

    private _updateKeyboardItem(item: CollectionItem<Model>): void {
        this._listModel.setHoveredItem(item);
        this._updateItemActions(this._listModel, this._options);
    }

    private _isNeedStartOpening(
        item: CollectionItem<Model>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): boolean {
        // menu:Control могут положить в пункт меню, от такого пунта открывать подменю не нужно
        // TODO: https://online.sbis.ru/opendoc.html?guid=6fdbc4ca-d19a-46b3-ad68-24fceefa8ed0
        return (
            !(this._viewMode === 'list' && this._options.searchValue) &&
            item.getContents() instanceof Model &&
            !this._isTouch() &&
            !this._options.isDragging &&
            sourceEvent.currentTarget.closest('.controls-menu') === this._container
        );
    }

    protected _itemMouseMove(
        event: SyntheticEvent<MouseEvent>,
        item: CollectionItem<Model>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (
            this._isNeedStartOpening(item, sourceEvent) &&
            (!this._subDropdownItem || this._subDropdownItem.key !== item.key)
        ) {
            this._clearClosingTimout();
            this._setItemParamsOnHandle(item, sourceEvent.nativeEvent);
            this._checkOpenedMenu(sourceEvent.nativeEvent, item);
            this._startOpeningTimeout();
        }
        if (this._options.focusable && this._listModel.getHoveredItem()) {
            this._updateKeyboardItem(null);
        }
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

    protected _itemSwipe(
        e: SyntheticEvent<null>,
        item: CollectionItem<Model>,
        swipeEvent: SyntheticEvent<ISwipeEvent>,
        swipeContainerWidth: number,
        swipeContainerHeight: number
    ): void {
        const isSwipeLeft = swipeEvent.nativeEvent.direction === 'left';
        const itemKey = item.getContents().getKey();
        if (
            !this._isSingleSelectionKey(itemKey) &&
            !item.getContents().get(this._options.nodeProperty)
        ) {
            if (this._options.itemActions || this._options.allowPin) {
                if (isSwipeLeft) {
                    this._itemActionsController.activateSwipe(
                        itemKey,
                        swipeContainerWidth,
                        swipeContainerHeight
                    );
                } else {
                    this._itemActionsController.deactivateSwipe();
                }
            } else {
                this._updateSwipeItem(item, isSwipeLeft);
            }
        }
    }

    /**
     * Проверяет, обработать клик или открыть подменю. Подменю может быть многоуровневым
     * @param event
     * @param item
     * @param action
     * @param clickEvent
     * @private
     */
    protected _itemActionMouseDown(
        event: SyntheticEvent<MouseEvent>,
        item: CollectionItem<Model>,
        action: IItemAction,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        const contents: Model = item.getContents();
        if (action && !action['parent@'] && action.handler) {
            action.handler(contents);
        } else {
            this._openItemActionMenu(item, action, clickEvent);
        }
    }

    protected _itemClick(
        event: SyntheticEvent<MouseEvent | KeyboardEvent>,
        item: Model,
        sourceEvent: SyntheticEvent<MouseEvent | KeyboardEvent>
    ): void {
        if (item.get('readOnly') || this._options.isDragging) {
            return;
        }
        const key: string | number = item.getKey();
        const treeItem: CollectionItem<Model> = this._listModel.getItemBySourceKey(key);

        if (this._options.multiSelect && !this._selectionChanged && this._selectedKeys?.length) {
            this._selectionChanged = true;
        }

        if (MenuControl._isPinIcon(sourceEvent.target)) {
            this._pinClick(item);
        } else if (MenuControl._isRightTemplateClick(sourceEvent.target)) {
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
                this._options.multiSelect &&
                this._selectionChanged &&
                !this._isSingleSelectionKey(item.getKey()) &&
                !MenuControl._isFixedItem(item)
            ) {
                this._changeSelection(key, treeItem.isSelected());
            } else {
                if (
                    this._isTouch() &&
                    !MenuControl._isTreeViewRender(this._options) &&
                    item.get(this._options.nodeProperty) &&
                    this._subDropdownItem !== treeItem
                ) {
                    this._handleCurrentItem(
                        treeItem,
                        sourceEvent.currentTarget,
                        sourceEvent.nativeEvent
                    );
                } else {
                    if (!MenuControl._isItemCurrentRoot(item, this._options)) {
                        this._notify('itemClick', [item, sourceEvent]);
                    } else {
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
                    const selectedKeys = [this._getMarkedKey([item.getKey()], this._options)];
                    this._notify('selectedKeysChanged', [selectedKeys]);
                }
            }
        }
    }

    private _needCreateSelectionController(options: IMenuControlOptions): boolean {
        return options.selectedKeys && options.selectedKeys.length && options.multiSelect;
    }

    private _getSelectionController(options?: IMenuControlOptions): SelectionController {
        if (!this._selectionController) {
            this._selectionController = this._createSelectionController(options);
        }
        return this._selectionController;
    }

    private _createSelectionController(options: IMenuControlOptions): SelectionController {
        let strategy;
        const strategyOptions = this._getSelectionStrategyOptions(options);
        if (options.parentProperty && options.nodeProperty) {
            strategy = new TreeSelectionStrategy(strategyOptions);
        } else {
            strategy = new FlatSelectionStrategy(strategyOptions);
        }
        return new SelectionController({
            ...this._getSelectionControllerOptions(options),
            strategy,
        });
    }

    private _updateSelectionController(newOptions: IMenuControlOptions): void {
        const selectionController = this._getSelectionController(newOptions);
        selectionController.updateOptions({
            ...this._getSelectionControllerOptions(newOptions),
            strategyOptions: this._getSelectionStrategyOptions(newOptions),
        });
        selectionController.setSelection({
            selected: this._selectedKeys,
            excluded: this._excludedKeys,
        });
    }

    private _getSelectionControllerOptions(
        options: IMenuControlOptions
    ): ISelectionControllerOptions {
        return {
            model: this._listModel,
            selectedKeys: this._getKeysForSelectionController(options),
            excludedKeys: this._excludedKeys || [],
            searchValue: options.searchValue,
        };
    }

    private _updateMarkerController(newOptions: IMenuControlOptions): void {
        this._getMarkerController(newOptions).updateOptions(
            this._getMarkerControllerConfig(newOptions)
        );
        const markedKey = this._getMarkedKey(this._getSelectedKeys(newOptions), newOptions);
        this._markerController.setMarkedKey(markedKey);
        if (this._isSingleSelectionKey(markedKey, newOptions)) {
            this._setMarkerEmptyItem(true);
        } else {
            this._setMarkerEmptyItem(false);
        }
    }

    private _getSelectionStrategyOptions(
        options: IMenuControlOptions
    ): Partial<IFlatSelectionStrategyOptions> {
        if (options.parentProperty && options.nodeProperty) {
            return {
                model: this._listModel,
                selectAncestors: true,
                selectDescendants: true,
                rootKey: null,
                recursiveSelection: true,
                selectionType: options.selectionType,
            };
        }
        return {
            model: this._listModel,
        };
    }

    private _getKeysForSelectionController(options: IMenuControlOptions): TSelectedKeys {
        const selectedKeys = [];
        const items = this._listModel.getSourceCollection();
        this._selectedKeys.forEach((key) => {
            const item = items.getRecordById(key);
            if (
                key !== options.emptyKey &&
                key !== options.selectedAllKey &&
                (!item || !MenuControl._isFixedItem(item))
            ) {
                selectedKeys.push(item && MenuControl._isHistoryItem(item) ? String(key) : key);
            }
        });
        return selectedKeys;
    }

    private _openItemActionMenu(
        item: CollectionItem<Model>,
        action: IItemAction,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        const menuConfig = this._itemActionsController.prepareActionsMenuConfig(
            item,
            clickEvent,
            action,
            this,
            false
        );
        if (menuConfig) {
            if (!this._itemActionSticky) {
                this._itemActionSticky = new StickyOpener();
            }
            menuConfig.eventHandlers = {
                onResult: this._onItemActionsMenuResult.bind(this),
            };
            this._itemActionSticky.open(menuConfig);
            this._itemActionsController.setActiveItem(item);
        }
    }

    private _onItemActionsMenuResult(
        eventName: string,
        actionModel: Model,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        if (eventName === 'itemClick') {
            const action = actionModel && actionModel.getRawData();
            if (action && !action['parent@']) {
                const item = this._itemActionsController.getActiveItem();
                this._itemActionMouseDown(null, item, action, clickEvent);
                this._itemActionSticky.close();
            }
        }
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

    protected _treeCheckBoxClick(
        event: SyntheticEvent<MouseEvent | KeyboardEvent>,
        key: string,
        sourceEvent: SyntheticEvent<MouseEvent | KeyboardEvent>
    ): void {
        const item = this._listModel.getCollection().getRecordById(key);
        this._checkBoxClick(event, item);
        this._itemClick(event, item, sourceEvent);
    }

    protected _checkBoxClick(
        event: SyntheticEvent<MouseEvent | KeyboardEvent>,
        item?: CollectionItem
    ): void {
        if (item && item['[Controls/_baseTree/BreadcrumbsItem]']) {
            if (this._options.multiSelect) {
                let contents = item.getContents();
                contents = contents[(contents as any).length - 1];
                this._changeSelection(contents.getKey(), item.isSelected());
            }
        }
        this._selectionChanged = true;
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
            this._listModel.removeFilter(toggleFilter);
        } else {
            this._listModel.addFilter(toggleFilter);
        }
        if (this._options.trigger === 'hover') {
            this._notify('expanderClick', [this._expander]);
        }
        // TODO after deleting additionalProperty option
        // if (value) {
        //     if (this._expandedItems) {
        //         this._listModel.removeFilter(this._expandedItemsFilter);
        //     } else {
        //         this._itemsCount = this._listModel.getCount();
        //         this._loadExpandedItems(this._options);
        //     }
        // } else {
        //     this._listModel.addFilter(this._expandedItemsFilter);
        // }
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
                if (
                    this._subDropdownItem.isFirstItem() &&
                    !this._options.emptyText &&
                    !this._options.selectedAllText
                ) {
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
                this._updateSelection(eventResult as ISelectionObject);
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

    private _checkOpenedMenu(nativeEvent: MouseEvent, newItem?: CollectionItem<Model>): void {
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
        if (this._subDropdownItem && this._subDropdownItem.getContents().getKey() === key) {
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

    private _setItemParamsOnHandle(item: CollectionItem<Model>, nativeEvent: MouseEvent): void {
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

    private _canOpenSubMenu(item: CollectionItem): boolean {
        return (
            item.getContents().get(this._options.nodeProperty) &&
            !item.getContents().get('readOnly')
        );
    }

    private _handleCurrentItem(
        item: CollectionItem<Model>,
        target: EventTarget,
        nativeEvent: MouseEvent
    ): void {
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

    private _changeSelection(key: string | number | null, isSelected?: boolean): void {
        const selectionController = this._getSelectionController(this._options);
        const markerController = this._getMarkerController(this._options);
        const markedKey = markerController.getMarkedKey();
        const selectedItem = this._listModel.getItemBySourceKey(markedKey);
        if (
            selectedItem &&
            (MenuControl._isFixedItem(selectedItem.getContents()) ||
                this._isSingleSelectionKey(selectedItem.getContents().getKey()))
        ) {
            markerController.setMarkedKey(undefined);
            this._setMarkerEmptyItem(false);
        }
        const newSelection = selectionController.toggleItem(key);
        const selectionDifference = selectionController.getSelectionDifference(newSelection);
        let selection;
        const beforeSelectionResult =
            this._options.beforeSelectionChangedCallback?.(selectionDifference);
        if (beforeSelectionResult instanceof Promise) {
            beforeSelectionResult.then((resultSelection) => {
                this._updateSelectionAndNotify(resultSelection, key, isSelected);
            });
        } else {
            selection = beforeSelectionResult || newSelection;
            this._updateSelectionAndNotify(selection, key, isSelected);
        }
    }

    private _updateSelectionAndNotify(
        selection: ISelectionObject,
        key: TKey,
        isSelected: boolean
    ): void {
        this._updateSelection(selection);

        // При поиске отмеченные ранее записи могут отсутствовать в коллекции,
        // и selectionController не вернет все отмеченные записи, поэтому храним записи на состоянии.
        // toggleSelectedItem сохраняет записи в порядке выбора, чтобы записи вернулись в порядке источника,
        // без поиска зовем метод selectionController'a.
        // selectionController возвращает записи в порядке, в котором они находятся в источнике
        if (this._options.searchParam && this._options.searchValue && isSelected === false) {
            this._toggleSelectedItem(this._selectedItems, key);
        } else {
            this._selectedItems = this._getSelectedItemsFromController();
        }
        this._listModel.nextVersion();

        this._updateEmptyItemMarker(selection);
        if (this._subDropdownItem && this._subMenu) {
            this._openSubMenu(this._hoveredTarget, this._subDropdownItem);
        }
        this._notify('selectionChanged', [selection]);
        this._notifySelectionChanged();
        this._notify('selectedItemsChanged', [this._getSelectedItems()]);
    }

    private _setMarkerEmptyItem(marker: boolean): void {
        this._emptyItem?.setMarked(marker);
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

    private _updateSelection(selection: ISelectionObject): void {
        this._getSelectionController(this._options).setSelection(selection);
        this._selectedKeys = selection.selected;
        this._excludedKeys = selection.excluded;
    }

    private _updateEmptyItemMarker(selection: ISelectionObject): void {
        const markerController = this._getMarkerController(this._options);
        const isEmptySelected = this._options.emptyText && !selection.selected.length;
        const isAllItemSelected = this._options.selectedAllText && !selection.selected.length;
        let isFixedItemSelected;
        if (selection.selected.length === 1) {
            const item = this._listModel.getItemBySourceKey(selection.selected[0]);
            if (item) {
                isFixedItemSelected = MenuControl._isFixedItem(item);
            }
        }
        if (isFixedItemSelected) {
            markerController.setMarkedKey(selection.selected[0]);
        }
        if (isEmptySelected) {
            markerController.setMarkedKey(this._options.emptyKey);
        } else if (isAllItemSelected) {
            markerController.setMarkedKey(this._options.selectedAllKey);
        }
        if (isEmptySelected || isAllItemSelected) {
            this._setMarkerEmptyItem(true);
        } else {
            this._setMarkerEmptyItem(false);
        }
    }

    private _getMarkerControllerConfig(
        options: IMenuControlOptions,
        markedKey?: string | number
    ): IOptions {
        return {
            markerVisibility: options.markerVisibility,
            markedKey,
            model: this._listModel,
        };
    }

    private _dataLoadCallback(items: RecordSet, options: IMenuControlOptions): void {
        if (options.dataLoadCallback) {
            options.dataLoadCallback(items);
        }
    }

    private _setItems(items: RecordSet, options: IMenuControlOptions): void {
        this._dataLoadCallback(items, options);
        this._setStateByItems(items, options);
        this._createControllers(options);
    }

    private _updateItems(items: RecordSet, options: IMenuControlOptions): void {
        this._dataLoadCallback(items, options);
        this._setStateByItems(items, options);
        this._updateControllers(options);
    }

    protected _setStateByItems(items: RecordSet, options: IMenuControlOptions): void {
        this._setButtonVisibleState(items, options);
        this._createViewModel(items, options);
        if (options.focusable && !this._listModel.getHoveredItem()) {
            const item = this._getMarkedItem(options.selectedKeys, options);
            this._updateKeyboardItem(item || this._listModel.getNext(item));
        }
        this._needStickyHistoryItems = this._checkStickyHistoryItems(options);
    }

    private _createControllers(options: IMenuControlOptions): void {
        if (options.markerVisibility !== MarkerVisibility.Hidden) {
            this._markerController = this._getMarkerController(options);
            const markedKey = this._markerController.calculateMarkedKeyForVisible();
            this._markerController.setMarkedKey(markedKey);
            if (this._isSingleSelectionKey(markedKey, options)) {
                this._setMarkerEmptyItem(true);
            }
        }
        if (this._needCreateSelectionController(options)) {
            this._selectionController = this._getSelectionController(options);
            this._updateSelection(this._selectionController.getSelection());
            this._selectedItems = this._getSelectedItemsFromController();
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

    private _setButtonVisibleState(items: RecordSet, options: IMenuControlOptions): void {
        this._moreButtonVisible =
            options.selectorTemplate && this._getSourceController(options).hasMoreData('down');
        this._expandButtonVisible = this._isExpandButtonVisible(items, options);
        if (this._expandButtonVisible && this._visibleIds.length && options.openedSubMenuKey) {
            this._expander = !this._visibleIds.includes(options.openedSubMenuKey);
        }
    }

    private _getMarkerController(options: IMenuControlOptions): MarkerController {
        if (!this._markerController) {
            const markedKey = this._getMarkedKey(this._selectedKeys, options);
            this._markerController = new MarkerController(
                this._getMarkerControllerConfig(options, markedKey)
            );
        }
        return this._markerController;
    }

    private _getTargetItem(item: CollectionItem<Model>): HTMLElement {
        const dataName = this._options.dataName + '_item_' + item.getContents().getKey();
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
        }: Partial<IMenuControlOptions>
    ): string | number | undefined {
        let markedKey;
        if (multiSelect) {
            if ((!selectedKeys.length || selectedKeys.includes(emptyKey)) && emptyText) {
                markedKey = emptyKey;
            } else if (
                (!selectedKeys.length || selectedKeys.includes(selectedAllKey)) &&
                selectedAllText
            ) {
                markedKey = selectedAllKey;
            } else {
                const item = this._listModel.getItemBySourceKey(selectedKeys[0]);
                if (item && MenuControl._isFixedItem(item.getContents())) {
                    markedKey = selectedKeys[0];
                }
            }
        } else {
            markedKey = selectedKeys[0];
        }
        return markedKey;
    }

    private _getSelectedKeys(options: IMenuControlOptions): TSelectedKeys {
        let selectedKeys = [];

        if (options.multiSelect) {
            selectedKeys = this._getSelectionController(options).getSelection().selected;
        } else {
            selectedKeys = options.selectedKeys;
        }

        return selectedKeys;
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

    private _limitHistoryCheck(item: Model | Model[]): boolean {
        let isVisible: boolean = true;
        if (item && item.getKey) {
            isVisible = this._visibleIds.includes(item.getKey());
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

    private _updateSwipeItem(newSwipedItem: CollectionItem<Model>, isSwipeLeft: boolean): void {
        const oldSwipedItem: CollectionItem<Model> = this._listModel.find(
            (item: CollectionItem<Model>): boolean => {
                return item.isSwiped() || item.isAnimatedForSelection();
            }
        );
        if (isSwipeLeft && oldSwipedItem) {
            oldSwipedItem.setSwiped(false);
        }

        newSwipedItem.setSwiped(isSwipeLeft);
        this._listModel.nextVersion();
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
    ): Collection<Model> {
        const collectionConfig: object = {
            collection: items,
            keyProperty: options.keyProperty,
            nodeProperty: options.nodeProperty,
            parentProperty: options.parentProperty,
            root: options.root,
            unique: true,
            multiSelectAccessibilityProperty: options.multiSelectAccessibilityProperty,
            topPadding: 'null',
            bottomPadding: 'menu-default',
            leftPadding: this._getLeftPadding(options),
            // для каждого пункта должен быть свой отступ справа
            rightPadding: '',
            multiSelectVisibility: options.multiSelect ? 'onhover' : 'hidden',
            multiSelectPosition: 'custom',
            emptyTemplate: options.emptyTemplate,
        };
        let listModel: Search<Model> | Collection<Model>;

        const isSearchModel = !!(options.searchParam && options.searchValue);
        if (isSearchModel) {
            const searchConfig = {
                ...collectionConfig,
                filter:
                    options.allowPin && options.parentProperty
                        ? MenuControl._searchHistoryDisplayFilter.bind(this, options, items)
                        : null,
            };
            if (!this._viewMode) {
                listModel = new Search(searchConfig);
            } else {
                listModel = new Tree(searchConfig);
            }
        } else {
            if (options.parentProperty) {
                this._checkParentsItems(items, options);
            }

            if (MenuControl._isTreeViewRender(options)) {
                const treeCollection = loadSync(TREE_COLLECTION);
                listModel = new treeCollection({
                    ...collectionConfig,
                    expandedItems: options.openedSubMenuKey
                        ? [options.openedSubMenuKey]
                        : undefined,
                    expanderIcon: 'hiddenNode',
                    expanderPosition: 'custom',
                });
            } else {
                listModel = new Tree({
                    ...collectionConfig,
                    filter:
                        options.parentProperty && options.nodeProperty
                            ? MenuControl._displayFilter.bind(
                                  this,
                                  options.historyId,
                                  options.source
                              )
                            : null,
                });
            }

            if (options.groupProperty) {
                listModel.setGroup(this._groupItem.bind(this, options));
            } else if (options.groupingKeyCallback) {
                listModel.setGroup(this._groupItem.bind(this, options));
            }
        }

        if (options.itemActions || options.allowPin) {
            this._updateItemActions(listModel, options);
        }

        if (options.additionalProperty && !this._expander) {
            listModel.addFilter(this._additionalFilter);
        } else if (
            !isSearchModel &&
            options.allowPin &&
            !options.subMenuLevel &&
            !this._expander &&
            this._expandButtonVisible
        ) {
            listModel.addFilter(this._limitHistoryFilter);
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

    private _addSingleSelectionItem(
        itemText: string,
        key: TKey,
        items: RecordSet,
        options: IMenuControlOptions,
        listModel: Collection
    ): void {
        const emptyItem = this._getSingleSelectionItem(itemText, key, items, options);
        this._emptyItem = new CollectionItem({
            contents: emptyItem,
            owner: listModel,
        });
    }

    private _getSingleSelectionItem(
        itemText: string,
        key: TKey,
        items: RecordSet,
        options: IMenuControlOptions
    ): Model {
        const emptyItem = this._getItemModel(items, options.keyProperty);

        const data = {};
        data[options.keyProperty] = key;
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

    private _getLeftPadding(options: IMenuControlOptions): string {
        let leftSpacing = 's';
        if (options.itemPadding.left) {
            leftSpacing = options.itemPadding.left;
        }
        return leftSpacing;
    }

    private _groupMethod(options: IMenuControlOptions, item: Model): string {
        const groupId: string = item.get(options.groupProperty);
        const isHistoryItem: boolean =
            MenuControl._isHistoryItem(item) && !this._options.subMenuLevel;
        return groupId !== undefined && groupId !== null && !isHistoryItem
            ? groupId
            : constView.hiddenGroup;
    }

    private _getSourceController({
        source,
        navigation,
        keyProperty,
        filter,
        sourceController,
        root,
        parentProperty,
        nodeProperty,
    }: IMenuControlOptions): SourceController {
        if (!this._sourceController) {
            this._sourceController =
                sourceController ||
                new SourceController({
                    source,
                    filter,
                    navigation,
                    keyProperty,
                    root,
                    parentProperty,
                    nodeProperty,
                });
            this._sourceController.subscribe('itemsChanged', this._itemsChangedCallback);
        }
        return this._sourceController;
    }

    private _itemsChangedCallback(): void {
        if (this._listModel) {
            const items = this._sourceController.getItems();
            this._setButtonVisibleState(items, this._options);
            this._listModel.setCollection(items);
            this._updateControllers(this._options);
            this._updateItemActions(this._listModel, this._options);
        }
    }

    private _updateControllers(options: IMenuControlOptions): void {
        if (this._selectionController || this._needCreateSelectionController(options)) {
            this._updateSelectionController(options);
        }
        if (this._markerController) {
            this._updateMarkerController(options);
        }
    }

    private _loadExpandedItems(options: IMenuControlOptions): void {
        const loadConfig: IMenuControlOptions = merge({}, options);

        delete loadConfig.navigation;
        this._destroySourceController();

        this._loadItems(loadConfig).then((items: RecordSet): void => {
            this._expandedItems = items;
            this._createViewModel(items, options);
        });
    }

    private _loadAndSetItems(options: IMenuControlOptions): Promise<RecordSet | void> {
        return this._loadItems(options).then(
            (items) => {
                this._setItems(items, options);
                this._initHistoryControllerIfNeed(options);
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

        return sourceController.load(void 0, options.root, filter, false).then(
            (items: RecordSet): RecordSet => {
                if (sourceController.getItems()) {
                    sourceController.mergeItems(items, options.root);
                } else {
                    sourceController.setItems(items);
                }
                return sourceController.getItems();
            },
            (error: Error): Promise<void | ErrorViewConfig> => {
                return Promise.reject(this._processError(error));
            }
        );
    }

    private _isExpandButtonVisible(items: RecordSet, options: IMenuControlOptions): boolean {
        let hasAdditional: boolean = false;

        if (options.additionalProperty) {
            items.each((item: Model): void => {
                if (!hasAdditional) {
                    hasAdditional = !MenuControl._additionalFilterCheck(options, item);
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
        return (
            !(options.searchParam && options.searchValue) &&
            options.allowPin &&
            !options.subMenuLevel
        );
    }

    private _getItemForOpen(key: TKey): CollectionItem {
        let item = this._listModel.getItemBySourceKey(key);
        if (!item) {
            // Если item'a нет в текущей модели, ищем родителя из этого меню
            const parentKey = this._getParentKey(key);
            item = this._listModel.getItemBySourceKey(parentKey);
        }
        return item;
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
        item: CollectionItem<Model>,
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
        item: CollectionItem<Model>,
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
                adaptiveOptions: {
                    modal: true,
                },
                templateOptions,
                target,
                autofocus: false,
                direction,
                targetPoint,
                calmTimer: this._options.calmTimer,
                backgroundStyle: this._options.backgroundStyle,
                trigger: this._options.trigger,
                className,
                opener: this,
                fittingMode: this._subMenuPopupPosition?.fittingMode,
            };
            return merge(config, popupOptions);
        };

        if (
            this._subMenuTemplateOptions &&
            this._subMenuTemplateOptions.root === item.getContents().getKey()
        ) {
            return Promise.resolve(getOptions(this._subMenuTemplateOptions));
        }
        return this._getTemplateOptions(item).then((templateOptions) => {
            this._subMenuTemplateOptions = templateOptions;
            return getOptions(this._subMenuTemplateOptions);
        });
    }

    private _getTemplateOptions(item: CollectionItem<Model>): Promise<IMenuControlOptions> {
        const sourceItem = item.getContents();
        const root: TKey = sourceItem.get(this._options.keyProperty);
        const headingCaption = sourceItem.get(this._options.headingCaptionProperty);
        const historyId = this._historyController?.getHistoryId();
        const isLoadedChildItems = this._isLoadedChildItems(root);
        const sourcePropertyConfig = sourceItem.get(this._options.sourceProperty);
        const dataLoadCallback =
            !isLoadedChildItems && !sourcePropertyConfig
                ? this._subMenuDataLoadCallback.bind(this)
                : null;
        const selection = this._selectionController?.getSelection();
        const selectedKeys = this._options.multiSelect
            ? selection?.selected
            : this._options.selectedKeys;
        const excludedKeys = this._options.multiSelect
            ? selection?.excluded
            : this._options.excludedKeys;
        const subMenuTemplate = sourceItem.get('subMenuTemplate');
        const promises = [];
        if (!(isLoadedChildItems && this._options.items && !this._options.source)) {
            promises.push(
                this._getSourceSubMenu(isLoadedChildItems, sourcePropertyConfig, historyId)
            );
        } else {
            promises.push(this._options.source);
        }
        if (this._options.hierarchyViewMode === 'tree') {
            TREE_DEPS.forEach((dep) => {
                promises.push(loadAsync(dep));
            });
        }
        if (typeof subMenuTemplate === 'string') {
            promises.push(loadAsync(subMenuTemplate));
        }
        return Promise.all(promises).then(([source]) => {
            let sourceController;
            if (
                (isLoadedChildItems || this._historyController) &&
                this._options.hierarchyViewMode !== 'tree'
            ) {
                sourceController = this._sourceController;
            }
            const subMenuOptions: object = {
                root: sourcePropertyConfig ? null : root,
                dataLoadCallback,
                headingCaption,
                footerContentTemplate: this._options.nodeFooterTemplate,
                footerItemData: {
                    key: root,
                    item: sourceItem,
                },
                closeButtonVisibility: false,
                historyId,
                historyRoot: this._historyController?.getRoot() || null,
                emptyText: null,
                selectedAllText: null,
                showClose: false,
                showHeader: !!headingCaption,
                headerTemplate: undefined,
                headerContentTemplate: null,
                searchParam: null,
                itemPadding: undefined,
                draggable: false,
                source,
                sourceController,
                selectedKeys,
                excludedKeys,
                subMenuTemplate,
                ...sourceItem.get('subMenuTemplateOptions'),
                applyButtonVisibility: this._options.multiSelect ? 'hidden' : undefined,
                items: isLoadedChildItems ? this._options.items : null,
                ...sourceItem.get('menuOptions'),
                subMenuLevel: this._options.subMenuLevel + 1,
                iWantBeWS3: false, // FIXME https://online.sbis.ru/opendoc.html?guid=9bd2e071-8306-4808-93a7-0e59829a317a
            };

            return { ...this._options, ...subMenuOptions };
        });
    }

    private _getSourceSubMenu(
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

        if (
            (isLoadedChildItems || this._historyController) &&
            this._options.hierarchyViewMode !== 'tree'
        ) {
            targetSource = this._sourceController.getSource();
        } else if (isLoadedChildItems) {
            targetSource = new PrefetchProxy({
                target: source,
                data: {
                    query: this._listModel.getSourceCollection(),
                },
            });
        } else if (sourcePropertyConfig) {
            targetSource = this._createMenuSource(sourcePropertyConfig);
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

    private _groupItem(options, item: Model, position: number, treeItem: TreeItem): string {
        const listModel = treeItem.getOwner();
        const collection = listModel.getSourceCollection();
        const parentKey = item.get(listModel.getParentProperty());
        const parent = collection.getRecordById(parentKey);
        if (
            parentKey !== null &&
            parent &&
            !MenuControl._isVisibleItem(item, collection, options)
        ) {
            return this._groupItem(options, parent, position, treeItem);
        } else {
            return this._getGroup(options, item);
        }
    }

    private _getGroup(options: IMenuControlOptions, item: Model): string {
        if (options.groupingKeyCallback) {
            return options.groupingKeyCallback(item);
        } else if (options.groupProperty) {
            return this._groupMethod(options, item);
        }
    }

    private _subMenuDataLoadCallback(items: RecordSet): void {
        const origCollectionFormat = this._listModel.getSourceCollection().getFormat();
        const collection = this._listModel.getSourceCollection();
        items.getFormat().forEach((field) => {
            const name = field.getName();
            this._addField(name, collection, origCollectionFormat);
        });
        this._listModel.getSourceCollection().append(items);
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

    private _updateItemActions(listModel: Collection<Model>, options: IMenuControlOptions): void {
        let itemActions: IItemAction[] = options.itemActions;

        if (options.allowPin) {
            itemActions = this._getItemActionsWithPin(itemActions);
        }

        if (!itemActions && !options.itemActionsProperty) {
            return;
        }

        if (MenuControl._isTreeViewRender(options)) {
            if (!this._itemActions) {
                this._itemActions = itemActions;
            }
            return;
        }

        if (!this._itemActions) {
            this._itemActions = itemActions;
        }

        if (!this._itemActionsController) {
            this._itemActionsController = new ItemActionsController();
        }
        const editingConfig = listModel.getEditingConfig();
        this._itemActionsController.update({
            collection: listModel,
            itemActions,
            itemActionsPosition: 'inside',
            visibilityCallback: this._itemActionsVisibilityCallback,
            style: 'default',
            theme: options.theme,
            actionAlignment: 'horizontal',
            actionCaptionPosition: 'none',
            itemActionsVisibility: options.itemActionsVisibility,
            itemActionsProperty: options.itemActionsProperty,
            itemActionsClass:
                options.itemActionsClass || 'controls-Menu__itemActions_position_rightBottom',
            iconSize: editingConfig ? 's' : 'm',
        });
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
            iconSize = itemActions.length ? 'm' : 's';
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
        { parentProperty, root }: IMenuControlOptions
    ): void {
        items.forEach((item) => {
            if (!item.hasOwnProperty(parentProperty) && item.get(parentProperty) === undefined) {
                item.set(parentProperty, root);
                Logger.warn(
                    `Для элемента меню с идентификатором ${item.getKey()} не задано значение parentProperty`,
                    this
                );
            }
        });
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
    };

    private static _isTreeViewRender(options: IMenuControlOptions): boolean {
        return !!(options.subMenuLevel && options.hierarchyViewMode === 'tree');
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

    private static _isFixedItem(item: Model): boolean {
        return !item.has || (!item.has('HistoryId') && item.get('pinned'));
    }

    private static _additionalFilterCheck(options: IMenuControlOptions, item: Model): boolean {
        if (item.get) {
            const isSelected = options.selectedKeys?.includes(item.getKey());
            const isHistoryItem = MenuControl._isHistoryItem(item);
            const isCurrentRoot = getItemParentKey(options, item) === options.root;
            const isAddItem =
                item.get?.(options.additionalProperty) &&
                !isSelected &&
                !isHistoryItem &&
                isCurrentRoot;
            return !isAddItem;
        }
        return true;
    }

    private static _displayFilter(
        historyId: string,
        source: ICrudPlus,
        item: Model,
        index: number,
        treeItem: TreeItem
    ): boolean {
        const model = treeItem.getOwner();
        const root = model.getRoot().contents;
        const parentProperty = model.getParentProperty();
        const nodeProperty = model.getNodeProperty();
        const items = model.getSourceCollection();

        let isVisible: boolean = true;
        if (item && item.get) {
            isVisible = MenuControl._isVisibleItem(item, items, {
                root,
                parentProperty,
                nodeProperty,
                historyId,
                source,
            });
        }
        return isVisible;
    }

    private static _isVisibleItem(
        item: Model,
        items: RecordSet,
        { root, parentProperty, nodeProperty, historyId, source }: Partial<IMenuControlOptions>
    ): boolean {
        const parent = getItemParentKey({ root, parentProperty }, item);
        const isHistoryItem =
            (!!historyId || MenuControl._isHistorySource(source)) &&
            MenuControl._isHistoryItem(item);

        return (
            parent === root ||
            (!isHistoryItem &&
                MenuControl._isHiddenNode(parent, items, parentProperty, nodeProperty, root))
        );
    }

    private static _isHistorySource(source): boolean {
        if (source instanceof PrefetchProxy) {
            source = source.getOriginal();
        }
        return source instanceof HistorySource;
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
            parentItem.get(nodeProperty) === false &&
            MenuControl._isVisibleItem(parentItem, items, {
                root,
                parentProperty,
                nodeProperty,
            })
        );
    }

    private static _searchHistoryDisplayFilter(
        options: IMenuControlOptions,
        items: RecordSet,
        item: Model
    ): boolean {
        let result = true;
        if (
            item &&
            item.get &&
            MenuControl._isHistoryItem(item) &&
            item.get(options.parentProperty)
        ) {
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
