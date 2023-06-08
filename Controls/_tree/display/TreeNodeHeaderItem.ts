/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import TreeNodeExtraItem from './TreeNodeExtraItem';

/**
 * Хедер узла в иерархическом списке
 * @private
 */

export default class TreeNodeHeaderItem extends TreeNodeExtraItem {
    readonly listInstanceName: string = 'controls-Tree__node-header';

    getMoreClasses(): string {
        return 'controls-Tree__nodeHeaderLoadMore';
    }
}

Object.assign(TreeNodeHeaderItem.prototype, {
    '[Controls/tree:TreeNodeHeaderItem]': true,
    _moduleName: 'Controls/tree:TreeNodeHeaderItem',
    _instancePrefix: 'tree-node-header-item-',
});
