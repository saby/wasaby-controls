/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'Vdom/Vdom';
import { constants } from 'Env/Env';
import * as ListTemplate from 'wml!Controls/_filterPanel/Editors/List/List';
import ItemTemplate from 'Controls/_filterPanel/Editors/resources/ItemTemplate';
import { navigateItem } from 'Controls/_filterPanel/Editors/resources/NavigateItem';
import getColumns from './List/Utils/getColumns';
import createSyntheticItem from './List/Utils/createSyntheticItem';
import addItemsFromSelector, { getMaxItemsCount } from './List/Utils/addItemsFromSelector';
import { StackOpener, DialogOpener } from 'Controls/popup';
import { Model } from 'Types/entity';
import {
    INavigationOptionValue,
    TFilter,
    TKey,
    INavigationSourceConfig,
    IItemPadding,
    Direction,
} from 'Controls/interface';
import { View as GridView, IColumn } from 'Controls/grid';
import { List, RecordSet } from 'Types/collection';
import { factory } from 'Types/chain';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { IListEditorOptions } from './List/interface/IList';
import {
    TItemActionShowType,
    IItemAction,
    TItemActionVisibilityCallback,
} from 'Controls/itemActions';
import 'css!Controls/toggle';
import 'css!Controls/filterPanel';
import 'css!Controls/masterDetail';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { loadSync, loadAsync } from 'WasabyLoader/ModulesLoader';
import DragNDropProvider from 'Controls/_filterPanel/Editors/List/DragNDropProvider';
import { BaseAction } from 'Controls/actions';
import * as rk from 'i18n!Controls';
import { ItemsEntity } from 'Controls/dragnDrop';
import { LOCAL_MOVE_POSITION } from 'Types/source';
import { Logger } from 'UI/Utils';

const COLUMNS_TEMPLATES = ['titleTemplate', 'counterTemplate'];

export default class ListEditor extends Control<IListEditorOptions> {
    protected _template: TemplateFunction = ListTemplate;
    protected _columns: object[] = null;
    protected _popupOpener: StackOpener | DialogOpener = null;
    protected _items: RecordSet = null;
    private _sourceController: SourceController = null;
    private _selectedItems: RecordSet | List<Model> = null;
    protected _selectedKeys: TKey[] = [];
    protected _filter: TFilter = {};
    protected _navigation: INavigationOptionValue<INavigationSourceConfig> = null;
    protected _historyService: unknown;
    protected _itemActions: IItemAction[];
    protected _itemsReadyCallback: Function = null;
    protected _markedKey: string | number;
    protected _expandedItems: TKey[] = [];
    protected _hiddenItemsCount: number = null;
    protected _itemPadding: IItemPadding = null;
    protected _stickyItem: Model;
    protected _isStickyItemSticked: boolean;
    protected _moreButtonVisible: boolean;
    protected _currentPageId: string;
    protected _children: {
        gridView: GridView;
    };
    private _dragNDropProvider: DragNDropProvider;

    constructor(options: IListEditorOptions) {
        super(options);
        this._itemsReadyCallback = this._handleItemsReadyCallback.bind(this);
        this._itemStickyCallback = this._itemStickyCallback.bind(this);
        this._itemActionVisibilityCallback = this._itemActionVisibilityCallback.bind(this);
        this._itemActionHandler = this._itemActionHandler.bind(this);
        this._onAfterCollectionChange = this._onAfterCollectionChange.bind(this);
        this._stickyCallback = this._stickyCallback.bind(this);
        this._colspanCallback = this._colspanCallback.bind(this);
    }

