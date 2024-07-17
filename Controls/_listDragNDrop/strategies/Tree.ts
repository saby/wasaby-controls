/**
 * @kaizen_zone 26b9ed5c-cfb5-41e7-8539-2b5dfaf4a5e0
 */
import Flat, { IDraggableFlatCollection } from './Flat';
import { IDragPosition } from 'Controls/display';
import { IDraggableItem, IDragStrategyParams, TPosition } from '../interface';
import { List } from 'Types/collection';

const DRAG_MAX_OFFSET = 0.3;

interface IDraggableTreeItem extends IDraggableItem {
    isNode(): boolean;
    isExpanded(): boolean;
    getChildren(): List<IDraggableTreeItem>;
}

interface IOffset {
    top: number;
    bottom: number;
}

interface IDraggableTreeCollection extends IDraggableFlatCollection<IDraggableTreeItem> {
    getPrevDragPosition(): IDragPosition<IDraggableTreeItem>;
}

type ITreeDragStrategyParams = IDragStrategyParams<
    IDragPosition<IDraggableTreeItem>,
    IDraggableTreeItem
>;

/**
 * Стратегия расчета позиции для драг'н'дропа в иерархическом списке
 * @class Controls/_listDragNDrop/strategies/Flat
 * @private
 */

export default class Tree extends Flat<IDraggableTreeItem, IDraggableTreeCollection> {
    /**
     * Запускает расчет позиции
     */
    calculatePosition({
        currentPosition,
        targetItem,
        mouseOffsetInTargetItem,
    }: ITreeDragStrategyParams): IDragPosition<IDraggableTreeItem> {
        const targetIndex = this._getTargetIndex(targetItem);
        if (targetIndex === -1) {
            return null;
        }

        if (this._draggableItem && this._draggableItem === targetItem) {
            return (this._model.getPrevDragPosition && this._model.getPrevDragPosition()) || null;
        }

        let result;

        const moveTileNodeToLeaves =
            this._model['[Controls/_tile/Tile]'] &&
            this._isNode(this._draggableItem) &&
            targetItem &&
            !this._isNode(targetItem);
        if (
            targetItem &&
            targetItem['[Controls/_display/TreeItem]'] &&
            this._isNode(targetItem) &&
            !moveTileNodeToLeaves &&
            mouseOffsetInTargetItem
        ) {
            result = this._calculatePositionRelativeNode(targetItem, mouseOffsetInTargetItem);
        } else {
            // В плитке нельзя смешивать узлы и листья, если перетаскивают узел в листья, то мы не меняем позицию
            result = super.calculatePosition({
                mouseOffsetInTargetItem,
                currentPosition,
                targetItem: moveTileNodeToLeaves ? null : targetItem,
            });
        }

        return result;
    }

    private _calculatePositionRelativeNode(
        targetItem: IDraggableTreeItem,
        mouseOffsetInTargetItem: IOffset
    ): IDragPosition<IDraggableTreeItem> {
        let relativePosition: TPosition = 'on';

        // Если нет перетаскиваемого элемента, то значит мы перетаскивам в папку другого реестра, т.к
        // если перетаскивают не в узел, то нам вернут рекорд из которого мы создадим draggableItem
        // В плитке лист мы можем перенести только внутрь узла
        if (
            !this._draggableItem ||
            (this._model['[Controls/_tile/Tile]'] &&
                !this._isNode(this._draggableItem) &&
                this._isNode(targetItem))
        ) {
            relativePosition = 'on';
        } else {
            if (mouseOffsetInTargetItem) {
                if (mouseOffsetInTargetItem.top <= DRAG_MAX_OFFSET) {
                    relativePosition = 'before';
                } else if (mouseOffsetInTargetItem.bottom <= DRAG_MAX_OFFSET) {
                    relativePosition = 'after';
                } else {
                    relativePosition = 'on';
                }
            }
        }

        let newPosition;
        if (
            relativePosition === 'after' &&
            targetItem.isExpanded() &&
            targetItem.getChildren().getCount()
        ) {
            const firstChild = targetItem.getChildren().at(0);

            if (firstChild.getContents() === this._draggableItem.getContents()) {
                newPosition = this._startPosition;
            } else {
                newPosition = {
                    index: this._getTargetIndex(firstChild),
                    position: 'before',
                    dispItem: firstChild,
                };
            }
        } else {
            newPosition = {
                index: this._getTargetIndex(targetItem),
                position: relativePosition,
                dispItem: targetItem,
            };
        }

        return newPosition;
    }

    private _isNode(item: IDraggableTreeItem): boolean {
        return item.isNode && item.isNode() !== null;
    }
}
