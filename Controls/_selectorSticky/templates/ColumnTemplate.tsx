import * as React from 'react';
// import { getIconPadding, getMenuClassList } from 'Controls/_menu/Render/getClassList';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { createElement } from 'UICore/Jsx';
import { ColumnTemplate } from 'Controls/grid';

export default function MenuColumnTemplate(props) {
    return <ColumnTemplate {...props} contentTemplate={ContentTemplate} />;
}

function ContentTemplate(props) {
    const options = props.column?.getTemplateOptions();
    let config = { ...props.column?.config, ...props, ...options };
    // const className = getMenuClassList(props.item, config);
    // const iconPadding = getIconPadding(props.item.getOwner()?.getCollection(), config);
    config = {
        ...config,
        ...props.item.contents.get('itemTemplateOptions'),
        marker: config.markerVisibility !== 'hidden' || config.multiSelect === true,
        viewMode: config.viewMode || props.item.contents.get('itemTemplateOptions')?.viewMode,
        menuMode: 'selector',
        // isFixedItem: isFixedItem(props.item.getContents(), config.source),
        // isSingleSelectionItem: isSingleSelectionItem(props.item, config),
        // iconPadding,
        // itemClassList: className,
        treeItem: props.item,
        searchValue: props.searchValue || props.item.searchValue,
        isSingleSelectionItem: props.emptyText && props.item.contents?.getKey() === props.emptyKey,
        multiSelectTemplate: null,
    };

    return (
        <>
            {getItemTemplate(props, config)}
            <props.multiSelectTemplate className="tw-self-center" />
        </>
    );
}

function getItemTemplate(props, config) {
    const ItemTpl = props.item.contents?.get(config.itemTemplateProperty) || config.itemTemplate;
    const className = 'tw-min-w-0 controls-Layout-SelectorPopup-item';

    if (ItemTpl.charAt) {
        const ItemTemplate = loadSync(ItemTpl);
        return createElement(
            ItemTemplate,
            {
                ...config,
            },
            { ...props.attrs, className }
        );
    }
    return <ItemTpl {...config} attrs={props.attrs} className={className} />;
}
