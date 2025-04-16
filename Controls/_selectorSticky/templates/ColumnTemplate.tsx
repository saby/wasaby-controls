import * as React from 'react';
import { useSlice } from 'Controls-DataEnv/context';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { Model } from 'Types/entity';
import { TreeGridDataRow as CollectionItem } from 'Controls/treeGrid';
import { ColumnTemplate } from 'Controls/grid';
import { MarkerTemplate } from 'Controls/menu';
import { TVisibility } from 'Controls/marker';
import { TKey } from 'Controls/interface';
import { default as SelectorSlice } from '../Factory/Slice';

export default function MenuColumnTemplate(props) {
    return <ColumnTemplate {...props} contentTemplate={ContentTemplate} />;
}

function ContentTemplate(props) {
    const options = props.column?.getTemplateOptions();
    let config = { ...props.column?.config, ...props, ...options };

    const isSingleSelectionItem = React.useMemo(() => {
        const emptyKeys = props.emptyKey instanceof Array ? props.emptyKey : [props.emptyKey];
        return emptyKeys.includes(props.item.contents?.getKey());
    }, [props.item, props.emptyKey]);

    const isExpanderRight = props.allowAdaptive && props.expanderTemplate;

    config = {
        ...config,
        ...props.item.contents.get('itemTemplateOptions'),
        marker: false,
        viewMode: config.viewMode || props.item.contents.get('itemTemplateOptions')?.viewMode,
        menuMode: 'selector',
        treeItem: props.item,
        searchValue: props.searchValue || props.item.searchValue,
        multiSelectTemplate: null,
        isSingleSelectionItem,
        iconAlign: 'right',
        expanderPosition: isExpanderRight ? 'right' : props.expanderPosition,
    };

    return (
        <>
            <MarkerCustomTemplate
                item={props.item}
                markerVisibility={props.markerVisibility}
                multiSelect={props.multiSelect}
                shouldDisplayExpander={props.shouldDisplayExpander}
                isSingleSelectionItem={isSingleSelectionItem}
                emptyText={props.emptyText}
                emptyKey={props.emptyKey}
                isExpanderRight={isExpanderRight}
            />
            {getItemTemplate(props, config, isSingleSelectionItem)}
            {isExpanderRight ? <props.expanderTemplate /> : null}
            {!isSingleSelectionItem ? (
                <props.multiSelectTemplate
                    className={`tw-self-center ${
                        props.allowAdaptive
                            ? 'controls-ListEnv-SelectorPopup__multiSelectPlus_marginLeft'
                            : 'controls-margin_left-xs'
                    }`}
                />
            ) : null}
        </>
    );
}

function getItemTemplate(props, config, isSingleSelectionItem: boolean) {
    const ItemTpl = props.item.contents?.get(config.itemTemplateProperty) || config.itemTemplate;
    let className = 'tw-min-w-0 controls-Layout-SelectorPopup-item';

    if (!isSingleSelectionItem && !props.shouldDisplayExpander) {
        className += ' ';
    }

    if (ItemTpl.charAt) {
        const ItemTemplate = loadSync(ItemTpl);
        return <ItemTemplate {...config} {...props.attrs} className={className} />;
    }
    return <ItemTpl {...config} attrs={props.attrs} className={className} />;
}

interface IMarkerTemplateProps {
    item: CollectionItem<Model>;
    markerVisibility: TVisibility;
    multiSelect: boolean;
    isSingleSelectionItem: boolean;
    shouldDisplayExpander: boolean;
    emptyText?: string;
    emptyKey?: TKey[];
    isExpanderRight: boolean;
}

function MarkerCustomTemplate({
    item,
    markerVisibility,
    multiSelect,
    isSingleSelectionItem,
    shouldDisplayExpander,
    emptyText,
    emptyKey,
    isExpanderRight,
}: IMarkerTemplateProps) {
    const selectorContext = useSlice<SelectorSlice>('_selectorStoreId');

    if (markerVisibility !== 'hidden' || multiSelect) {
        if (!multiSelect || isSingleSelectionItem) {
            return (
                <MarkerTemplate
                    selected={item.isMarked()}
                    className="controls-Layout-SelectorPopup_item-marker-offset controls-Layout-SelectorPopup_item-marker"
                />
            );
        } else if (
            (emptyText || emptyKey instanceof Array) &&
            !isSingleSelectionItem &&
            (!shouldDisplayExpander || isExpanderRight) &&
            selectorContext?.state.isRoot
        ) {
            return <div className="controls-Layout-SelectorPopup_item-marker-space"></div>;
        }
        return null;
    }
    return null;
}
