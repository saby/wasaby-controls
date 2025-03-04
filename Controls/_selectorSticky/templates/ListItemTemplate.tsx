import { ItemTemplate as GridItemTemplate } from 'Controls/treeGrid';
import * as React from 'react';
import { Model } from 'Types/entity';
import { TKey } from 'Controls/interface';
import { GroupTemplate } from 'Controls/menu';

export default function ListItemTemplate(props): React.ReactElement {
    const item = props.item;
    const itemContents = item?.contents;
    const isPinnedBoldItem =
        itemContents.get('HistoryId') &&
        itemContents.get('pinned') === true &&
        ((!hasParent(itemContents, props.parentProperty, props.historyRoot) &&
            itemContents.get(props.nodeProperty) !== false) ||
            props.searchValue);
    const attrs = React.useMemo(() => {
        return {
            'type-data-qa':
                itemContents.get(props.nodeProperty) ||
                itemContents.get(props.nodeProperty) === false
                    ? 'node'
                    : 'leaf',
        };
    }, [itemContents, props.nodeProperty]);

    const isSingleSelectionItem = props.emptyText && itemContents.getKey() === props.emptyKey;

    const isHistorySeparatorVisible = React.useMemo(() => {
        if (!props.allowPin || props.item.searchValue) {
            return false;
        }
        let nextItem = item.getOwner().at(item.index + 1);
        while (nextItem?.['[Controls/treeGrid:TreeGridSpaceRow]']) {
            nextItem = item.getOwner().at(nextItem.index + 1);
        }
        const contents = item.contents;
        const isNextGroup = nextItem?.['[Controls/_display/GroupItem]'];
        return (
            nextItem &&
            !isNextGroup &&
            isHistoryItem(contents) &&
            !hasParent(contents, props.parentProperty, props.historyRoot) &&
            !isHistoryItem(nextItem.contents)
        );
    }, [item, props.allowPin, props.item.searchValue]);

    const historySeparatorAttrs = React.useMemo(() => {
        return isHistorySeparatorVisible
            ? {
                  key: item.getUid() + '_separator',
              }
            : null;
    }, [isHistorySeparatorVisible, item.getUid()]);

    return (
        <>
            <GridItemTemplate
                {...props}
                fontWeight={isPinnedBoldItem ? 'bold' : 'normal'}
                marker={false}
                withoutLevelPadding={false}
                withoutExpanderPadding={
                    itemContents?.get('icon') ||
                    (isSingleSelectionItem && props.markerVisibility !== 'hidden')
                }
                highlightOnHover={itemContents?.get('highlightOnHover') ?? true}
                showItemActionsOnHover={itemContents?.get('highlightOnHover') ?? true}
                expanderIcon={
                    isHistoryItem(itemContents) && !itemContents?.get(props.parentProperty)
                        ? 'none'
                        : itemContents?.get('expanderIcon') || null
                }
                itemActionsClass={
                    props.multiSelect
                        ? 'controls-ListEnv-SelectorPopup__itemActions_position_multiSelect'
                        : 'controls-Menu__itemActions_position_rightBottom'
                }
                className={`${props.className} controls-Menu__item ${
                    isPinnedBoldItem ? 'controls-Menu__row_pinned' : ''
                } ${
                    itemContents?.get('expanderIcon') === 'hidden'
                        ? 'controls-Menu__item_hiddenNode'
                        : ''
                }`}
                attrs={attrs}
            />
            {isHistorySeparatorVisible ? (
                <GroupTemplate
                    className="controls-Menu__group_marginBottom"
                    attrs={historySeparatorAttrs}
                    isHistoryGroup={true}
                />
            ) : null}
        </>
    );
}

function isHistoryItem(item: Model): boolean {
    return item?.get('pinned') || item?.get('recent') || item?.get('frequent');
}

function hasParent(item: Model, parentProperty: string, root?: TKey = null): boolean {
    return item.get(parentProperty) !== undefined && item.get(parentProperty) !== root;
}