    protected _beforeMount(options: IListEditorOptions): void | Promise<RecordSet | Error> {
        const sourceController = this._getSourceController(options);
        this._setSelectedKeys(options);
        this._setMarkedKey(this._selectedKeys, options);
        this._setColumns(options);
        this._setFilter(this._selectedKeys, options);
        this._setItemAction(options);
        this._navigation = this._getNavigation(options);

        if (options.expandedItems) {
            this._expandedItems = options.expandedItems;
        }

        if (options.dragNDropProviderName && options.sourceController) {
            this._dragNDropProvider = this._createDragNDropProvider(options);
        }

        if (sourceController) {
            this._subscribeDataLoad(sourceController);
            const needSetFilter = !isEqual(sourceController.getFilter(), this._filter);
            const needSetNavigation =
                !isEqual(sourceController.getNavigation(), this._navigation) &&
                (this._navigation?.view === 'demand' || this._navigation?.view === 'cut');
            if (needSetFilter) {
                sourceController.setFilter(this._filter);
            }
            if (needSetNavigation) {
                sourceController.setNavigation(this._navigation);
            }
            if (needSetFilter) {
                if (constants.isServerSide) {
                    Logger.error(
                        'Controls/filterPanel:ListEditor: вызвана перезагрузка данных на сервере, значение фильтра у sourceController отличается от фильтра контрола',
                        this
                    );
                } else {
                    return sourceController.reload() as Promise<RecordSet>;
                }
            }
        }
        this._setMoreButtonVisibility(this._selectedKeys, options);
    }

    protected _beforeUpdate(options: IListEditorOptions): void {
        const {
            propertyValue,
            filter,
            additionalTextProperty,
            mainCounterTooltip,
            additionalCounterTooltip,
            displayProperty,
            source,
            multiSelect,
            expandedItems,
        } = options;
        const sourceController = this._getSourceController(options);
        const sourceControllerChanged = this._options.sourceController !== options.sourceController;

        const valueChanged =
            !this._isPropertyValuesEqual(propertyValue, this._options.propertyValue, multiSelect) &&
            !this._isPropertyValuesEqual(propertyValue, this._selectedKeys, multiSelect);
        let filterChanged = !isEqual(filter, this._options.filter);
        const displayPropertyChanged = displayProperty !== this._options.displayProperty;
        const additionalDataChanged =
            additionalTextProperty !== this._options.additionalTextProperty;
        const mainCounterTooltipChanged = mainCounterTooltip !== this._options.mainCounterTooltip;
        const additionalCounterTooltipChanged =
            additionalCounterTooltip !== this._options.additionalCounterTooltip;
        const columnsTemplateChanged = this._isTemplatesChanged(this._options, options);
        const expandedItemsChanged = !isEqual(expandedItems, this._options.expandedItems);
        const sourceChanged = source !== this._options.source;
        if (additionalDataChanged || valueChanged || displayPropertyChanged) {
            this._setSelectedKeys(options);
            this._resetStickyItem();
            this._setColumns(options);
            this._navigation = this._getNavigation(options);
            this._setHiddenItemsCount(this._selectedKeys);
        }
        if (expandedItemsChanged) {
            this._expandedItems = expandedItems;
        }
        if (
            mainCounterTooltipChanged ||
            additionalCounterTooltipChanged ||
            columnsTemplateChanged
        ) {
            this._setColumns(options);
        }
        if (filterChanged || valueChanged) {
            const currentFilter = this._filter;
            this._setFilter(valueChanged ? this._selectedKeys : null, options);
            if (sourceController) {
                filterChanged = !isEqual(sourceController.getFilter(), this._filter);
            } else {
                filterChanged = !isEqual(currentFilter, this._filter);
            }
        }
        if (valueChanged) {
            this._setMarkedKey(this._selectedKeys, options);
        }
        if (sourceControllerChanged) {
            this._unsubscribeDataLoad(this._getSourceController(this._options));
            this._subscribeDataLoad(sourceController);
        }
        if (sourceController && (filterChanged || sourceChanged)) {
            this._updateSourceControllerOptions(options);
        }
    }

