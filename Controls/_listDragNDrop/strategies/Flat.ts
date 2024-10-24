/**
 * @kaizen_zone 26b9ed5c-cfb5-41e7-8539-2b5dfaf4a5e0
 */
import { IDragPosition } from 'Controls/display';
import {
    BaseDragStrategy,
    IDraggableCollection,
    IDraggableItem,
    IDragStrategyParams,
} from '../interface';
import { Model } from 'Types/entity';
import { CrudEntityKey } from 'Types/source';

const DRAG_MAX_OFFSET = 0.5;

export interface IDraggableFlatCollection<T extends IDraggableItem = IDraggableItem>
    extends IDraggableCollection {
    getCount(): number;
    at(index: number): T;
    getIndex(item: T): number;
    getIndexBySourceItem(sourceItem: Model): number;
}

/**
 * Стратегия расчета позиции для драг'н'дропа в плоском списке
 * @private
 */

export default class Flat<
    T extends IDraggableItem = IDraggableItem,
    C extends IDraggableFlatCollection = IDraggableFlatCollection
> extends BaseDragStrategy<IDragPosition<T>, T, C> {
    protected _startPosition: IDragPosition<T>;

    constructor(model: C, draggableItem: T) {
        super(model, draggableItem);

        // getIndexBySourceItem - т.к. draggableItem это avatar и его нет в коллекции
        this._startPosition = {
            index: this._model.getIndexBySourceItem(draggableItem?.getContents()),
            dispItem: this._draggableItem,
        };
    }

    /**
     * Запускает расчет позиции
     */
    calculatePosition({
        currentPosition,
        targetItem,
        mouseOffsetInTargetItem,
    }: IDragStrategyParams<IDragPosition<T>, T>): IDragPosition<T> {
        if (targetItem === null) {
            return this._startPosition;
        }
        const targetIndex = this._getTargetIndex(targetItem);
        if (targetIndex === -1) {
            return null;
        }

        // для групп своя логика подсчета новой позиции
        if (
            (!targetItem.DraggableItem && !targetItem['[Controls/_display/GroupItem]']) ||
            this._targetItemIsDraggable(targetItem)
        ) {
            return currentPosition;
        }

        let position;
        if (mouseOffsetInTargetItem) {
            position = mouseOffsetInTargetItem.top <= DRAG_MAX_OFFSET ? 'before' : 'after';
        } else {
            let prevIndex = -1;
            if (currentPosition) {
                prevIndex = currentPosition.index;
            } else if (this._draggableItem) {
                prevIndex = this._startPosition.index;
            }

            if (prevIndex === -1) {
                position = 'before';
            } else if (targetIndex > prevIndex) {
                position = 'after';
            } else if (targetIndex < prevIndex) {
                position = 'before';
            } else if (targetIndex === prevIndex) {
                position =
                    currentPosition && currentPosition.position === 'after' ? 'before' : 'after';
            }
        }

        // Логика для свернутых групп
        if (targetItem['[Controls/_display/GroupItem]'] && targetIndex > 0) {
            const shouldChangePosition = this._shouldChangePosition(targetIndex, position);
            if (!shouldChangePosition) {
                return currentPosition;
            }
        }

        return {
            index: targetIndex,
            dispItem: targetItem,
            position,
        };
    }

    /**
     * Возвращает ключи перетаскиваемых записей.
     * Отсеивает из selectedKeys ключи записей, которых нет в рекордсете
     * @param {CrudEntityKey[]} selectedKeys Ключи выбранных записей
     */
    getDraggableKeys(selectedKeys: CrudEntityKey[]): CrudEntityKey[] {
        const selectedItems = [];

        const items = this._model.getSourceCollection();
        selectedKeys.forEach((key) => {
            if (items.getRecordById(key)) {
                selectedItems.push(key);
            }
        });

        return selectedItems;
    }

    getStartPosition(): IDragPosition<T> {
        return this._startPosition;
    }

    protected _getTargetIndex(targetItem: IDraggableTreeItem): number {
        return this._model.getIndex(targetItem);
    }

    protected _targetItemIsDraggable(targetItem: T): boolean {
        return (
            this._draggableItem &&
            targetItem &&
            !targetItem['[Controls/_display/GroupItem]'] &&
            this._draggableItem.getContents().getKey() === targetItem.getContents().getKey()
        );
    }

    /**
     * Проверяем, что нужно менять позицию, если навели на группу.
     * Позицию нужно поменять, только когда навели на последнюю группу.
     * Между свернутыми группами вставлять элемент не нужно.
     * @param targetIndex
     * @param position
     * @protected
     */
    protected _shouldChangePosition(targetIndex: number, position: string): boolean {
        const offset = position === 'after' ? 1 : -1;

        let index = targetIndex;
        let item = this._model.at(index);

        const isGroup = () => {
            return item && item['[Controls/_display/GroupItem]'];
        };
        const correctExpandable = () => {
            return position === 'before' || (position === 'after' && item.isExpanded());
        };
        const inBounds = () => {
            return index > -1 || index < this._model.getCount();
        };

        // пробегаемся по группам, находящимся по порядку
        while (isGroup() && correctExpandable() && inBounds()) {
            index += offset;
            item = this._model.at(index);
        }

        // если текущий индекс index равняется targetIndex, скорректированному по position,
        // то значит навели на последнюю группу среди подряд идущих
        return targetIndex + offset === index;
    }
}
