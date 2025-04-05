/**
 * @kaizen_zone 4368b094-41a4-40db-a0f9-b83257bd8251
 */
import { Model } from 'Types/entity';
import CollectionItem from '../CollectionItem';
import { TreeDragStrategy } from 'Controls/baseTree';

/**
 * Стратегия для премещения элементов, относящихся к определённой колонке Collection.
 * При создании аватара элемента использует ту же колонку, в которой начался Drag-n-Drop;
 * @private
 */
export default class ColumnsDrag<
    S extends Model = Model,
    T extends CollectionItem<S> = CollectionItem<S>
> extends TreeDragStrategy<S, T> {
    protected _createItem(protoItem: T): T {
        const item = super._createItem(protoItem);
        if (item && protoItem) {
            item.setColumn(protoItem.getColumn());
        }
        return item;
    }
}