    protected _itemActionVisibilityCallback(action: IItemAction, item: Model): boolean {
        let isActionVisible;
        const itemKey = item.getKey();

        if (action.id === 'PinNull' || action.id === 'PinOff') {
            if (item.get('pinned')) {
                isActionVisible = action.id !== 'PinNull';
            } else {
                isActionVisible = action.id !== 'PinOff';
            }
            return (
                isActionVisible &&
                !this._isSyntheticKey(itemKey) &&
                (item !== this._stickyItem || !this._isStickyItemSticked)
            );
        }
        const callbackName = this._options.itemActionVisibilityCallbackName;
        if (callbackName) {
            const itemActionVisibilityCallback: TItemActionVisibilityCallback =
                loadSync(callbackName);
            return itemActionVisibilityCallback(action, item, false);
        }
        if (this._options.itemActionVisibilityCallback) {
            return this._options.itemActionVisibilityCallback(action, item, false);
        }
        return true;
    }

    protected _handleItemsReadyCallback(items: RecordSet): void {
        this._items = items;
        this._resetStickyItem();
        this._addSyntheticItemsToOriginItems(items, this._options);
        this._items.subscribe('onAfterCollectionChange', this._onAfterCollectionChange);
        this._setHiddenItemsCount(this._selectedKeys);
        this._setMoreButtonVisibility(this._selectedKeys, this._options);
    }

    protected _onAfterCollectionChange(): void {
        this._resetStickyItem();
        this._addSyntheticItemsToOriginItems(this._items, this._options);
        this._setHiddenItemsCount(this._selectedKeys);
        this._setMoreButtonVisibility(this._selectedKeys, this._options);
    }

    protected _handleActionClick(
        event: SyntheticEvent,
        action: IItemAction,
        item: Model,
        itemContainer: HTMLElement
    ): void {
        if (action.commandName) {
            this._itemActionHandler(item, action, itemContainer);
        }
    }

    protected _handleItemClick(
        event: SyntheticEvent,
        item: Model,
        nativeEvent: SyntheticEvent
    ): void {
        this._setPropertyValueByItem(item);
    }

    private _handleDataLoad(event: SyntheticEvent, items: RecordSet, direction: Direction): void {
        if (!direction) {
            this._addSyntheticItemsToOriginItems(items, this._options);
        }
    }

    private _subscribeDataLoad(sourceController): void {
        sourceController?.subscribe('dataLoad', this._handleDataLoad, this);
    }

    private _unsubscribeDataLoad(sourceController): void {
        sourceController?.unsubscribe('dataLoad', this._handleDataLoad, this);
    }

    private _isSyntheticKey(key: TKey): boolean {
        return key === this._options.emptyKey || key === this._options.selectedAllKey;
    }

    _setPropertyValueByItem(item: Model): void {
        let selectedKeysArray = this._options.multiSelect
            ? object.clonePlain(this._selectedKeys)
            : [];
        let itemKey;
        if (item) {
            itemKey = item.get(this._options.keyProperty);
            const itemIndex = selectedKeysArray.indexOf(itemKey);
            if (itemIndex !== -1) {
                selectedKeysArray.splice(itemIndex, 1);
            } else {
                if (this._isSyntheticKey(itemKey)) {
                    selectedKeysArray = [itemKey];
                } else if (!selectedKeysArray.includes(itemKey)) {
                    selectedKeysArray.unshift(item.get(this._options.keyProperty));
                }
            }
            if (this._needNavigateItem(item)) {
                this._currentPageId = item.get('pageId');
                navigateItem(this._options.Router, item);
                return;
            }
        }
        this._setItems(selectedKeysArray);
        if (this._markedKey !== itemKey) {
            this._processPropertyValueChanged(selectedKeysArray);
        }
    }

    protected _handleSelectedKeysChanged(event: SyntheticEvent, keys: string[] | number[]): void {
        if (this._options.multiSelect) {
            this._processPropertyValueChanged(keys);
        }
    }

    protected _handleSelectedKeyChanged(event: SyntheticEvent, key: string | number): void {
        this._processPropertyValueChanged([key]);
    }

