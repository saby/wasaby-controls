/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import TreeGridNodeExtraRow from './TreeGridNodeExtraRow';

/**
 * Хедер узла в иерархической таблице
 * @private
 */
export default class TreeGridNodeHeaderRow extends TreeGridNodeExtraRow {
    readonly listInstanceName: string = 'controls-TreeGrid__node-header';

    getItemClasses(): string {
        return super.getItemClasses() + ' controls-TreeGrid__nodeHeader';
    }

    getMoreClasses(): string {
        return 'controls-Tree__nodeHeaderLoadMore controls-TreeGrid__nodeHeaderLoadMore';
    }

    shouldDisplayMoreButton(): boolean {
        return this.hasMoreStorage('backward');
    }

    protected _resolveExtraItemTemplate(): string {
        return 'Controls/treeGrid:NodeHeaderTemplate';
    }
}

Object.assign(TreeGridNodeHeaderRow.prototype, {
    '[Controls/treeGrid:TreeGridNodeHeaderRow]': true,
    '[Controls/tree:TreeNodeHeaderItem]': true,
    _moduleName: 'Controls/treeGrid:TreeGridNodeHeaderRow',
    _instancePrefix: 'tree-grid-node-header-row-',
});
