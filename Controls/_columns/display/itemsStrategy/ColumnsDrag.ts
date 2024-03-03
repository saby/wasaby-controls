/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
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
