/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import type { Model } from 'Types/entity';
import type { EnumeratorCallback, EnumeratorIndex } from 'Types/collection';
import type CompositeCollectionItem from '../display/CompositeCollectionItem';
import type { TreeItem } from 'Controls/baseTree';
import { CrudEntityKey } from 'Types/source';
import {
    ISelectionObject as ISelection,
} from 'Controls/interface';

import { TreeSelectionStrategy } from 'Controls/multiselection';

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
    protected _eachItem(callback: EnumeratorCallback<TreeItem<Model>, EnumeratorIndex>): void {
        this._model.each((item: TreeItem<Model>, index: number) => {
            if (item['[Controls/expandedCompositeTree:CompositeCollectionItem]']) {
                (item as CompositeCollectionItem).eachChild(callback);
            } else {
                callback(item, index);
            }
        });
    }

    protected _isAllChildrenExcluded(selection: ISelection, node: TItem): boolean {
        const nodeKey = this._getKey(node);
        const realParent = this._model.getItemBySourceKey(nodeKey);
        return super._isAllChildrenExcluded(selection, realParent);
    }

    protected _getKey(item: TItem): CrudEntityKey {
        if (item?.['[Controls/expandedCompositeTree:CompositeCollectionItem]']) {
            return undefined;
        }
        return super._getKey(item);
    }
}
