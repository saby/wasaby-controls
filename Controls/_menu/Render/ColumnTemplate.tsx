import * as React from 'react';
import { ColumnTemplate } from 'Controls/grid';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { createElement } from 'UICore/Jsx';
import { getIconPadding, getMenuClassList } from 'Controls/_menu/Render/getClassList';
import { isHistorySource } from 'Controls/_menu/Util';
import { TreeItem } from 'Controls/baseTree';
import { Model } from 'Types/entity';
import Utils = require('Types/util');

export default function MenuColumnTemplate(props) {
    if (props.viewMode === 'list') {
        return <ContentTemplate {...props} />;
    }
    return <ColumnTemplate {...props} contentTemplate={ContentTemplate} />;
}

function ContentTemplate(props) {
    const options = props.column?.getTemplateOptions();
    let config = { ...props.column?.config, ...props, ...options };
    const className = getMenuClassList(props.item, config);
    const iconPadding =
        config.menuMode === 'selector'
            ? null
            : getIconPadding(props.item.getOwner()?.getCollection(), config);
    config = {
        ...config,
        ...props.item.contents.get('itemTemplateOptions'),
        marker: config.markerVisibility !== 'hidden' || config.multiSelect === true,
        viewMode: config.viewMode || props.item.contents.get('itemTemplateOptions')?.viewMode,
        isFixedItem: isFixedItem(props.item.getContents(), config.source),
        isSingleSelectionItem: isSingleSelectionItem(props.item, config),
        iconPadding,
        itemClassList: className,
        treeItem: props.item,
        searchValue: props.searchValue || props.item.searchValue,
    };

    patchItemData(props.itemData);

    const ItemTpl = props.item.contents?.get(config.itemTemplateProperty) || config.itemTemplate;

    if (ItemTpl.charAt) {
        const ItemTemplate = loadSync(ItemTpl);
        return createElement(
            ItemTemplate,
            {
                ...config,
            },
            { ...props.attrs, className: 'tw-min-w-0' }
        );
    }
    return <ItemTpl {...config} attrs={props.attrs} className="tw-min-w-0" />;
}

function isFixedItem(item, source): boolean {
    return item.has && (!item.has('HistoryId') || !isHistorySource(source)) && item.get('pinned');
}

function isEmptyItem(treeItem: TreeItem<Model>, options): boolean {
    const key = treeItem.getContents().getId();
    return options.emptyText && key === options.emptyKey;
}

function isSingleSelectionItem(treeItem: TreeItem<Model>, options): boolean {
    let result = false;
    const item = treeItem.getContents();
    if (item instanceof Model) {
        if (options.selectedAllText && item.getKey() === options.selectedAllKey) {
            result = true;
        } else if (isEmptyItem(treeItem, options)) {
            result = true;
        }
    }
    return result;
}

function patchItemData(itemData: object): void {
    itemData.treeItem = itemData;
    itemData.getPropValue = Utils.object.getPropertyValue;
}
