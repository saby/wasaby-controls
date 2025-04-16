/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Events';
import { constants } from 'Env/Env';
import * as ListTemplate from 'wml!Controls/_filterPanel/Editors/List/List';
import ItemTemplate from 'Controls/_filterPanel/Editors/resources/ItemTemplate';
import { navigateItem } from 'Controls/_filterPanel/Editors/resources/NavigateItem';
import getColumns from './List/Utils/getColumns';
import { IObservable } from 'Types/collection';
import { Object as EventObject } from 'Env/Event';
import createSyntheticItem from './List/Utils/createSyntheticItem';
import addItemsFromSelector, { getMaxItemsCount } from './List/Utils/addItemsFromSelector';
import { StackOpener, DialogOpener } from 'Controls/popup';
import { Model } from 'Types/entity';
import { IHistoryStore } from 'Controls/HistoryStore';
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
import 'css!Controls/filterPanel';
import 'css!Controls/masterDetail';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { loadSync, loadAsync } from 'WasabyLoader/ModulesLoader';
import DragNDropProvider from 'Controls/_filterPanel/Editors/List/DragNDropProvider';
import { BaseAction } from 'Controls/actions';
import * as rk from 'i18n!Controls';
import { ItemsEntity } from 'Controls/dragnDrop';
import { ICrud, IData, LOCAL_MOVE_POSITION, CrudEntityKey } from 'Types/source';
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
    protected _itemActions: IItemAction[];
    protected _itemsReadyCallback: Function = null;
    protected _markedKey: string | number;
    protected _expandedItems: TKey[] = [];
    protected _hiddenItemsCount: number = null;
    protected _itemPadding: IItemPadding = null;
    protected _stickyItem: Model;
    protected _isStickyItemSticked: boolean;
    protected _moreButtonVisible: boolean;
    protected _itemTemplateOptions: object;
    protected _currentPageId: string;
    protected _keyProperty: string | undefined;
    protected _groupProperty: string | null;
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
        this._setItemTemplateOptions(options);
        this._setMarkedKey(this._selectedKeys, options);
        this._setColumns(options);
        this._setFilter(this._selectedKeys, options);
        this._setItemAction(options);
        this._setMoreButtonVisibility(this._selectedKeys, options);
        this._navigation = this._getNavigation(options);
        this._groupProperty = options.groupProperty;

        if (options.expandedItems) {
            this._expandedItems = options.expandedItems;
        }

        if (options.dragNDropProviderName && options.sourceController) {
            this._dragNDropProvider = this._createDragNDropProvider(options);
        }

        if (sourceController) {
            this._subscribeDataLoad(sourceController, options);
            const needSetFilter = !isEqual(sourceController.getFilter(), this._filter);
            const items = sourceController.getItems();
            const needSetNavigation =
                !isEqual(sourceController.getNavigation(), this._navigation) &&
                (this._navigation?.view === 'demand' || this._navigation?.view === 'cut');
            if (needSetFilter) {
                sourceController.setFilter(this._filter);
            }
            if (needSetNavigation) {
                sourceController.setNavigation(this._navigation);
            }
            if (items) {
                this._setHiddenItemsCount(items, options);
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

            if (this._isHistoryInTree(options)) {
                const {
                    setHistoryItemsGroupProperty,
                    getGroupProperty,
                    prepareFilterPanelHistoryItems,
                    COPY_ORIG_ID,
                } = this._getPrepareHistoryUtils();

                const historyItems = prepareFilterPanelHistoryItems(
                    sourceController.getItems(),
                    options.historyId,
                    {
                        parentProperty: options.parentProperty,
                        keyProperty: options.keyProperty,
                        nodeProperty: options.nodeProperty,
                    }
                );

                setHistoryItemsGroupProperty(historyItems, options);
                this._groupProperty = getGroupProperty(historyItems, options);
                this._keyProperty = COPY_ORIG_ID;
            }
        }
    }

    protected _beforeUpdate(options: IListEditorOptions): void {
        const {
            propertyValue,
            filter,
            root,
            additionalTextProperty,
            mainCounterTooltip,
            additionalCounterTooltip,
            displayProperty,
            source,
            multiSelect,
            expandedItems,
            itemTemplateOptions,
            parentProperty,
            markerStyle,
            emptyKey,
            selectedAllKey,
        } = options;
        const sourceController = this._getSourceController(options);
        const sourceControllerChanged = this._options.sourceController !== options.sourceController;

        const itemTemplateOptionsChanged = !isEqual(
            itemTemplateOptions,
            this._options.itemTemplateOptions
        );
        const valueChanged =
            !this._isPropertyValuesEqual(
                propertyValue,
                this._options.propertyValue,
                multiSelect,
                options
            ) &&
            !this._isPropertyValuesEqual(propertyValue, this._selectedKeys, multiSelect, options);
        let filterChanged = !isEqual(filter, this._options.filter);
        const displayPropertyChanged = displayProperty !== this._options.displayProperty;
        const parentPropertyChanged = parentProperty !== this._options.parentProperty;
        const markerStyleChanged = markerStyle !== this._options.markerStyle;
        const emptyKeyChanged = emptyKey !== this._options.emptyKey;
        const selectedAllKeyChanged = selectedAllKey !== this._options.selectedAllKey;
        const additionalDataChanged =
            additionalTextProperty !== this._options.additionalTextProperty;
        const mainCounterTooltipChanged = mainCounterTooltip !== this._options.mainCounterTooltip;
        const additionalCounterTooltipChanged =
            additionalCounterTooltip !== this._options.additionalCounterTooltip;
        const columnsTemplateChanged = this._isTemplatesChanged(this._options, options);
        const expandedItemsChanged = !isEqual(expandedItems, this._options.expandedItems);
        const sourceChanged = source !== this._options.source;
        const rootChanged = root !== this._options.root;
        if (additionalDataChanged || valueChanged || displayPropertyChanged) {
            this._setSelectedKeys(options);
            this._resetStickyItem();
            this._setColumns(options);
            this._navigation = this._getNavigation(options);
            this._setHiddenItemsCount();
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
            this._subscribeDataLoad(sourceController, this._options);
        }
        if (
            sourceController &&
            (filterChanged || sourceChanged || sourceControllerChanged || rootChanged)
        ) {
            this._updateSourceControllerOptions(options);
        }
        if (!isEqual(options.itemActions, this._options.itemActions)) {
            this._setItemAction(options);
        }
        if (
            itemTemplateOptionsChanged ||
            parentPropertyChanged ||
            markerStyleChanged ||
            emptyKeyChanged ||
            selectedAllKeyChanged
        ) {
            this._setItemTemplateOptions(options);
        }
    }

    protected _itemActionVisibilityCallback(action: IItemAction, item: Model): boolean {
        let isActionVisible;
        const itemKey = item.getKey();

        if (this._isHistoryInTree(this._options)) {
            const { isHistoryItem, IS_DUPLICATED_ITEM } = this._getPrepareHistoryUtils();
            if (isHistoryItem(item) && !(action.id === 'PinNull' || action.id === 'PinOff')) {
                return false;
            }
            if (item.get(IS_DUPLICATED_ITEM) === true) {
                return false;
            }
        }
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
        this._setHiddenItemsCount();
        this._setMoreButtonVisibility(this._selectedKeys, this._options);
        this._initCurrentPageId(this._markedKey);
        if (this._isHistoryInTree(this._options)) {
            this._getPrepareHistoryUtils().setHistoryKeyProperty(this._items);
        }
    }

    protected _onAfterCollectionChange(event: EventObject, action: string): void {
        this._resetStickyItem();
        this._addSyntheticItemsToOriginItems(this._items, this._options);
        this._setHiddenItemsCount();
        this._setMoreButtonVisibility(this._selectedKeys, this._options);
        this._updateSourceControllerItems(action);
        if (this._isHistoryInTree(this._options)) {
            this._getPrepareHistoryUtils().setHistoryKeyProperty(this._items);
        }
    }

    private _updateSourceControllerItems(action: string): void {
        const sourceController = this._sourceController;
        if (
            action === IObservable.ACTION_RESET &&
            this._options.sourceController &&
            sourceController &&
            sourceController !== this._options.sourceController &&
            this._options.extendedCaption &&
            sourceController.getItems() !== this._items
        ) {
            sourceController.setItems(this._items);
        }
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

    protected _handleItemClick(_event: SyntheticEvent, item: Model): void {
        this._setPropertyValueByItem(item);
    }

    private _handleDataLoad(_event: SyntheticEvent, items: RecordSet, direction: Direction): void {
        if (!direction) {
            this._addSyntheticItemsToOriginItems(items, this._options);
        }

        if (this._isHistoryInTree(this._options)) {
            this._setHistoryAndGroupPropertyState(items, this._options);
            return Promise.resolve(items);
        }
    }

    private _subscribeDataLoad(sourceController, options): void {
        sourceController?.subscribe('dataLoad', this._handleDataLoad, this);

        if (this._isHistoryInTree(options)) {
            sourceController?.setNodeLoadCallback((items: RecordSet, _nodeName: string) => {
                this._setHistory(items, options);
            });
        }
    }

    private _unsubscribeDataLoad(sourceController): void {
        sourceController?.unsubscribe('dataLoad', this._handleDataLoad, this);
    }

    private _isSyntheticKey(key: TKey): boolean {
        return key === this._options.emptyKey || key === this._options.selectedAllKey;
    }

    protected _getKey(item: Model) {
        return item.get(
            this._isHistoryInTree(this._options)
                ? this._getPrepareHistoryUtils().COPY_ORIG_ID
                : this._options.keyProperty
        );
    }

    _setPropertyValueByItem(item: Model): void {
        let selectedKeysArray = this._options.multiSelect ? [...this._selectedKeys] : [];
        let itemKey;
        if (item) {
            itemKey = this._isHistoryInTree(this._options)
                ? this._getKey(item)
                : item.get(this._options.keyProperty);
            const itemIndex = selectedKeysArray.indexOf(itemKey);
            if (itemIndex !== -1) {
                selectedKeysArray.splice(itemIndex, 1);
            } else {
                if (this._isSyntheticKey(itemKey)) {
                    selectedKeysArray = [itemKey];
                } else if (!selectedKeysArray.includes(itemKey)) {
                    selectedKeysArray.unshift(itemKey);
                }
            }
            if (this._needNavigateItem(item)) {
                this._currentPageId = item.get('pageId');
                this._markedKey = itemKey;
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

    protected _handleSelectorResult(result: RecordSet | List<Model>): Promise<void> {
        return loadAsync<typeof import('Controls/lookup')>('Controls/lookup').then(
            async ({ ToSourceModel }) => {
                const items = ToSourceModel(
                    result,
                    this._options.source as IData & ICrud,
                    this._options.keyProperty
                );
                this._addItemsFromSelector(items);

                this._loadHistoryModules().then(([historyStore, historySaveCallback]) => {
                    if (this._options.historyId) {
                        const itemsIds: CrudEntityKey[] = [];
                        items.each((el) => {
                            itemsIds.push(el.get(this._options.keyProperty));
                        });
                        historyStore?.Store.push(this._options.historyId, itemsIds).then(() => {
                            historySaveCallback?.();
                        });
                    }
                });
            }
        );
    }

    private _loadHistoryModules(): Promise<
        [{ Store: IHistoryStore }, IListEditorOptions['historySaveCallback']]
    > {
        let historySavePromise = Promise.resolve(this._options.historySaveCallback);
        if (typeof this._options.historySaveCallback === 'string') {
            historySavePromise = loadAsync<IListEditorOptions['historySaveCallback']>(
                this._options.historySaveCallback
            );
        }
        return Promise.all([
            loadAsync<{ Store: IHistoryStore }>('Controls/HistoryStore'),
            historySavePromise,
        ]);
    }

    private _addItemsFromSelector(result: RecordSet | List<Model>): void {
        const selectedKeys = [];
        const { sourceController } = this._options;
        result.forEach((item) => {
            selectedKeys.push(item.getKey());
        });
        if (selectedKeys.length) {
            this._setFilter(selectedKeys, this._options);
        }

        // Будет удалено после перехода всеми прикладными программистами на новую стики панель
        const textValue = this._getTextValueFromSelectorResult(result);
        this._processPropertyValueChanged(selectedKeys, textValue);

        this._navigation = this._getNavigation(this._options, selectedKeys);

        if (this._options.navigation) {
            const newItems = this._items.clone();
            addItemsFromSelector(result, newItems, this._options);
            this._items.assign(newItems);
            this._selectedItems = result;
            this._getSourceController(this._options)?.setFilter(this._filter);
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
        // FIXME Костыль, список сейчас стреляет всплывающим событием expandedItemsChanged
        // А сверху может быть Browser, которое это событие отловит
        // cобытие списка явно всплывающим быть не должно
        event.stopPropagation();
        if (this._expandedItems !== expandedItems) {
            this._expandedItems = expandedItems;

            if (this._options.nodeHistoryId) {
                this._getSourceController(this._options).setExpandedItems(expandedItems);
                this._getSourceController(this._options).updateExpandedItemsInUserStorage();
            }
        }
    }

    protected _dragStart(event: Event, items: RecordSet, key: TKey): ItemsEntity {
        if (
            this._isHistoryInTree(this._options) &&
            this._getPrepareHistoryUtils().isHistoryItem(
                this._getSourceController(this._options).getItems().getRecordById(key)
            )
        ) {
            return null;
        }

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
        const { _options } = this;
        const prevSelectedKeys = this._selectedKeys;
        const nextSelectedKeys = this._setSelectedKeys(_options, value);

        if (!nextSelectedKeys.length) {
            this._handleResetItems();
        }
        this._resetStickyItem();
        this._setMarkedKey(nextSelectedKeys, _options);
        this._setColumns(_options);
        this._setHiddenItemsCount();
        const extendedValue = {
            value: this._getPropertyValue(value, _options.multiSelect),
            textValue: textValue || this._getTextValue(nextSelectedKeys),
        };

        if (!isEqual(prevSelectedKeys, nextSelectedKeys)) {
            if (_options.onPropertyValueChanged) {
                _options.onPropertyValueChanged(extendedValue);
            } else {
                this._notify('propertyValueChanged', [extendedValue], { bubbling: true });
            }
        }
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
            sourceControllerItems.setMetaData(items.getMetaData());
            this._options.sourceController.setItems(sourceControllerItems, true);
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
        const needReload =
            sourceController?.updateOptions({
                ...options,
                filter: this._filter,
            }) || !isEqual(this._filter, sourceController?.getFilter());

        if (this._navigation?.view === 'demand' || this._navigation?.view === 'cut') {
            sourceController.setNavigation(this._navigation);
        }
        sourceController?.setFilter(this._filter);
        options.sourceController?.setFilter(this._filter);

        if (!options.deepReload) {
            sourceController?.setExpandedItems([]);
        }

        if (!sourceControllerChanged || needReload) {
            if (options.deepReload) {
                // Пока полностью не вынесли функционал перезагрузки и сохранения навигации из списка
                // надо звать метод reload, потому что в нём реализована логика сохранения навигации
                this._children.gridView.reload(true);
            } else {
                sourceController?.reload().catch((error) => {
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
        multiSelect: boolean,
        options: IListEditorOptions
    ): boolean {
        const newPropertyValue = this._getPropertyValue(newValue, multiSelect, undefined, options);
        const currentPropertyValue = this._getPropertyValue(
            currentValue,
            multiSelect,
            undefined,
            options
        );
        return isEqual(newPropertyValue, currentPropertyValue);
    }

    private _setItemTemplateOptions({
        itemTemplateOptions,
        parentProperty,
        markerStyle,
        emptyKey,
        selectedAllKey,
    }: IListEditorOptions): void {
        this._itemTemplateOptions = {
            ...itemTemplateOptions,
            ...{
                parentProperty,
                markerStyle,
                emptyKey,
                selectedAllKey,
                itemStickyCallback: this._itemStickyCallback,
            },
        };
    }

    private _setSelectedKeys(
        options: IListEditorOptions,
        value: TKey[] | TKey = options.propertyValue
    ): TKey[] {
        const { resetValue, multiSelect } = options;

        const selectedValue = this._getPropertyValue(value, multiSelect, undefined, options);
        const resetPropertyValue = this._getPropertyValue(
            resetValue,
            multiSelect,
            undefined,
            options
        );

        if (isEqual(selectedValue, resetPropertyValue)) {
            return (this._selectedKeys = []);
        }

        return (this._selectedKeys = this._getSelectedKeysByValue(value, multiSelect));
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
        resetValue: TKey[] = this._options.resetValue,
        options: IListEditorOptions = this._options
    ): TKey[] | TKey {
        const isArray = Array.isArray(value);
        let propValue;
        if (multiSelect) {
            propValue =
                isArray && value.includes(this._options.emptyKey)
                    ? []
                    : this._getOriginalKeys(value, options);
        } else if (isArray) {
            propValue =
                value[0] !== undefined ? this._getOriginalKey(value[0], options) : resetValue;
        } else {
            propValue = this._getOriginalKey(value, options);
        }
        return propValue;
    }

    private _getOriginalKey(key: TKey, options: IListEditorOptions = this._options): TKey {
        if (!this._isHistoryInTree(options)) {
            return key;
        }
        const { COPY_ORIG_ID } = this._getPrepareHistoryUtils();
        const items = this._getSourceController(options).getItems();
        return items.at(items.getIndexByValue(COPY_ORIG_ID, key))?.get(options.keyProperty) || key;
    }

    private _getOriginalKeys(
        keys: TKey[],
        options: IListEditorOptions = this._options
    ): TKey[] | undefined {
        return keys
            ? keys.map((key) => {
                  return this._getOriginalKey(key, options);
              })
            : keys;
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
        const filter = this._filter;
        this._setFilter(this._selectedKeys, this._options);
        this._navigation = this._getNavigation(this._options);

        if (!isEqual(this._filter, filter)) {
            this._updateSourceControllerOptions(this._options);
        }
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
                    expandedItems: this._expandedItems,
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

    private _initCurrentPageId(markedKey: TKey): void {
        if (!this._currentPageId) {
            this._currentPageId = this._items.getRecordById(markedKey)?.get('pageId');
        }
    }

    private _setMarkedKey(selectedKeys: TKey[], options: IListEditorOptions): void {
        this._markedKey = this._getMarkedKey(selectedKeys, options);
    }

    private _getMarkedKey(
        selectedKeys: TKey[],
        { multiSelect, resetValue, editorsViewMode }: IListEditorOptions
    ): TKey | undefined {
        if (!multiSelect) {
            const resetKey = Array.isArray(resetValue) ? resetValue[0] : resetValue;
            if (!selectedKeys.length || selectedKeys[0] === resetKey) {
                // чтобы список убрал маркер со сброшенного фильтра, нужно передать null
                return this._markedKey && editorsViewMode === 'popupCloudPanelDefault'
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

            if (
                this._getSourceController(options)?.hasMoreData('down') &&
                !this._needShowMoreButton(options)
            ) {
                return navigation;
            }
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
        this._loadHistoryModules().then(([{ Store }, historySaveCallback]) => {
            Store.togglePin(this._options.historyId, item.get(this._options.keyProperty)).then(
                async () => {
                    await historySaveCallback?.();

                    const sourceController = this._options.sourceController;
                    sourceController?.setFilter(this._setFilter(this._selectedKeys, this._options));
                    sourceController?.reload();
                }
            );
        });
    }

    private _setHiddenItemsCount(items = this._items, options = this._options): void {
        if (options.navigation) {
            const hiddenItems = this._selectedKeys.filter((itemId) => {
                return !items.getRecordById(itemId);
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

    protected _needShowMoreButton(options: IListEditorOptions): boolean {
        return (
            options.selectorTemplate &&
            options.navigation?.view !== 'demand' &&
            options.navigation?.view !== 'infinity' &&
            this._moreButtonVisible
        );
    }

    protected _getPrepareHistoryUtils(): typeof import('Controls/Utils/History/PrepareFilterPanelItems') {
        return loadSync('Controls/Utils/History/PrepareFilterPanelItems');
    }

    private _isHistoryInTree(options): boolean {
        //!options.isFlatList - временное решение https://online.saby.ru/opendoc.html?guid=d959a56d-a84e-483b-8e22-d092e6cd9b22&client=3
        return options.historyId && options.parentProperty && !options.isFlatHistory;
    }

    private _setHistory(items: RecordSet, options: IListEditorOptions): RecordSet {
        const { prepareFilterPanelHistoryItems, COPY_ORIG_ID, setHistoryItemsGroupProperty } =
            this._getPrepareHistoryUtils();
        const historyItems = prepareFilterPanelHistoryItems(items, options.historyId, {
            parentProperty: options.parentProperty,
            keyProperty: options.keyProperty,
            nodeProperty: options.nodeProperty,
        });
        setHistoryItemsGroupProperty(historyItems, this._options);
        historyItems.setKeyProperty(COPY_ORIG_ID);
        return historyItems;
    }

    private _setHistoryAndGroupPropertyState(
        items: RecordSet,
        options: IListEditorOptions
    ): RecordSet {
        const { getGroupProperty } = this._getPrepareHistoryUtils();
        const historyItems = this._setHistory(items, options);
        this._groupProperty = getGroupProperty(historyItems, this._options);
        return historyItems;
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
            bottomPaddingMode: 'basic',
        };
    }
}