    protected _handleSelectorResult(result: RecordSet | List<Model>): void {
        const selectedKeys = [];
        const { sourceController } = this._options;
        result.forEach((item) => {
            selectedKeys.push(item.get(this._options.keyProperty));
        });
        if (selectedKeys.length) {
            this._setFilter(selectedKeys, this._options);
        }

        // Будет удалено после перехода всеми прикладными программистами на новую стики панель
        const textValue = this._getTextValueFromSelectorResult(result);
        this._processPropertyValueChanged(selectedKeys, textValue);

        this._navigation = this._getNavigation(this._options, selectedKeys);

        if (this._options.navigation) {
            addItemsFromSelector(result, this._items, this._options);
            this._selectedItems = result;
        } else if (sourceController) {
            sourceController.updateOptions({
                ...this._options,
                filter: this._filter,
            });
            sourceController.reload();
        }
    }

    protected _handleMarkedKeyChanged(event: Event, key: TKey): void {
        // Нельзя реагировать на смену маркера, если маркер стоит на пункте
        // который добавляет редактор по опции emptyText
        // список обрабатывает изменение RecordSet'a раньше,
        // чем добавляется этот пункт
        if (!this._options.multiSelect && !this._isSyntheticKey(this._markedKey)) {
            this._setPropertyValueByItem(this._items.getRecordById(key));
        }
    }

    protected _handleExpandedItemsChanged(event: Event, expandedItems: TKey[]): void {
        if (this._expandedItems !== expandedItems) {
            this._expandedItems = expandedItems;

            if (this._options.nodeHistoryId) {
                this._getSourceController(this._options).setExpandedItems(expandedItems);
                this._getSourceController(this._options).updateExpandedItemsInUserStorage();
            }
        }
    }

    protected _dragStart(event: Event, items: RecordSet, key: TKey): ItemsEntity {
        if (this._dragNDropProvider) {
            return this._dragNDropProvider.getEntity([key]);
        }
    }

    protected _dragEnter(event: Event, entity: ItemsEntity): boolean {
        if (this._dragNDropProvider) {
            return this._dragNDropProvider.dragEnter(entity);
        }
    }

    protected _changeDragTarget(
        event: Event,
        entity: ItemsEntity,
        item: Model,
        position: LOCAL_MOVE_POSITION
    ): boolean | void {
        if (this._dragNDropProvider) {
            return this._dragNDropProvider.changeDragTarget(entity, item, position);
        }
    }

    protected _dragEnd(
        event: Event,
        itemsEntity: ItemsEntity,
        target: Model,
        position: LOCAL_MOVE_POSITION
    ): Promise<void> | void {
        if (this._dragNDropProvider) {
            const result = this._dragNDropProvider.dragEnd(itemsEntity, target, position);
            if (result instanceof Promise) {
                return result.then((items: RecordSet) => {
                    this._dragNDropProvider.afterItemsMove(items);
                });
            } else if (result) {
                this._dragNDropProvider.afterItemsMove(result);
            }
        }
    }

    protected _handleFooterClick(event: SyntheticEvent): void {
        const selectorOptions = this._options.selectorTemplate;
        const popupOptions = {
            ...{
                opener: this,
                templateOptions: {
                    ...selectorOptions.templateOptions,
                    ...{
                        selectedKeys: this._selectedKeys,
                        selectedItems: this._getSelectedItems(),
                        multiSelect: this._options.multiSelect,
                    },
                },
                template: selectorOptions.templateName,
                eventHandlers: {
                    onResult: this._handleSelectorResult.bind(this),
                },
            },
            ...selectorOptions.popupOptions,
        };
        loadAsync('Controls/lookup').then(({ showSelector }) => {
            showSelector(this, popupOptions, this._options.multiSelect);
        });
    }

    protected _processPropertyValueChanged(value: TKey[], textValue?: string): void {
        this._setSelectedKeys(this._options, value);
        if (!this._selectedKeys.length) {
            this._handleResetItems();
        }
        this._resetStickyItem();
        this._setMarkedKey(this._selectedKeys, this._options);
        this._setColumns(this._options);
        this._setHiddenItemsCount(this._selectedKeys);
        const extendedValue = {
            value: this._getPropertyValue(value, this._options.multiSelect),
            textValue: textValue || this._getTextValue(this._selectedKeys),
        };
        this._notify('propertyValueChanged', [extendedValue], {
            bubbling: true,
        });
        this._updateDragNDropProvider(extendedValue.value);
    }

