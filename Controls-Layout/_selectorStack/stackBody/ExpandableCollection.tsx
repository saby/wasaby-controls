import {
    useState,
    useCallback,
    useEffect,
    useMemo,
    ForwardedRef,
    forwardRef,
    ReactElement,
} from 'react';
import { useSelectSlice } from 'Controls/selector';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { View } from 'ExpandableCollection/base';
import { Icon } from 'Controls/icon';

const MAX_AMOUNT_BIG_SELECTED_ITEMS = 10;

interface IExpandableCollectionTemplate {
    displayProperty?: string;
    nodeProperty?: string;
    isAdaptive?: boolean;
}

const getNewSelectedItems = (
    selectedItems: Record<string, RecordSet<Model>>,
    removingItem: Model
): Record<string, RecordSet<Model>> => {
    const newSelectedItems = { ...selectedItems };
    Object.keys(selectedItems).forEach((key) => {
        const removingItemKey = removingItem.getKey();
        newSelectedItems[key] = selectedItems[key].clone();
        const removingRecordIndex = newSelectedItems[key].getIndexByValue(
            removingItem.getKeyProperty(),
            removingItemKey
        );
        const removingRecord = newSelectedItems[key].at(removingRecordIndex);
        if (selectedItems[key] && removingRecord) {
            newSelectedItems[key].remove(removingRecord);
        }
    });
    return { ...newSelectedItems };
};

function ItemTemplate(props): JSX.Element {
    const caption = props.item.get(props.displayProperty);
    const isFolder = props.item.get(props.nodeProperty);
    return (
        <div
            className={`ws-flexbox  ws-ellipsis ws-flex-grow-1 ws-flex-shrink-1 ws-align-items-center
            controls-margin_left-${isFolder ? 'xs' : 'l'}`}
            title={caption}
        >
            {isFolder ? (
                <Icon
                    iconSize={'m'}
                    icon={'icon-Folder'}
                    iconStyle={'unaccented'}
                    className={'controls-margin_right-xs'}
                />
            ) : null}
            <div className={'ws-line-clamp ws-line-clamp_2'}>{caption}</div>
        </div>
    );
}

export const ExpandableCollectionTemplate = forwardRef(
    (
        props: IExpandableCollectionTemplate,
        ref: ForwardedRef<HTMLDivElement>
    ): ReactElement | null => {
        const selectSlice = useSelectSlice();
        const selectedItems = selectSlice.state.selectedItems as Record<string, RecordSet<Model>>;
        const [listExpanded, setListExpanded] = useState<boolean>(true);
        const [itemHeight, setItemHeight] = useState<'s' | 'mt'>('mt');

        const extendedBlockListItems: RecordSet = useMemo(() => {
            let extendedBlockItems: RecordSet;
            Object.keys(selectedItems).forEach((key) => {
                const items = selectedItems?.[key];
                if (!extendedBlockItems) {
                    extendedBlockItems = items.clone();
                } else {
                    items?.each((item) => {
                        const newItem = item.clone();
                        extendedBlockItems.add(newItem);
                    });
                }
            });
            return extendedBlockItems;
        }, [selectedItems]);

        const onSelectedItemsRemoved = useCallback(() => {
            const newSelectedItems = { ...selectedItems };
            Object.keys(selectedItems).forEach((key) => {
                if (selectedItems?.[key]) {
                    newSelectedItems[key] = selectedItems[key].clone();
                    newSelectedItems[key].clear();
                }
            });
            selectSlice.setState({ selectedItems: newSelectedItems });
        }, [selectedItems]);

        const onSelectedItemRemoved = useCallback(
            (item: Model) => {
                selectSlice.setState({ selectedItems: getNewSelectedItems(selectedItems, item) });
            },
            [selectedItems]
        );

        const onExpandedChanged = useCallback(
            (expanded: boolean) => {
                setListExpanded(expanded);
            },
            [selectedItems]
        );

        useEffect(() => {
            setItemHeight(
                extendedBlockListItems.getCount() >= MAX_AMOUNT_BIG_SELECTED_ITEMS ? 's' : 'mt'
            );
        }, [selectedItems]);

        const CollectionItemTemplate = useCallback(
            (itemTemplateProps) => {
                return (
                    <ItemTemplate
                        {...itemTemplateProps}
                        displayProperty={props.displayProperty}
                        nodeProperty={props.nodeProperty}
                    />
                );
            },
            [props.displayProperty, props.nodeProperty]
        );

        return !!extendedBlockListItems?.getCount() &&
            Object.keys(selectSlice.state.configs).length !== 1 ? (
            <View
                ref={ref}
                items={extendedBlockListItems}
                shadowVisible={false}
                displayProperty={props.displayProperty}
                expanded={listExpanded}
                contrastItemBackground={true}
                itemHeight={itemHeight}
                minItemWidth={0}
                itemTemplate={CollectionItemTemplate}
                isAdaptive={props.isAdaptive}
                onExpandedChanged={onExpandedChanged}
                onSelectedItemsRemoved={onSelectedItemsRemoved}
                onSelectedItemRemoved={onSelectedItemRemoved}
                className={
                    'controls-Layout-SelectorStack__selectedItems controls-padding_left-xl controls-padding_right-s'
                }
            />
        ) : null;
    }
);

export default ExpandableCollectionTemplate;
