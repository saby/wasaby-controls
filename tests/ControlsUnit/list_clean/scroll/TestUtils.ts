import {
    AbstractListVirtualScrollController,
    IItemsRange,
    IAbstractItemsSizesControllerConstructor,
    IAbstractObserversControllerConstructor,
    IDirection,
    ItemsSizeController,
    ObserversController,
} from 'Controls/baseList';

import { TItemKey } from 'Controls/display';

export class TestVirtualScrollController extends AbstractListVirtualScrollController {
    private _indexes: IItemsRange;
    private _shiftDirection: IDirection;

    getIndexes(): IItemsRange {
        return this._indexes;
    }

    getShiftDirection(): IDirection {
        return this._shiftDirection;
    }

    protected _applyIndexes(
        startIndex: number,
        endIndex: number,
        shiftDirection: IDirection
    ): void {
        this._indexes = { startIndex, endIndex };
        this._shiftDirection = shiftDirection;
        this._collection.setIndexes(startIndex, endIndex, shiftDirection);
    }

    protected _getCollectionItemsCount(): number {
        return this._collection.getCount();
    }

    protected _getItemsSizeControllerConstructor(): IAbstractItemsSizesControllerConstructor {
        return ItemsSizeController;
    }

    protected _getObserversControllerConstructor(): IAbstractObserversControllerConstructor {
        return ObserversController;
    }

    protected _getIndexByKey<T extends TItemKey = TItemKey>(key: T): number {
        return this._collection.getIndexByKey(key);
    }
}
