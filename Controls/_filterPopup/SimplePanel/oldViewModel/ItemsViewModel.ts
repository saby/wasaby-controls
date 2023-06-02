/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import BaseViewModel = require('Controls/_filterPopup/SimplePanel/oldViewModel/BaseViewModel');
import ItemsUtil = require('Controls/_filterPopup/SimplePanel/oldViewModel/ItemsUtil');
import cInstance = require('Core/core-instance');
import { Logger } from 'UI/Utils';
import collection = require('Types/collection');
import { RecordSet } from 'Types/collection';
import { Record, Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import { CollectionItem, groupConstants } from 'Controls/display';
import { isEqualItems } from 'Controls/dataSource';

/**
 * @class Controls/_filterPopup/SimplePanel/oldViewModel/ItemsViewModel
 * @private
 */

const _private = {
    isFullCacheResetAction(action: string) {
        return (
            action === collection.IObservable.ACTION_REMOVE ||
            action === collection.IObservable.ACTION_ADD ||
            action === collection.IObservable.ACTION_MOVE
        );
    },
    checkDeprecated(cfg): void {
        if (cfg.groupingKeyCallback) {
            Logger.warn(
                'IGrouped: Option "groupingKeyCallback" is deprecated and removed in 20.2000. Use option "groupProperty".',
                self
            );
        }
    },

    prepareCollapsedGroupsByArray(collapsedGroups): {} {
        const result = {};
        if (collapsedGroups) {
            collapsedGroups.forEach((group) => {
                result[group] = true;
            });
        }
        return result;
    },
    getDisplayFilter(data, cfg) {
        const filter = [];
        if (cfg.itemsFilterMethod) {
            filter.push(cfg.itemsFilterMethod);
        }
        return filter;
    },
};
const ItemsViewModel = BaseViewModel.extend({
    _display: null,
    _items: null,
    _itemDataCache: null,
    _curIndex: 0,
    _onCollectionChangeFnc: null,
    _onAfterCollectionChangeFnc: null,
    _prefixItemVersion: null,
    _updateIndexesCallback: null,

    constructor: function ItemsViewModelConstructor(cfg) {
        this._prefixItemVersion = 0;
        this._itemDataCache = {};
        ItemsViewModel.superclass.constructor.apply(this, arguments);
        this._onCollectionChangeFnc = this._onCollectionChange.bind(this);
        this._onAfterCollectionChangeFnc =
            this._onAfterCollectionChange.bind(this);
        this._onMetaDataChanged = this._onMetaDataChanged.bind(this);
        if (cfg.items) {
            if (cfg.itemsReadyCallback) {
                cfg.itemsReadyCallback(cfg.items);
            }
            this._items = cfg.items;
            this._updateSubscriptionOnMetaChange(null, cfg.items);
            this._display = this._prepareDisplay(cfg.items, this._options);
            this._updateResults(this._items);
            this._display.subscribe(
                'onCollectionChange',
                this._onCollectionChangeFnc
            );
            this._display.subscribe(
                'onAfterCollectionChange',
                this._onAfterCollectionChangeFnc
            );
        }
    },

    getMetaResults(): {} {
        const display = this.getDisplay();
        if (display) {
            return display.getMetaResults();
        }
    },

    _prepareDisplay(items, cfg) {
        const filter = this.getDisplayFilter(
            this.prepareDisplayFilterData(),
            cfg
        );
        return ItemsUtil.getDefaultDisplayFlat(items, cfg, filter);
    },

    setSupportVirtualScroll(value) {
        this._options.supportVirtualScroll = value;
    },

    _isSupportVirtualScroll() {
        return this._options.supportVirtualScroll;
    },

    _getCurIndexForReset(startIndex: number): number {
        return startIndex;
    },
    _getEndIndexForReset(): number {
        let endIndex;
        if (this._isSupportVirtualScroll()) {
            endIndex = !!this._stopIndex ? this._stopIndex : 0;
        } else {
            endIndex = this._display ? this._display.getCount() : 0;
        }
        return endIndex;
    },
    reset(): void {
        this._startIndex =
            this._isSupportVirtualScroll() && !!this._startIndex
                ? this._startIndex
                : 0;
        this._curIndex = this._getCurIndexForReset(this._startIndex);
        this._endIndex = this._getEndIndexForReset();
    },

    isEnd() {
        return this._curIndex < this._endIndex;
    },

    isShouldBeDrawnItem() {
        return (
            this._startIndex <= this._curIndex &&
            this._curIndex <= this._stopIndex
        );
    },

    setUpdateIndexesCallback(updateIndexesCallback: Function): void {
        this._updateIndexesCallback = updateIndexesCallback;
    },

    setIndexes(newStartIndex: number, stopIndex: number): boolean {
        const newStopIndex = Math.min(stopIndex, this.getCount());
        let isUpdated = false;

        if (
            this._startIndex !== newStartIndex ||
            this._stopIndex !== newStopIndex
        ) {
            this._startIndex = newStartIndex;
            this._stopIndex = newStopIndex;
            isUpdated = true;
            this._nextModelVersion(true, 'indexesChanged');
            if (this._updateIndexesCallback) {
                this._updateIndexesCallback();
            }
        }

        return isUpdated;
    },

    isLast() {
        let lastIndex;
        if (this._isSupportVirtualScroll()) {
            lastIndex = this._stopIndex - 1;
        } else {
            lastIndex = this._display ? this._display.getCount() - 1 : 0;
        }
        return this._curIndex === lastIndex;
    },

    goToNext() {
        this._curIndex++;
    },

    getCurrent() {
        const dispItem = this._display.at(this._curIndex);
        return this.getItemDataByItem(dispItem);
    },

    setKeyProperty(keyProperty: string): void {
        if (keyProperty !== this.getKeyProperty()) {
            const display = this.getDisplay();
            if (display) {
                display.setKeyProperty(keyProperty);
            } else {
                this._options.keyProperty = keyProperty;
            }
        }
    },

    getKeyProperty(): string {
        const display = this.getDisplay();
        if (display) {
            return display.getKeyProperty();
        } else {
            return this._options.keyProperty;
        }
    },

    _nextModelVersion(
        notUpdatePrefixItemVersion?: boolean,
        changesType?: string | string[],
        action?: string,
        newItems?: [CollectionItem<Model>],
        newItemsIndex?: number,
        removedItems?: [CollectionItem<Model>],
        removedItemsIndex?: number
    ): void {
        let changedItems = [];

        if (!notUpdatePrefixItemVersion) {
            this._prefixItemVersion++;
        }
        this._nextVersion();

        if (
            notUpdatePrefixItemVersion &&
            !_private.isFullCacheResetAction(action)
        ) {
            if (Array.isArray(newItems) && newItems.length > 0) {
                changedItems = changedItems.concat(newItems);
            }
            if (Array.isArray(removedItems) && removedItems.length > 0) {
                changedItems = changedItems.concat(removedItems);
            }
        }
        this._resetCacheOnChange(changesType, changedItems);

        this._notify(
            'onListChange',
            changesType,
            action,
            newItems,
            newItemsIndex,
            removedItems,
            removedItemsIndex
        );
    },

    nextModelVersion(notUpdatePrefixItemVersion, changesType) {
        this._nextModelVersion(notUpdatePrefixItemVersion, changesType);
    },

    _getItemVersion(item) {
        // records have defined method getVersion, groups haven't
        if (item && item.getVersion) {
            return '' + item.getVersion();
        }
        return '' + item;
    },

    _calcItemVersion(item) {
        let version = '' + this._prefixItemVersion;
        version += this._getItemVersion(item);
        return version;
    },

    getItemDataByItem(dispItem) {
        const cacheKey = this._getDisplayItemCacheKey(dispItem);
        const display = this.getDisplay();

        if (this.isCachedItemData(cacheKey)) {
            return this.getCachedItemData(cacheKey);
        }

        const itemData = {
            getPropValue: ItemsUtil.getPropertyValue,
            style: this._options.style,
            keyProperty: this.getKeyProperty(),
            index: this._display.getIndex(dispItem),
            item: dispItem.getContents(),
            dispItem,
            theme: this.getTheme(),
            _preferVersionAPI: true,
            getVersion: (): string => {
                return this._calcItemVersion(itemData.item, itemData.key);
            },
        };

        // The key of breadcrumbs row is the key of the last item in the crumbs.
        if (dispItem.getContents() instanceof Array) {
            const breadCrumbs = dispItem.getContents();
            itemData.key = ItemsUtil.getPropertyValue(
                breadCrumbs[breadCrumbs.length - 1],
                this.getKeyProperty()
            );
        } else {
            itemData.key = ItemsUtil.getPropertyValue(
                dispItem.getContents(),
                this.getKeyProperty()
            );
        }

        if (display.getGroup()) {
            if (this._isGroup(itemData.item)) {
                itemData.isGroup = true;
                itemData.isHiddenGroup =
                    itemData.item === groupConstants.hiddenGroup;
                itemData.isGroupExpanded = this.isGroupExpanded(itemData.item);
                itemData.metaData = this._items.getMetaData();
            }
        }

        this.setCachedItemData(cacheKey, itemData);

        return itemData;
    },

    getCollapsedGroups() {
        const display = this.getDisplay();
        if (display) {
            return display.getCollapsedGroups();
        } else {
            // todo task1179709412 https://online.sbis.ru/opendoc.html?guid=43f508a9-c08b-4938-b0e8-6cfa6abaff21
            return this._options.collapsedGroups;
        }
    },

    setCollapsedGroups(collapsedGroups): void {
        const display = this.getDisplay();
        if (display) {
            display.setCollapsedGroups(collapsedGroups);
            this.setFilter(
                this.getDisplayFilter(
                    this.prepareDisplayFilterData(),
                    this._options
                )
            );
            this._nextModelVersion();
        } else {
            // todo task1179709412 https://online.sbis.ru/opendoc.html?guid=43f508a9-c08b-4938-b0e8-6cfa6abaff21
            this._options.collapsedGroups = collapsedGroups;
        }
    },

    isGroupExpanded(groupId): boolean {
        const collapsedGroups = this.getCollapsedGroups();
        return collapsedGroups ? collapsedGroups.indexOf(groupId) === -1 : true;
    },

    toggleGroup(groupId, state: boolean): void {
        if (typeof state === 'undefined') {
            state = !this.isGroupExpanded(groupId);
        }
        const collapsedGroups = this.getCollapsedGroups() || [];
        const newCollapsedGroups = [...collapsedGroups];
        if (state) {
            const index = newCollapsedGroups.indexOf(groupId, 0);
            if (index > -1) {
                newCollapsedGroups.splice(index, 1);
            }
        } else {
            newCollapsedGroups.push(groupId);
        }
        this.setCollapsedGroups(newCollapsedGroups);
        this._notify('onGroupsExpandChange', {
            group: groupId,
            changeType: state ? 'expand' : 'collapse',
            collapsedGroups: newCollapsedGroups,
        });
    },

    setFilter(filter) {
        this._display.setFilter(filter);
        this.nextModelVersion();
    },

    prepareDisplayFilterData(): {} {
        return {
            collapsedGroups: _private.prepareCollapsedGroupsByArray(
                this.getCollapsedGroups()
            ),
        };
    },

    getDisplayFilter(data, cfg) {
        const filters = _private.getDisplayFilter(data, cfg);
        if (cfg.groupingKeyCallback || cfg.groupProperty) {
            filters.push(
                this.displayFilterGroups.bind({
                    collapsedGroups: data.collapsedGroups,
                })
            );
        }
        return filters;
    },
    displayFilterGroups(item, index, displayItem) {
        return (
            (item ? item === groupConstants.hiddenGroup || !item.get : true) ||
            !this.collapsedGroups[
                displayItem.getOwner().getGroup()(item, index, displayItem)
            ]
        );
    },
    setGroupProperty(groupProperty: string): void {
        const display = this.getDisplay();
        if (display) {
            display.setGroupProperty(groupProperty);
        } else {
            // todo task1179709412 https://online.sbis.ru/opendoc.html?guid=43f508a9-c08b-4938-b0e8-6cfa6abaff21
            this._options.groupProperty = groupProperty;
        }
    },

    getGroupProperty(): string {
        const display = this.getDisplay();
        if (display) {
            return display.getGroupProperty();
        } else {
            // todo task1179709412 https://online.sbis.ru/opendoc.html?guid=43f508a9-c08b-4938-b0e8-6cfa6abaff21
            return this._options.groupProperty;
        }
    },

    getNext() {
        const itemIndex = this._curIndex + 1;
        const dispItem = this._display.at(itemIndex);
        return {
            getPropValue: ItemsUtil.getPropertyValue,
            keyProperty: this.getKeyProperty(),
            index: itemIndex,
            item: dispItem.getContents(),
            dispItem,
        };
    },

    getCurrentIndex() {
        return this._curIndex;
    },

    getItemById(
        id: string | number,
        keyProperty: string,
        withFilter: boolean = true
    ) {
        return this._display
            ? this._display.getItemBySourceKey(id, withFilter)
            : undefined;
    },

    getItemBySourceKey(id) {
        return this.getItemById(id);
    },

    getCount() {
        return this._display ? this._display.getCount() : 0;
    },

    _onCollectionChange(
        event,
        action,
        newItems,
        newItemsIndex,
        removedItems,
        removedItemsIndex
    ) {
        this._onBeginCollectionChange(
            action,
            newItems,
            newItemsIndex,
            removedItems,
            removedItemsIndex
        );

        /**
         * Virtual scroll should update indexes before onListChange event fires, otherwise subscribers of the onListChange event are going to work with the stale indexes.
         * It can cause all kinds of troubles, e.g. out of bounds access.
         * https://online.sbis.ru/opendoc.html?guid=e7978ebd-881c-494b-8449-d04af83f3404
         */
        const collectionChangeResult = this._notify.apply(
            this,
            ['onCollectionChange'].concat(
                Array.prototype.slice.call(arguments, 1)
            )
        );

        const shouldNotUpdatePrefix =
            collectionChangeResult === 'updatePrefix'
                ? false
                : action !== collection.IObservable.ACTION_RESET &&
                  action !== collection.IObservable.ACTION_MOVE;
        let changesType = 'collectionChanged';
        // TODO https://online.sbis.ru/opendoc.html?guid=b8b8bd83-acd7-44eb-a915-f664b350363b
        //  Костыль, позволяющий определить, что мы загружаем файл и его прогрессбар изменяется
        //  Это нужно, чтобы в ListView не вызывался resize при изменении прогрессбара и не сбрасывался hovered в плитке
        if (
            action === collection.IObservable.ACTION_CHANGE &&
            this._isLoadingPercentsChanged(newItems)
        ) {
            changesType = 'loadingPercentChanged';
        }

        this._nextModelVersion(
            shouldNotUpdatePrefix,
            changesType,
            action,
            newItems,
            newItemsIndex,
            removedItems,
            removedItemsIndex
        );
        this._onEndCollectionChange(
            action,
            newItems,
            newItemsIndex,
            removedItems,
            removedItemsIndex
        );
    },

    _onAfterCollectionChange(): void {
        this._notify('onAfterCollectionChange');
    },

    _onBeginCollectionChange() {
        // method may be implemented
    },
    _onEndCollectionChange() {
        // method may be implemented
    },

    _execUpdateSubscriptionOnMetaChange(
        items: RecordSet,
        command: 'subscribe' | 'unsubscribe',
        isRecordSetEqual?: boolean
    ): void {
        if (
            items &&
            cInstance.instanceOfModule(items, 'Types/collection:RecordSet')
        ) {
            if (!isRecordSetEqual) {
                items[command]('onPropertyChange', this._onMetaDataChanged);
            }

            const meta = items.getMetaData();
            if (
                meta &&
                meta.results &&
                cInstance.instanceOfModule(meta.results, 'Types/entity:Model')
            ) {
                meta.results[command](
                    'onPropertyChange',
                    this._onMetaDataChanged
                );
            }
        }
    },

    _updateSubscriptionOnMetaChange(
        oldItems: RecordSet | null,
        newItems: RecordSet | null,
        isRecordSetEqual?: boolean
    ): void {
        this._execUpdateSubscriptionOnMetaChange(
            oldItems,
            'unsubscribe',
            isRecordSetEqual
        );
        this._execUpdateSubscriptionOnMetaChange(
            newItems,
            'subscribe',
            isRecordSetEqual
        );
    },

    _onMetaDataChanged(): void {
        if (this._updateResults(this._items)) {
            this._nextModelVersion(true);
        }
    },

    _updateResults(items: RecordSet): boolean {
        const metaData = items && items.getMetaData && items.getMetaData();
        const shouldUpdate =
            !!metaData &&
            !isEqual(metaData, {}) &&
            typeof metaData.results !== 'undefined';
        if (shouldUpdate) {
            this._updateSubscriptionOnMetaChange(this._items, items, true);
        }
        return shouldUpdate;
    },

    _convertItemKeyToCacheKey(itemKey) {
        // Model can have an item with the key 1 and a group with the key "1".
        // We need to differentiate between them in cache, so we add an _str postfix
        // to the string ids (for cache only)
        if (typeof itemKey === 'string') {
            return itemKey + '_str';
        }
        return itemKey;
    },
    _getDisplayItemCacheKey(dispItem) {
        const key = ItemsUtil.getDisplayItemKey(
            dispItem,
            this.getKeyProperty()
        );
        return this._convertItemKeyToCacheKey(key);
    },
    isCachedItemData(itemKey) {
        return (
            typeof itemKey !== 'undefined' &&
            typeof this._itemDataCache[itemKey] !== 'undefined'
        );
    },
    getCachedItemData(itemKey) {
        return this._itemDataCache[itemKey];
    },
    setCachedItemData(itemKey, cache) {
        this._itemDataCache[itemKey] = cache;
    },
    resetCachedItemData(itemKey?) {
        if (typeof itemKey !== 'undefined') {
            delete this._itemDataCache[itemKey];
        } else {
            this._itemDataCache = {};
        }
    },
    _resetCacheOnChange(changesType, changedItems?) {
        if (
            changesType === 'indexesChanged' ||
            changesType === 'itemActionsUpdated'
        ) {
            return;
        } else if (Array.isArray(changedItems) && changedItems.length > 0) {
            changedItems.forEach((item) => {
                if (item) {
                    const key = this._getDisplayItemCacheKey(item);
                    this.resetCachedItemData(key);
                }
            });
        } else {
            // Full cache reset
            this.resetCachedItemData();
        }
    },

    _isGroup(item) {
        return item ? item === groupConstants.hiddenGroup || !item.get : true;
    },

    isAllGroupsCollapsed(): boolean {
        const collapsedGroups = this.getCollapsedGroups();
        const display = this.getDisplay();
        if (!collapsedGroups || !display) {
            return false;
        }
        for (let i = 0; i < display.getItems().length; i++) {
            if (collapsedGroups.indexOf(display.getGroupByIndex(i)) === -1) {
                return false;
            }
        }
        return true;
    },

    // todo task1179709412 https://online.sbis.ru/opendoc.html?guid=43f508a9-c08b-4938-b0e8-6cfa6abaff21
    setItems(items, cfg): void {
        const metaData = items.getMetaData();
        if (isEqualItems(this._items, items)) {
            this._items.setMetaData(metaData);
            this._items.assign(items);
            this._updateSubscriptionOnMetaChange(this._items, items, true);
            this._display.setHasMoreData(metaData?.more);
        } else {
            if (this._options.itemsReadyCallback) {
                this._options.itemsReadyCallback(items);
            }
            this._updateSubscriptionOnMetaChange(this._items, items);
            this._items = items;
            const oldDisplay = this._display;
            this._display = this._prepareDisplay(this._items, cfg);
            this._updateResults(this._items);
            this._display.setHasMoreData(metaData?.more);
            this._display.subscribe(
                'onCollectionChange',
                this._onCollectionChangeFnc
            );
            this._display.subscribe(
                'onAfterCollectionChange',
                this._onAfterCollectionChangeFnc
            );
            if (oldDisplay) {
                oldDisplay.unsubscribe(
                    'onCollectionChange',
                    this._onCollectionChangeFnc
                );
                oldDisplay.unsubscribe(
                    'onAfterCollectionChange',
                    this._onAfterCollectionChangeFnc
                );
                oldDisplay.destroy();
            }
            this.setIndexes(0, this.getCount());
            this._nextModelVersion();

            // Необходимо нотифицировать о ресете модели отсюда, иначе никто этого не сделает
            // и об изменениях модели никто не узнает. Вследствие этого скакнет virtualScroll
            // https://online.sbis.ru/opendoc.html?guid=569a3c15-462f-4765-b624-c913baed1a57
            this._notify(
                'onListChange',
                'collectionChanged',
                collection.IObservable.ACTION_RESET,
                this.getDisplay().getItems(),
                0,
                [],
                0
            );
        }
        if (this._options.itemsSetCallback) {
            this._options.itemsSetCallback(this._items);
        }
    },

    // todo task1179709412 https://online.sbis.ru/opendoc.html?guid=43f508a9-c08b-4938-b0e8-6cfa6abaff21
    getItems() {
        return this._items;
    },

    // для совместимости с новой моделью
    getSourceCollection() {
        return this.getItems();
    },

    appendItems(items) {
        let shouldAppend = true;
        if (cInstance.instanceOfModule(items, 'Types/collection:RecordSet')) {
            this._items.setMetaData(items.getMetaData());

            // (this._items.getCount() === 0) для того чтоб emptyTemplate перерисовался
            shouldAppend = items.getCount() > 0 || this._items.getCount() === 0;
        }
        if (shouldAppend) {
            this._items.append(items);
        }
    },

    acceptChanges(): void {
        if (this._items && this._items.isChanged()) {
            this._items.acceptChanges();
        }
    },

    mergeItems(items, options) {
        options = { remove: false, ...(options || {}) };
        this._items.merge(items, options);
    },

    prependItems(items) {
        let shouldPrepend = true;
        if (cInstance.instanceOfModule(items, 'Types/collection:RecordSet')) {
            this._items.setMetaData(items.getMetaData());

            // (this._items.getCount() === 0) для того чтоб emptyTemplate перерисовался
            shouldPrepend =
                items.getCount() > 0 || this._items.getCount() === 0;
        }
        if (shouldPrepend) {
            this._items.prepend(items);
        }
    },

    // New Model compatibility
    each(
        callback: collection.EnumeratorCallback<Record>,
        context?: object
    ): void {
        if (this._display) {
            this._display.each(callback, context);
        }
    },

    // New Model compatibility
    find(predicate: (item: Model) => boolean): Model {
        if (this._display) {
            return this._display.find(predicate);
        }
    },

    // New Model compatibility
    getIndex(item: CollectionItem<Model>): number | string {
        return this._display ? this._display.getIndex(item) : undefined;
    },

    // New Model compatibility
    getSourceIndexByItem(item: CollectionItem<Model>): number {
        return this._display
            ? this._display.getSourceIndexByItem(item)
            : undefined;
    },

    // New Model compatibility
    getIndexBySourceItem(item: Model): number | string {
        return this._display
            ? this._display.getIndexBySourceItem(item)
            : undefined;
    },

    at(index: number): Model {
        return this._display ? this._display.at(index) : undefined;
    },

    getDisplay() {
        return this._display;
    },

    destroy() {
        ItemsViewModel.superclass.destroy.apply(this, arguments);
        if (this._display) {
            this._display.destroy();
            this._display = null;
        }
        if (this._items) {
            this._execUpdateSubscriptionOnMetaChange(
                this._items,
                'unsubscribe'
            );
            this._items = null;
        }
        this._itemDataCache = null;
        this._curIndex = null;
        this._onCollectionChangeFnc = null;
        this._onAfterCollectionChangeFnc = null;
    },

    setHasMoreData(hasMoreDataObject: object): boolean {
        const display = this.getDisplay();
        if (display) {
            const hasMoreData =
                hasMoreDataObject instanceof Object
                    ? hasMoreDataObject.up || hasMoreDataObject.down
                    : hasMoreDataObject;
            return this._display.setHasMoreData(hasMoreData);
        }
    },

    getHasMoreData(): boolean {
        const display = this.getDisplay();
        if (display) {
            const hasMoreData = this._display.getHasMoreData();
            return hasMoreData instanceof Object
                ? hasMoreData.up || hasMoreData.down
                : hasMoreData;
        }
    },

    hasMoreData(): boolean {
        return this.getHasMoreData();
    },

    getTheme(): string | undefined {
        const display = this.getDisplay();
        if (display) {
            return display.getTheme();
        } else {
            // todo task1179709412 https://online.sbis.ru/opendoc.html?guid=43f508a9-c08b-4938-b0e8-6cfa6abaff21
            return this._options.theme;
        }
    },

    setTheme(theme: string): void {
        const display = this.getDisplay();
        if (display) {
            if (display.setTheme(theme)) {
                this.resetCachedItemData();
            }
        } else {
            // todo task1179709412 https://online.sbis.ru/opendoc.html?guid=43f508a9-c08b-4938-b0e8-6cfa6abaff21
            this._options.theme = theme;
        }
    },

    /**
     * TODO https://online.sbis.ru/opendoc.html?guid=b8b8bd83-acd7-44eb-a915-f664b350363b
     *  Костыль, позволяющий определить, что мы загружаем файл и его прогрессбар изменяется
     *  Это нужно, чтобы в ListView не вызывался resize при изменении прогрессбара и не сбрасывался hovered в плитке
     */
    _isLoadingPercentsChanged(newItems: CollectionItem<Model>[]): boolean {
        return (
            newItems &&
            newItems.length &&
            newItems[0].getContents() &&
            newItems[0].getContents().getChanged &&
            newItems[0]
                .getContents()
                .getChanged()
                .indexOf('docviewLoadingPercent') !== -1 &&
            newItems[0]
                .getContents()
                .getChanged()
                .indexOf('docviewIsLoading') === -1
        );
    },
});

export = ItemsViewModel;
