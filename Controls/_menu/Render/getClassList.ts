import { TreeItem } from 'Controls/baseTree';
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import { getItemParentKey, hasPinIcon } from 'Controls/_menu/Util';
import { TKey } from 'Controls/_menu/interface/IMenuBase';

function getLeftPaddingClass(options): string {
    if (options.menuMode !== 'selector') {
        return ' controls-ListView__item-leftPadding_' + options.leftPadding;
    }
    return '';
}

function getRightPaddingClass(item: Model, options): string {
    let paddingClass;
    const rightPadding = options.multiSelect || options.markerVisibility !== 'hidden' ? 's' : 'm';
    const isAdaptive = options.isAdaptive && options.allowAdaptive !== false ? '-adaptive' : '';
    if (hasPinIcon(options, item)) {
        // FIXME https://online.sbis.ru/opendoc.html?guid=08a41199-b648-4f12-9176-ebbe06ed4a63
        paddingClass = ` controls-ListView__item-rightPadding_menu${isAdaptive}-pin`;
    } else if (
        item.get(options.nodeProperty) ||
        (options.itemAlign === 'left' && item.get('icon')) ||
        options.menuMode === 'selector'
    ) {
        paddingClass = ` controls-ListView__item-rightPadding_menu${isAdaptive}-s`;
    } else if (options.itemPadding.right) {
        paddingClass = ` controls-ListView__item-rightPadding_${options.itemPadding.right}`;
    } else {
        paddingClass = ` controls-ListView__item-rightPadding_menu${isAdaptive}-${rightPadding}`;
    }
    return paddingClass;
}

function getFontStyleClass(treeItem: TreeItem<Model>, options): string {
    let itemClass;
    const key = treeItem.getContents().getId();
    const isEmpty = options.emptyText && key === options.emptyKey;
    if (isEmpty) {
        itemClass = ' controls-Menu__emptyItem';
    } else {
        itemClass = ' controls-Menu__defaultItem ';
        if (options.fontColorStyle !== 'default') {
            itemClass += ` controls-text-${options.fontColorStyle}`;
        } else {
            itemClass += ' controls-Menu__text-default';
        }
    }
    return itemClass;
}

function getNextItem(treeItem: TreeItem<Model>): TreeItem<Model> {
    const index = treeItem.getOwner().getIndex(treeItem);
    return treeItem.getOwner().at(index + 1);
}

function isGroupNext(treeItem: TreeItem<Model>): boolean {
    const nextItem = getNextItem(treeItem);
    return nextItem && nextItem['[Controls/_display/GroupItem]'];
}

function isHistoryItem(item: Model): boolean {
    return item.get('pinned') || item.get('recent') || item.get('frequent');
}

export function hasParent(item: Model, options, root?: TKey = null): boolean {
    return (
        item.get(options.parentProperty) !== undefined && item.get(options.parentProperty) !== root
    );
}

export function isHistorySeparatorVisible(treeItem: TreeItem<Model>, options): boolean {
    if (!options.allowPin || options.searchValue) {
        return false;
    }
    let result = false;
    const item = treeItem.getContents();
    let nextCollectionItem = getNextItem(treeItem);
    while (nextCollectionItem?.['[Controls/treeGrid:TreeGridSpaceRow]']) {
        nextCollectionItem = getNextItem(nextCollectionItem);
    }
    const nextItem = nextCollectionItem?.getContents();
    const isNextGroup = isGroupNext(treeItem);
    if (item instanceof Model && nextItem && nextItem instanceof Model) {
        result =
            !isNextGroup &&
            isHistoryItem(item) &&
            !hasParent(item, options, options.historyRoot) &&
            !isHistoryItem(nextItem);
    }
    return result;
}

export function getMenuClassList(treeItem: TreeItem<Model>, options): string {
    const item = treeItem.getContents();
    let classes = '';
    if (item && item.get) {
        const readOnly = item.get('readOnly');

        if (readOnly) {
            classes += ' controls-Menu__row_state_readOnly';
        } else {
            classes +=
                ' controls-Menu__row_state_default' +
                ` controls-Menu__row_hoverBackgroundStyle-${options.hoverBackgroundStyle}`;
        }

        classes += getRightPaddingClass(item, options);
        classes += getLeftPaddingClass(options);
        classes += getFontStyleClass(treeItem, options);

        if (treeItem.isHovered()) {
            classes += ' controls-Menu__row_hovered';
        } else if (treeItem.isActive()) {
            classes += ' controls-ListView__item_active';
        }

        if (
            item.get('HistoryId') &&
            item.get('pinned') === true &&
            (!hasParent(item, options, options.historyRoot) || options.searchValue)
        ) {
            classes += ' controls-Menu__row_pinned controls-DropdownList__row_pinned';
        }

        if (
            !treeItem.isLastItem() &&
            !isGroupNext(treeItem) &&
            !(options.allowPin && isHistorySeparatorVisible(treeItem, options))
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

const ICON_SIZES = [
    ['icon-small', 's'],
    ['icon-medium', 'm'],
    ['icon-large', 'l'],
    ['icon-size', 'default'],
];

function getIconSize(icon: string): string {
    let result = '';
    ICON_SIZES.forEach((size) => {
        if (icon.indexOf(size[0]) !== -1) {
            result = size[1];
        }
    });
    return result;
}

export function getIconPadding(items: RecordSet, options): string {
    let iconPadding = '';
    let icon;

    items?.each((item) => {
        icon = item.get('icon');
        if (icon) {
            const parent = getItemParentKey(options, item);
            if (parent === options.root) {
                iconPadding = item.get('iconSize') || getIconSize(icon) || options.iconSize || 'm';
            }
        }
    });
    return iconPadding;
}
