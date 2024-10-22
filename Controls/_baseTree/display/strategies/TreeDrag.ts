/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { itemsStrategy, IDragPosition } from 'Controls/display';
import { CrudEntityKey } from 'Types/source';
import TreeItem from './../TreeItem';

/**
 * Стратегия для премещения элементов в дереве.
 * @private
 */
export default class TreeDrag<
    S extends Model = Model,
    T extends TreeItem<S> = TreeItem<S>
> extends itemsStrategy.Drag<S, T> {
    setPosition(newPosition: IDragPosition<T>): void {
        super.setPosition(newPosition);

        if (this.avatarItem) {
            const newParent = this._getParentForDraggableItem(newPosition);
            this.avatarItem.setParent(newParent);
        }
    }

    protected _isDisplayItem(item: Model, index: number, collectionItem: TreeItem): boolean {
        if (!super._isDisplayItem(item, index, collectionItem)) {
            return false;
        }

        const startDraggableItemKey =
            this._options.draggableItem && this._options.draggableItem.key;
        const itemIsStartDraggableItem = startDraggableItemKey === collectionItem.key;
        if (itemIsStartDraggableItem) {
            return true;
        }

        return this._isDisplayByParents(collectionItem, this._options.draggedItemsKeys);
    }

    protected _isDisplayByParents(item: TreeItem, draggedItemsKeys: CrudEntityKey[]): boolean {
        const itemParent = item['[Controls/_display/TreeItem]'] && item.getParent();
        if (itemParent && !itemParent.isRoot()) {
            const itemParentKey = itemParent.getContents().getKey();
            if (draggedItemsKeys.includes(itemParentKey)) {
                return false;
            }

            return this._isDisplayByParents(itemParent, draggedItemsKeys);
        }

        return true;
    }

    /**
     * После создания элементов, нужно выставить правильного родителя у avatarItem.
     * Делать это нужно именно в этот момент, т.к. тут мы скрываем перетаскиваемые записи и создаем avatarItem.
     * @protected
     */
    protected _createItems(): T[] {
        const newItems = super._createItems();

        // avatarItem может не создасться, например когда тащат запись в мастер
        if (this.avatarItem) {
            const parent = this._getParentConsideringHiddenItems(this.avatarItem);
            if (parent) {
                this.avatarItem.setParent(parent);
            }
        }

        return newItems;
    }

    protected _createItem(protoItem: T): T {
        const item = super._createItem(protoItem);
        if (item && protoItem) {
            item.setParent(protoItem.getParent());
        }
        return item;
    }

    /**
     * Получаем родителя элемента учитывая скрытые(перетаскиваемые) записи
     * @param item Элемент, для которого считаем родителя
     * @param items Текущие элементы списка
     * @private
     */
    private _getParentConsideringHiddenItems(item: T): T {
        let parent = item.getParent() as T;
        let parentIndex = this._options.display.getIndex(parent);
        while (
            parent &&
            !parent.isRoot() &&
            !this._isDisplayItem(parent.contents, parentIndex, parent)
        ) {
            parent = parent.getParent() as T;
            parentIndex = this._options.display.getIndex(parent);
        }
        return parent;
    }

    private _getParentForDraggableItem(newPosition: IDragPosition<T>): T {
        let parent;

        const targetItem = newPosition.dispItem;
        const relativePosition = newPosition.position;

        if (!targetItem['[Controls/_display/TreeItem]']) {
            // targetItem может быть, например, группа. Она не наследуется от TreeItem и её родителем будет корень.
            parent = this.options.display.getRoot();
        } else if (targetItem.isNode()) {
            if (
                relativePosition === 'before' ||
                (relativePosition === 'after' && !targetItem.isExpanded())
            ) {
                parent = this._getParentConsideringHiddenItems(targetItem);
            } else if (
                relativePosition === 'after' &&
                targetItem.isExpanded() &&
                targetItem.getChildren().getCount()
            ) {
                parent = targetItem;
            } else {
                // relativePosition = 'on'
                parent = this._getParentConsideringHiddenItems(this.avatarItem);
            }
        } else {
            parent = this._getParentConsideringHiddenItems(targetItem);
        }

        return parent;
    }
}
