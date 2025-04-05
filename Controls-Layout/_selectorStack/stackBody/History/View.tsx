import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { IHistoryConfig, useSelectSlice } from 'Controls/selector';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import type { ItemsView } from 'Controls/columns';
import { RecordSet } from 'Types/collection';
import { getSelectedKeysFromSlice } from '../../Utils/getSelectedKeys';
import { isEqual } from 'Types/object';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { Model } from 'Types/entity';
import { useSubmit } from '../../hooks/useSubmit';
import 'css!Controls-Layout/selectorStack';
import { IHistoryItem } from 'Controls/HistoryStore';
import { CrudEntityKey } from 'Types/source';
import { Serializer } from 'UI/State';
import { ItemTemplate } from './ItemTemplate';

interface IHistoryItems extends IHistoryConfig {
    storeId: string;
}

const MAX_DISPLAYED_HISTORY_ITEMS = 6;

function getHistoryKeys(historyItems: RecordSet<IHistoryItem> | null): CrudEntityKey[] {
    const historyItemsKeys = [] as CrudEntityKey[];
    historyItems?.each((item) => {
        const itemData = JSON.parse(item.get('ObjectId') as string, new Serializer().deserialize);
        historyItemsKeys.push(itemData);
    });
    return historyItemsKeys;
}

export default function View(props: IHistoryItems): ReactElement | null {
    const selectSlice = useSelectSlice();
    const submit = useSubmit();
    const { historyItems, multiSelect, selectedItems } = selectSlice?.state;
    const List = loadSync(
        props.viewMode === 'tile' ? 'Controls/columns:ItemsView' : 'Controls/list:ItemsView'
    ) as ItemsView;

    const [pinnedKeys, setPinnedKeys] = useState(historyItems?.[props.storeId]?.pinnedKeys || []);

    const listHistoryItems = useMemo(() => {
        const newHistoryItems = historyItems?.[props.storeId]?.items?.clone() as RecordSet;
        newHistoryItems.clear();
        for (let i = 0; i < MAX_DISPLAYED_HISTORY_ITEMS; i++) {
            const item = historyItems?.[props.storeId]?.items?.at(i);
            if (item) {
                const isItemSelected = Object.keys(selectedItems).some(
                    (key) =>
                        selectedItems[key].getIndexByValue(
                            item.getKeyProperty(),
                            item?.getKey()
                        ) !== -1
                );
                if (!isItemSelected) {
                    newHistoryItems.add(item);
                }
            }
        }
        return newHistoryItems;
    }, [historyItems?.[props.storeId], selectedItems]);

    const handlePinClick = useCallback(
        (item: Model) => {
            const { Store } = loadSync('Controls/HistoryStore');
            Store.togglePin(props.historyId, item.getKey());
            const { pinned } = Store.getLocal(props.historyId);
            setPinnedKeys(getHistoryKeys(pinned));
        },
        [pinnedKeys]
    );

    useEffect(() => {
        pinnedKeys.forEach((key, index) => {
            const neededItemIndex = listHistoryItems.getIndexByValue(
                listHistoryItems.getKeyProperty(),
                key
            );
            if (neededItemIndex !== -1 && neededItemIndex !== index) {
                listHistoryItems.move(neededItemIndex, index);
            }
        });
    }, [pinnedKeys]);

    const itemActionsVisibility = useCallback(
        (action: IItemAction, item: Model) => {
            const isPinned = pinnedKeys.includes(item.getKey());
            return action.id === 'PinOff' ? isPinned : !isPinned;
        },
        [pinnedKeys]
    );

    const onSelectedKeysChanged = useCallback(
        (selectedKeys, added) => {
            const selectedItemsKeys = getSelectedKeysFromSlice(props.storeId, selectedItems);
            if (!isEqual(selectedItemsKeys, selectedKeys)) {
                selectSlice?.select(props.storeId, listHistoryItems.getRecordById(added[0]));
            }
        },
        [props.storeId, selectedItems]
    );

    const onItemClick = useCallback(
        (item: Model) => {
            if (!multiSelect) {
                submit(item);
            } else if (getSelectedKeysFromSlice(props.storeId, selectedItems).length) {
                selectSlice?.select(props.storeId, listHistoryItems.getRecordById(item.getKey()));
            }
        },
        [props.storeId, selectedItems]
    );

    const itemTemplate = useCallback(
        (innerProps) => {
            return (
                <ItemTemplate
                    {...innerProps}
                    viewMode={props.viewMode}
                    storeId={props.storeId}
                    itemPinned={pinnedKeys.includes(innerProps.item.contents.getKey())}
                    multiSelectTemplate={
                        multiSelect
                            ? loadSync('Controls/selectorSticky:MultiSelectPlusTemplate')
                            : null
                    }
                />
            );
        },
        [multiSelect, pinnedKeys, props.storeId]
    );

    const itemActions = useMemo(
        () => [
            {
                id: 'PinOff',
                icon: 'icon-PinOff',
                iconSize: 's',
                iconStyle: 'unaccented',
                showType: TItemActionShowType.TOOLBAR,
                handler: handlePinClick,
            },
            {
                id: 'PinNull',
                icon: 'icon-PinNull',
                iconSize: 's',
                iconStyle: 'unaccented',
                showType: TItemActionShowType.TOOLBAR,
                handler: handlePinClick,
            },
        ],
        []
    );

    const itemPadding = useMemo(() => {
        if (props.viewMode === 'tile') {
            return {
                left: 's',
                right: 's',
                top: 'null',
                bottom: 'm',
            };
        }
        return {
            left: 'xl',
            top: 's',
            bottom: 's',
        };
    }, [props.viewMode]);

    const itemsContainerPadding = useMemo(() => {
        if (props.viewMode === 'tile') {
            return {
                left: 'm',
                top: 'null',
                bottom: 'null',
            };
        }
        return null;
    }, [props.viewMode]);
    return (
        <>
            <List
                items={listHistoryItems}
                itemTemplate={itemTemplate}
                multiSelectVisibility={'onhover'}
                itemActions={itemActions}
                itemActionVisibilityCallback={itemActionsVisibility}
                multiSelectPosition={'custom'}
                itemActionsPosition={'custom'}
                itemPadding={itemPadding}
                itemsContainerPadding={itemsContainerPadding}
                bottomPaddingMode={'none'}
                onSelectedKeysChanged={onSelectedKeysChanged}
                onItemClick={onItemClick}
            />
            {props.viewMode !== 'tile' ? (
                <div className={'controls-Layout-SelectorStack__history-separator'}></div>
            ) : null}
        </>
    );
}
