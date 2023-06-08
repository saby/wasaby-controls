/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import * as BaseViewModel from 'Controls/_filterPopup/SimplePanel/oldViewModel/BaseViewModel';
import * as ItemsViewModel from 'Controls/_filterPopup/SimplePanel/oldViewModel/ItemsViewModel';
import * as ItemsUtil from 'Controls/_filterPopup/SimplePanel/oldViewModel/ItemsUtil';

import { Utils } from 'Controls/itemActions';
import { factory } from 'Types/chain';
import { isEqual } from 'Types/object';
import entity = require('Types/entity');
import { Model } from 'Types/entity';

const _private = {
    filterHierarchy(item: Model) {
        let parent;
        if (!this._options.parentProperty || !this._options.nodeProperty || !item.get) {
            return true;
        }
        parent = item.get(this._options.parentProperty);
        if (typeof parent === 'undefined') {
            parent = null;
        }
        return parent === this._options.rootKey;
    },

    isHistoryItem(item: Model) {
        return !!(item.get('pinned') || item.get('recent') || item.get('frequent'));
    },

    isFixedItem(item: Model): boolean {
        return !item.has || (!item.has('HistoryId') && item.get('pinned'));
    },

    filterAdditional(item: Model) {
        if (!this._options.additionalProperty || this._expanded === true || !item.get) {
            return true;
        }

        const isAdditional = item.get(this._options.additionalProperty);
        const isHistory = _private.isHistoryItem(item);

        // additional item in history must be showed
        return isAdditional !== true || isHistory;
    },

    needToDrawSeparator(item: Model, nextItem: Model, hasParent: boolean) {
        if (!nextItem.get) {
            return false;
        }
        const itemInHistory = _private.isHistoryItem(item) && !hasParent;
        const nextItemInHistory = _private.isHistoryItem(nextItem);
        return itemInHistory && !nextItemInHistory;
    },

    needHideGroup(self: typeof DropdownViewModel, key: string) {
        // FIXME временное решение, переделывается тут:
        //  https://online.sbis.ru/opendoc.html?guid=8760f6d2-9ab3-444b-a83b-99019207a9ca

        // Get items from the same group. Hide the separator, if
        // the group is empty or all list items from the same group
        const itemsGroup = self._itemsModel._display.getGroupItems(key);
        // getCount of itemsModel returns count items includes groups
        const numberItemsCurrentRoot = factory(self.getItems())
            .filter(_private.filterHierarchy.bind(self))
            .value().length;
        return itemsGroup.length === 0 || itemsGroup.length === numberItemsCurrentRoot;
    },

    getRightPadding(
        options: object,
        rightPadding: string,
        itemData: object,
        hasHierarchy: boolean,
        hasApplyButton: boolean
    ) {
        let result = rightPadding || 'default';
        if (itemData.hasPinned) {
            result = 'history';
        } else if (itemData.hasClose) {
            result = 'close';
        } else if (hasHierarchy) {
            result = 'hierarchy';
        }
        return result;
    },

    getClassList(options: object, itemData: object, hasHierarchy: boolean) {
        const item = itemData.item;
        let classes =
            'controls-SimplePanel-List__row_state_' +
            (item.get('readOnly') ? 'readOnly' : 'default');

        if (item.get('pinned') === true && !itemData.hasParent) {
            classes += ' controls-SimplePanel-List__row_pinned';
        }

        const paddings = options.itemPadding || {};
        if (options.multiSelect && itemData.emptyText) {
            classes += ' controls-SimplePanel-List__emptyItem-leftPadding_multiSelect';
        } else if (!options.multiSelect) {
            classes +=
                ' controls-SimplePanel-List__item-leftPadding_' + (paddings.left || 'default');
        }
        classes +=
            ' controls-SimplePanel-List__item-rightPadding_' +
            _private.getRightPadding(
                options,
                paddings.right,
                itemData,
                hasHierarchy,
                options.hasApplyButton
            );
        return classes;
    },

    getNewTreeItem(currentItem: object): object {
        return {
            isNode: () => {
                return currentItem.hasChildren;
            },
            isSelected: () => {
                return currentItem.isSelected ? currentItem.isSelected() : currentItem._isSelected;
            },
            getContents: () => {
                return currentItem.item;
            },
            isSwiped: () => {
                return currentItem.isSwiped ? currentItem.isSwiped() : false;
            },
            shouldDisplayItemActions: () => {
                return false;
            },
            getLevel: () => {
                return currentItem.levelPadding;
            },
            getParent: () => {
                return {
                    getContents: () => {
                        return currentItem.hasParent;
                    },
                };
            },
            shouldDisplayLevelPadding: () => {
                return currentItem.isDefaultLevelPadding;
            },
        };
    },
};