    protected _updateDragNDropProvider(propertyValue: TKey[] | TKey): void {
        this._dragNDropProvider?.update({
            sourceController: this._options.sourceController,
            propertyValue,
        });
    }

    protected _registerHandler(event: SyntheticEvent, type: string): void {
        // Если среди родителей панели фильтров будет Browser, то все команды ПМО, посылаемые через
        // Register будут долетать до списков внутри панели фильтров
        if (event.type === 'register' && type === 'selectedTypeChanged') {
            event.stopPropagation();
        }
    }

    protected _handleEditArrowClick(event: SyntheticEvent, item: Model): void {
        this._options.editArrowClickCallback(item);
    }

    protected _needNavigateItem(item: Model): boolean {
        const pageId = item.get('pageId');
        const mask = item.get('mask');
        if (pageId && mask) {
            const markedKey =
                this._markedKey ||
                this._getMarkedKey(this._selectedKeys, this._options) ||
                this._options.emptyKey;
            let markedItemPageId;
            if (markedKey) {
                const markedItem = this._items.getRecordById(markedKey);
                // Запись могли удалить из списка, в этом случае берем pageId с состояния
                markedItemPageId = markedItem ? markedItem.get('pageId') : this._currentPageId;
            }
            return markedItemPageId && markedItemPageId !== pageId;
        }
        return false;
    }

    private _setItems(): void {
        if (
            this._options.editorsViewMode === 'popupCloudPanelDefault' &&
            this._options.extendedCaption
        ) {
            const items = this._getSourceController(this._options).getItems();
            const sourceControllerItems = new RecordSet({
                adapter: items?.getAdapter(),
                keyProperty: this._options.keyProperty,
                format: items?.getFormat(),
                model: items?.getModel(),
            });

            sourceControllerItems.append(items);
            this._options.sourceController.setItems(sourceControllerItems);
        }
    }

    private _setMoreButtonVisibility(selectedKeys: TKey[], options: IListEditorOptions): void {
        const sourceController = this._getSourceController(options);
        const isValueSelected =
            this._moreButtonVisible !== false &&
            !this._isValueReseted(selectedKeys, options.resetValue, options.multiSelect);
        this._moreButtonVisible = sourceController
            ? sourceController.hasMoreData('down') || isValueSelected
            : true;
    }

    private _updateSourceControllerOptions(options: IListEditorOptions): void {
        const sourceController = this._getSourceController(options);
        const sourceControllerChanged = this._options.sourceController !== options.sourceController;
        const needReload = sourceController.updateOptions({
            ...options,
            filter: this._filter,
        });
        if (this._navigation?.view === 'demand' || this._navigation?.view === 'cut') {
            sourceController.setNavigation(this._navigation);
        }
        sourceController.setFilter(this._filter);
        if (!options.deepReload) {
            sourceController.setExpandedItems([]);
        }

        if (!sourceControllerChanged || needReload) {
            if (options.deepReload) {
                // Пока полностью не вынесли функционал перезагрузки и сохранения навигации из списка
                // надо звать метод reload, потому что в нём реализована логика сохранения навигации
                this._children.gridView.reload(true);
            } else {
                sourceController.reload().catch((error) => {
                    return error;
                });
            }
        }
    }

    private _isTemplatesChanged(
        oldOptions: IListEditorOptions,
        newOptions: IListEditorOptions
    ): boolean {
        return COLUMNS_TEMPLATES.some((template) => {
            return typeof template === 'string' && oldOptions[template] !== newOptions[template];
        });
    }

    private _isPropertyValuesEqual(
        newValue: TKey[] | TKey,
        currentValue: TKey[] | TKey,
        multiSelect: boolean
    ): boolean {
        const newPropertyValue = this._getPropertyValue(newValue, multiSelect);
        const currentPropertyValue = this._getPropertyValue(currentValue, multiSelect);
        return isEqual(newPropertyValue, currentPropertyValue);
    }

