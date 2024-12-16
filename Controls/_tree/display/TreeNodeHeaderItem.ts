/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
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

    shouldDisplayMoreButton(): boolean {
        return this.hasMoreStorage('backward');
    }
}

Object.assign(TreeNodeHeaderItem.prototype, {
    '[Controls/tree:TreeNodeHeaderItem]': true,
    _moduleName: 'Controls/tree:TreeNodeHeaderItem',
    _instancePrefix: 'tree-node-header-item-',
});