const DropdownViewModel = BaseViewModel.extend({
    _itemsModel: null,
    _expanded: false,

    constructor: function DropdownViewModelConstructor(cfg: object) {
        this._options = cfg;
        DropdownViewModel.superclass.constructor.apply(this, arguments);
        this._itemsModel = new ItemsViewModel({
            groupProperty: cfg.groupProperty,
            groupingKeyCallback: cfg.groupingKeyCallback,
            groupTemplate: cfg.groupTemplate,
            items: cfg.items,
            keyProperty: cfg.keyProperty,
            displayProperty: cfg.displayProperty || 'title',
        });
        this._itemsModel.subscribe('onListChange', () => {
            this._nextVersion();
        });
        this._hierarchy = new entity.relation.Hierarchy({
            keyProperty: cfg.keyProperty,
            parentProperty: cfg.parentProperty,
            nodeProperty: cfg.nodeProperty,
        });
        this.setFilter(this.getDisplayFilter());
    },

    setFilter(filter: object) {
        this._itemsModel.setFilter(filter);
    },

    updateSelection(item: Model) {
        const key = item.get(this._options.keyProperty);
        if (this._options.selectedKeys.indexOf(key) !== -1) {
            const index = this._options.selectedKeys.indexOf(key);
            this._options.selectedKeys.splice(index, 1);
            // In the dropdown list with a multiselect, emptyText (item with key null) is required.
            if (!this._options.selectedKeys.length) {
                this._options.selectedKeys.push(null);
            }
        } else {
            if (this._options.selectedKeys[0] === null) {
                this._options.selectedKeys = [];
            }
            this._options.selectedKeys.push(key);
        }
        this._nextVersion();
    },

    getSelectedKeys() {
        return this._options.selectedKeys;
    },

    setSelectedKeys(selectedKeys: string[]) {
        if (this._options.selectedKeys !== selectedKeys) {
            this._options.selectedKeys = selectedKeys;
            this._nextVersion();
        }
    },

    getDisplayFilter() {
        const filter = [];
        filter.push(_private.filterAdditional.bind(this));
        return filter;
    },

    setItems(options: object): void {
        this._options.items = options.items;
        this._itemsModel.setItems(options.items, options);
    },

    setRootKey(key: string) {
        this._options.rootKey = key;
        this.setFilter(this.getDisplayFilter());
    },

    destroy() {
        this._itemsModel.destroy();
        this._hierarchy.destroy();
        DropdownViewModel.superclass.destroy.apply(this, arguments);
    },

    reset() {
        return this._itemsModel.reset();
    },

    isEnd() {
        return this._itemsModel.isEnd();
    },

    goToNext() {
        return this._itemsModel.goToNext();
    },

    isLast() {
        return this._itemsModel.isLast();
    },

    isGroupNext() {
        return !!this._itemsModel.getItemDataByItem(this._itemsModel.getNext().dispItem).isGroup;
    },

    getCurrent() {
        const itemsModelCurrent = this._itemsModel.getCurrent();

        // if we had group element we should return it without changes
        if (itemsModelCurrent.isGroup) {
            // FIXME временное решение, переделывается тут:
            //  https://online.sbis.ru/opendoc.html?guid=8760f6d2-9ab3-444b-a83b-99019207a9ca
            if (_private.needHideGroup(this, itemsModelCurrent.key)) {
                itemsModelCurrent.isHiddenGroup = true;
            }

            return itemsModelCurrent;
        }
        itemsModelCurrent.contents = itemsModelCurrent.item;
        itemsModelCurrent.hasChildren = this._hasItemChildren(itemsModelCurrent.item);
        itemsModelCurrent.hasParent = this._hasParent(itemsModelCurrent.item);
        // TODO USE itemsModelCurrent.isSelected()
        itemsModelCurrent._isSelected = this._isItemSelected(itemsModelCurrent.item);
        itemsModelCurrent.icon = itemsModelCurrent.item.get('icon');
        itemsModelCurrent.iconSize = this._options.iconSize;

        // Draw the separator to split history and nohistory items.
        // Separator is needed only when list has both history and nohistory items
        // if the last item is in history then separator is unnecessary
        if (!this._itemsModel.isLast()) {
            itemsModelCurrent.hasSeparator = _private.needToDrawSeparator(
                itemsModelCurrent.item,
                this._itemsModel.getNext().item,
                itemsModelCurrent.hasParent
            );
        }
        itemsModelCurrent.iconStyle = Utils.getStyle(
            itemsModelCurrent.item.get('iconStyle'),
            'secondary',
            'DropdownList'
        );
        itemsModelCurrent.itemTemplateProperty = this._options.itemTemplateProperty;
        itemsModelCurrent.template = itemsModelCurrent.item.get(
            itemsModelCurrent.itemTemplateProperty
        );
        itemsModelCurrent.isFixedItem = _private.isFixedItem(itemsModelCurrent.item);
        itemsModelCurrent.multiSelect = this._options.multiSelect;
        itemsModelCurrent.parentProperty = this._options.parentProperty;
        itemsModelCurrent.hasClose = this._options.hasClose;
        itemsModelCurrent.hasPinned =
            this._options.hasIconPin && itemsModelCurrent.item.has('pinned');
        itemsModelCurrent.levelPadding = this._getLevelPadding(itemsModelCurrent.item);
        itemsModelCurrent.isDefaultLevelPadding =
            !this._options.levelPadding && itemsModelCurrent.hasParent;
        itemsModelCurrent.itemClassList = _private.getClassList(
            this._options,
            itemsModelCurrent,
            this.hasHierarchy()
        );

        // Для совместимости с menu:Control
        itemsModelCurrent.treeItem = _private.getNewTreeItem(itemsModelCurrent);
        return itemsModelCurrent;
    },
    _getLevelPadding(item: Model): string | number {
        if (item instanceof Model) {
            let parentLevel = 0;
            const parent = item.get(this._options.parentProperty);
            if (parent && parent !== this._options.root) {
                if (this._options.levelPadding) {
                    return this._options.levelPadding;
                }
                parentLevel = this._getLevelPadding(
                    this._hierarchy.getParent(item, this._options.items)
                );
            }
            return parentLevel + 1;
        }
    },
    _isItemSelected(item: Model) {
        const keys = this._options.selectedKeys;
        if (keys instanceof Array) {
            const index = keys.findIndex((key) => {
                if (isEqual(key, item.get(this._options.keyProperty))) {
                    return true;
                }
            });
            return index > -1;
        }
        return keys !== undefined && isEqual(keys, item.get(this._options.keyProperty));
    },
    _hasItemChildren(item: Model) {
        return (
            this._hierarchy.isNode(item) &&
            !!this._hierarchy.getChildren(item, this._options.items).length
        );
    },
    setSwipeItem(itemData: object) {
        this._swipeItem = itemData;
        this._nextVersion();
    },
    hasHierarchy() {
        if (!this._options.parentProperty || !this._options.nodeProperty) {
            return false;
        }
        const display = this._itemsModel._display;
        for (let i = 0; i < display.getCount(); i++) {
            const item = display.at(i).getContents();
            if (item.get && item.get(this._options.nodeProperty)) {
                return true;
            }
        }
        return false;
    },
    hasAdditional() {
        let hasAdditional = false;

        if (this._options.additionalProperty && this._options.rootKey === null) {
            this._options.items.each((item) => {
                if (!hasAdditional) {
                    hasAdditional =
                        item.get(this._options.additionalProperty) && !_private.isHistoryItem(item);
                }
            });
        }
        return hasAdditional;
    },
    _hasParent(item: object) {
        return this._hierarchy.hasParent(item, this._options.items);
    },
    getItems() {
        return this._itemsModel._options.items;
    },
    getCount() {
        return this._itemsModel.getCount();
    },
    toggleExpanded(expanded: boolean) {
        this._expanded = expanded;
        this.setFilter(this.getDisplayFilter());
        this._nextVersion();
    },
    isExpanded() {
        return this._expanded;
    },
    getEmptyItem() {
        if (this._options.emptyText) {
            const emptyItem = {};
            const itemData = {};
            itemData[this._options.displayProperty] = this._options.emptyText;
            itemData[this._options.keyProperty] =
                this._options.emptyKey !== undefined ? this._options.emptyKey : null;
            const item = new entity.Model({
                rawData: itemData,
            });
            emptyItem.item = item;
            emptyItem.contents = item;
            emptyItem._isSelected = this._options.selectedKeys.length
                ? this._isItemSelected(item)
                : true;
            emptyItem.getPropValue = ItemsUtil.getPropertyValue;
            emptyItem.emptyText = this._options.emptyText;
            emptyItem.hasClose = this._options.hasClose;
            emptyItem.itemClassList = _private.getClassList(
                this._options,
                emptyItem,
                this.hasHierarchy()
            );

            // Для совместимости с menu:Control
            emptyItem.treeItem = _private.getNewTreeItem(emptyItem);
            return emptyItem;
        }
    },
});

DropdownViewModel._private = _private;
export = DropdownViewModel;
