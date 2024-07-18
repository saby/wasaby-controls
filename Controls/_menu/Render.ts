/**
 * @kaizen_zone f90b65ee-d3e2-41d5-9722-a2ea4200bc7e
 */
import { Control, TemplateFunction } from 'UI/Base';
import { IRenderOptions } from 'Controls/listRender';
import { IMenuBaseOptions, TKey } from 'Controls/_menu/interface/IMenuBase';
import { GroupItem } from 'Controls/display';
import { TreeItem } from 'Controls/baseTree';
import * as itemTemplate from 'wml!Controls/_menu/Render/itemTemplate';
import * as multiSelectTpl from 'wml!Controls/_menu/Render/multiSelectTpl';
import ViewTemplate = require('wml!Controls/_menu/Render/Render');
import { getItemParentKey, hasPinIcon, isHistorySource } from 'Controls/_menu/Util';
import { Model } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import Utils = require('Types/util');
import { IItemAction } from 'Controls/itemActions';
import 'css!Controls/menu';
import 'css!Controls/CommonClasses';
import { controller } from 'I18n/i18n';

interface IMenuRenderOptions extends IMenuBaseOptions, IRenderOptions {}

const ICON_SIZES = [
    ['icon-small', 's'],
    ['icon-medium', 'm'],
    ['icon-large', 'l'],
    ['icon-size', 'default'],
];

/**
 * Контрол меню рендер.
 * @class Controls/menu:Render
 * @extends UICore/Base:Control
 * @private
 *
 */

class MenuRender extends Control<IMenuRenderOptions> {
    protected _template: TemplateFunction = ViewTemplate;
    protected _iconPadding: string;
    protected _expandedItems: string[];
    protected _directionality: string = controller.currentLocaleConfig.directionality;

    protected _beforeMount(options: IMenuRenderOptions): void {
        this._iconPadding = this.getIconPadding(options);
        this._expandedItems = options.expandedItems;
    }

    protected _beforeUnmount(): void {
        this.removeEmptyItemFromCollection();
    }

    private removeEmptyItemFromCollection(): void {
        const options = this._options;
        const listModel = options.listModel;
        const emptyItem = options.emptyText && listModel.getItemBySourceKey(options.emptyKey);
        const allSelectedItem =
            options.selectedAllText && listModel.getItemBySourceKey(options.selectedAllKey);

        if (emptyItem) {
            listModel.getSourceCollection().remove(emptyItem.getContents());
        }
        if (allSelectedItem) {
            listModel.getSourceCollection().remove(allSelectedItem.getContents());
        }
    }

    protected _isEmptyItem(treeItem: TreeItem<Model>): boolean {
        const key = treeItem.getContents().getId();
        return this._options.emptyText && key === this._options.emptyKey;
    }

    protected _isSingleSelectionItem(treeItem: TreeItem<Model>): boolean {
        let result = false;
        const item = treeItem.getContents();
        if (item instanceof Model) {
            if (this._options.selectedAllText && item.getKey() === this._options.selectedAllKey) {
                result = true;
            } else if (this._isEmptyItem(treeItem)) {
                result = true;
            }
        }
        return result;
    }

    // FIXME
    protected _getItemData(treeItem: TreeItem<Model>): object {
        return {
            item: treeItem.getContents(),
            contents: treeItem.getContents(),
            treeItem,
            iconPadding: this._iconPadding,
            levelPadding: this._getLevelPadding(treeItem),
            iconSize: treeItem.getContents() ? this._getIconSize(treeItem.getContents()) : null,
            multiSelect: this._options.multiSelect,
            parentProperty: this._options.parentProperty,
            nodeProperty: this._options.nodeProperty,
            multiSelectTpl,
            itemClassList: this._getClassList(treeItem),
            getPropValue: (itemContents, field) => {
                if (!(itemContents instanceof Object)) {
                    return itemContents;
                } else {
                    return Utils.object.getPropertyValue(itemContents, field);
                }
            },
            isSingleSelectionItem: this._isSingleSelectionItem(treeItem),
            isFixedItem: this._isFixedItem(treeItem),
            isSelected: treeItem.isSelected.bind(treeItem),
        };
    }

    protected _stopEvent(e: SyntheticEvent<MouseEvent>): void {
        e.stopPropagation();
    }

    protected _emptyItemMouseEnter(e: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        this._itemMouseEnter(e, item, e);
    }

    protected _emptyItemMouseMove(e: SyntheticEvent<MouseEvent>, item: TreeItem<Model>) {
        this._itemMouseMove(e, item, e);
    }

    protected _itemMouseEnter(
        e: SyntheticEvent<MouseEvent>,
        item: TreeItem<Model>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        e.stopPropagation();
        this._notify('itemMouseEnter', [item, sourceEvent || e]);
    }

