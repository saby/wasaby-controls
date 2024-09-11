import { IListState } from 'Controls/dataFactory';
import { Model } from 'Types/entity';
import { IBasePositionSourceConfig } from 'Controls/interface';
import { IListSavedState } from 'Controls/dataSource';
import { saveControllerState } from 'Controls/dataSource';

function getRootItem(nextState: IListState): Model {
    const { markedKey, root, items, parentProperty } = nextState;

    const rootItem = items.getRecordById(markedKey as string);
    const parent = rootItem.get(parentProperty);
    const parentItem = items.getRecordById(parent);
    return parent === root || !parentItem
        ? rootItem
        : getRootItem({ ...nextState, markedKey: parentItem.getKey() });
}

function getRootNavSourceConfig(nextState: IListState): IBasePositionSourceConfig {
    const { navigation, parentProperty, markedKey, expandedItems, items } = nextState;
    const field = navigation.sourceConfig.field;
    const position = [];
    let item: Model;

    if (parentProperty) {
        item = getRootItem(nextState);
    } else {
        item = items.getRecordById(markedKey);
    }

    (field instanceof Array ? field : [field]).forEach((fieldName) => {
        position.push(item.get(fieldName));
    });

    const multiNavigation = !!expandedItems?.length;
    return {
        multiNavigation,
        position,
    };
}

export function saveState(nextState: IListState): void {
    const {
        markedKey,
        selectedKeys,
        excludedKeys,
        searchValue,
        expandedItems,
        navigation,
        listConfigStoreId,
        sourceController,
        root,
        items,
    } = nextState;
    const state: IListSavedState = {
        selectedKeys,
        excludedKeys,
        searchValue,
        expandedItems,
        markedKey,
        root,
    };

    const hasItemWithMarkedKeyInItems = items.getRecordById(markedKey);

    if (
        navigation &&
        navigation.sourceConfig &&
        navigation.source === 'position' &&
        hasItemWithMarkedKeyInItems
    ) {
        const multiNavigation = !!expandedItems?.length;
        const rootSourceConfig = getRootNavSourceConfig(nextState);

        if (multiNavigation) {
            const navigationSourceConfig = new Map();
            navigationSourceConfig.set(nextState.root, rootSourceConfig);

            expandedItems?.forEach((key) => {
                navigationSourceConfig.set(key, {
                    position: null,
                    limit:
                        sourceController?.getItemsCountForRoot(key) ||
                        navigation.sourceConfig.limit,
                    multiNavigation,
                });
            });
            state.navigationSourceConfig = navigationSourceConfig;
            state.navigationSourceConfig.multiNavigation = true;
        } else {
            state.navigationSourceConfig = rootSourceConfig;
        }
    }

    saveControllerState(listConfigStoreId as string, state);
}
