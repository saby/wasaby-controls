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

const MAX_AMOUNT_BIG_SELECTED_ITEMS = 10;

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

export const ExpandableCollectionTemplate = forwardRef(
    (_props, ref: ForwardedRef<HTMLDivElement>): ReactElement | null => {
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

        return !!extendedBlockListItems?.getCount() &&
            Object.keys(selectSlice.state.configs).length !== 1 ? (
            <View
                ref={ref}
                items={extendedBlockListItems}
                shadowVisible={false}
                displayProperty={'title'}
                expanded={listExpanded}
                contrastItemBackground={true}
                itemHeight={itemHeight}
                minItemWidth={0}
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