    protected _itemMouseMove(
        e: SyntheticEvent<MouseEvent>,
        item: TreeItem<Model>,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        e.stopPropagation();
        this._notify('itemMouseMove', [item, sourceEvent || e]);
    }

    protected _itemSwipe(
        e: SyntheticEvent<MouseEvent>,
        item: TreeItem<Model>,
        swipeEvent: SyntheticEvent<TouchEvent>,
        swipeContainerWidth: number,
        swipeContainerHeight: number
    ): void {
        e.stopPropagation();
        this._notify('itemSwipe', [
            item,
            swipeEvent || e,
            swipeContainerWidth,
            swipeContainerHeight,
        ]);
    }

    protected _itemActionMouseDown(
        e: SyntheticEvent<MouseEvent>,
        item: TreeItem<Model>,
        action: IItemAction,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        e.stopPropagation();
        this._notify('itemActionMouseDown', [item, action, sourceEvent]);
    }

    protected _checkBoxClick(event: SyntheticEvent<MouseEvent>, item: TreeItem<Model>): void {
        if (item.isVisibleCheckbox() && !item.isReadonlyCheckbox()) {
            this._notify('checkBoxClick', [item]);
        } else {
            event.stopPropagation();
        }
    }

    protected _treeCheckBoxClick(event: SyntheticEvent<MouseEvent>, key: string): void {
        this._notify('treeCheckBoxClick', [key, event]);
    }

    protected _separatorMouseEnter(event: SyntheticEvent<MouseEvent>): void {
        this._notify('separatorMouseEnter', [event]);
    }

    protected _itemClick(
        e: SyntheticEvent<MouseEvent>,
        item: Model,
        sourceEvent: SyntheticEvent<MouseEvent>
    ): void {
        e.stopPropagation();
        if (item instanceof Model) {
            this._notify('itemClick', [item, sourceEvent || e]);
        }
    }

    protected _getMenuClassList(treeItem: TreeItem<Model>): string {
        const item = treeItem.getContents();
        let classes = '';
        if (item && item.get) {
            const readOnly = item.get('readOnly');

            if (readOnly) {
                classes += ' controls-Menu__row_state_readOnly';
            } else {
                classes +=
                    ' controls-Menu__row_state_default' +
                    ` controls-Menu__row_hoverBackgroundStyle-${this._options.hoverBackgroundStyle}`;
            }

            classes += this._getRightPaddingClass(item);
            classes += this._getFontStyleClass(treeItem);

            if (treeItem.isHovered()) {
                classes += ' controls-Menu__row_hovered';
            } else if (treeItem.isActive()) {
                classes += ' controls-ListView__item_active';
            }

            if (
                !treeItem.isLastItem() &&
                !this._isGroupNext(treeItem) &&
                !this._isHistorySeparatorVisible(treeItem) &&
                !this._options.isAdaptive
            ) {
                classes += ' controls-margin_bottom-xs';
            }

            if (
                item.get('HistoryId') &&
                item.get('pinned') === true &&
                (!this._hasParent(item, this._options.historyRoot) || this._options.searchValue)
            ) {
                classes += ' controls-Menu__row_pinned controls-DropdownList__row_pinned';
            }

            if (
                this._options.listModel.getLast() !== treeItem &&
                !this._isGroupNext(treeItem) &&
                !(this._options.allowPin && this._isHistorySeparatorVisible(treeItem))
            ) {
                classes += ' controls-Menu__row-separator';
            }
        } else if (item && !treeItem['[Controls/_display/SearchSeparator]']) {
            classes += ' controls-Menu__row-breadcrumbs';
            if (!treeItem.isLastItem()) {
                classes += ' controls-margin_bottom-xs';
            }
        }
        return classes;
    }

    protected _getClassList(treeItem: TreeItem<Model>): string {
        let classes = '';
        if (!this._options.useListRender) {
            classes += treeItem.getContentClasses();
        }
        classes += this._getMenuClassList(treeItem);
        return classes;
    }

    protected _isHistorySeparatorVisible(treeItem: TreeItem<Model>): boolean {
        if (!this._options.allowPin || this._options.searchValue) {
            return false;
        }
        let result = false;
        const item = treeItem.getContents();
        const nextItem = this._getNextItem(treeItem)?.getContents();
        const isGroupNext = this._isGroupNext(treeItem);
        if (item instanceof Model && nextItem && nextItem instanceof Model) {
            result =
                !isGroupNext &&
                this._isHistoryItem(item) &&
                !this._hasParent(item, this._options.historyRoot) &&
                !this._isHistoryItem(nextItem);
        }
        return result;
    }

    protected _isGroupVisible(groupItem: GroupItem): boolean {
        const collection = groupItem.getOwner();
        const itemsGroupCount = collection.getGroupItems(groupItem.getContents()).length;
        const collectionCount = collection.getCount(true) + (this._options.emptyItem ? 1 : 0);
        return (
            !groupItem.isHiddenGroup() && itemsGroupCount > 0 && itemsGroupCount !== collectionCount
        );
    }

