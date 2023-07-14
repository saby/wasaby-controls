import {
    ListVirtualScrollController,
    IListVirtualScrollControllerOptions,
    IDirectionNew,
    IAbstractObserversControllerConstructor,
    IItemsSizesControllerConstructor,
    ItemsSizeControllerMultiColumns,
    IItemsSizes,
    IPlaceholders,
} from 'Controls/baseList';
import ColumnsCollection from 'Controls/_columns/display/Collection';
import { CrudEntityKey } from 'Types/source';
import { ColumnObserversController } from 'Controls/_columns/controllers/ColumnObserversController';
import { COLUMN_SELECTOR } from '../Constants';

export interface IColumnVirtualScrollControllerOptions extends IListVirtualScrollControllerOptions {
    column: number;
}

export default class ColumnVirtualScrollController extends ListVirtualScrollController {
    private readonly _column: number;

    constructor(options: IColumnVirtualScrollControllerOptions) {
        this._column = options.column;
        super(options);
    }

    updateTriggers(): void {
        this._scrollController.updateTriggers();
    }

    getItemsSizes(): IItemsSizes {
        return this._scrollController.getItemsSizes();
    }

    getPlaceholders(): IPlaceholders {
        return this._scrollController.getPlaceholders();
    }

    getContentSizeBeforeList(): number {
        return this._scrollController.getContentSizeBeforeList();
    }

    setItemsContainer(itemsContainer: HTMLElement): void {
        super.setItemsContainer(itemsContainer);
        this._scrollController.updateItemsSizes();
    }

    destroy(): void {
        super.destroy();
        if (!this._collection.isDestroyed()) {
            (this._collection as ColumnsCollection).setColumnPlaceholder(this._column, null);
        }
    }

    protected _applyIndexes(
        startIndex: number,
        endIndex: number,
        shiftDirection: IDirectionNew
    ): void {
        // инициализируем итератор по всем записям, чтобы с помощью него itemActions посчитались на новых записях
        this._setCollectionIterator();
        (this._collection as ColumnsCollection).setColumnRange(this._column, {
            startIndex,
            endIndex,
        });
    }

    protected _getCollectionItemsCount(): number {
        return (this._collection as ColumnsCollection).getItemsCountInColumns(this._column);
    }

    protected _getIndexByKey<T extends CrudEntityKey = CrudEntityKey>(key: T): number {
        const collectionIndex = (this._collection as ColumnsCollection).getIndexByKey(key);
        return (this._collection as ColumnsCollection).getIndexInColumnByIndex(collectionIndex);
    }

    protected _getObserversControllerConstructor(): IAbstractObserversControllerConstructor {
        return ColumnObserversController;
    }

    protected _getItemsSizeControllerConstructor(): IItemsSizesControllerConstructor {
        return ItemsSizeControllerMultiColumns;
    }

    protected _getTriggersSelector(selector: string): string {
        return `${COLUMN_SELECTOR}_${this._column} > ${selector}`;
    }
}