    private _setSelectedKeys(
        options: IListEditorOptions,
        value: TKey[] | TKey = options.propertyValue
    ): void {
        const { resetValue, multiSelect } = options;

        const selectedValue = this._getPropertyValue(value, multiSelect);
        const resetPropertyValue = this._getPropertyValue(resetValue, multiSelect);

        if (isEqual(selectedValue, resetPropertyValue)) {
            this._selectedKeys = [];
            return;
        }

        this._selectedKeys = this._getSelectedKeysByValue(value, multiSelect);
    }

    private _getSelectedKeysByValue(value: TKey[] | TKey, multiSelect: boolean): TKey[] {
        if (multiSelect) {
            const selectedKeys = value || [];
            return this._getValue(selectedKeys, this._options);
        }
        return Array.isArray(value) ? value : [value];
    }

    private _getPropertyValue(
        value: TKey[] | TKey,
        multiSelect: boolean,
        resetValue: TKey[] = this._options.resetValue
    ): TKey[] | TKey {
        const isArray = Array.isArray(value);
        let propValue;
        if (multiSelect) {
            propValue = isArray && value.includes(this._options.emptyKey) ? [] : value;
        } else if (isArray) {
            propValue = value[0] !== undefined ? value[0] : resetValue;
        } else {
            propValue = value;
        }
        return propValue;
    }

    private _getTextValue(selectedKeys: TKey[] = this._selectedKeys): string {
        const textArray = [];

        selectedKeys.forEach((item) => {
            const record = this._items?.getRecordById(item);
            if (record) {
                textArray.push(record.get(this._options.displayProperty));
            }
        });
        return textArray.join(', ');
    }

    private _getTextValueFromSelectorResult(items: RecordSet | List<Model>): string {
        const textArray = [];

        items?.each((item) => {
            textArray.push(item.get(this._options.displayProperty));
        });
        return textArray.join(', ');
    }

    private _getValue(value: TKey[], { emptyKey, selectedAllKey }: IListEditorOptions): TKey[] {
        return value?.includes(emptyKey) || value?.includes(selectedAllKey) ? [] : value;
    }

    protected _setColumns(options: IListEditorOptions): void {
        this._columns = getColumns(
            options,
            this._handleEditArrowClick.bind(this),
            this._isStickyItemSticked,
            this._getTextValue(this._selectedKeys)
        );
    }

    protected _beforeUnmount(): void {
        if (this._popupOpener) {
            this._popupOpener.destroy();
        }

        if (this._items) {
            this._items.unsubscribe('onAfterCollectionChange', this._onAfterCollectionChange);
            this._items = null;
        }
        this._unsubscribeDataLoad(this._getSourceController(this._options));
    }

    protected _colspanCallback(item: Model, column: IColumn, columnIndex: number): number {
        if (
            (this._options.imageTemplateName ||
                this._options.imageTemplate ||
                this._options.imageProperty) &&
            this._options.emptyKey === item.get(this._options.keyProperty) &&
            columnIndex === 0
        ) {
            return 2;
        }
        return 1;
    }

    private _setItemAction({ historyId, itemActions }: IListEditorOptions): void {
        this._itemActions = this._getItemActions(historyId, itemActions);
    }

    private _stickyCallback(item: Model): string | void {
        if (this._options.multiSelect) {
            return this._getStickyItem() === item ? 'topBottom' : void 0;
        }
        const itemKey = item.getKey();
        return this._selectedKeys.includes(itemKey) || this._markedKey === itemKey
            ? 'topBottom'
            : void 0;
    }

    private _getStickyItem(): Model {
        if (this._stickyItem) {
            return this._stickyItem;
        }

        const keys = this._getValue(this._selectedKeys, this._options);
        if (this._options.multiSelect && keys.length) {
            this._items.each((item: Model) => {
                if (!this._stickyItem && keys.includes(item.get(this._options.keyProperty))) {
                    this._stickyItem = item;
                }
            });
        }
        return this._stickyItem;
    }