    protected _isGroupSticky(groupItem: GroupItem): boolean {
        const nextItem = this._getNextItem(groupItem);
        const prevItem = this._getPrevItem(groupItem);
        return (
            nextItem?.getContents().get('doNotSaveToHistory') &&
            prevItem?.getContents().get('doNotSaveToHistory')
        );
    }

    private _hasParent(item: Model, root?: TKey = null): boolean {
        return (
            item.get(this._options.parentProperty) !== undefined &&
            item.get(this._options.parentProperty) !== root
        );
    }

    private _isHistoryItem(item: Model): boolean {
        return item.get('pinned') || item.get('recent') || item.get('frequent');
    }

    private _isFixedItem(treeItem: TreeItem<Model>): boolean {
        let isFixed = false;
        const item = treeItem.getContents();
        if (item instanceof Model) {
            isFixed =
                (!item.has('HistoryId') || !isHistorySource(this._options.source)) &&
                !!item.get('pinned');
        }
        return isFixed;
    }

    private _isGroupNext(treeItem: TreeItem<Model>): boolean {
        const nextItem = this._getNextItem(treeItem);
        return nextItem && nextItem['[Controls/_display/GroupItem]'];
    }

    private _getNextItem(treeItem: TreeItem<Model>): TreeItem<Model> {
        const index = treeItem.getOwner().getIndex(treeItem);
        return treeItem.getOwner().at(index + 1);
    }

    private _getPrevItem(treeItem: TreeItem<Model>): TreeItem<Model> {
        const index = treeItem.getOwner().getIndex(treeItem);
        return treeItem.getOwner().at(index - 1);
    }

    private _getLevelPadding(treeItem: TreeItem<Model>): string {
        const item = treeItem.getContents();
        if (item instanceof Model) {
            const parent = getItemParentKey(this._options, item);
            if (parent && parent !== this._options.root) {
                return 'xl';
            }
        }
    }

    private _getIconSize(item: Model): string {
        let iconSize = '';
        if (item.get && item.get('icon')) {
            iconSize = item.get('iconSize') || this._options.iconSize;
        } else if (!this._iconPadding) {
            iconSize = this._options.iconSize;
        }
        return iconSize;
    }

    private getIconPadding(options: IMenuRenderOptions): string {
        let iconPadding = '';
        let icon;
        let itemContents;

        options.listModel.each((item) => {
            itemContents = item.getContents();
            icon = itemContents.get && itemContents.get('icon');
            if (icon) {
                const parent = getItemParentKey(options, itemContents);
                if (parent === options.root) {
                    iconPadding =
                        itemContents.get('iconSize') ||
                        this.getIconSize(icon) ||
                        options.iconSize ||
                        'm';
                }
            }
        });
        return iconPadding;
    }

    private getIconSize(icon: string): string {
        let result = '';
        ICON_SIZES.forEach((size) => {
            if (icon.indexOf(size[0]) !== -1) {
                result = size[1];
            }
        });
        return result;
    }

    private _getRightPaddingClass(item: Model): string {
        let paddingClass;
        const rightPadding =
            this._options.multiSelect || this._options.markerVisibility !== 'hidden' ? 's' : 'm';
        const isAdaptive =
            this._options.isAdaptive && this._options.allowAdaptive !== false ? '-adaptive' : '';
        if (hasPinIcon(this._options, item)) {
            // FIXME https://online.sbis.ru/opendoc.html?guid=08a41199-b648-4f12-9176-ebbe06ed4a63
            paddingClass = ` controls-ListView__item-rightPadding_menu${isAdaptive}-pin`;
        } else if (
            item.get(this._options.nodeProperty) ||
            (this._options.itemAlign === 'left' && item.get('icon'))
        ) {
            paddingClass = ` controls-ListView__item-rightPadding_menu${isAdaptive}-s`;
        } else if (this._options.itemPadding.right) {
            paddingClass = ` controls-ListView__item-rightPadding_${this._options.itemPadding.right}`;
        } else {
            paddingClass = ` controls-ListView__item-rightPadding_menu${isAdaptive}-${rightPadding}`;
        }
        return paddingClass;
    }

    private _getFontStyleClass(treeItem: TreeItem<Model>): void {
        let itemClass;
        if (this._isEmptyItem(treeItem)) {
            itemClass = ' controls-Menu__emptyItem';
        } else {
            itemClass = ' controls-Menu__defaultItem ';
            if (this._options.fontColorStyle !== 'default') {
                itemClass += ` controls-text-${this._options.fontColorStyle}`;
            } else {
                itemClass += ' controls-Menu__text-default';
            }
        }
        return itemClass;
    }
    static defaultProps: Partial<IRenderOptions> = {
        itemTemplate,
        fontColorStyle: 'default',
        virtualScrollConfig: {
            pageSize: 70,
        },
    };
}

export default MenuRender;
