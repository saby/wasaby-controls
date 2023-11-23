import type { TreeCollection as ITreeCollection, ITreeCollectionOptions } from 'Controls/tree';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';

import { RecordSet } from 'Types/collection';
import { create as diCreate } from 'Types/di';

export function createTreeCollection(state: IListState): ITreeCollection {
    return diCreate(getConstructor(), getOptions(state));
}

function getConstructor() {
    return 'Controls/tree:TreeCollection';
}

function getOptions(state: IListState): ITreeCollectionOptions {
    const treeItems = state.items ?? new RecordSet({ keyProperty: state.keyProperty });

    return {
        items: treeItems,
        root: state.root,
        collection: treeItems,
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}
