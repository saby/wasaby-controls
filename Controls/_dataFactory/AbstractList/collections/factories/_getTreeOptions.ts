import type { ITreeCollectionOptions } from 'Controls/tree';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';

export default function (state: IListState): ITreeCollectionOptions {
    const treeItems = state.items;

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
        selectedKeys: state.selectedKeys,
        excludedKeys: state.excludedKeys,
        nodeHistoryType: state.nodeHistoryType,
        nodeHistoryId: state.nodeHistoryId,
        deepReload: state.deepReload,
        header: state.header,
        columns: state.columns,
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
        headerVisibility: state.headerVisibility,
        stickyHeader: state.stickyHeader,
        rowSeparatorSize: state.rowSeparatorSize,
        rowSeparatorVisibility: state.rowSeparatorVisibility,

        ladderProperties: state.ladderProperties,
        emptyView: state.emptyView,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}
