import type {
    ITreeGridCollectionOptions,
    TreeGridCollection as ITreeGridCollection,
} from 'Controls/treeGrid';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';

import { create as diCreate } from 'Types/di';

export function createTreeGridCollection(state: IListState): ITreeGridCollection {
    return diCreate(getConstructor(), getOptions(state));
}

function getConstructor() {
    return 'Controls/treeGrid:TreeGridCollection';
}

function getOptions(state: IListState): ITreeGridCollectionOptions {
    const treeGridItems = state.items;

    return {
        items: treeGridItems,
        root: state.root,
        collection: treeGridItems,
        sorting: state.sorting,
        filter: state.filter,
        source: state.source,
        navigation: state.navigation,
        displayProperty: state.displayProperty,
        parentProperty: state.parentProperty,
        sourceController: state.sourceController,
        excludedKeys: state.excludedKeys,
        nodeHistoryType: state.nodeHistoryType,
        nodeHistoryId: state.nodeHistoryId,
        deepReload: state.deepReload,
        header: state.header,
        columns: state.columns,
        selectedKeys: state.selectedKeys,
        activeElement: state.activeElement,
        expandedItems: state.expandedItems,
        nodeProperty: state.nodeProperty,
        keyProperty: state.keyProperty,
        markerVisibility: state.markerVisibility,
        multiSelectVisibility: state.multiSelectVisibility,
        markedKey: state.markedKey,
        selectionCountMode: state.selectionCountMode,

        nodeTypeProperty: state.nodeTypeProperty,
        hasChildrenProperty: state.hasChildrenProperty,
        expanderVisibility: state.expanderVisibility,
        recursiveSelection: state.recursiveSelection,

        isThinInteractor: state.isThinInteractor,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}