    private _resetStickyItem(): void {
        this._stickyItem = null;
    }

    private _itemStickyCallback(isSticked: boolean): void {
        if (this._isStickyItemSticked !== isSticked && this._options.multiSelect) {
            this._isStickyItemSticked = isSticked;
            this._setItemAction(this._options);
            this._setColumns(this._options);
        }
    }

    private _handleResetItems(): void {
        this._setFilter(this._selectedKeys, this._options);
        this._navigation = this._getNavigation(this._options);
    }

    private _getItemActions(historyId: string, itemActions: IItemAction[]): IItemAction[] {
        let itemActionsList = itemActions ? [...itemActions] : [];
        if (historyId) {
            itemActionsList = itemActionsList.concat([
                {
                    id: 'PinOff',
                    icon: 'icon-PinOff',
                    iconSize: 's',
                    tooltip: rk('Открепить'),
                    showType: TItemActionShowType.TOOLBAR,
                    handler: this._handlePinClick.bind(this),
                },
                {
                    id: 'PinNull',
                    icon: 'icon-PinNull',
                    iconSize: 's',
                    tooltip: rk('Закрепить'),
                    showType: TItemActionShowType.TOOLBAR,
                    handler: this._handlePinClick.bind(this),
                },
            ]);
        }
        return itemActionsList;
    }

    private _itemActionHandler(item: Model, itemAction: IItemAction, target?: HTMLElement): void {
        loadAsync<BaseAction>('Controls/actions:BaseAction').then((Action) => {
            const action = new Action({
                ...itemAction,
                commandOptions: {
                    columns: [
                        {
                            displayProperty: this._options.displayProperty,
                            textOverflow: 'ellipsis',
                            width: 'auto',
                        },
                    ],
                    ...itemAction.commandOptions,
                },
            });
            action.execute({
                item,
                sourceController: new SourceController({
                    ...this._options,
                    items: this._items,
                }),
                selection: {
                    selected: [item.getId()],
                    excluded: [],
                },
                parentProperty: this._options.parentProperty,
                nodeProperty: this._options.nodeProperty,
                target,
            });
        });
    }

    private _addSyntheticItemsToOriginItems(
        items: RecordSet,
        { emptyText, emptyKey, selectedAllText, selectedAllKey }: IListEditorOptions
    ): void {
        if (emptyText && !items.getRecordById(emptyKey)) {
            this._prependItem(emptyKey, emptyText, items);
        }

        if (selectedAllText && !items.getRecordById(selectedAllKey)) {
            this._prependItem(selectedAllKey, selectedAllText, items);
        }
    }

    private _prependItem(key: TKey, text: string, items: RecordSet = this._items): void {
        if (items) {
            const emptyItem = createSyntheticItem(this._options, key, text, items);
            items.prepend([emptyItem]);
        }
    }

    private _setFilter(
        selectedKeys: TKey[],
        {
            selectorTemplate,
            filter,
            historyId,
            keyProperty,
            resetValue,
            multiSelect,
            navigation,
            editorsViewMode,
        }: IListEditorOptions
    ): TFilter {
        this._filter = { ...filter };
        const isValueReseted = this._isValueReseted(selectedKeys, resetValue, multiSelect);
        if (
            editorsViewMode !== 'popupCloudPanelDefault' &&
            (selectorTemplate || navigation) &&
            selectedKeys?.length &&
            !isValueReseted
        ) {
            const maxItemsCount = getMaxItemsCount(navigation);
            if (maxItemsCount) {
                this._filter[keyProperty] = selectedKeys.slice(0, maxItemsCount);
            } else {
                this._filter[keyProperty] = selectedKeys;
            }
        } else if (isValueReseted) {
            delete this._filter[keyProperty];
        }
        if (historyId) {
            this._filter._historyIds = [historyId];
        }
        return this._filter;
    }
    private _isValueReseted(
        selectedKeys: TKey[],
        resetValue: TKey[] | TKey,
        multiSelect: boolean
    ): boolean {
        const selectedValue = this._getPropertyValue(selectedKeys, multiSelect, resetValue);
        const resetPropertyValue = this._getPropertyValue(resetValue, multiSelect);
        return isEqual(resetPropertyValue, selectedValue);
    }

