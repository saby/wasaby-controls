/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { ICollectionOptions } from 'Controls/display';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';

export default function (state: IListState): ICollectionOptions {
    const items = state.items;

    return {
        items,
        collection: items,
        sorting: state.sorting,
        filter: state.filter,
        source: state.source,
        navigation: state.navigation,
        displayProperty: state.displayProperty,
        sourceController: state.sourceController,
        selectedKeys: state.selectedKeys,
        excludedKeys: state.excludedKeys,
        activeElement: state.activeElement,
        keyProperty: state.keyProperty,
        markerVisibility: state.markerVisibility,
        multiSelectVisibility: state.multiSelectVisibility,
        markedKey: state.markedKey,
        selectionCountMode: state.selectionCountMode,
        recursiveSelection: state.recursiveSelection,
        isThinInteractor: state.isThinInteractor,
        rowSeparatorSize: state.rowSeparatorSize,
        rowSeparatorVisibility: state.rowSeparatorVisibility,
        ladderProperties: state.ladderProperties,
        emptyView: state.emptyView,
        order: state.order,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}
