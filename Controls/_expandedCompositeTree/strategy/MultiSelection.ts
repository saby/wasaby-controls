/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import type { Model } from 'Types/entity';
import type { EnumeratorCallback, EnumeratorIndex } from 'Types/collection';
import type CompositeCollectionItem from '../display/CompositeCollectionItem';
import type { TreeItem } from 'Controls/baseTree';
import { CrudEntityKey } from 'Types/source';

import { TreeSelectionStrategy } from 'Controls/multiselection';
import {
    HierarchySelectionStrategy,
    IHierarchySelectionState,
} from 'Controls/hierarchySelectionAspect';

class NewStrategy extends HierarchySelectionStrategy {
    protected _eachItem(
        collection,
        callback: EnumeratorCallback<TreeItem<Model>, EnumeratorIndex>
    ) {
        collection.each((item: TreeItem<Model>, index: number) => {
            if (item['[Controls/expandedCompositeTree:CompositeCollectionItem]']) {
                (item as CompositeCollectionItem).eachChild(callback);
            } else {
                callback(item, index);
            }
        });
    }

    protected _isAllChildrenExcluded(state: IHierarchySelectionState, node: TreeItem): boolean {
        const nodeKey = this._getKey(node);
        const realParent = state.collection.getItemBySourceKey(nodeKey);
        return super._isAllChildrenExcluded(state, realParent);
    }

    protected _getKey(item: unknown): CrudEntityKey {
        if (item?.['[Controls/expandedCompositeTree:CompositeCollectionItem]']) {
            return undefined;
        }
        return super._getKey(item);
    }
}

/**
 * Стратегия выбора для композитного списка.
 * Отличается от стратегии выбора для иерархического списка тем,
 * что при поиске заходит во вложенные коллекции.
 * @class Controls/_expandedCompositeTree/multiSelection/MultiSelection
 *
 * @public
 */
export class MultiSelectionStrategy<
    TItem extends TreeItem = TreeItem
> extends TreeSelectionStrategy<TItem> {
    constructor(...args) {
        super(...args);
        this._newStrategy = new NewStrategy(!!this._feature1188089336);
    }
}