    private _setMarkedKey(selectedKeys: TKey[], options: IListEditorOptions): void {
        this._markedKey = this._getMarkedKey(selectedKeys, options);
    }

    private _getMarkedKey(
        selectedKeys: TKey[],
        { multiSelect, resetValue }: IListEditorOptions
    ): TKey {
        if (!multiSelect) {
            const resetKey = resetValue instanceof Array ? resetValue[0] : resetValue;
            if (!selectedKeys.length || selectedKeys[0] === resetKey) {
                // чтобы список убрал маркер со сброшенного фильтра, нужно передать null
                return this._markedKey && this._options.editorsViewMode === 'popupCloudPanelDefault'
                    ? null
                    : resetKey;
            } else {
                return selectedKeys[0];
            }
        }
    }

    private _getSourceController(options: IListEditorOptions): SourceController {
        if (options.editorsViewMode === 'popupCloudPanelDefault' && options.extendedCaption) {
            if (!this._sourceController) {
                this._sourceController = new SourceController({
                    ...options,
                    items: options.items,
                });
            }
            return this._sourceController;
        } else {
            return options.sourceController;
        }
    }

    private _getNavigation(
        options: IListEditorOptions,
        selectedKeys?: string[]
    ): INavigationOptionValue<INavigationSourceConfig> {
        const selectedKeysArray = this._getValue(selectedKeys || this._selectedKeys, options);
        const navigation = object.clonePlain(options.navigation);

        if (navigation && (navigation.view === 'demand' || navigation.view === 'cut')) {
            navigation.viewConfig = {
                ...navigation.viewConfig,
                buttonView: 'separator',
                buttonConfig: {
                    size: 'listEditorFilter',
                    contrastBackground: false,
                },
            };
        }
        return selectedKeysArray?.length ? null : navigation;
    }

    private _getSelectedItems(): List<Model> {
        const selectedItems = [];
        const getItemById = (id, items) => {
            return items?.at(items?.getIndexByValue(this._items.getKeyProperty(), id));
        };

        factory(this._selectedKeys).each((key) => {
            const record = getItemById(key, this._items) || getItemById(key, this._selectedItems);
            if (record) {
                selectedItems.push(record);
            }
        });
        return new List({
            items: selectedItems,
        });
    }

    private _handlePinClick(item: Model): void {
        this._getHistoryService().then((historyService) => {
            historyService.update(item, { $_pinned: !item.get('pinned') }).then(() => {
                const sourceController = this._options.sourceController;
                sourceController.setFilter(this._setFilter(this._selectedKeys, this._options));
                sourceController.reload();
            });
            return historyService;
        });
    }

    private _getHistoryService(): Promise<unknown> {
        if (!this._historyService) {
            return import('Controls/history').then((history) => {
                this._historyService = new history.Service({
                    historyId: this._options.historyId,
                    pinned: true,
                });
                return this._historyService;
            });
        }
        return Promise.resolve(this._historyService);
    }

    private _setHiddenItemsCount(selectedKeys: TKey[]): void {
        if (this._options.navigation) {
            const hiddenItems = selectedKeys.filter((itemId) => {
                return !this._items.getRecordById(itemId);
            });
            this._hiddenItemsCount = hiddenItems.length;
        }
    }

    private _createDragNDropProvider(options: IListEditorOptions): DragNDropProvider {
        const provider = loadSync<typeof DragNDropProvider>(options.dragNDropProviderName);
        return new provider({
            sourceController: options.sourceController,
            propertyValue: options.propertyValue,
        });
    }

    static getDefaultOptions(): object {
        return {
            propertyValue: [],
            style: 'default',
            itemActions: [],
            expanderVisibility: 'visible',
            root: null,
            multiSelectVerticalAlign: 'top',
            itemTemplate: ItemTemplate,
        };
    }
}
