import { forwardRef, useEffect, LegacyRef, useCallback, useState } from 'react';
import Async from 'Controls/Container/Async';
import { useStrictSlice } from 'Controls-DataEnv/context';
import { RecordSet } from 'Types/collection';
import type { TKey } from 'Controls-DataEnv/interface';
import { isEqual } from 'Types/object';
import { ListSlice } from 'Controls-DataEnv/list';
import { Model } from 'Types/entity';
import { useSelectSlice } from 'Controls/selector';
import ExpandableCollection from './stackBody/ExpandableCollection';
import BeforeTabsTemplate from './stackBody/BeforeTabsTemplate';
import WorkspaceArea from './stackBody/WorkSpaceArea';
import Tabs from './stackBody/Tabs';
import { useSubmit } from './hooks/useSubmit';
import View from './stackBody/History/View';
import { getSelectedKeysFromSlice } from './Utils/getSelectedKeys';
import { Container } from 'Controls/scroll';
import 'css!Controls-Layout/selectorStack';

interface IStackContentProps {
    listName: string;
}

const nodePropMap = new Map([
    [null, 'leaf'],
    [false, 'hiddenNode'],
    [true, 'node'],
]);

const getItemFromArray = (
    newSelectedKeys: TKey[],
    oldSelectedKeys: TKey[],
    itemAdded: boolean,
    listItems?: RecordSet<Model>
): Model => {
    let neededKey: string;
    if (itemAdded) {
        neededKey = newSelectedKeys.filter(
            (key) => !oldSelectedKeys.includes(key)
        )[0] as unknown as string;
    } else {
        neededKey = oldSelectedKeys.filter(
            (key) => !newSelectedKeys.includes(key)
        )[0] as unknown as string;
    }
    const neededItemIndex = listItems?.getIndexByValue(listItems?.getKeyProperty(), neededKey);
    return listItems?.at(neededItemIndex as number) as Model;
};

const isItemAdded = (newSelectedKeys: TKey[], oldSelectedKeys: TKey[]): boolean => {
    return newSelectedKeys.length > oldSelectedKeys.length;
};

const selectedItemsNotEmpty = (selectedItems: Record<string, RecordSet<Model>>) => {
    return Object.values(selectedItems).some((items) => !!items.getCount());
};

export const ContentTemplate = forwardRef(
    (props: IStackContentProps, ref: LegacyRef<Async>): JSX.Element | null => {
        const selectSlice = useSelectSlice();
        const submit = useSubmit();
        const { configs, multiSelect, selectedItems, selectedTabKey } = selectSlice.state;
        const stackWithTabs = Object.keys(configs).length !== 1;
        const currentTabConfig = configs[props.listName];
        const storeId = currentTabConfig.storeId;
        const historyItems = selectSlice.state.historyItems?.[storeId]?.items as RecordSet | null;
        const currentListSlice = useStrictSlice<ListSlice>(storeId);

        const { selectedKeys, items, nodeProperty, searchValue } = currentListSlice.state;
        const [selectedItemsKeys, setSelectedItemsKeys] = useState<TKey[] | null>(null);

        const onItemActivate = useCallback(
            (item: Model) => {
                const itemKey = item.getKey();
                if (multiSelect) {
                    if (currentTabConfig.selectionType) {
                        const itemNodeProperty = item.get(nodeProperty as string);
                        const nodeType = nodePropMap.get(itemNodeProperty) as
                            | 'leaf'
                            | 'hiddenNode'
                            | 'node';
                        const allowSelect = currentTabConfig.selectionType.includes(nodeType);
                        if (!allowSelect) {
                            return;
                        }
                    }
                    const hasSelectedItems = stackWithTabs
                        ? selectedItemsNotEmpty(selectedItems)
                        : selectedKeys.length;
                    if (hasSelectedItems) {
                        if (!selectedKeys.includes(itemKey)) {
                            const newSelectedItemsKeys = [...selectedKeys, itemKey];
                            currentListSlice.setSelectedKeys(newSelectedItemsKeys);
                        }
                    } else {
                        submit(item);
                    }
                } else {
                    submit(item);
                }
            },
            [multiSelect, selectedKeys, selectedItems]
        );

        useEffect(() => {
            if (multiSelect && selectedItems && selectedItems[storeId]) {
                const newSelectedItemsKeys = getSelectedKeysFromSlice(storeId, selectedItems);
                if (!selectedItemsKeys || !isEqual(newSelectedItemsKeys, selectedKeys)) {
                    setSelectedItemsKeys(newSelectedItemsKeys);
                    currentListSlice.setSelectedKeys(newSelectedItemsKeys as TKey[]);
                }
            }
        }, [selectedItems, selectedTabKey]);

        useEffect(() => {
            if (multiSelect && selectedItemsKeys && !isEqual(selectedItemsKeys, selectedKeys)) {
                if (stackWithTabs) {
                    const itemAdded = isItemAdded(selectedKeys, selectedItemsKeys);
                    const changedItem = getItemFromArray(
                        selectedKeys,
                        selectedItemsKeys,
                        itemAdded,
                        items
                    );
                    if (itemAdded) {
                        selectSlice?.select(storeId, changedItem);
                    } else {
                        selectSlice?.exclude(storeId, changedItem);
                    }
                } else {
                    selectSlice.updateSelectionChangedState(storeId, selectedKeys);
                }
                setSelectedItemsKeys(selectedKeys);
            }
        }, [selectedKeys]);

        return (
            <>
                {multiSelect && stackWithTabs && <ExpandableCollection />}
                <div className={'ws-flexbox'}>
                    <BeforeTabsTemplate {...currentTabConfig.beforeTabsConfig} storeId={storeId} />
                    <Tabs listName={props.listName} />
                </div>
                <div
                    className={`controls-Layout-SelectorStack__content ${
                        stackWithTabs ? '' : 'controls__block-wrapper tr'
                    }`}
                    ref={ref}
                >
                    <Container
                        className={`controls-air-m controls-Layout-SelectorStack__content controls-background-default
                                           ${stackWithTabs ? '' : 'controls__block'}`}
                    >
                        {currentTabConfig.historyConfig?.historyId &&
                        historyItems?.getCount() &&
                        !searchValue.length ? (
                            <View storeId={storeId} {...currentTabConfig.historyConfig} />
                        ) : null}
                        <WorkspaceArea
                            storeId={storeId}
                            {...currentTabConfig.contentConfig.workspaceConfig}
                            onItemActivate={onItemActivate}
                        />
                    </Container>
                </div>
            </>
        );
    }
);
